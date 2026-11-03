import axios from 'axios';

function Navbar({ user, setUser, setPage }) {
  // the links are just <a> tags that change the page state
  const go = (e, page) => {
    e.preventDefault();
    setPage(page);
  };

  const handleSignOut = async () => {
    await axios.post('/api/signout');
    setUser(null);
    setPage('signin');
  };

  return (
    <nav>
      {user ? (
        <>
          <span>Signed in as <strong>{user.name}</strong></span>
          <a href="#" onClick={(e) => go(e, 'home')}>Home</a>
          <a href="#" onClick={(e) => go(e, 'profile')}>My Profile</a>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <>
          <a href="#" onClick={(e) => go(e, 'signin')}>Sign In</a> | <a href="#" onClick={(e) => go(e, 'signup')}>Sign Up</a>
        </>
      )}
    </nav>
  );
}

export default Navbar;
