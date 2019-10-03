import React from 'react';
import './Nav.css';

export default function Nav() {
  return (
    <header>
    <nav>
      <ul>
        <li className='nav-el'><a href='index.html'>Lethologica</a></li>
        <li className='nav-el'><a href='game.html'>Game</a></li>
      </ul>
    </nav>
    </header>
  );
}
