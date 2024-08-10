const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middlewares/roleMiddleware");

const {getSubCategory, subCategory, createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Create a new category
router.post('/createCategory', createCategory);
router.post('/subCategory', subCategory);



router.get('/subcategory/:category_id',verifyToken, getSubCategory);
// Get all categories
router.get('/allCategory',verifyToken, getAllCategories);

// Get a specific category by ID
//router.get('/category/:id', getCategoryById);

// Update a category
router.put('/category/:id',verifyToken, updateCategory); 

// Delete a category
router.delete('/deleteCategory/:id',verifyToken, deleteCategory);

module.exports = router;
