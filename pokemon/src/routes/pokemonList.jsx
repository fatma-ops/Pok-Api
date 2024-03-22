import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from "./loading";

const PokemonList = () => {
    const [allPokemon, setAllPokemon] = useState([]);
    const [displayedPokemon, setDisplayedPokemon] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Charger tous les noms et URL de Pokémon au démarrage
    useEffect(() => {
        setLoading(true);
        const fetchAllPokemon = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
                setAllPokemon(response.data.results);
            } catch (error) {
                console.error('Error fetching all pokemon:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllPokemon();
    }, []);

    // Gérer la recherche et l'affichage des Pokémon
    useEffect(() => {
        const fetchPokemonDetails = async (pokemonArray) => {
            return Promise.all(pokemonArray.map(async (pokemon) => {
                const response = await axios.get(pokemon.url);
                return response.data;
            }));
        };

        const matchedPokemon = searchTerm ? allPokemon.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : allPokemon.slice(0, 40); // Limite les résultats à 40 si aucun terme de recherche

        if (matchedPokemon.length) {
            fetchPokemonDetails(matchedPokemon).then(setDisplayedPokemon);
        } else {
            setDisplayedPokemon([]);
        }
    }, [searchTerm, allPokemon]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <h2>Liste des Pokémons</h2>
            <input
                type="text"
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            {displayedPokemon.length > 0 ? (
                <ul>
                    {displayedPokemon.map((pokemon) => (
                        <li key={pokemon.id}>
                            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                            <div>
                                <p>Numéro : {pokemon.id}</p>
                                <p>Nom : {pokemon.name}</p>
                                <p>Type(s): {pokemon.types.map(type => type.type.name).join(', ')}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun Pokémon correspondant trouvé.</p>
            )}
        </div>
    );
};

export default PokemonList;
