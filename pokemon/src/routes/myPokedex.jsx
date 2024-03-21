import {useEffect, useState} from "react";

export default function MyPokedex () {
    const [pokedex, setPokedex] = useState([])

    useEffect(() => {
        const pokedexCache = localStorage.getItem('pokemon')
        if (pokedexCache) setPokedex(pokedexCache)
    }, [])

  function suppressionPokedex() {
    localStorage.removeItem('pokemon')
    setPokedex([])
  }

  return (
    <div className={"d-flex flex-column justify-content-center align-items-center"}>
      <h1 className={"mt-5"}>My pokédex</h1>
      <h3>Liste des pokémons attrapés</h3>
      <button className={"btn btn-danger mt-5"} data-bs-toggle="modal"
              data-bs-target="#suppressionPokedex" type={"button"}>Supprimer tout mon
        pokédex
      </button>
      <div style={{marginTop: "5%"}} className={"d-flex justify-content-center align-items-center"}>
        {pokedex.length > 0 ? pokedex.map((pokemon, index) => {
            return (
              <div key={index} className={"card"} style={{width: '18rem'}}>
                <img className={"card-img-top"} src={pokemon.sprite} alt="Sprite pokémon"/>
                <div className={"card-body"}>
                  <p className={"card-text"}>Some quick example text to build on the card title and make up
                    the bulk of the card's content.</p>
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
                <div className="progress-bar w-100 bg-secondary" role="progressbar" aria-valuenow="0" aria-valuemin="0"
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
                <button type="button" className="btn btn-danger" onClick={suppressionPokedex}>
                  Libérer les pokémons
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
