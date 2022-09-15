import React, { useState } from 'react';
import axios from 'axios';

function ModifyProfilBlock(props) {
  const { id } = props;

  const [bio, setBio] = useState('');

  const handleSubmit = async (e) => {
    e.preventdefault();
    try {
      const response = await axios.put(`http://localhost:4000/api/user/${id}`, {
        bio: bio,
      });

      console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
      <div className="button_user">
        <form onSubmit={handleSubmit}>
          <textarea
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
            }}
          />
          <button type="submit">Valider</button>
        </form>
      </div>
    </>
  );
}

export default ModifyProfilBlock;
