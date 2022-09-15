import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Header() {
  return (
    <>
      <div className="header">
        <Link to="/">
          <FontAwesomeIcon icon="fa-house" />
        </Link>
        <Link to="/profil">
          <FontAwesomeIcon icon="fa-user" />
        </Link>
        <FontAwesomeIcon icon="fa-right-from-bracket" />
      </div>
    </>
  );
}

export default Header;
