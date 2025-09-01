// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="spinner-container" role="status" aria-live="polite" aria-busy="true">
      <div className="spinner" />
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default LoadingSpinner;
