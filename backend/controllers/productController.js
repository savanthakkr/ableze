const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middlewares/roleMiddleware');
const multer = require('multer');
// Set up storage with multer to store images in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create the 'uploads' directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


const saveBase64Image = (base64String, folderPath) => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
  }

  const ext = matches[1].split('/')[1]; // get the image extension
  const buffer = Buffer.from(matches[2], 'base64'); // decode base64 string

  const fileName = `${Date.now()}.${ext}`;
  const filePath = path.join(folderPath, fileName);

  fs.writeFileSync(filePath, buffer); // save the file to the uploads folder

  return filePath; // return the file path for saving in the database
};

const addProduct = async (req, res) => {
  const { category_id, sub_category_id, title, description, image } = req.body;

  if (!image) {  // Corrected: Changed `req.file` to `image`
      return res.status(400).json({ message: 'Image is required' });
  }

  try {
      // Save the image path
      const imagePath = saveBase64Image(image, 'uploads');

      // Assuming you have database logic here
      const result = await sequelize.query(
          'INSERT INTO product (category_id, sub_category_id, title, description, image) VALUES (?, ?, ?, ?, ?)',
          {
              replacements: [category_id, sub_category_id, title, description, imagePath],
              type: QueryTypes.INSERT
          }
      );

      res.status(201).json({
          message: 'Product added successfully',
          productId: result[0], // Use the correct index for the result
          data: {
              category_id,
              sub_category_id,
              title,
              description,
              imagePath
          }
      });
  } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Database error', error: err });
  }
};





// const addProduct = async (req, res) => {
//   try {
//     const { category_id, sub_category_id, title, description,image } = req.body;

//     console.log(image);
    
    

//     const result = await sequelize.query(
//       'INSERT INTO product (category_id, sub_category_id, title, description, image) VALUES (?, ?, ?, ?, ?)',
//       {
//         replacements: [category_id, sub_category_id, title, description, image],
//         type: QueryTypes.INSERT
//       }
//     );

//     res.json({ message: 'Product added!', id: result[0] });
//   } catch (error) {
//     console.error('Error adding product:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

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
    let replacements = [userId, productId];

    if (action === 'increment') {
      updateQuery = `
          UPDATE cart 
          SET quantity = quantity + 1 
          WHERE user_id = ? 
          AND product_id = ? 
          AND status = 0`;
    } else if (action === 'decrement') {
      // First check the current quantity
      const [cartItem] = await sequelize.query(
        'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ? AND status = 0',
        { replacements, type: QueryTypes.SELECT }
      );

      if (!cartItem) {
        return res.status(404).json({ error: true, message: 'Cart item not found' });
      }

      if (cartItem.quantity > 1) {
        updateQuery = `
            UPDATE cart 
            SET quantity = quantity - 1 
            WHERE user_id = ? 
            AND product_id = ? 
            AND status = 0 
            AND quantity > 1`;
      } else {
        // If quantity is 1, remove the item from the cart
        updateQuery = `
            DELETE FROM cart 
            WHERE user_id = ? 
            AND product_id = ? 
            AND status = 0`;
      }
    } else {
      return res.status(400).json({ error: true, message: 'Invalid action' });
    }

    await sequelize.query(updateQuery, { replacements, type: QueryTypes.INSERT });
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


const getOrdersWithCartItems = async (req, res) => {
  try {
    const ordersWithCartItems = await sequelize.query(
      `
      SELECT 
        orders.id as order_id,
        orders.table_number,
        user.name as user_name,
        user.phone as user_phone,
        GROUP_CONCAT(JSON_OBJECT(
          'cart_id', cart.id,
          'product_id', cart.product_id,
          'quantity', cart.quantity,
          'status', cart.status,
          'product_name', product.title,
          'product_price', product.price,
          'product_description', product.description
        )) AS cart_items
      FROM orders
      LEFT JOIN cart ON orders.id = cart.order_id
      LEFT JOIN product ON cart.product_id = product.id
      LEFT JOIN user ON orders.user_id = user.id
      GROUP BY orders.id
      `,
      { type: QueryTypes.SELECT }
    );

    const result = ordersWithCartItems.map(order => ({
      order_id: order.order_id,
      table_number: order.table_number,
      user_name: order.user_name,
      user_phone: order.user_phone,
      cart_items: JSON.parse(`[${order.cart_items}]`)
    }));

    res.status(200).json({ orders: result, error: false });
  } catch (error) {
    console.error('Error fetching orders with cart items:', error);
    res.status(500).json({ message: 'Internal server error', error: true });
  }
};






const fetchVideos = async (req, res) => {
  try {
    const results = await sequelize.query(
      'SELECT * FROM product',
      { type: QueryTypes.SELECT }
    );

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const uploadMiddleware = upload.single('image');


module.exports = { 
  placeOrder,
  fetchVideos,
   qrcodeganrate, 
   getCartCountByCategory, 
   fetchCart, 
   updateProductCart,
   uploadMiddleware,
   getOrdersWithCartItems,
    addProductCart, 
   checkProductCart, 
   getproduct, 
   addProduct,  };