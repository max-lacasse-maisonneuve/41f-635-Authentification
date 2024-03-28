import { useState } from "react";
import "./FormFilm.css";
import { useNavigate } from "react-router-dom";

function FormFilm() {
    const genres = [
        "Action",
        "Aventure",
        "Comédie",
        "Drame",
        "Fantaisie",
        "Horreur",
        "Policier",
        "Science-fiction",
        "Thriller",
        "Western",
    ];
    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        realisation: "",
        annee: "",
        genres: [],
        titreVignette: "vide.jpg",
    });
    const [vignette, setVignette] = useState("");
    const [formValidity, setFormValidity] = useState("invalid");
    const navigate = useNavigate();
    //ICI on pourrait utiliser le useState pour capter les messages d'erreurs

    function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        const resultat = new Promise((resolve, reject) => {
            reader.onload = function () {
                console.log(reader.result);
                resolve(reader.result);
            };
            reader.onerror = function (error) {
                reject(error);
            };
        });

        return resultat;
    }

    async function onFormDataChange(evenement) {
        //On récupère le nom du champ
        const name = evenement.target.name;
        //On récupère la valeur du champ
        const value = evenement.target.value;
        // const{name, value} = evenement.target;

        //Section uniquement pour les boites à cocher
        if (name.startsWith("genre")) {
            //On récupère l'état de la boite à cocher
            const estCoche = evenement.target.checked;
            let genres = formData.genres || [];

            //si on decoche et que la valeur est dans le tableau de notre objet film
            if (!estCoche && genres.includes(value)) {
                //créer un nouveau tableau sans la donnée décochée
                genres = genres.filter((genre, index) => {
                    //Si true, genre est ajouté au tableau, si false genre n'est pas ajouté au tableau
                    return genre !== value;
                });
            } else if (estCoche && !genres.includes(value)) {
                //Si on coche la boite et qu'elle n'est pas dans le tableau de l'objet film
                //On ajoute
                genres.push(value);
            }
            //On met à jour notre objet film
            const donneeModifiee = { ...formData, genres: genres };
            setFormData(donneeModifiee);
        } else if (name === "titreVignette") {
            const nomFichier = evenement.target.files[0].name;
            // console.log(evenement.target, nomFichier);
            const base64 = await getBase64(evenement.target.files[0]);
            setVignette(base64);
            const donneeModifiee = { ...formData, titreVignette: nomFichier };
            setFormData(donneeModifiee);
        } else {
            //On clone la donnee dans un nouvel objet
            const donneeModifiee = { ...formData, [name]: value };

            const estValide = evenement.target.form.checkValidity() ? "valid" : "invalid";
            setFormValidity(estValide);
            //On met à jour la donnée globale
            setFormData(donneeModifiee);
        }
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
            setVignette("");
            //Reinit l'état de validité
            setFormValidity("invalid");
            //navigate("/"); //Redirige vers une page en particulier
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
                    <div className="input-group">
                        <p>Genres</p>
                        {genres.map((element, index) => {
                            return (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        id={element}
                                        name={`genre-${element}`}
                                        value={element}
                                        onChange={onFormDataChange}
                                        checked={formData.genres.includes(element)}
                                    />
                                    <label htmlFor={element}>{element}</label>
                                </div>
                            );
                        })}
                    </div>
                    <div className="input-group">
                        <label htmlFor="titreVignette">Vignette</label>
                        <input
                            type="file"
                            name="titreVignette"
                            id="titreVignette"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={onFormDataChange}
                        />
                        {vignette !== "" ? (
                            <img className="vignette" src={vignette} alt={formData.titreVignette} />
                        ) : (
                            ""
                        )}
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
