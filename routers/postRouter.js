const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const authMiddleware = require('../middlewares/authMiddlewere');

router.get('/', postsController.getPosts);
router.post('/', authMiddleware, postsController.addPost);
router.get('/create', postsController.createPostPage);
router.get('/:slug', postsController.getPostBySlug);
router.get('/:slug/download', postsController.downloadImageBySlug);
router.delete('/:slug', postsController.deletePost);

module.exports = router;
