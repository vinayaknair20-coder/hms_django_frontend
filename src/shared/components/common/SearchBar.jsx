import React from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = 'Search...', onClear }) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input"
      />
      {value && (
        <button 
          className="search-clear-btn" 
          onClick={handleClear}
          type="button"
        >
          ×
        </button>
      )}
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;
