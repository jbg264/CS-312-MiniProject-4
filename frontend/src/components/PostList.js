import axios from 'axios';

function PostList({ posts, user, removePost, goToEdit }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/blogs/' + id);
      removePost(id);
    } catch (err) {
      console.log(err);
      alert("You can't delete someone else's post!");
    }
  };

  return (
    <>
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p><em>{post.name} on {new Date(post.createdAt).toLocaleString()}</em></p>

          {/* edit and delete only show up on your own posts */}
          {user && user.user_id === post.user_id && (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); goToEdit(post.id); }}>Edit</a>
              <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </>
  );
}

export default PostList;
