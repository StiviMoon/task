/**
* Renders the "About Us" section view.
*
* This function returns HTML markup describing the mission,
* goals, and features of the **Timely** app.
*
* @function renderAboutUs
* @returns {string} HTML of the "About Us" page
*/
export function renderAboutUs() {
  return `


    <div class="about-us-sections">
      <div class="about-us-logo">
        <img src="/logo.png" alt="Timely Logo" class="app-logo" onclick="window.open('https://github.com/StiviMoon/task', '_blank')">
        <p class="about-us-subtitle">Tu compañero perfecto para la gestión de tareas</p>
      </div>
      <div class="about-us-section">
        <h3>¿Qué es Timely?</h3>
        <p>Timely es una aplicación web moderna diseñada para ayudarte a organizar y gestionar tus tareas de manera eficiente. Con una interfaz intuitiva y funcionalidades avanzadas, te permitimos mantener el control total sobre tus actividades diarias.</p>
      </div>

      <div class="about-us-section">
        <h3>Características principales</h3>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"></path>
                <path d="M9 11V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                <path d="M9 11h6"></path>
              </svg>
            </div>
            <div class="feature-content">
              <h4>Gestión de Tareas</h4>
              <p>Crea, edita y organiza tus tareas con facilidad</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            </div>
            <div class="feature-content">
              <h4>Control de Tiempo</h4>
              <p>Establece fechas y horarios para cada tarea</p>
            </div>
          </div>


          <div class="feature-item">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18l-2 13H5L3 6z"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
            <div class="feature-content">
              <h4>Papelera</h4>
              <p>Recupera tareas eliminadas cuando las necesites</p>
            </div>
          </div>


          <div class="feature-item">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="feature-content">
              <h4>Perfil de Usuario</h4>
              <p>Gestiona tu información personal de forma segura</p>
            </div>
          </div>
        </div>
      </div>

      <div class="about-us-section">
        <h3>Nuestra misión</h3>
        <p>Creemos que la productividad no debe ser complicada. Timely está diseñado para ser simple, intuitivo y efectivo, permitiéndote enfocarte en lo que realmente importa: completar tus tareas y alcanzar tus objetivos.</p>
      </div>


      <div class="about-us-section">
        <h3>Versión actual</h3>
        <div class="version-info">
          <span class="version-badge">v1.0.0</span>
          <p>Primera versión estable con todas las funcionalidades básicas</p>
        </div>
      </div>
    </div>
    <footer class="footer">
        <div class="footer-top">
          <h2>Empieza a usar Timely hoy.</h2>
          <p>Únete a miles de usuarios que ya están organizando su vida con Timely</p>
        </div>

        <div class="footer-bottom">
          <!-- Bloque izquierdo - Información de la empresa -->
          <div class="footer-left">
            <div class="footer-brand">
              <h3>Timely</h3>
            </div>
            <p>Convierte tus pendientes en logros, un paso a la vez. La herramienta de gestión de tareas más intuitiva y eficiente.</p>
            <div class="footer-contact">
              <p>📧 contacto@timely.app</p>
              <p>🌐 www.timely.app</p>
            </div>
          </div>

          <!-- Links de navegación -->
          <div class="footer-links">
            <div class="footer-column">
              <h4>Navegación</h4>
              <ul>
                <li><a href="/" class="footer-link" data-page="dashboard">Mis tareas</a></li>
                <li><a href="/profile" class="footer-link" data-page="profile">Mi cuenta</a></li>
                <li><a href="/create-task" class="footer-link" data-page="create-task">Crear nueva tarea</a></li>
                <li><a href="/about" class="footer-link" data-page="about">Sobre nosotros</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Recursos</h4>
              <ul>
                <li><a href="#help" class="footer-link">Centro de ayuda</a></li>
                <li><a href="#tutorials" class="footer-link">Tutoriales</a></li>
                <li><a href="#api" class="footer-link">API</a></li>
                <li><a href="#status" class="footer-link">Estado del servicio</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#privacy" class="footer-link">Política de privacidad</a></li>
                <li><a href="#terms" class="footer-link">Términos de servicio</a></li>
                <li><a href="#cookies" class="footer-link">Política de cookies</a></li>
                <li><a href="#gdpr" class="footer-link">GDPR</a></li>
              </ul>
            </div>
          </div>

          <!-- Redes sociales y descarga -->
          <div class="footer-right">
            <div class="footer-social">
              <h4>Síguenos</h4>
              <div class="social-icons">
                <a href="https://github.com/StiviMoon/task" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>


                <a href="https://linkedin.com/company/timelyapp" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>


            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="footer-copyright">
          <div class="copyright-content">
            <p>&copy; 2025 Timely. Todos los derechos reservados.</p>
            <div class="footer-legal-links">
              <a href="#privacy" class="legal-link">Privacidad</a>
              <a href="#terms" class="legal-link">Términos</a>
              <a href="#cookies" class="legal-link">Cookies</a>
            </div>
          </div>
        </div>
    </footer>
  `;
}
