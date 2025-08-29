# Task Manager - Guía de Inicio Rápido

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- MongoDB Atlas (cuenta gratuita)
- Git

### 1. Clonar el Proyecto
```bash
git clone <tu-repositorio>
cd Task-Project
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de MongoDB
npm run dev
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Editar .env con la URL del backend
npm run dev
```

### 4. Acceder a la Aplicación
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Estructura del Proyecto

```
Task-Project/
├── frontend/          # Aplicación Vite
├── backend/           # API Express
└── docs/             # Documentación
```

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

- [Arquitectura del Proyecto](./ARCHITECTURE.md)
- [Documentación de la API](./API.md)

## 🆘 Solución de Problemas

### Error de Conexión a MongoDB
- Verificar credenciales en .env
- Asegurar que la IP esté en whitelist de MongoDB Atlas

### CORS Error
- Verificar que el backend esté corriendo en el puerto correcto
- Revisar configuración de CORS en el backend

### Frontend no se conecta al Backend
- Verificar VITE_API_BASE_URL en .env del frontend
- Asegurar que el backend esté corriendo

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 📞 Soporte

Si tienes problemas o preguntas:
- Abre un issue en GitHub
- Revisa la documentación en la carpeta `docs/`
- Consulta los logs del servidor

---

*¡Happy Coding! 🎉*
