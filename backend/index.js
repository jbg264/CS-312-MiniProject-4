const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

// no database, everything lives in these arrays
// (so it all resets when the server restarts)
let users = [];
let posts = [];
let nextId = 1;

// no more ejs, just sending json now
app.use(express.json());

app.use(session({
  secret: 'blog-app-session-secret',
  resave: false,
  saveUninitialized: false
}));

// makes sure someone is signed in
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please sign in first.' });
  }
  next();
};


// checks if someone is logged in (react calls this on page load)
app.get('/api/me', (req, res) => {
  res.json({ user: req.session.user || null });
});

// SIGNUP: make a new user
app.post('/api/signup', (req, res) => {
  const userExists = users.find(u => u.user_id == req.body.user_id);

  if (userExists) {
    return res.status(400).json({ error: 'That user ID is already taken. Pick a different one!' });
  }

  const newUser = {
    user_id: req.body.user_id,
    password: req.body.password,
    name: req.body.name,
    age: req.body.age,
    occupation: req.body.occupation,
    city: req.body.city
  };

  users.push(newUser);
  res.json({ message: 'Account created!' });
});

// SIGNIN: check the user id and password
app.post('/api/signin', (req, res) => {
  const user = users.find(u => u.user_id == req.body.user_id && u.password == req.body.password);

  if (!user) {
    return res.status(401).json({ error: 'Incorrect user ID or password.' });
  }

  // dont keep the password in the session
  req.session.user = { user_id: user.user_id, name: user.name };
  res.json({ user: req.session.user });
});

app.post('/api/signout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Signed out.' }));
});


// READ: send all the posts, newest first
app.get('/api/blogs', (req, res) => {
  res.json({ posts: posts.slice().reverse() });
});

// CREATE: add a new post
app.post('/api/blogs', requireLogin, (req, res) => {
  const newPost = {
    id: nextId++,
    name: req.session.user.name,
    user_id: req.session.user.user_id,
    title: req.body.title,
    content: req.body.content,
    createdAt: new Date()
  };

  posts.push(newPost);
  res.json({ post: newPost });
});

// get one post for the edit page, only works if its yours
app.get('/api/blogs/:id', requireLogin, (req, res) => {
  const post = posts.find(p => p.id == req.params.id && p.user_id == req.session.user.user_id);

  if (!post) {
    return res.status(403).json({ error: 'Hey, you can only edit your own posts!' });
  }

  res.json({ post: post });
});

// UPDATE: save changes to an existing post
app.put('/api/blogs/:id', requireLogin, (req, res) => {
  const post = posts.find(p => p.id == req.params.id && p.user_id == req.session.user.user_id);

  if (!post) {
    return res.status(403).json({ error: "You can't edit someone else's post!" });
  }

  post.title = req.body.title;
  post.content = req.body.content;

  res.json({ post: post });
});

// DELETE: remove a post from the array
app.delete('/api/blogs/:id', requireLogin, (req, res) => {
  const post = posts.find(p => p.id == req.params.id && p.user_id == req.session.user.user_id);

  if (!post) {
    return res.status(403).json({ error: "You can't delete someone else's post!" });
  }

  posts = posts.filter(p => p.id != req.params.id);
  res.json({ message: 'Post deleted.' });
});


// MY PROFILE (bonus): user info + only their posts
app.get('/api/profile', requireLogin, (req, res) => {
  const me = users.find(u => u.user_id == req.session.user.user_id);
  const myPosts = posts.filter(p => p.user_id == req.session.user.user_id).reverse();

  // sending the info without the password
  res.json({
    user: {
      user_id: me.user_id,
      name: me.name,
      age: me.age,
      occupation: me.occupation,
      city: me.city
    },
    posts: myPosts
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
