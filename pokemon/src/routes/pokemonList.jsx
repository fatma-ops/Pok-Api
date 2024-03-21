import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonList = () => {

    const [pokemonDetails, setPokemonDetails] = useState(null);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/`);
                setPokemonDetails(response.data);
            } catch (error) {
                console.error('Error fetching pokemon details:', error);
            }
        };
        fetchPokemonDetails();
    });

    if (!pokemonDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{pokemonDetails.name}</h2>
            <p>Numéro: {pokemonDetails.id}</p>
            <img  />
            <button>Ajouter au Pokédex</button>
        </div>
    );
};

export default PokemonList;
