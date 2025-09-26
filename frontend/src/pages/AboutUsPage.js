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
    <div class="about-us-logo">
      <img src="/logo.png" alt="Timely Logo" class="app-logo" onclick="window.open('https://github.com/StiviMoon/task', '_blank')">
      <p class="about-us-subtitle">Tu compañero perfecto para la gestión de tareas</p>
    </div>

    <div class="about-us-sections">
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
        </div>

        <div class="footer-bottom">
          <!-- Bloque izquierdo -->
          <div class="footer-left">
            <p>Convierte tus pendientes en logros, un paso a la vez.</p>
          </div>

          <!-- Links en el centro -->
          <div class="footer-links">
            <ul>
              <li>Mis tareas</li>
              <li>Mi cuenta</li>
              <li>Crear nueva tarea</li>
              <li>Sobre nosotros</li>
            </ul>
          </div>

          <!-- Bloque derecho (donde estaba el aguacate) -->
          <div class="footer-right">
            <img src="/logo.png" alt="Logo" class="footer-decor" />
            <div class="footer-social">
              <div class="social-icons">
                <div class="social-icons">
                  <a href="https://github.com/StiviMoon/task.git" target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </footer>
  `;
}
