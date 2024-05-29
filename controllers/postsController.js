const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { writeDataToFile, findPostBySlug, generateUniqueSlug } = require('../helpers');
const posts = require('../data/data.json');

// Configurazione multer per salvare le immagini caricate
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imgs/posts');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Funzione per ottenere tutti i post
exports.getPosts = (req, res) => {
    const initialPage = `<a href="/">Torna alla pagina iniziale</a>`;

    res.format({
        'application/json': function () {
            res.json(posts);
        },
        'text/html': function () {
            let html = initialPage + '<ul>';
            posts.forEach(post => {
                // Creazione del link per la visualizzazione del singolo post
                const postLink = `<a href="/posts/${post.slug}">${post.title}</a>`;
                html += `
                    <li>
                        <h2>${postLink}</h2>
                        <img src="/imgs/posts/${post.image}" alt="${post.title}" style="width:300px">
                        <p>${post.content}</p>
                        <p>Tags: ${post.tags.join(', ')}</p>                            
                    </li>`;
            });
            html += '</ul>';
            res.send(html);
        },
        default: function () {
            res.status(406).send('Not Acceptable');
        }
    });
};

// Funzione per visualizzare un singolo post
// Funzione per visualizzare un singolo post
exports.getPostBySlug = (req, res) => {
    const slug = req.params.slug;
    const post = posts.find(post => post.slug === slug);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    post.image_url = `/imgs/posts/${post.image}`;

    res.format({
        'application/json': function () {
            res.json(post);
        },
        'text/html': function () {
            const html = `
                <a href="/posts">Torna alla lista dei post</a>
                <h2>${post.title}</h2>
                <a href="${post.image_url}" target="_blank">
                    <img src="/imgs/posts/${post.image}" alt="${post.title}" style="width:300px">
                </a>
                <p>${post.content}</p>
                <p>Tags: ${post.tags.join(', ')}</p>
                <a href="${post.image_url}" download>Download Image</a>
            `;
            res.send(html);
        },
        default: function () {
            res.status(406).send('Not Acceptable');
        }
    });
};

// Funzione per aggiungere un nuovo post
exports.addPost = [
    upload.single('image'),
    async (req, res) => {
        const { title, content, tags } = req.body;

        if (!title || !content || !req.file || !tags) {
            return res.status(400).json({ error: 'Assicurati di fornire tutti i campi necessari: title, content, image e tags' });
        }

        const slug = generateUniqueSlug(title);

        const newPost = {
            title,
            content,
            image: req.file.filename,
            tags: tags.split(',').map(tag => tag.trim()),
            slug
        };

        posts.push(newPost);

        try {
            const dataFilePath = path.join(__dirname, '../data/data.json');
            await writeDataToFile(dataFilePath, posts);

            res.format({
                'application/json': function () {
                    res.status(201).json(newPost);
                },
                'text/html': function () {
                    res.redirect(`/posts/${newPost.slug}`);
                },
                default: function () {
                    res.status(406).send('Not Acceptable');
                }
            });
        } catch (err) {
            console.error('Errore durante il salvataggio dei dati:', err);
            res.status(500).json({ error: 'Errore durante il salvataggio dei dati' });
        }
    }
];


// Funzione per creare una pagina per la creazione di un nuovo post
exports.createPostPage = (req, res) => {
    const accept = req.headers.accept;

    if (accept && accept.includes('text/html')) {
        res.send('<h1>Creazione nuovo post</h1>');
    } else {
        res.status(406).send('Not Acceptable');
    }
};

// Funzione per scaricare l'immagine del post tramite lo slug
// Funzione per scaricare l'immagine del post tramite lo slug
exports.downloadImageBySlug = (req, res) => {
    const slug = req.params.slug;
    const post = posts.find(post => post.slug === slug);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const imagePath = path.join(__dirname, `../public/imgs/posts/${post.image}`);

    res.download(imagePath, (err) => {
        if (err) {
            console.error('Errore durante il download dell\'immagine:', err);
            return res.status(500).json({ error: 'Errore durante il download dell\'immagine' });
        }
        console.log('Immagine scaricata correttamente.');
    });
};

// Funzione per eliminare un post tramite lo slug
exports.deletePost = (req, res) => {
    const slug = req.params.slug;
    const postIndex = posts.findIndex(post => post.slug === slug);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    posts.splice(postIndex, 1);

    try {
        const dataFilePath = path.join(__dirname, '../data/data.json');
        writeDataToFile(dataFilePath, posts);

        res.format({
            'application/json': function () {
                res.status(200).send('Post eliminato');
            },
            'text/html': function () {
                res.redirect('/posts');
            },
            default: function () {
                res.status(406).send('Not Acceptable');
            }
        });
    } catch (err) {
        console.error('Errore durante il salvataggio dei dati:', err);
        res.status(500).json({ error: 'Errore durante il salvataggio dei dati' });
    }
};
