import React, { useState } from 'react';
import './App.css';
import BenchmarkGroups from './components/BenchmarkGroups';
import BenchmarkTitle from './components/BenchmarkTitle';
import BenchmarkMenu from './components/BenchmarkMenu';

const App = () => {
  const [type, setType] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="App">
      {type === '' && <BenchmarkTitle />}
      <BenchmarkMenu setFn={setType} isOpen={menuOpen} toggleMenu={toggleMenu} />
      {type === 'groups' && <BenchmarkGroups />}
    </div>
  );
};

export default App;
