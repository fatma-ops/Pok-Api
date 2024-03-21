import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    return (
        <div id="error-page">
            <h1>Mauvaise page!</h1>
            <p>Hop là ! Il semblerait que vous ayez atterri sur une page qui n'existe pas</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}
