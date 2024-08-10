const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');
 
const sendPDF = async (req, res) => {
  try {
   
    const records = await sequelize.query(
      `SELECT id, user_email, question_id, response_data FROM form_responses WHERE form_id = ?`,
      {
        replacements: [req.body.formId.formId],
        type: QueryTypes.SELECT
      }
    );
 
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          table {
            font-family: Arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>Form Responses of Form ID:${req.body.formId.formId}</h1>
        <table>
          <tr>
            <th>ID</th>
            <th>User Email</th>
            <th>Question ID</th>
            <th>Response Data</th>
          </tr>`;
 
    records.forEach(record => {
      html += `
          <tr>
            <td>${record.id}</td>
            <td>${record.user_email}</td>
            <td>${record.question_id}</td>
            <td>${record.response_data}</td>
          </tr>`;
    });
 
    html += `
        </table>
      </body>
      </html>`;
 
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf();
    await browser.close();
 
    const pdfPath = `public/assets/${Date.now()}.pdf`;
    fs.writeFileSync(pdfPath, pdfBuffer);
 
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
 
    await transporter.sendMail({
      from: process.env.MAIL,
      to: req.body.email,
      subject: `Form ${req.body.formId.formId} Responses`,
      html:html,
      attachments: [{
        filename: `Form_${req.body.formId.formId}_Responses.pdf`,
        path: pdfPath
      }]
    });
 
    res.status(200).send('PDF sent!');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error sending PDF via email.');
  }
}
 
module.exports = { sendPDF };