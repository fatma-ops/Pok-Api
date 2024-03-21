import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    return (
        <div id="error-page" style={{height: '100vh'}} className={"d-flex flex-row justify-content-center align-items-center"}>
          <div className={"f"}>

          </div>
            <h1>Mauvaise page!</h1>
            <img src={'https://media1.tenor.com/m/_BiwWBWhYucAAAAd/what-huh.gif'}/>
            <p>Hop là ! Il semblerait que vous ayez atterri sur une page qui n'existe pas</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}
