import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from "./loading";
import { Toaster, toast } from 'sonner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const PokemonList = () => {
    const [allPokemon, setAllPokemon] = useState([]);
    const [displayedPokemon, setDisplayedPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(40);

    useEffect(() => {
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

    useEffect(() => {
        const fetchPokemonDetails = async (pokemonArray) => {
            return Promise.all(pokemonArray.map(async (pokemon) => {
                const response = await axios.get(pokemon.url);
                return response.data;
            }));
        };

        const matchedPokemon = searchTerm
            ? allPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()))
            : allPokemon;

        const startIndex = currentPage * itemsPerPage;
        const selectedPokemon = matchedPokemon.slice(startIndex, startIndex + itemsPerPage);

        if (selectedPokemon.length) {
            fetchPokemonDetails(selectedPokemon).then(setDisplayedPokemon);
        } else {
            setDisplayedPokemon([]);
        }
    }, [searchTerm, allPokemon, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm]);

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(Math.max(0, currentPage - 1));

    };

    const totalResults = searchTerm
        ? allPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())).length
        : allPokemon.length;
    const totalPages = Math.ceil(totalResults / itemsPerPage);

    if (loading) {
        return <Loading />;
    }

    const colours = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD',
    };

    const addToPokedex = (pokemon) => {
        return () => {
            const storagePokemon = localStorage.getItem('pokemon');
            if (storagePokemon) {
                let existingPokemon = JSON.parse(storagePokemon);
                let pokemonExists = existingPokemon.some(objetPokemon => objetPokemon.id === pokemon.id);

                if (!pokemonExists) {
                    existingPokemon.push(pokemon);
                    localStorage.setItem('pokemon', JSON.stringify(existingPokemon));
                    toast("Pokémon ajouté au pokédex");
                } else {
                    toast("Ce pokémon est déjà dans votre pokédex");
                }
            } else {
                localStorage.setItem('pokemon', JSON.stringify([pokemon]));
                toast("Pokémon ajouté au pokédex");
            }
        };
    };

    return (
        <>
            <Toaster />
            <h1 style={{ fontSize: '5vw', fontFamily: 'Pokemon Solid, sans-serif', marginBottom: '5%', color: '#ffcb05' }} className={"text-center"}>My Pokémon</h1>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}  className={"d-flex flex-column justify-content-center align-items-center gap-4"}/>
            <div className={"d-flex flex-column justify-content-center align-items-center gap-4"}>
                <Link style={{ width: "20vw", fontSize: "1vw" }} className={"btn btn-warning"} to={{ pathname: "/my-pokedex" }}>
                    <img className={"pe-3"} style={{ minWidth: "50px", width: "20%" }} src={"https://www.freeiconspng.com/thumbs/pokeball-png/free-pokeball-download-3.png"} alt={"pokeball"} />
                    Accéder au pokédex personnel
                </Link>
                <div className={"d-flex gap-3 flex-wrap justify-content-center align-items-center"}>

                    {displayedPokemon.map((pokemon, index) => (
                        <div key={index} className={"card pokemon-dislike-button"} style={{ width: '18rem', backgroundColor: colours[pokemon.types[0].type.name] }}>
                            <img className={"card-img-top"} src={pokemon.sprites.front_default} alt="Sprite pokémon" />
                            <div className={"card-body d-flex flex-column align-items-center justify-content-center"}>
                                <p className={"card-text"}>{pokemon.id} - {pokemon.name}</p>
                                <p className={"card-text"}>Type(s): {pokemon.types.map(type => type.type.name).join(', ')}</p>
                                <button type={'button'} className={"btn btn-success"} onClick={addToPokedex(pokemon)}>Ajouter au Pokédex</button>
                            </div>
                        </div>
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="navigation-buttons">
                        <button className={"position-fixed rounded-circle z-1 btn btn-secondary"} style={{ left: '2%', top: '50%', transform: 'translate(-50%, -50%)', width: '50px', height: '50px' }} onClick={handlePrevPage} disabled={currentPage === 0}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button className={"position-fixed rounded-circle z-1 btn btn-secondary"} style={{ right: '2%', top: '50%', transform: 'translate(50%, -50%)', width: '50px', height: '50px' }} onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default PokemonList;