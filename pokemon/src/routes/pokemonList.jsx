import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Loading from "./loading";
import {Toaster, toast} from 'sonner';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

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
    return <Loading/>;
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

  return (
    <>
      <Toaster/>
      <h1 style={{fontSize: '5vw', fontFamily: 'Pokemon Solid, sans-serif', marginBottom: '5%', color: '#ffcb05'}} className={"text-center"}>My Pokémon</h1>
      <div className={"d-flex flex-column justify-content-center align-items-center gap-4"}>
        <div>
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button onClick={searchPokemon}>Rechercher</button>
        </div>
        <Link style={{width: "20vw", fontSize: "1vw"}} className={"btn btn-warning"} to={{pathname: "/my-pokedex"}} ><img className={"pe-3"} style={{minWidth: "50px", width: "20%"}} src={"https://www.freeiconspng.com/thumbs/pokeball-png/free-pokeball-download-3.png"} alt={"pokeball"}/>Accéder au pokédex personnel</Link>
        <div className={"d-flex gap-3 flex-wrap justify-content-center align-items-center"}>
          {pokemonDetails.map((pokemon, index) => (
            <div key={index} className={"card d-flex pokemon-dislike-button"} style={{width: '18rem', backgroundColor: colours[pokemon.types[0].type.name]}}>
              <img className={"card-img-top"} src={pokemon.sprites.front_default} alt="Sprite pokémon"/>
              <div className={"card-body d-flex flex-column align-items-center justify-content-center"}>
                <p className={"card-text"}>{pokemon.id} - {pokemon.name}</p>
                <p className={"card-text"}>Type(s): {pokemon.types.map(type => type.type.name).join(', ')}</p>
                <button type={'button'} className={"btn btn-success"} onClick={addToPokedex(pokemon)}>Ajouter au Pokédex</button>
              </div>
            </div>
          ))}
        </div>
        <button className={"position-fixed rounded-circle z-1 btn btn-secondary"} style={{left: '2%', top:'50%', transform:'translate(-50%, -50%)', width: '50px', height: '50px'}} onClick={handlePrevPage} disabled={!prevPage}><FontAwesomeIcon icon={faChevronLeft} /></button>
        <button className={"position-fixed rounded-circle z-1 btn btn-secondary"} style={{right: '0%', top: '50%', transform: 'translate(-50%, -50%)', width: '50px', height: '50px'}} onClick={handleNextPage} disabled={!nextPage}><FontAwesomeIcon icon={faChevronRight}/></button>
      </div>
    </>);
};

export default PokemonList;
