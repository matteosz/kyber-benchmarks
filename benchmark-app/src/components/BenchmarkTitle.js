import React from 'react';

function BenchmarkTitle({ isVisible }) {
  return (
    <div className={`title-container ${isVisible ? 'fade-in' : 'fade-out'}`}>
      <h1>Benchmark</h1>
      <p>Explore performance benchmarks for different cryptographic curves.</p>
    </div>
  );
}

export default BenchmarkTitle;
