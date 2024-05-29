require('dotenv').config();
const express = require('express');
const app = express();
const postRouter = require('./routers/postRouter'); // Importa il router per le rotte dei post
const authRouter = require('./routers/authRouter'); // Importa il router per l'autenticazione
const postsController = require('./controllers/postsController'); // Importa il controller dei post

// Middleware per il parsing del corpo della richiesta
app.use(express.json());

// Configurare gli asset statici
app.use(express.static('public'));

// Utilizza i router per le rotte relative ai post e all'autenticazione
app.use('/posts', postRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send(`
        <h1>Benvenuto nel mio blog!</h1>
        <a href="/posts">Visualizza tutti i post</a>
    `);
});

// Gestione della favicon
app.get('/favicon.ico', (req, res) => {
    res.status(404).send('Favicon not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
