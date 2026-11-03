import { useState } from 'react';
import axios from 'axios';

function BlogPostForm({ addPost }) {
  // state for each input
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // dont let the page refresh
    setError('');

    try {
      const response = await axios.post('/api/blogs', { title, content });
      addPost(response.data.post);
      setTitle('');
      setContent('');
    } catch (err) {
      console.log(err);
      setError('Could not create the post.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Content:</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <button type="submit">Post</button>
    </form>
  );
}

export default BlogPostForm;
