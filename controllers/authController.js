const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Funzione per autenticare l'utente
exports.login = (req, res) => {
    // Dati dell'utente da verificare (questo potrebbe provenire dal database)
    const { username, password } = req.body;

    // Simuliamo l'autenticazione
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
        // Genera il token JWT
        const token = jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Invia il token come risposta
        res.json({ token: token });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
};
