const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {fetchVideos,placeOrder,getOrdersWithCartItems,qrcodeganrate,getCartCountByCategory ,getproduct,fetchCart,updateProductCart,addProductCart,checkProductCart, addProduct, } = productController;
const { verifyToken } = require("../middlewares/roleMiddleware");
const path = require('path')
const fs = require('fs')


router.post('/addProduct', addProduct);
router.get('/fetchVideos', fetchVideos);
router.post('/qrcodeganrate', qrcodeganrate);

router.get('/cart',verifyToken, fetchCart);
router.get('/getOrdersWithCartItems', getOrdersWithCartItems);
router.put('/updateCart/:productId',verifyToken, updateProductCart);
router.get('/getCartCountByCategory/:category_id',verifyToken, getCartCountByCategory);
router.post('/addToCart', verifyToken, addProductCart);
router.post('/placeOrder', verifyToken, placeOrder);
router.post('/checkCart', verifyToken, checkProductCart);
router.get('/getproduct/:sub_category_id', getproduct);




module.exports = router;