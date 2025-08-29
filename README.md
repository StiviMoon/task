# Task Manager - Proyecto Full Stack

## 📋 Descripción

Task Manager es una aplicación web full-stack para gestión de tareas con autenticación de usuarios. El proyecto está estructurado como un **monorepo** con frontend y backend independientes.

## 🏗️ Estructura del Proyecto

```
📁 Task-Project/
├── 📁 frontend/              # Aplicación Vite (Frontend)
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── 📁 backend/               # API Express (Backend)
│   ├── src/
│   ├── package.json
│   └── server.js
│
├── 📁 docs/                  # Documentación
│   ├── ARCHITECTURE.md       # Arquitectura del proyecto
│   ├── API.md                # Documentación de la API
│   └── README.md             # Guía de inicio rápido
│
├── .gitignore                # Gitignore global del proyecto
└── README.md                 # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- MongoDB Atlas (cuenta gratuita)

### 1. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de MongoDB
npm run dev
```

### 2. Configurar Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Editar .env con la URL del backend
npm run dev
```

### 3. Acceder a la Aplicación
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔧 Comandos Útiles

### Backend
```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
npm test         # Ejecutar tests
```

### Frontend
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
```

## 🌐 Variables de Entorno

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=tu-clave-secreta
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Task Manager
```

## 📚 Documentación

- [Arquitectura del Proyecto](./docs/ARCHITECTURE.md)
- [Documentación de la API](./docs/API.md)
- [Guía de Inicio Rápido](./docs/README.md)

## 🔒 Seguridad

- **JWT Tokens** para autenticación
- **Variables de entorno** para configuraciones sensibles
- **CORS** configurado correctamente
- **Validación de entrada** en el backend

## 🚀 Despliegue

### Backend (Render)
- Conectar repositorio de GitHub
- Configurar variables de entorno
- Build command: `npm install && npm start`

### Frontend (Vercel/Netlify)
- Conectar repositorio de GitHub
- Build command: `npm run build`
- Output directory: `dist`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

*¡Happy Coding! 🎉*
