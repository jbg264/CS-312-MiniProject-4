import { useEffect, useState } from 'react';
import axios from 'axios';
import BlogPostForm from './BlogPostForm';
import PostList from './PostList';

function Home({ user, setPage, goToEdit }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // grab the posts when the page loads
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await axios.get('/api/blogs');
        setPosts(response.data.posts);
      } catch (err) {
        console.log(err);
        setError('Could not load posts right now.');
      }
    };
    loadPosts();
  }, []);

  // new post goes on top
  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // remove the deleted post from the list
  const removePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <>
      {error && <p className="error">{error}</p>}

      {user ? (
        <>
          <h1>Make new posts</h1>
          <BlogPostForm addPost={addPost} />
        </>
      ) : (
        <>
          <h1>Welcome</h1>
          <p>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('signin'); }}>Sign in</a> to write, edit, or delete your own posts.
          </p>
        </>
      )}
      <hr />

      <h2>Posts</h2>
      <PostList posts={posts} user={user} removePost={removePost} goToEdit={goToEdit} />
    </>
  );
}

export default Home;
