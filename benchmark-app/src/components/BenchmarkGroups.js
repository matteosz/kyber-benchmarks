import React, { useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { Chart, registerables} from 'chart.js';

import data from '../data/data.json';

import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import './Benchmark.css';

Chart.register(...registerables);

const BenchmarkGroups = () => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [leftGroup, setLeftGroup] = useState('');
  const [rightGroup, setRightGroup] = useState('');
  const [isBenchmarkExpanded, setIsBenchmarkExpanded] = useState(false);
  const [isComparisonExpanded, setIsComparisonExpanded] = useState(false);
  const [isRankingExpanded, setIsRankingExpanded] = useState(false);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
  };

  const handleLeftGroupSelect = (group) => {
    setLeftGroup(group);
  };

  const handleRightGroupSelect = (group) => {
    setRightGroup(group);
  };

  const toggleBenchmarkExpand = () => {
    setIsBenchmarkExpanded(!isBenchmarkExpanded);
  };

  const toggleComparisonExpand = () => {
    setIsComparisonExpanded(!isComparisonExpanded);
  };

  const toggleRankingExpand = () => {
    setIsRankingExpanded(!isRankingExpanded);
  };

  return (
    <div className="benchmark-chart-container">
      <h1>Groups Benchmark</h1>
      <p>
        The benchmarks were run on a machine with the following specifications:
        <ul>
          <li>Processor: Intel Core i9-9900K</li>
          <li>Memory: 32GB DDR4</li>
          <li>Operating System: Windows 11</li>
        </ul>
      </p>

      <div className="section">
        <div className="section-header" onClick={toggleBenchmarkExpand}>
          <h2 className="section-title">Single Benchmarks</h2>
          <div className="section-toggle">
            {isBenchmarkExpanded ? <AiOutlineMinus /> : <AiOutlinePlus />}
          </div>
        </div>
        <div className={`section-content ${isBenchmarkExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="group-selection">
            <h3>Select Group</h3>
            <div className="group-buttons">
              {Object.keys(data.groups).map((group, index) => (
                <button
                  key={index}
                  className="group-button"
                  onClick={() => handleGroupSelect(group)}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
          {selectedGroup && (
            <BenchmarkDisplay selectedGroup={selectedGroup} />
          )}
        </div>
      </div>

      <div className="section">
        <div className="section-header" onClick={toggleComparisonExpand}>
          <h2 className="section-title">Comparison</h2>
          <div className="section-toggle">
            {isComparisonExpanded ? <AiOutlineMinus /> : <AiOutlinePlus />}
          </div>
        </div>
        <div className={`section-content ${isComparisonExpanded ? 'expanded' : 'collapsed'}`}>
          <Comparison
            leftGroup={leftGroup}
            rightGroup={rightGroup}
            handleLeftGroupSelect={handleLeftGroupSelect}
            handleRightGroupSelect={handleRightGroupSelect}
          />
        </div>
      </div>
      <div className="section">
        <div className="section-header" onClick={toggleRankingExpand}>
          <h2 className="section-title">Ranking</h2>
          <div className="section-toggle">
            {isRankingExpanded ? <AiOutlineMinus /> : <AiOutlinePlus />}
          </div>
        </div>
        <div className={`section-content ${isRankingExpanded ? 'expanded' : 'collapsed'}`}>
          <Ranking />
        </div>
      </div>
    </div>
  );
};

const BenchmarkDisplay = ({ selectedGroup }) => {
  const benchmarks = selectedGroup ? data.groups[selectedGroup].benchmarks : {};
  const allOperations = Object.values(benchmarks).reduce((acc, category) => {
    return acc.concat(Object.keys(category));
  }, []);
  const uniqueOperations = [...new Set(allOperations)];
  const colors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
  ];
  
  const chartDataTime = {
    labels: uniqueOperations,
    datasets: Object.keys(benchmarks).map((category, index) => ({
      label: category,
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length],
      borderWidth: 1,
      hoverBackgroundColor: colors[index % colors.length],
      hoverBorderColor: colors[index % colors.length],
      data: Object.keys(benchmarks[category]).map((operation) => 
        benchmarks[category][operation].T / benchmarks[category][operation].N
      )})),
  };
  const chartDataMemory = {
    labels: uniqueOperations,
    datasets: Object.keys(benchmarks).map((category, index) => ({
      label: category,
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length],
      borderWidth: 1,
      hoverBackgroundColor: colors[index % colors.length],
      hoverBorderColor: colors[index % colors.length],
      data: Object.keys(benchmarks[category]).map((operation) => 
        benchmarks[category][operation].MemBytes / benchmarks[category][operation].N
      )})),
  };

  const chartOptionsTime = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (ns/op)',
        },
      },
    },
  };
  const chartOptionsMemory = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Memory (bytes/op)',
        },
      },
    },
  };

  return (
    <div className="benchmark-display">
      <h2>Benchmarks for {selectedGroup}</h2>
      <div className="chart-container">
        <Bar data={chartDataTime} options={chartOptionsTime} />
        <Bar data={chartDataMemory} options={chartOptionsMemory} />
      </div>
    </div>
  );
};

const Comparison = ({ leftGroup, rightGroup, handleLeftGroupSelect, handleRightGroupSelect }) => {
  const groups = Object.keys(data.groups);

  return (
    <div className="comparison">
      <div className="group-selection">
        <div className="left">
          <select value={leftGroup} onChange={(e) => handleLeftGroupSelect(e.target.value)}>
            <option value="">Select Left Group</option>
            {groups.map((group, index) => (
              <option key={index} value={group}>{group}</option>
            ))}
          </select>
          {leftGroup && (
            <BenchmarkDisplay selectedGroup={leftGroup}/>
          )}
        </div>
        <div className="right">
          <select value={rightGroup} onChange={(e) => handleRightGroupSelect(e.target.value)}>
            <option value="">Select Right Group</option>
            {groups.map((group, index) => (
              <option key={index} value={group}>{group}</option>
            ))}
          </select>
          {rightGroup && (
            <BenchmarkDisplay selectedGroup={rightGroup}/>
          )}
        </div>
      </div>
    </div>
  );
};

const Ranking = () => {
  const groups = data.groups;

  // Extract average scores for each group and operation
  const groupAverages = Object.keys(groups).map((group) => {
    const benchmarks = groups[group].benchmarks;
    const operationScores = {};

    // Calculate average score for each operation
    Object.keys(benchmarks).forEach((category) => {
      if (!operationScores[category]) {
        operationScores[category] = {};
      }
      Object.keys(benchmarks[category]).forEach((operation) => {
        if (!operationScores[category][operation]) {
          operationScores[category][operation] = {};
        }
        operationScores[category][operation]['t'] = benchmarks[category][operation].T / benchmarks[category][operation].N;
        operationScores[category][operation]['m'] = benchmarks[category][operation].MemBytes / benchmarks[category][operation].N;
      });
    });

    return {
      group,
      operationScores,
    };
  });

  // Sorting state
  const [sortBy, setSortBy] = useState('Group');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('point');
  const [selectedMetric, setSelectedMetric] = useState('t');

  // Prepare table headers and data
  const tableHeaders = ['Group', ...Object.keys(groupAverages[0]?.operationScores[selectedCategory] || {})];
  const tableData = groupAverages.map(({ group, operationScores }) => ({
    Group: group,
    ...operationScores,
  }));

  // Function to handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Sort table data based on current sort settings
  const sortedData = [...tableData].sort((a, b) => {
    if (sortBy) {
      if (sortBy === 'Group') {
        const comparison = a[sortBy].localeCompare(b[sortBy]);
        return sortOrder === 'asc' ? comparison : -comparison;
      }
      const comparison = a[selectedCategory][sortBy][selectedMetric] - b[selectedCategory][sortBy][selectedMetric];
      return sortOrder === 'asc' ? comparison : -comparison;
    }
    return 0;
  });

  return (
    <div className="ranking">
      <div className="selectors">
        <div>
          <label htmlFor="category-select">Category:</label>
          <select id="category-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="point">Point</option>
            <option value="scalar">Scalar</option>
          </select>
        </div>
        <div>
          <label htmlFor="metric-select">Metric:</label>
          <select id="metric-select" value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
            <option value="t">Time (ns/op)</option>
            <option value="m">Memory (bytes/op)</option>
          </select>
        </div>
      </div>
      <br></br>
      <table>
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index} onClick={() => handleSort(header)}>
                {header}
                {sortBy === header && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {tableHeaders.map((header, colIndex) => (
                <td key={colIndex}>{colIndex === 0 ? row[header] : (Math.round(row[selectedCategory][header][selectedMetric] * 100) / 100).toFixed(2)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BenchmarkGroups;