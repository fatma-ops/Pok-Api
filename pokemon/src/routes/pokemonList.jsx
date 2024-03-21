import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonList = () => {
    const [pokemonNames, setPokemonNames] = useState([]);

    useEffect(() => {
        const fetchPokemonNames = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=40&offset=40');
                const names = response.data.results.map(pokemon => pokemon.name);
                setPokemonNames(names);
            } catch (error) {
                console.error('Error fetching pokemon names:', error);
            }
        };
        fetchPokemonNames();
    }, []);

    if (pokemonNames.length === 0) {
        return <div>Loading...</div>;
    }

    return (
      <div>
          <h2>Liste des Pokémons</h2>
          <ul>
              {pokemonNames.map((name, index) => (
                <li key={index}>{name}</li>

              ))}
              <button> Ajouter au pokédex</button>

          </ul>
      </div>
    );
};

export default PokemonList;
