import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from "./loading";

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

    const addToPokedex = (pokemon) => {
        localStorage.setItem('selectedPokemon', JSON.stringify(pokemon));
        console.log(localStorage.getItem('selectedPokemon'));
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

    return (
        <div>
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
                            <p>Numéro : {pokemon.id}</p>
                            <p>Nom : {pokemon.name}</p>
                            <p>Type(s): {pokemon.types.map(type => type.type.name).join(', ')}</p>
                            <button onClick={() => addToPokedex(pokemon)}>Ajouter au Pokédex</button>
                        </div>
                    </li>
                ))}
            </ul>
            {prevPage && <button onClick={handlePrevPage}>Page précédente</button>}
            {nextPage && <button onClick={handleNextPage}>Page suivante</button>}
        </div>
    );
};

export default PokemonList;
