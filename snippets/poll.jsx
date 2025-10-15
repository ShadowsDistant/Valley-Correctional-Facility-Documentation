import React, { useState, useEffect } from 'react';

// --- Configuration for your poll ---
const pollConfig = {
  question: "How helpful was this page?",
  options: [
    { id: 0, text: 'Very helpful', votes: 8 },
    { id: 1, text: 'Somewhat helpful', votes: 3 },
    { id: 2, text: 'Not helpful', votes: 1 },
  ],
};
// ------------------------------------

// --- Styling for the component ---
const styles = {
  pollContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    padding: '16px',
    maxWidth: '400px',
    margin: '20px 0',
  },
  question: {
    fontWeight: '600',
    fontSize: '1.1em',
    marginBottom: '12px',
  },
  optionButton: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px',
    marginBottom: '8px',
    border: '1px solid #d1d5da',
    borderRadius: '6px',
    backgroundColor: '#f6f8fa',
    cursor: 'pointer',
    fontSize: '1em',
  },
  resultsContainer: {
    marginTop: '16px',
  },
  resultBar: {
    backgroundColor: '#f1f1f1',
    borderRadius: '4px',
    marginBottom: '8px',
    overflow: 'hidden',
  },
  resultFill: {
    backgroundColor: '#0366d6',
    color: 'white',
    padding: '8px',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  resultText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9em',
    marginBottom: '4px',
  },
  totalVotes: {
    marginTop: '12px',
    fontSize: '0.9em',
    color: '#586069',
  },
};
// ---------------------------------

function Poll() {
  const [options, setOptions] = useState(pollConfig.options);
  const [voted, setVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const initialTotalVotes = options.reduce((acc, option) => acc + option.votes, 0);
    setTotalVotes(initialTotalVotes);
  }, []);

  const handleVote = (optionId) => {
    if (voted) return;

    const newOptions = options.map(option => {
      if (option.id === optionId) {
        return { ...option, votes: option.votes + 1 };
      }
      return option;
    });

    setOptions(newOptions);
    setTotalVotes(prevTotal => prevTotal + 1);
    setVoted(true);
  };

  return (
    <div style={styles.pollContainer}>
      <p style={styles.question}>{pollConfig.question}</p>
      {voted ? (
        <div style={styles.resultsContainer}>
          {options.map(option => {
            const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
            return (
              <div key={option.id}>
                <div style={styles.resultText}>
                  <span>{option.text}</span>
                  <span>{option.votes} votes</span>
                </div>
                <div style={styles.resultBar}>
                  <div style={{ ...styles.resultFill, width: `${percentage}%` }}>
                    {percentage > 15 ? `${percentage}%` : ''}
                  </div>
                </div>
              </div>
            );
          })}
          <p style={styles.totalVotes}>Total Votes: {totalVotes}</p>
        </div>
      ) : (
        <div>
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              style={styles.optionButton}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Poll;