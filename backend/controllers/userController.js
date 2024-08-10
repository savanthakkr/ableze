
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



const generateToken = (user) => {
  const payload = {
    email: user.email,
    phone: user.phone,
    id: user.id,
  };
  return jwt.sign(payload, 'crud', { expiresIn: '24h' });
};




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sponda.netclues@gmail.com',
    pass: 'qzfm wlmf ukeq rvvb'
  }
});






const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sponda.netclues@gmail.com',
      pass: 'qzfm wlmf ukeq rvvb'
    }
  });

  const mailOptions = {
    from: 'sponda.netclues@gmail.com',
    to: options.to,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTPS();
    console.log(otp);



    // Send OTP via email
    await sendEmail({
      to: email,
      subject: 'Your OTP',
      message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}







const loginUserOrcreate = async (req, res) => {
  try {
    const { name, email, phone, tableNumber } = req.body;

    // Check if the user exists
    const [existingUser] = await sequelize.query(
      'SELECT * FROM user WHERE email = ? OR phone = ?',
      { replacements: [email, phone], type: QueryTypes.SELECT }
    );

    if (existingUser) {
      // User exists, update the table number and generate token
      const userId = existingUser.id;

      await sequelize.query(
        'UPDATE user SET tableNumber = ? WHERE id = ?',
        { replacements: [tableNumber, userId], type: QueryTypes.UPDATE }
      );

      const token = generateToken(existingUser);
      
      return res.status(200).send({ message: 'Login success and table number updated!', token: token, userId: userId });
    } else {
      // User does not exist, create a new user
      await sequelize.query(
        'INSERT INTO user (name, email, phone, tableNumber) VALUES (?, ?, ?, ?)',
        { replacements: [name, email, phone, tableNumber], type: QueryTypes.INSERT }
      );

      // Fetch the newly created user
      const [newUser] = await sequelize.query(
        'SELECT * FROM user WHERE email = ?',
        { replacements: [email], type: QueryTypes.SELECT }
      );

      const token = generateToken(newUser);
      const userId = newUser.id;

      return res.status(201).send({ message: 'User created and logged in!', token: token, userId: userId });
    }
  } catch (error) {
    console.log('Error in login or registration process:', error);
    res.status(500).send({
      message: 'Error in login or registration process!',
      error
    });
  }
};


module.exports = {
  loginUserOrcreate,
  sendPasswordOTP,
};