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
    <div class="about-us-container">
      <h1>Sobre nosotros</h1>
      <p>
        En Timely creemos que la organización es la clave para alcanzar tus metas. 
        Somos una aplicación web full-stack diseñada para ayudarte a gestionar tus tareas 
        de manera sencilla, rápida y eficiente.
      </p>
      <p>
        Con nuestra plataforma puedes planificar tu día, dar seguimiento a tus pendientes 
        y visualizar tu progreso en un tablero intuitivo tipo kanban. 
        Timely no solo se centra en almacenar tareas, sino en ayudarte a mantener 
        un equilibrio entre tus responsabilidades y tu tiempo personal.
      </p>
      <p>
        Nuestro objetivo es que cada usuario tenga el control total de su agenda diaria, 
        con una experiencia fluida que combina diseño moderno, seguridad en la información 
        y accesibilidad desde cualquier dispositivo.
      </p>
      <p>
        En pocas palabras, Timely es tu compañero digital para organizar, priorizar y cumplir tus objetivos.
      </p>
    </div>
  `;
}


