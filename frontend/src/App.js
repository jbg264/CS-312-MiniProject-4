import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import EditPost from './components/EditPost';
import Profile from './components/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // which page we're on: 'home', 'signin', 'signup', 'profile' or 'edit'
  const [page, setPage] = useState('home');
  const [editId, setEditId] = useState(null);

  // check if somebody is already logged in when the app loads
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get('/api/me');
        setUser(response.data.user);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  // go to the edit page for a certain post
  const goToEdit = (id) => {
    setEditId(id);
    setPage('edit');
  };

  if (loading) return <p>Loading...</p>;

  // not logged in -> can't see edit/profile, logged in -> no need for signin/signup
  let currentPage = page;
  if (!user && (page === 'edit' || page === 'profile')) currentPage = 'signin';
  if (user && (page === 'signin' || page === 'signup')) currentPage = 'home';

  return (
    <>
      <Navbar user={user} setUser={setUser} setPage={setPage} />

      {currentPage === 'home' && <Home user={user} setPage={setPage} goToEdit={goToEdit} />}
      {currentPage === 'signin' && <SignIn setUser={setUser} setPage={setPage} />}
      {currentPage === 'signup' && <SignUp setPage={setPage} />}
      {currentPage === 'profile' && <Profile user={user} goToEdit={goToEdit} />}
      {currentPage === 'edit' && <EditPost editId={editId} setPage={setPage} />}
    </>
  );
}

export default App;
