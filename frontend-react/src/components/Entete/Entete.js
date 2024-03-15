import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Entete.css";

import App, { AppContext } from "../App/App";

function Entete(props) {
    const contexte = useContext(AppContext);
    //TODO: Ajouter l'état de connexion
    return (
        <header className="pt-medium pb-medium">
            <div className="wrapper">
                <div className="entete">
                    <NavLink to="/">
                        <h1>VideoClub</h1>
                    </NavLink>
                    <div className="entete__right">
                        {contexte ? (
                            <nav>
                                <NavLink to="/admin" className={"underline"}>
                                    Page privée
                                </NavLink>
                            </nav>
                        ) : (
                            ""
                        )}
                        <form onSubmit={props.handleLogin} data-connexion={contexte}>
                            {!contexte ? <input type="text" name="courriel" placeholder="Usager"></input> : ""}
                            {!contexte ? <input type="password" name="mdp" placeholder="Mot de passe"></input> : ""}
                            <button>{contexte ? "Logout" : "Login"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Entete;
