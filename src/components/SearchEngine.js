import React from "react";
import PropTypes from "prop-types";

function SearchEngine({ query, setQuery, search }) {
  return (
    <form className="SearchEngine" onSubmit={search} style={{border:'1px solid skyblue', borderRadius:'10px', padding:'5px', boxShadow:'0 2px 4px rgba(0, 0, 0, 0.1)'}}>
      <label className="visually-hidden" htmlFor="city-search">
        Search for a city
      </label>
      <input
        type="text"
        className="city-search"
        id="city-search"
        placeholder="Search any city..."
        name="query"
        aria-label="City search"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" aria-label="Search weather">
        <i className="fas fa-search" style={{ fontSize: "18px" }}></i>
      </button>
    </form>
  );
}

// Adding prop types for better validation
SearchEngine.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
};

export default SearchEngine;
