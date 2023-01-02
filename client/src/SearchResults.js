import React from 'react';

const SearchResults = ({ results }) => (
    <div className="search-results">
      {results.map((result) => (
        <div key={result.link} className="search-result">
          <h2 className="search-result-title">
            <a href={result.link} className="search-result-link" target="_blank" rel="noopener noreferrer">
              {result.title}
            </a>
          </h2>
          <p>{result.snippet}</p>
        </div>
      ))}
    </div>
  );
  
  export default SearchResults;