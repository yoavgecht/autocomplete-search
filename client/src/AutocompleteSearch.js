import React, { useState, useEffect, useRef } from 'react';
import SearchResults from './SearchResults';

function AutocompleteSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFocused) {
        fetch('http://localhost:3000/api/history')
          .then((response) => response.json())
          .then((data) => {
            setHistory(data);
            setSuggestions(data);
          })
          .catch((error) => {
            console.error(error);
          });
      setOpen(true);
    } else {
      setTimeout(() => {
        setOpen(false);
      }, 200);
    }
  }, [isFocused]);

  function debounce(func, delay) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }
  
  const handleChange = (userInput) => {
    setQuery(userInput);
    setOpen(true);
  };

  const debouncedHandleChange = debounce(handleChange, 50);

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      handleSelect(event.target.value);
    }
  }

  async function removeSearch(searchItem) {
    // Send a DELETE request to the server to remove the item from the database
    const response = await fetch(`http://localhost:3000/api/history/removeSearch/${searchItem}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    })
    
    const data = await response.json()
    
    // Update the search history state to remove the item
    // setHistory(history.filter(s => s !== searchItem));

    setHistory(data);
      // Reset the query
    setQuery('');;
  }
    


  const handleSelect = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    setOpen(false);

     // store search history
    fetch('http://localhost:3000/api/history/saveSearch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestion }),
    })
    .then((response) => response.json())
    .then((data) => {
      fetch('http://localhost:3000/api/suggestions/saveSuggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestion }),
      })
    })
    .catch((error) => {
      console.error(error);
    });

     // retrieve search results from Google search API
     fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyBXFNm4nYQ6Jhco9Chz2-5D4hSAaSxsoH8&cx=86d9fef699de14b93&q=${suggestion}`)
     .then((response) => response.json())
     .then((data) => {
       setSearchResults(data.items);
       setTotalResults(data.searchInformation.totalResults);
     })
     .catch((error) => {
       console.error(error);
     });
 };
  

  useEffect(() => {
    if (query.length > 0) {
      // retrieve suggestions from API
      fetch(`http://localhost:5000/api/suggestions?q=${query}`)
        .then((response) =>  response.json())
        .then((data) => {
          setSuggestions(
            data.map((suggestion) => ({
              ...suggestion,
              inHistory: history.includes(suggestion.query),
            }))
          );
        })
        .catch((error) => {
          console.error(error);
        });
    } else if(history.length > 0) {
      setOpen(true);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }, [query, history])
  
  return (
    <div className="container">
      <div className='search-container'>
        <input ref={inputRef} className={open ? 'search-input no-border' : 'search-input'} 
        placeholder="Search..." 
        type="text" value={query} 
        onChange={(event) => debouncedHandleChange(event.target.value)}
        onFocus={() => setIsFocused(true)} 
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}  
        />

      {query && (
          <button className="remove-button" onClick={() => removeSearch(query)}>
            X
          </button>
        )}
      </div>
            
       {open && (<ul className="autocomplete-suggestions">
        {suggestions.map((suggestion) => (
          <li className={`autocomplete-suggestion ${suggestion.inHistory ? 'in-history' : ''}`}  
            key={suggestion._id} 
            onClick={() => handleSelect(suggestion.query)}
            >
            <span className='autocomplete-suggestion-text'>
              {suggestion.query}</span></li>
        ))}
      </ul>
       )}
      {totalResults > 0 && (
        <div className="search-results-info">
          <p>About {totalResults} results</p>
        </div>
      )}
      {searchResults && <SearchResults results={searchResults} />}
    </div>
  );
}

export default AutocompleteSearch;
