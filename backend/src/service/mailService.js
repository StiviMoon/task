const nodemailer = require("nodemailer");
const config = require("../config/environment");

const transporter = nodemailer.createTransport({
    service: config.SMTP_SERVICE,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
    },
});

/**
 * Envía un correo electrónico.
 * @async
 * @param {string} to - Dirección de correo del destinatario.
 * @param {string} subject - Asunto del correo.
 * @param {string} text - Cuerpo del correo.
 * @returns {Promise<void>} - Resuelve si el correo se envía correctamente, rechaza con un error en caso contrario.
 */

async function sendMail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Timely App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    
    throw err;
  }
};

module.exports = { sendMail };