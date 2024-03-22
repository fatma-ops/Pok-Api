import React, {useEffect, useState} from "react";
import {faArrowCircleLeft, faHeartBroken} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

export default function MyPokedex() {
  const [pokedex, setPokedex] = useState([])

  useEffect(() => {
    const pokedexCache = localStorage.getItem('pokemon')
    if (pokedexCache) setPokedex(JSON.parse(pokedexCache))
  }, [])

  function suppressionPokedex() {
    localStorage.clear()
    setPokedex([])
  }

  function suppressionPokemon(id) {
    // Mettre à jour l'état en filtrant les pokémons pour exclure celui avec l'ID spécifié
    const updatedPokedex = pokedex.filter(pokemon => pokemon.id !== id);
    setPokedex(updatedPokedex);
    // Mettre à jour le stockage local
    localStorage.setItem('pokemon', JSON.stringify(updatedPokedex));
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

  return (
    <>
      <Link className={"btn btn-primary m-5"} to={{pathname: "/"}}><FontAwesomeIcon className={"pe-2"} icon={faArrowCircleLeft}/>Retour à la page d'accueil</Link>
      <div className={"d-flex flex-column justify-content-center align-items-center"}>
        <h1>My pokédex</h1>
        <h3>Liste des pokémons attrapés</h3>
        <button className={"btn btn-danger mt-5"} data-bs-toggle="modal"
                data-bs-target="#suppressionPokedex" type={"button"}>Supprimer tout mon
          pokédex
        </button>
        <div style={{marginTop: "5%"}} className={"d-flex justify-content-center align-items-center gap-4 flex-wrap"}>
          {pokedex.length > 0 ? pokedex.map((pokemon, index) => {
              return (
                <div key={index} className={"card d-flex pokemon-dislike-button"}
                     style={{width: '18rem', backgroundColor: colours[pokemon.types[0].type.name]}}>
                  <button style={{width: '15%'}} onClick={() => suppressionPokemon(pokemon.id)}
                          className={"btn btn-danger mt-1 align-self-end me-1 hover-button"} type={'button'}>
                    <FontAwesomeIcon icon={faHeartBroken}/></button>
                  <img className={"card-img-top"} src={pokemon.sprites.front_default} alt="Sprite pokémon"/>
                  <div className={"card-body d-flex flex-column align-items-center justify-content-center"}>
                    <p className={"card-text"}>{pokemon.id} - {pokemon.name}</p>
                    <p className={"card-text"}>Type(s): {pokemon.types.map(type => type.type.name).join(', ')}</p>
                  </div>
                </div>
              )
            }) :
            <div className={"card align-items-center"} style={{width: "18rem"}}>
              <img className={"rounded-circle w-75 mt-1"}
                   src={"https://media.licdn.com/dms/image/D4E03AQFYvqKYbIbN-A/profile-displayphoto-shrink_800_800/0/1681854235502?e=1716422400&v=beta&t=N4_XijMMUHfd0xLqzBl233Io2nGMIDDEWP-awbEXOEY"}
                   alt="Mourad"/>
              <div className={"card-body text-center"}>
                <h3 className={"card-title animate-character"}>Pokémon rare !</h3>
                <p className={"card-text"}><b>Moumou</b></p>
                <hr/>
                <h4>Statistiques</h4>
                <p style={{height: '15px'}}>Vitesse</p>
                <div style={{width: '180px'}} className={"progress"}>
                  <div className="progress-bar w-100 bg-secondary" role="progressbar" aria-valuenow="0"
                       aria-valuemin="0"
                       aria-valuemax="100"></div>
                </div>
                <p style={{height: '15px'}}>Attaque</p>
                <div className={"progress mt-0"}>
                  <div className="progress-bar w-100 bg-danger" role="progressbar" aria-valuenow="25"
                       aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <p style={{height: '15px'}}>Défense</p>
                <div className={"progress"}>
                  <div className="progress-bar w-100" role="progressbar" aria-valuenow="50"
                       aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <p style={{height: '15px'}}>Santé</p>
                <div className={"progress"}>
                  <div className="progress-bar w-100 bg-success" role="progressbar" aria-valuenow="75"
                       aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </div>
          }
        </div>
        {/* Modal */}
        <div
          className="modal fade"
          id="suppressionPokedex"
          tabIndex={-1}
          aria-labelledby="suppressionPokedexLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="suppressionPokedexLabel">
                  Suppression Pokédex
                </h1>
              </div>
              <div className="modal-body">Êtes-vous sûr de vouloir supprimer tous votre pokédex ?</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Non, j'ai fait une erreur
                </button>
                <button data-bs-dismiss="modal" type="button" className="btn btn-danger" onClick={suppressionPokedex}>
                  Libérer les pokémons
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
