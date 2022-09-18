import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../style/assets/icon-red.png';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:4000/api/user/signup',
        {
          pseudo: username,
          email: email,
          password: password,
        }
      );
      console.log(response);
      navigate('/login');
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
      <div className="signupForm">
        <img src={Logo} alt="logo" />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button type="submit">Valider</button>
        </form>
        <Link className="link" to="/login">
          Déjà un compte ? Connectez-vous ici !
        </Link>
      </div>
    </>
  );
}

export default Signup;
