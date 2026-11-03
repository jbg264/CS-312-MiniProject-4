import { useState } from 'react';
import axios from 'axios';

function SignIn({ setUser, setPage }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/signin', {
        user_id: userId,
        password: password
      });
      setUser(response.data.user);
      setPage('home');
    } catch (err) {
      console.log(err);
      setError('Incorrect user ID or password.');
    }
  };

  return (
    <>
      <h1>Sign In</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>User ID:</label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Sign In</button>
      </form>

      <p>
        New here? <a href="#" onClick={(e) => { e.preventDefault(); setPage('signup'); }}>Create an account</a>
      </p>
    </>
  );
}

export default SignIn;
