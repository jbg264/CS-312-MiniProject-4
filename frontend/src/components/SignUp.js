import { useState } from 'react';
import axios from 'axios';

function SignUp({ setPage }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('/api/signup', {
        user_id: userId,
        password: password,
        name: name,
        age: age,
        occupation: occupation,
        city: city
      });
      setPage('signin');
    } catch (err) {
      console.log(err);
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <>
      <h1>Create an Account</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>User ID:</label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Age (optional):</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />

        <label>Occupation (optional):</label>
        <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />

        <label>Current City (optional):</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />

        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setPage('signin'); }}>Sign in</a>
      </p>
    </>
  );
}

export default SignUp;
