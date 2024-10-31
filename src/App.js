import React, { useState } from 'react';

function App() {
  const [videoId, setVideoId] = useState('');
  const [videoDetails, setVideoDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVideoDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`http://localhost:5000/api/video/${videoId}`);
      const data = await response.json();
      
      if (response.ok) {
        setVideoDetails(data);
        fetchComments('');
      } else {
        setError(data.error || 'Failed to fetch video details');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (pageToken) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/comments/${videoId}${pageToken ? `?pageToken=${pageToken}` : ''}`
      );
      const data = await response.json();
      
      if (response.ok) {
        if (pageToken) {
          setComments(prev => [...prev, ...data.comments]);
        } else {
          setComments(data.comments);
        }
        setNextPageToken(data.nextPageToken);
      } else {
        setError(data.error || 'Failed to fetch comments');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && nextPageToken && !loading) {
      fetchComments(nextPageToken);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchSection}>
        <h1 style={styles.title}>YouTube Video Viewer</h1>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Enter YouTube Video ID"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            style={styles.input}
          />
          <button 
            onClick={fetchVideoDetails}
            disabled={loading || !videoId}
            style={styles.button}
          >
            {loading ? 'Loading...' : 'Load Video'}
          </button>
        </div>
        
        {error && (
          <div style={styles.error}>{error}</div>
        )}
      </div>

      {videoDetails && (
        <div style={styles.videoDetails}>
          <h2 style={styles.videoTitle}>{videoDetails.title}</h2>
          <div style={styles.stats}>
            {videoDetails.viewCount.toLocaleString()} views • {videoDetails.likeCount.toLocaleString()} likes
          </div>
          <div style={styles.description}>
            {videoDetails.description}
          </div>
        </div>
      )}

      {comments.length > 0 && (
        <div 
          style={styles.commentsSection}
          onScroll={handleScroll}
        >
          {comments.map((comment) => (
            <div key={comment.id} style={styles.commentCard}>
              <div style={styles.author}>{comment.author}</div>
              <div style={styles.date}>
                {new Date(comment.publishedAt).toLocaleDateString()}
              </div>
              <div style={styles.commentText}>{comment.text}</div>
              <div style={styles.likes}>
                {comment.likeCount} likes
              </div>
            </div>
          ))}
          {loading && (
            <div style={styles.loading}>
              Loading...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  searchSection: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    marginTop: 0,
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flexGrow: 1,
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: '#d32f2f',
    marginTop: '10px',
  },
  videoDetails: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  videoTitle: {
    marginTop: 0,
  },
  stats: {
    color: '#666',
    fontSize: '14px',
    margin: '10px 0',
  },
  description: {
    marginTop: '10px',
    whiteSpace: 'pre-wrap',
  },
  commentsSection: {
    maxHeight: '600px',
    overflowY: 'auto',
    padding: '10px',
  },
  commentCard: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '10px',
  },
  author: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  date: {
    color: '#666',
    fontSize: '12px',
    marginBottom: '8px',
  },
  commentText: {
    marginBottom: '8px',
  },
  likes: {
    color: '#666',
    fontSize: '12px',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
};

export default App;