const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); 
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, upload.single('blogImage'), blogController.createBlog);

router.get('/', blogController.getBlogs);

router.get('/:id', blogController.getBlogById);

router.put('/:id', authMiddleware, upload.single('blogImage'), blogController.updateBlog);

router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;
