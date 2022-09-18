import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from '../style/assets/icon-red.png';

function Header() {
  return (
    <>
      <div className="header">
        <Link to="/">
          <img src={Logo} alt="logo" className="header__logo" />
        </Link>
        <div>
          <Link to="/">
            <FontAwesomeIcon icon="fa-house" />
          </Link>
          <Link to="/profil">
            <FontAwesomeIcon icon="fa-user" />
          </Link>
          <FontAwesomeIcon icon="fa-right-from-bracket" />
        </div>
      </div>
    </>
  );
}

export default Header;
