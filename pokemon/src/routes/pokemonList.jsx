import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonList = () => {
  const [pokemonDetails, setPokemonDetails] = useState([]);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=40');
        const pokemonData = await Promise.all(
          response.data.results.map(async pokemon => {
            const pokemonResponse = await axios.get(pokemon.url);
            return pokemonResponse.data;
          })
        );
        setPokemonDetails(pokemonData);
      } catch (error) {
        console.error('Error fetching pokemon details:', error);
      }
    };  
    fetchPokemonDetails();
  }, []);

  if (pokemonDetails.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Liste des Pokémons</h2>
      <ul>
        {pokemonDetails.map(pokemon => (
          <li key={pokemon.id}>
            <img src={pokemon.sprites.front_default}></img>
            <div>
              <p>{pokemon.id}</p>
              <p>{pokemon.name}</p>
              <p>Type(s): {pokemon.types.map(type => type.type.name).join(', ')}</p>
              <button>Ajouter au Pokédex</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonList;
