const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/comments', auth, commentController.addComment);

router.post('/comments/:commentId/reply', auth, commentController.addReply);

router.get('/comments/:blogId', commentController.getCommentsByBlog);

module.exports = router;
