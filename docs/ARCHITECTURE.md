# Task Manager - Arquitectura del Proyecto

## 📋 Descripción General

Task Manager es una aplicación web full-stack para gestión de tareas con autenticación de usuarios. El proyecto está estructurado como una **arquitectura separada** con frontend y backend independientes.

## 🏗️ Estructura del Proyecto

```
📁 Task-Project/
├── 📁 frontend/              # Proyecto Vite (Frontend)
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── 📁 backend/               # Proyecto Express (Backend)
│   ├── src/
│   ├── package.json
│   └── server.js
│
└── 📁 docs/                  # Documentación
    ├── ARCHITECTURE.md       # Este archivo
    ├── API.md                # Documentación de la API
    └── README.md             # Guía de inicio rápido
```

## 🎯 Tecnologías Utilizadas

### Frontend
- **Vite.js** - Build tool y servidor de desarrollo
- **HTML5** - Estructura semántica
- **CSS3** - Estilos y responsive design
- **JavaScript Vanilla** - Lógica de la aplicación
- **Page.js** - Enrutamiento del lado del cliente

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB Atlas** - Base de datos en la nube
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens

## 📁 Arquitectura del Frontend

```
frontend/
├── src/
│   ├── main.js              # Punto de entrada de la aplicación
│   ├── router.js             # Configuración de rutas con Page.js
│   ├── services/             # Llamadas a la API del backend
│   │   ├── authService.js    # Servicios de autenticación
│   │   └── taskService.js    # Servicios CRUD de tareas
│   ├── pages/                # Páginas principales de la aplicación
│   │   ├── LoginPage.js      # Página de inicio de sesión
│   │   ├── RegisterPage.js   # Página de registro
│   │   ├── DashboardPage.js  # Dashboard principal
│   │   └── TaskPage.js       # Gestión de tareas
│   ├── components/           # Componentes reutilizables
│   │   ├── Header.js         # Encabezado de la aplicación
│   │   ├── TaskForm.js       # Formulario de tareas
│   │   ├── TaskList.js       # Lista de tareas
│   │   └── TaskItem.js       # Item individual de tarea
│   ├── styles/               # Archivos CSS organizados
│   │   ├── main.css          # Estilos principales
│   │   ├── components.css    # Estilos de componentes
│   │   └── pages.css         # Estilos específicos de páginas
│   ├── utils/                # Utilidades y helpers
│   │   ├── constants.js      # Constantes de la aplicación
│   │   └── helpers.js        # Funciones auxiliares
│   └── config/               # Configuración de la aplicación
│       └── api.js            # URLs y configuración de la API
├── index.html                # HTML principal de la aplicación
├── package.json              # Dependencias y scripts
├── vite.config.js            # Configuración de Vite
└── .env                      # Variables de entorno
```

### Características del Frontend

- **SPA (Single Page Application)** - No recarga la página
- **Enrutamiento del lado del cliente** - Navegación fluida
- **Componentes modulares** - Código reutilizable y mantenible
- **Responsive design** - Adaptable a diferentes dispositivos
- **Manejo de estado local** - localStorage para persistencia
- **Validación de formularios** - Validación en tiempo real

## 🖥️ Arquitectura del Backend

```
backend/
├── src/
│   ├── server.js             # Punto de entrada del servidor
│   ├── config/               # Configuración del servidor
│   │   ├── database.js       # Conexión a MongoDB Atlas
│   │   └── environment.js    # Variables de entorno
│   ├── routes/               # Definición de rutas de la API
│   │   ├── authRoutes.js     # Rutas de autenticación
│   │   └── taskRoutes.js     # Rutas CRUD de tareas
│   ├── controllers/          # Lógica de negocio
│   │   ├── authController.js # Controlador de autenticación
│   │   └── taskController.js # Controlador de tareas
│   ├── models/               # Modelos de datos (Mongoose)
│   │   ├── User.js           # Modelo de usuario
│   │   └── Task.js           # Modelo de tarea
│   ├── middleware/           # Middleware personalizado
│   │   ├── auth.js          # Verificación de JWT
│   │   └── validation.js    # Validación de datos de entrada
│   └── utils/                # Utilidades del servidor
│       ├── jwt.js           # Manejo de tokens JWT
│       └── validation.js    # Validaciones del servidor
├── package.json              # Dependencias y scripts
├── server.js                 # Archivo principal del servidor
└── .env                      # Variables de entorno
```

### Características del Backend

- **API RESTful** - Endpoints bien definidos
- **Arquitectura MVC** - Separación clara de responsabilidades
- **Middleware personalizado** - Autenticación y validación
- **Manejo de errores** - Respuestas de error consistentes
- **Validación de datos** - Sanitización de entrada
- **Seguridad** - JWT, CORS, rate limiting

## 🔄 Flujo de Comunicación

```
Frontend (Vite) ←→ Backend (Express) ←→ MongoDB Atlas
     ↓                    ↓                    ↓
  JavaScript         Node.js + Express    Base de datos
  + Page.js         + Mongoose          + Colecciones
  + Fetch API       + JWT               + users, tasks
```

### Flujo de Autenticación

1. **Usuario ingresa credenciales** en el frontend
2. **Frontend envía POST** a `/auth/login`
3. **Backend valida credenciales** contra MongoDB
4. **Backend genera JWT** y lo envía al frontend
5. **Frontend almacena JWT** en localStorage
6. **Frontend incluye JWT** en headers de futuras peticiones

### Flujo de Gestión de Tareas

1. **Usuario accede a tareas** (JWT verificado)
2. **Frontend envía GET** a `/tasks` con JWT
3. **Backend valida JWT** y busca tareas del usuario
4. **Backend responde** con lista de tareas
5. **Frontend renderiza** las tareas en la interfaz

## 🚀 Scripts de Desarrollo

### Frontend
```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Backend
```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Servidor de producción
npm start
```

## 🌍 Variables de Entorno

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Task Manager
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## 📱 Responsive Design

- **Mobile First** - Diseño optimizado para móviles
- **Breakpoints** - Adaptable a tablets y desktop
- **Flexbox/Grid** - Layouts modernos y flexibles
- **Media Queries** - Estilos específicos por dispositivo

## 🔒 Seguridad

- **JWT Tokens** - Autenticación stateless
- **CORS** - Control de acceso entre dominios
- **Validación de entrada** - Sanitización de datos
- **Rate Limiting** - Protección contra ataques
- **Variables de entorno** - Configuración segura

## 📊 Base de Datos

### Colección: users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: tasks
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  title: String,
  description: String,
  status: String (pending, in-progress, completed),
  priority: String (low, medium, high),
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Estilo de Código

- **JSDoc** - Documentación de funciones y clases
- **ESLint** - Linting y formateo de código
- **Prettier** - Formateo automático
- **Convenciones** - Nombres descriptivos y consistentes
- **Modularidad** - Funciones pequeñas y reutilizables

## 📈 Escalabilidad

- **Arquitectura modular** - Fácil agregar nuevas funcionalidades
- **Separación de responsabilidades** - Frontend y backend independientes
- **API RESTful** - Fácil integración con otros sistemas
- **Base de datos escalable** - MongoDB Atlas con opciones de escalado
- **Despliegue independiente** - Cada capa puede escalar por separado

## 🔧 Herramientas de Desarrollo

- **Git** - Control de versiones
- **Postman/Insomnia** - Testing de API
- **MongoDB Compass** - Cliente de base de datos
- **VS Code** - Editor recomendado con extensiones
- **Chrome DevTools** - Debugging del frontend

## 📝 Próximos Pasos

1. **Configurar estructura de carpetas**
2. **Instalar dependencias** en ambos proyectos
3. **Configurar base de datos** MongoDB Atlas
4. **Implementar autenticación** básica
5. **Crear CRUD de tareas**
6. **Implementar frontend** con enrutamiento
7. **Testing y debugging**
8. **Despliegue en Render**

---

*Documentación creada para el proyecto Task Manager*
*Última actualización: $(date)*
