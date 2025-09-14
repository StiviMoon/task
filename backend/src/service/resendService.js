const { Resend } = require('resend');
const config = require('../config/environment');

const resend = new Resend(config.RESEND_API_KEY);

/**
* Sends an email using Resend
* @async
* @param {string} to - Recipient's email address
* @param {string} subject - Email subject
* @param {string} text - Plain text email body
* @param {string} html - HTML email body
* @returns {Promise<void>} - Determines whether the email was sent successfully
*/
async function sendMail({ to, subject, text, html }) {
  try {
    console.log('📧 Enviando email con Resend...');
    console.log('Para:', to);
    console.log('Asunto:', subject);

    const { data, error } = await resend.emails.send({
      from: 'Timely App <onboarding@resend.dev>', // Email verified in Forward
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
