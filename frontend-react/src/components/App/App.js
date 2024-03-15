import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Entete from "../Entete/Entete";
import Accueil from "../Accueil/Accueil";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Admin from "../Admin/Admin";
import { jwtDecode } from "jwt-decode";
import "./App.css";

export const AppContext = React.createContext();

function App() {
    //Variable contenant l'état de connexion
    const [estConnecte, setConnexion] = useState(false);

    //Vérification de la validité
    useEffect(() => {
        if (localStorage.getItem("api-film")) {
            //On vérifie à chaque changement dans la page si notre jeton est valide
            setConnexion(jetonValide());
        }
    }, []);

    async function login(e) {
        //Si on est connecté et qu'on appuie sur le bouton
        console.log(estConnecte);
        if (e.target.dataset.connexion == false) {
            e.preventDefault();
            const form = e.target;

            const body = {
                courriel: form.courriel.value,
                mdp: form.mdp.value,
            };

            // console.log(body);
            const data = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            };
            const reponse = await fetch("http://localhost:3301/utilisateurs/connexion", data);
            const token = await reponse.json();
            console.log(token);

            if (reponse.status === 200) {
                localStorage.setItem("api-film", token);
                console.log(jetonValide());
            }
            form.reset();
        }
        // else {
        //     setConnexion(false);
        //     localStorage.removeItem("api-film");
        //     return;
        // }
    }

    function jetonValide() {
        try {
            const token = localStorage.getItem("api-film");
            const decode = jwtDecode(token);
            //On vérifie si le jeton est expiré
            if (Date.now() < decode.exp * 1000) {
                return true;
            } else {
                //Si le jeton est invalide, on enlève le jeton du storage
                localStorage.removeItem("api-film");
                return false;
            }
        } catch (erreur) {
            console.log(erreur);
            return false;
        }
    }

    return (
        <AppContext.Provider value={estConnecte}>
            <Router>
                <Entete handleLogin={login} />
                <Routes>
                    {/* Si on est connecté, on continue à la page demandée */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/admin" element={<Admin />}></Route>
                    </Route>
                    <Route path="/" element={<Accueil />} />
                </Routes>
            </Router>
        </AppContext.Provider>
    );
}

export default App;
