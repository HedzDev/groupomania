import React, { useState } from 'react';

function CreatePostBar() {
  return (
    <>
      {/* photo du user qui s'est connecté 
    input text, ajout d'image dans le post, bouton publié
    */}
      <div className="wrapper">
        <div className="home-bar">
          <p>username</p>
          <form>
            <input type="text" placeholder="Écrivez quelque chose..." />
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePostBar;
