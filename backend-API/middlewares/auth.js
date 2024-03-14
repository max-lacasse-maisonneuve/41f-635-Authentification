const jwt = require("jsonwebtoken");
const db = require("../config/db");

const auth = async (req, res, next) => {
    try {
        //Si le jeton est valide
        // Est-ce qu'il y quelque chose dans l'entête
        if (req.headers.authorization) {
            //Transforme en array et retourne la portion après Bearer
            //Exemple d'auth: "Bearer 13wkjsd.hfwuisudhfiusdhf.uisdhf3"
            const jetonAValider = req.headers.authorization.split(" ")[1];
            const jetonDecode = jwt.verify(jetonAValider, process.env.JWT_SECRET);

            const utilisateurVerifie = await db.collection("utilisateurs").doc(jetonDecode.id).get();

            if (utilisateurVerifie.exists) {
                //Si l'utilisateur existe, on permet la suite de la requête initiale
                const utilisateurRecupere = utilisateurVerifie.data();
                req.utilisateur = utilisateurRecupere;

                // Appelle la suite de la requête initiale.
                next();
            } else {
                //Si l'utilisateur n'existe pas, on retourne une erreur non autorisée
                // res.statusCode = 401;
                // res.json({ message: "Non autorisé" });
                throw new Error("Non autorisé");
            }
        } else {
            // res.statusCode = 401;
            // res.json({ message: "Non autorisé" });
            throw new Error("Non autorisé");
        }
    } catch (erreur) {
        console.log(erreur);
        res.statusCode = 401;
        res.json({ message: erreur.message });
    }
};

module.exports = auth;
