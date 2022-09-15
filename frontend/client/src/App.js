import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Home from './containers/Home';
import Profil from './containers/Profil';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHouse,
  faRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
library.add(faHouse, faUser, faRightFromBracket);

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profil/:id" element={<Profil />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
