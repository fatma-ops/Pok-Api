import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div>
        <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control border-1"
                    />
        </div>
    );
};

export default Search;
