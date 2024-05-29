const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

router.get('/', postsController.getPosts);
router.post('/', postsController.addPost);
router.get('/create', postsController.createPostPage);
router.get('/:slug', postsController.getPostBySlug);
router.get('/:slug/download', postsController.downloadImageBySlug);
router.delete('/:slug', postsController.deletePost);

module.exports = router;
