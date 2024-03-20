import { useState } from "react";
import "./FormFilm.css";

function FormFilm() {
    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        realisation: "",
        annee: "",
        genres: [],
        titreVignette: "vide.jpg",
    });

    const [formValidity, setFormValidity] = useState("invalid");
    //ICI on pourrait utiliser le useState pour capter les messages d'erreurs

    function onFormDataChange(evenement) {
        //On récupère le nom du champ
        const name = evenement.target.name;
        //On récupère la valeur du champ
        const value = evenement.target.value;
        // const{name, value} = evenement.target;

        //On clone la donnee dans un nouvel objet
        const donneeModifiee = { ...formData, [name]: value };

        const estValide = evenement.target.form.checkValidity() ? "valid" : "invalid";
        setFormValidity(estValide);
        //On met à jour la donnée globale
        setFormData(donneeModifiee);
    }

    async function onFormSubmit(evenement) {
        evenement.preventDefault();
        // Vérifier si le formulaire est valide
        if (formValidity === "invalid") {
            //Afficher un message d'erreur
            evenement.target.reportValidity();
            return;
        }

        // Prépare la donnée
        const data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("api-film")}`,
            },
            body: JSON.stringify(formData),
        };
        // On récupère le token
        // On soumet
        const request = await fetch("http://localhost:3301/films", data);
        const response = await request.json();

        // On gère la réponse du formulaire
        if (request.status === 200) {
            //Afficher un message de succès
            console.log("SUPER");
            //Vide le formulaire
            setFormData({
                titre: "",
                description: "",
                realisation: "",
                annee: "",
                genres: [],
                titreVignette: "vide.jpg",
            });
            //Reinit l'état de validité
            setFormValidity("invalid");
        } else {
            const messageErreur = response.message;
            console.log("erreur", messageErreur);
        }
    }

    return (
        <main>
            <div className="wrapper">
                <h1>Ajouter un film</h1>
                <form className={formValidity} onSubmit={onFormSubmit}>
                    <div className="input-group">
                        <label htmlFor="titre">Titre</label>
                        <input
                            type="text"
                            id="titre"
                            name="titre"
                            value={formData.titre}
                            onChange={onFormDataChange}
                            required
                            minLength={1}
                            maxLength={150}
                        ></input>
                    </div>
                    <div className="input-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={onFormDataChange}
                            required
                            minLength={1}
                            maxLength={500}
                        ></textarea>
                    </div>
                    <div className="input-group">
                        <label htmlFor="realisation">realisation</label>
                        <input
                            type="text"
                            id="realisation"
                            name="realisation"
                            value={formData.realisation}
                            onChange={onFormDataChange}
                            required
                            minLength={1}
                            maxLength={50}
                        ></input>
                    </div>
                    <div className="input-group">
                        <label htmlFor="annee">annee</label>
                        <input
                            type="text"
                            id="annee"
                            name="annee"
                            value={formData.annee}
                            onChange={onFormDataChange}
                            required
                            minLength={1}
                            maxLength={10}
                        ></input>
                    </div>
                    <input
                        type="submit"
                        value="Envoyer"
                        disabled={formValidity === "invalid" ? "disabled" : ""}
                    ></input>
                </form>
                {/* {
                    messageErreur!==""?(<div className="message-erreur">{}</div>):""
                } */}
            </div>
        </main>
    );
}

export default FormFilm;
