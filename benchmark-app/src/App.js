import React, { useState, useEffect } from 'react';
import './App.css';
import BenchmarkGroups from './components/BenchmarkGroups';
import BenchmarkTitle from './components/BenchmarkTitle';

function App() {
  const [isTitleVisible, setIsTitleVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsTitleVisible(false);
      } else {
        setIsTitleVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <BenchmarkTitle isVisible={false} />
      <BenchmarkGroups/>
      {/* Add the rest of your content here */}
    </div>
  );
}

export default App;
