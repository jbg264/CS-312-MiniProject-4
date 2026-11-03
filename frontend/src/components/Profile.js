import { useEffect, useState } from 'react';
import axios from 'axios';
import PostList from './PostList';

function Profile({ user, goToEdit }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // get the user info + their posts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setProfile(response.data.user);
        setPosts(response.data.posts);
      } catch (err) {
        console.log(err);
        setError('Could not load your profile.');
      }
    };
    loadProfile();
  }, []);

  const removePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <>
      <h1>My Profile</h1>
      {error && <p className="error">{error}</p>}

      {profile && (
        <div className="profile">
          <h3>{profile.name}</h3>
          <p><strong>User ID:</strong> {profile.user_id}</p>
          <p><strong>Age:</strong> {profile.age || 'Not added'}</p>
          <p><strong>Occupation:</strong> {profile.occupation || 'Not added'}</p>
          <p><strong>Current City:</strong> {profile.city || 'Not added'}</p>
        </div>
      )}
      <hr />

      <h2>My Posts</h2>
      <PostList posts={posts} user={user} removePost={removePost} goToEdit={goToEdit} />
    </>
  );
}

export default Profile;
