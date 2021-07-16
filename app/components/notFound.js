import React from "react";
import {Page} from "./page";
import {Link} from "react-router-dom";

function NotFound() {
    return (
        <Page title = "Not Found">
            <div className="text-center">
                <h2>Oops, your page could not be found!</h2>
                <p className="lead text-muted">You can always visit {<Link to="/">
                    Home Page
                </Link>} to get a fresh start</p>
            </div>
        </Page>
    )
}

export default NotFound