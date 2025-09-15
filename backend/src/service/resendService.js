const { Resend } = require('resend');
const config = require('../config/environment');

const resend = new Resend(config.RESEND_API_KEY);

/**
 * Sends an email using Resend.
 * 
 * @async
 * @function sendMail
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.text - Plain text body of the email
 * @param {string} params.html - HTML body of the email
 * @returns {Promise<void>} Resolves if the email is sent successfully
 * @throws {Error} If the email fails to send
 */
async function sendMail({ to, subject, text, html }) {
  try {
    console.log('📧 Enviando email con Resend...');
    console.log('Para:', to);
    console.log('Asunto:', subject);

    const { data, error } = await resend.emails.send({
      from: 'Timely App <onboarding@resend.dev>', // Email verificado en Resend
      to: [to],
      subject: subject,
      text: text,
      html: html,
    });

    if (error) {
      console.error('❌ Error de Resend:', error);
      throw new Error(`Error enviando email: ${error.message || 'Error desconocido'}`);
    }

    console.log('✅ Email enviado exitosamente con Resend');
    console.log('ID del email:', data.id);

  } catch (err) {
    console.error('❌ Error enviando email:', err);
    throw err;
  }
}

module.exports = { sendMail };
