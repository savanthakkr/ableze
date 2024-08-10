const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {placeOrder,qrcodeganrate,getCartCountByCategory ,getproduct,fetchCart,updateProductCart,addProductCart,checkProductCart, addProduct, } = productController;
const { verifyToken } = require("../middlewares/roleMiddleware");



router.post('/addProduct', addProduct);
router.post('/qrcodeganrate', qrcodeganrate);

router.get('/cart',verifyToken, fetchCart);
router.put('/updateCart/:productId',verifyToken, updateProductCart);
router.get('/getCartCountByCategory/:category_id',verifyToken, getCartCountByCategory);
router.post('/addToCart', verifyToken, addProductCart);
router.post('/placeOrder', verifyToken, placeOrder);
router.post('/checkCart', verifyToken, checkProductCart);
router.get('/getproduct/:sub_category_id', verifyToken, getproduct);




module.exports = router;