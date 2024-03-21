import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from "./loading";

const PokemonList = () => {
  const [pokemonDetails, setPokemonDetails] = useState([]);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=40&offset=0');
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

    const loading = setTimeout(()=>{
      fetchPokemonDetails();
    }, 1500);

    return () => clearTimeout(loading);
  }, []);

  if (pokemonDetails.length === 0) {
    return <Loading />;
  }

  return (
    <div>
      <h2>Liste des Pokémons</h2>
      <ul>
        {pokemonDetails.map(pokemon => (
          <li key={pokemon.id}>
            <img src={pokemon.sprites.front_default} alt={"sprite de pokemon"}></img>
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
