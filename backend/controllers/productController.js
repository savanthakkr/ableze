const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middlewares/roleMiddleware');



const addProduct = async (req, res) => {
  try {
    const { category_id, sub_category_id, title, description } = req.body;
    const result = await sequelize.query(
      'INSERT INTO product (category_id,sub_category_id, title, description ) VALUES (?, ?, ?, ?)',
      {
        replacements: [category_id, sub_category_id, title, description],
        type: QueryTypes.INSERT
      }
    );
    res.json({ message: 'product added!', id: result[0] });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getproduct = async (req, res) => {
  try {
    const { sub_category_id } = req.params; // Correctly destructuring to match req.params
    console.log(sub_category_id);

    // Using parameterized query with replacements to prevent SQL injection
    const product = await sequelize.query(
      'SELECT * FROM product WHERE sub_category_id = :sub_category_id',
      {
        replacements: { sub_category_id: sub_category_id },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getCartCountByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const userId = req.user.id;

    // Query to fetch the count of products in the cart by category, with status = 0
    const [results] = await sequelize.query(
      `SELECT COUNT(*) as count 
           FROM cart 
           INNER JOIN product ON cart.product_id = product.id 
           WHERE cart.user_id = ? AND product.category_id = ? AND cart.status = 0`,
      { replacements: [userId, category_id], type: QueryTypes.SELECT }
    );

    return res.status(200).json({ count: results.count });
  } catch (error) {
    console.error('Error fetching cart count by category_id:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



const checkProductCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const [product] = await sequelize.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND status = 0',
      { replacements: [userId, productId], type: QueryTypes.SELECT }
    );

    if (product) {
      return res.status(200).json({ product, inCart: true });
    } else {
      return res.status(200).json({ inCart: false });
    }
  } catch (error) {
    console.error('Error checking cart:', error);
    res.status(500).json({ message: 'Internal server error', error: true });
  }
};


const addProductCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    await sequelize.query(
      'INSERT INTO cart (user_id, product_id, quantity, status) VALUES (?, ?, ?, ?)',
      { replacements: [userId, productId, quantity, 0], type: QueryTypes.INSERT }
    );
    res.status(200).json({ message: 'Product added to cart', error: false });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal server error', error: true });
  }
};


const qrcodeganrate = async (req, res) => {
  const { tableNumber, websiteLink } = req.body;

  if (!tableNumber || !websiteLink) {
    return res.status(400).json({ message: 'Table number and website link are required' });
  }

  const qrData = `${websiteLink}${tableNumber}`;

  try {
    const qrCodeUrl = await QRCode.toDataURL(qrData);
    res.status(200).json({ qrCodeUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const updateProductCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    let updateQuery;
    if (action === 'increment') {
      updateQuery = `
          UPDATE cart 
          SET quantity = quantity + 1 
          WHERE user_id = ? 
          AND product_id = ? 
          AND status = 0`;
    } else if (action === 'decrement') {
      updateQuery = `
          UPDATE cart 
          SET quantity = quantity - 1 
          WHERE user_id = ? 
          AND product_id = ? 
          AND status = 0 
          AND quantity > 1`;
    } else {
      return res.status(400).json({ error: true, message: 'Invalid action' });
    }

    await sequelize.query(updateQuery, { replacements: [userId, productId], type: QueryTypes.UPDATE });
    res.status(200).json({ message: 'Cart updated', error: false });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Internal server error', error: true });
  }
};

const placeOrder = async (req, res) => {
  const userId = req.user.id;
  const { tableNumber } = req.body;

  try {

    const result = await sequelize.query(
      'INSERT INTO orders (user_id, table_number) VALUES (?, ?)',
      { replacements: [userId, tableNumber], type: QueryTypes.INSERT }
    );


    if (result && result[0] != null) {
      const insertedId = result[0];
      const resultUpdate = await sequelize.query(
        'UPDATE cart SET status = 1, order_id = ? WHERE user_id = ? AND status = 0',
        { replacements: [insertedId, userId], type: QueryTypes.UPDATE }
      );
  
      res.status(200).json({ message: 'Order created!', error: false });
    } else {
      res.status(400).json({ message: 'Order not create', error: true });
    }
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const fetchCart = async (req, res) => {
  try {
    const userId = req.user.id;


    // const { userId } = req.params;
    const cartItems = await sequelize.query(
      'SELECT * FROM cart WHERE user_id = ? AND  status = 0',
      { replacements: [userId], type: QueryTypes.SELECT }
    );
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
}




module.exports = { 
  placeOrder,
   qrcodeganrate, 
   getCartCountByCategory, 
   fetchCart, 
   updateProductCart,
    addProductCart, 
   checkProductCart, 
   getproduct, 
   addProduct,  };