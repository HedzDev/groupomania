import { useState } from 'react';
import axios from 'axios';
import Logo from '../style/assets/icon-red.png';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uid, setUid] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:4000/api/user/login',
        {
          email: email,
          password: password,
        }
      );
      console.log(response.data);
      setUid(response.data);
      console.log(uid);
      navigate('/');
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
      <div className="loginForm">
        <img src={Logo} alt="logo" />
        <form onSubmit={handleSubmit}>
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
            value={password}
            placeholder="Mot de passe"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button type="submit">Valider</button>
        </form>
        <Link className="link" to="/signup">
          Vous n'avez pas de compte ? Inscrivez-vous ici
        </Link>
      </div>
    </>
  );
}

export default Login;
