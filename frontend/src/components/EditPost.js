import { useEffect, useState } from 'react';
import axios from 'axios';

// the form, gets the post as a prop so we can prefill it
function EditForm({ post, setPage }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.put('/api/blogs/' + post.id, { title, content });
      setPage('home'); // home reloads the posts so the edit shows up
    } catch (err) {
      console.log(err);
      setError("You can't edit someone else's post!");
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

      <button type="submit">Save Changes</button>
    </form>
  );
}

// the actual page, gets the post from the backend first
function EditPost({ editId, setPage }) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await axios.get('/api/blogs/' + editId);
        setPost(response.data.post);
      } catch (err) {
        console.log(err);
        setError('Hey, you can only edit your own posts!');
      }
    };
    loadPost();
  }, [editId]);

  return (
    <>
      <h1>Edit Post</h1>
      {error && <p className="error">{error}</p>}
      {post && <EditForm post={post} setPage={setPage} />}
      <p>
        <a href="#" className="cancel" onClick={(e) => { e.preventDefault(); setPage('home'); }}>Cancel</a>
      </p>
    </>
  );
}

export default EditPost;
