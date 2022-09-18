import React, { useState } from 'react';
import axios from 'axios';

function CreatePostBar() {
  const [post, setPost] = useState('');

  const handleSubmit = async (e) => {
    e.preventdefault();

    try {
      const sendPost = await axios.post(`http://localhost:4000/api/post/`, {
        message: post,
      });
      console.log(sendPost);
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <>
      {/* photo du user qui s'est connecté 
    input text, ajout d'image dans le post, bouton publié
    */}
      <div className="wrapper">
        <div className="home-bar">
          <p>username</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={post}
              placeholder="Écrivez quelque chose..."
              onChange={(e) => {
                setPost(e.target.value);
              }}
            />
            <button type="submit">Publier</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePostBar;
