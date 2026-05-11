import React, { useState } from "react";
import "../styles/community.css";
import Sidebar from "../components/Sidebar";

function Community() {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});

  const createPost = () => {
    if (!post.trim()) return;

    const newPost = {
      id: Date.now(),
      user: "Charitha",
      text: post,
      likes: 0,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setPost("");
  };

  const likePost = (id) => {
    const updatedPosts = posts.map((item) =>
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    );
    setPosts(updatedPosts);
  };

  const addComment = (id) => {
    const text = comments[id];
    if (!text?.trim()) return;

    const updatedPosts = posts.map((item) =>
      item.id === id
        ? { ...item, comments: [...item.comments, text] }
        : item
    );

    setPosts(updatedPosts);

    setComments({
      ...comments,
      [id]: "",
    });
  };

  return (
    <div className="community-layout">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="community-container">

        <h1>Community Hub</h1>

        <p className="subtitle">
          Share ideas and connect with others.
        </p>

        {/* CREATE POST */}
        <div className="create-post">
          <textarea
            placeholder="Share your thoughts..."
            value={post}
            onChange={(e) => setPost(e.target.value)}
          />

          <button onClick={createPost}>
            Create Post
          </button>
        </div>

        {/* POSTS */}
        <div className="posts">

          {posts.map((item) => (
            <div className="post-card" key={item.id}>

              <div className="post-top">
                <div className="avatar">
                  {item.user[0]}
                </div>

                <div>
                  <h3>{item.user}</h3>
                  <small>Community Member</small>
                </div>
              </div>

              <p className="post-text">{item.text}</p>

              <button
                className="like-btn"
                onClick={() => likePost(item.id)}
              >
                ❤️ {item.likes}
              </button>

              {/* COMMENTS */}
              <div className="comments">

                {item.comments.map((comment, index) => (
                  <div className="comment" key={index}>
                    {comment}
                  </div>
                ))}

                <div className="comment-box">

                  <input
                    type="text"
                    placeholder="Add comment..."
                    value={comments[item.id] || ""}
                    onChange={(e) =>
                      setComments({
                        ...comments,
                        [item.id]: e.target.value,
                      })
                    }
                  />

                  <button onClick={() => addComment(item.id)}>
                    Comment
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Community;