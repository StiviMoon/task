const { Resend } = require('resend');
const config = require('../config/environment');

const resend = new Resend(config.RESEND_API_KEY);

/**
 * Envía un correo electrónico usando Resend
 * @async
 * @param {string} to - Dirección de correo del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} text - Cuerpo del correo en texto plano
 * @param {string} html - Cuerpo del correo en HTML
 * @returns {Promise<void>} - Resuelve si el correo se envía correctamente
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
