# Task Manager Frontend

Frontend de la aplicación de gestión de tareas construido con Vanilla JavaScript y Vite.

## 🚀 Tecnologías

- **Vanilla JavaScript** (ES6+)
- **Vite** (Build tool)
- **CSS3** (Variables CSS, Grid, Flexbox)
- **Page.js** (Routing)

## 🏃‍♂️ Ejecutar el Proyecto

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔧 Variables de Entorno

### Para Vercel (Producción)

Configura estas variables en tu dashboard de Vercel:

```env
VITE_API_BASE_URL=https://backend-task-6ub4.onrender.com/api
VITE_APP_NAME=Timely - Task Manager
VITE_NODE_ENV=production
```

### Para Desarrollo Local

Crea un archivo `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Timely - Task Manager
VITE_NODE_ENV=development
```

## 🌐 URLs

- **Desarrollo:** `http://localhost:5173`
- **Producción:** `https://task-three-blue.vercel.app`

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── config/
│   │   └── api.js          # Configuración de API
│   ├── pages/              # Páginas de la aplicación
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── DashboardPage.js
│   │   └── ResetPasswordPage.js
│   ├── services/           # Servicios de API
│   │   ├── authService.js  # Servicios de autenticación
│   │   └── taskService.js  # Servicios de tareas
│   ├── styles/             # Estilos CSS organizados
│   ├── utils/
│   │   └── authGuard.js    # Guards de autenticación
│   ├── main.js             # Punto de entrada
│   └── style.css           # Estilos principales
├── public/                 # Archivos estáticos
├── index.html              # HTML principal
└── package.json
```

## 🔐 Autenticación

La aplicación maneja autenticación mediante:

1. **Cookies httpOnly** (método principal)
2. **JWT tokens** en localStorage (backup)
3. **Guards de rutas** para proteger páginas

### Guards Implementados:

- `requireAuth()` - Requiere autenticación
- `requireGuest()` - Solo para usuarios no autenticados

## 📱 Funcionalidades

### ✅ Autenticación
- Login/Logout
- Registro de usuarios
- Recuperación de contraseña
- Validación de sesión

### ✅ Gestión de Tareas
- Crear tareas
- Listar tareas (vista Kanban)
- Editar tareas
- Eliminar tareas
- Estados: Por hacer, Haciendo, Hecho

### ✅ UI/UX
- Diseño responsive
- Tema moderno
- Animaciones CSS
- Compatibilidad móvil

## 🚀 Despliegue en Vercel

### Pasos para desplegar:

1. **Conecta tu repositorio** en [vercel.com](https://vercel.com)

2. **Configuración del proyecto:**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Variables de entorno** (en Vercel Dashboard):
   ```
   VITE_API_BASE_URL=https://backend-task-6ub4.onrender.com/api
   VITE_APP_NAME=Timely - Task Manager
   VITE_NODE_ENV=production
   ```

4. **Auto-deploy:** ✅ Habilitado

### Troubleshooting:

- ✅ **Routing:** `vercel.json` configurado para SPA
- ✅ **CORS:** Backend configurado para Vercel
- ✅ **Variables:** Prefijo `VITE_` obligatorio
- ✅ **Build:** Archivos estáticos en `/dist`

## 🔄 Flujo de Datos

```
User Action → Page Component → Service → API → Backend DAO → Database
     ↓              ↓            ↓       ↓        ↓           ↓
   Click          Logic       HTTP    REST    Business    MongoDB
                              Request  API     Logic       Atlas
```

## 🎨 Estilos

### Arquitectura CSS:
- **main.css** - Variables y estilos base
- **components.css** - Componentes reutilizables
- **pages.css** - Estilos específicos de páginas
- **form.css** - Elementos de formulario
- **modal.css** - Modales y overlays
- **button.css** - Botones y elementos interactivos

### Variables CSS:
```css
:root {
  /* Colores */
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-danger: #ef4444;

  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;

  /* Tipografía */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
}
```

## 🐛 Debugging

### Console Logs Implementados:
```javascript
// En authService.js
console.log('🔄 Intentando login con URL:', url);
console.log('📡 Respuesta recibida:', response.status);
console.log('✅ Login exitoso:', data);

// En authGuard.js
console.log('🔒 Verificando autenticación...');
console.log('🔑 Estado de autenticación:', authenticated);
```

### DevTools Network Tab:
1. Verifica la URL de las peticiones
2. Revisa headers de CORS
3. Checa cookies en Application tab

## 📞 APIs Utilizadas

### Endpoints del Backend:
```javascript
// Autenticación
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/verify

// Tareas
GET    /tasks
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
```

## 🔧 Configuración de Desarrollo

### Vite Config:
```javascript
// vite.config.js
export default {
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist'
  }
}
```

### Package.json Scripts:
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

**¡Frontend Task Manager - Interfaz moderna para gestión de tareas! 🎯**
