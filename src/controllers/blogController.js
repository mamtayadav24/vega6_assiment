const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: 'Title and description are required' });
      
    const blog = new Blog({
      title,
      description,
      image: req.file ? req.file.path : null,
      author: req.userId
    });
    await blog.save();
    res.status(201).json({ message: 'Blog created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'email');
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'email');
    if (!blog)
      return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };
    if (req.file) {
      updateData.image = req.file.path;
    }
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      updateData,
      { new: true }
    );
    if (!updatedBlog)
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    res.json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.userId
    });
    if (!deletedBlog)
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
