import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from "./loading";
import { Toaster, toast } from 'sonner';

const PokemonList = () => {
    const [pokemonDetails, setPokemonDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState('');
    const [prevPage, setPrevPage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPokemonDetails = async (url) => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            const pokemonData = await Promise.all(
                response.data.results.map(async pokemon => {
                    const pokemonResponse = await axios.get(pokemon.url);
                    return pokemonResponse.data;
                })
            );
            setPokemonDetails(pokemonData);
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
        } catch (error) {
            console.error('Error fetching pokemon details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemonDetails('https://pokeapi.co/api/v2/pokemon/?limit=40&offset=0');
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

    const searchPokemon = async () => {
        if (!searchTerm) return; // Ne recherche rien si le terme de recherche est vide
        setLoading(true);
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
            setPokemonDetails([response.data]); // Affiche uniquement le Pokémon recherché
            setNextPage('');
            setPrevPage('');
        } catch (error) {
            console.error('Error fetching pokemon:', error);
            setPokemonDetails([]); // Efface les résultats en cas d'erreur
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

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
            <div>
                <input
                    type="text"
                    placeholder="Rechercher par nom..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button onClick={searchPokemon}>Rechercher</button>
            </div>
            <ul>
              {pokemonDetails.map(pokemon => (
                <li key={pokemon.id}>
                  <img src={pokemon.sprites.front_default} alt={pokemon.name}></img>
                  <div>
                    <p>Numéro: {pokemon.id}</p>
                    <p>Nom: {pokemon.name}</p>
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
