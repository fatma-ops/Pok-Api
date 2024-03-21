import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    return (
        <div id="error-page" style={{height: '100vh'}} className={"d-flex flex-row justify-content-center align-items-center gap-4"}>
          <img className={"rounded"} width={"15%"} src={'https://media1.tenor.com/m/_BiwWBWhYucAAAAd/what-huh.gif'}/>
          <div className={"d-flex flex-column"}>
            <h1>Mauvaise page!</h1>
            <p>Hop là ! Il semblerait que vous ayez atterri sur une page qui n'existe pas</p>
            <p>
              <p>Erreur: <i>{error.statusText || error.message}</i></p>
            </p>
          </div>
        </div>
    );
}
