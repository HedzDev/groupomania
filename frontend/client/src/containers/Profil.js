import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import ModifyProfilBlock from '../components/ModifyProfilBlock';

function Profil() {
  const [data, setData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(
          `http://localhost:4000/api/user/${id}`
        );
        console.log(response.data);
        setData(response.data);
      };

      fetchData();
    } catch (error) {
      console.log(error.response);
    }
  }, [id]);

  return (
    <>
      <Header />
      <div className="profil">
        <div>Profil</div>
        {data.map((elem, index) => {
          return (
            <div key={elem._id}>
              <ul className="profil__info">
                <li>{elem.pseudo}</li>
                <li>{elem.bio}</li>
                <li>{elem.picture}</li>
              </ul>
              <ModifyProfilBlock id={id} />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Profil;
