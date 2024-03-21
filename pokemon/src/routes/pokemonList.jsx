import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from "./loading";
import { Toaster, toast } from 'sonner';

const PokemonList = () => {
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [nextPage, setNextPage] = useState('');
  const [prevPage, setPrevPage] = useState('');

  const fetchPokemonDetails = async (url) => {
    try {
      const response = await axios.get(url);
      const pokemonData = await Promise.all(
        response.data.results.map(async pokemon => {
          const pokemonResponse = await axios.get(pokemon.url);
          return pokemonResponse.data;
        })
      );
      setPokemonDetails(pokemonData);
      setNextPage(response.data.next)
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error('Error fetching pokemon details:', error);
    }
  };

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

  const handleNextPage = () => {
    if (nextPage) {
      fetchPokemonDetails(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      fetchPokemonDetails(prevPage);
    }
  };

  if (pokemonDetails.length === 0) {
    return <Loading />;
  }

//
  const addToPokedex = (pokemon) => {
    return () => {
      const storagePokemon = localStorage.getItem('pokemon');

      if (storagePokemon) {
        let existingPokemon = JSON.parse(storagePokemon);
        let pokemonExists = false;

        existingPokemon.forEach(objetPokemon => {
          if (objetPokemon.id === pokemon.id) {
            pokemonExists = true;
          }
        });

        if (!pokemonExists) {
          existingPokemon.push(pokemon);
          localStorage.setItem('pokemon', JSON.stringify(existingPokemon));
        } else {
          toast("Ce pokémon est déjà dans votre pokédex")
        }
      } else {
        // Si le tableau n'existe pas, crée un nouveau tableau avec le nouveau Pokémon
        localStorage.setItem('pokemon', JSON.stringify([pokemon]));
      }
    };
  };
   
  return (
    <div>
      <Toaster />
      <h2>Liste des Pokémons</h2>
      <ul>
        {pokemonDetails.map(pokemon => (
          <li key={pokemon.id}>
            <img src={pokemon.sprites.front_default} alt={pokemon.name}></img>
            <img src={pokemon.sprites.front_default} alt={"sprite de pokemon"}></img>
            <div>
              <p>{pokemon.id}</p>
              <p>{pokemon.name}</p>
              <p>Type(s): {pokemon.types.map(type => type.type.name).join(', ')}</p>
              <button onClick={addToPokedex(pokemon)}>Ajouter au Pokédex</button>
            </div>
          </li>
        ))}  
      </ul>
      <button onClick={handlePrevPage} disabled={!prevPage}>Page précédente</button>
      <button onClick={handleNextPage} disabled={!nextPage}>Page suivante</button>
    </div>
  );
};  

export default PokemonList;
