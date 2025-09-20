# Task Manager API

Backend API para gestión de tareas con autenticación JWT y patrón DAO.

## 🚀 Tecnologías

- **Node.js** + **Express.js**
- **MongoDB Atlas** (Base de datos en la nube)
- **JWT** (Autenticación)
- **Bcrypt** (Hash de contraseñas)
- **Patrón DAO** (Data Access Object)
- **CORS** universal

## 🏃‍♂️ Ejecutar el Proyecto

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm start
```

## 🌐 Base URL

- **Desarrollo:** `http://localhost:5000/api`
- **Producción:** `https://tu-dominio.com/api`

## 📋 Endpoints

### 🔐 Autenticación

#### 1. **Registrar Usuario**
```http
POST /auth/register
```

**Body (JSON):**
```json
{
  "name": "Juan",
  "lastName": "Pérez",
  "age": 25,
  "email": "juan@ejemplo.com",
  "password": "MiPassword123!"
}
```

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "lastName": "Pérez",
    "age": 25,
    "email": "juan@ejemplo.com",
    "password": "MiPassword123!"
  }'
```

**Respuesta Exitosa:**
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Validaciones:**
- ✅ **Email:** Formato válido y único
- ✅ **Contraseña:** Mínimo 8 caracteres, 1 mayúscula, 1 número, 1 carácter especial
- ✅ **Edad:** Mínimo 13 años
- ✅ **Nombres y apellidos:** Obligatorios

---

#### 2. **Iniciar Sesión**
```http
POST /auth/login
```

**Body (JSON):**
```json
{
  "email": "juan@ejemplo.com",
  "password": "MiPassword123!"
}
```

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "MiPassword123!"
  }' \
  -c cookies.txt
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notas:**
- 🍪 **Cookie automática:** `access_token` (httpOnly, 24h)
- 🎫 **Token en respuesta:** Para clientes que no manejan cookies
- ⏰ **Duración:** 24 horas

---

#### 3. **Cerrar Sesión**
```http
POST /auth/logout
```

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente."
}
```

---

#### 4. **Verificar Autenticación**
```http
GET /auth/verify
```

**Headers requeridos:**
```
Authorization: Bearer <token>
```
O usar cookies automáticas.

**Ejemplo cURL:**
```bash
# Con cookie
curl -X GET http://localhost:5000/api/auth/verify \
  -b cookies.txt

# Con header
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "juan@ejemplo.com"
  }
}
```

---

### 📝 Gestión de Tareas (CRUD)

> **⚠️ Todas las rutas de tareas requieren autenticación**

#### 1. **Crear Tarea**
```http
POST /tasks
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>  (opcional si usas cookies)
```

**Body (JSON):**
```json
{
  "title": "Mi nueva tarea",
  "details": "Descripción de la tarea",
  "date": "2025-12-25",
  "hour": "14:30",
  "status": "Por hacer"
}
```

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Mi nueva tarea",
    "details": "Descripción de la tarea",
    "date": "2025-12-25",
    "hour": "14:30",
    "status": "Por hacer"
  }'
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "taskId": "507f1f77bcf86cd799439012",
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Mi nueva tarea",
    "details": "Descripción de la tarea",
    "date": "2025-12-25T00:00:00.000Z",
    "hour": "14:30",
    "status": "Por hacer",
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2025-09-15T05:05:49.132Z",
    "updatedAt": "2025-09-15T05:05:49.132Z"
  }
}
```

**Campos:**
- ✅ **title:** Obligatorio, máx 50 caracteres
- ✅ **details:** Opcional, máx 500 caracteres
- ✅ **date:** Opcional, formato YYYY-MM-DD (no pasado)
- ✅ **hour:** Opcional, formato HH:mm
- ✅ **status:** Por hacer | Haciendo | Hecho (default: "Por hacer")

---

#### 2. **Obtener Todas las Tareas**
```http
GET /tasks
```

**Headers:**
```
Authorization: Bearer <token>  (opcional si usas cookies)
```

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:5000/api/tasks \
  -b cookies.txt
```

**Respuesta Exitosa:**
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Mi nueva tarea",
      "details": "Descripción de la tarea",
      "date": "2025-12-25T00:00:00.000Z",
      "hour": "14:30",
      "status": "Por hacer",
      "userId": "507f1f77bcf86cd799439011",
      "createdAt": "2025-09-15T05:05:49.132Z",
      "updatedAt": "2025-09-15T05:05:49.132Z"
    }
  ]
}
```

**Notas:**
- 🔒 **Solo tus tareas:** Cada usuario ve únicamente sus tareas
- 📅 **Orden:** Más recientes primero (createdAt desc)

---

#### 3. **Actualizar Tarea**
```http
PUT /tasks/:id
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>  (opcional si usas cookies)
```

**Body (JSON):**
```json
{
  "title": "Tarea actualizada",
  "details": "Nueva descripción",
  "date": "2025-12-30",
  "hour": "16:00",
  "status": "Haciendo"
}
```

**Ejemplo cURL:**
```bash
curl -X PUT http://localhost:5000/api/tasks/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Tarea actualizada",
    "details": "Nueva descripción",
    "status": "Haciendo"
  }'
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Tarea actualizada",
    "details": "Nueva descripción",
    "status": "Haciendo",
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2025-09-15T05:05:49.132Z",
    "updatedAt": "2025-09-15T05:06:10.530Z"
  }
}
```

**Notas:**
- 🔒 **Solo tus tareas:** Solo puedes actualizar tareas que te pertenecen
- ⚡ **Campos opcionales:** Puedes actualizar solo los campos que necesites

---

#### 4. **Eliminar Tarea**
```http
DELETE /tasks/:id
```

**Headers:**
```
Authorization: Bearer <token>  (opcional si usas cookies)
```

**Ejemplo cURL:**
```bash
curl -X DELETE http://localhost:5000/api/tasks/507f1f77bcf86cd799439012 \
  -b cookies.txt
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Tarea eliminada exitosamente."
}
```

**Notas:**
- 🔒 **Solo tus tareas:** Solo puedes eliminar tareas que te pertenecen
- ⚠️ **Irreversible:** La eliminación es permanente

---

### 🏥 Salud del Servidor

#### **Health Check**
```http
GET /health
```

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Servidor funcionando correctamente",
  "timestamp": "2025-09-15T05:05:12.735Z",
  "environment": "development"
}
```

---

## 🔐 Autenticación

### Métodos Soportados:

#### 1. **Cookies (Recomendado)**
```bash
# Login (guarda cookie automáticamente)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Password123!"}' \
  -c cookies.txt

# Usar en peticiones posteriores
curl -X GET http://localhost:5000/api/tasks -b cookies.txt
```

#### 2. **Header Authorization**
```bash
# Login y extraer token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Password123!"}' \
  | jq -r '.token')

# Usar token en peticiones
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

---

## ❌ Códigos de Error

| **Código** | **Significado** | **Ejemplo** |
|------------|-----------------|-------------|
| `400` | Bad Request | Datos inválidos, campos faltantes |
| `401` | Unauthorized | Token inválido o ausente |
| `403` | Forbidden | Token expirado |
| `404` | Not Found | Tarea no encontrada o no te pertenece |
| `409` | Conflict | Email ya registrado |
| `429` | Too Many Requests | Límite de intentos de login |
| `500` | Internal Server Error | Error del servidor |

### Ejemplos de Errores:

```json
// Email duplicado
{
  "message": "Este correo ya está registrado."
}

// Credenciales inválidas
{
  "success": false,
  "message": "Correo o contraseña inválidos"
}

// Token requerido
{
  "success": false,
  "message": "Token de acceso requerido"
}

// Tarea no encontrada
{
  "success": false,
  "message": "Tarea no encontrada."
}
```

---

## 🔧 Variables de Entorno

### Desarrollo (archivo `.env`)
```env
# Servidor
NODE_ENV=development
PORT=5000

# Base de datos
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/basedatos

# Frontend
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=tu_clave_super_secreta
JWT_RESET_PASSWORD_SECRET=tu_clave_reset_secreta

# Email (Resend)
RESEND_API_KEY=tu_api_key_de_resend

# API
API_PREFIX=/api

# Rate limiting (opcional)
SKIP_RATE_LIMIT=true
```

### Producción (Render)
Configura estas variables en el dashboard de Render:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://terminal:12345@todolisttest.miey5kl.mongodb.net/?retryWrites=true&w=majority&appName=todolistTest
FRONTEND_URL=https://task-three-blue.vercel.app
JWT_SECRET=tu-clave-secreta
JWT_RESET_PASSWORD_SECRET=tu-clave-secreta-para-reset
API_PREFIX=/api
RESEND_API_KEY=re_FjB9n9me_LkBmuLNcRyukZoZtqR62aLs6
```

---

## 🚀 Despliegue en Render

### Pasos para desplegar:

1. **Conecta tu repositorio** en [render.com](https://render.com)

2. **Configuración del servicio:**
   ```
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```

3. **Variables de entorno** (en Render Dashboard):
   ```
   NODE_ENV=production
   MONGODB_URI=tu_mongodb_atlas_uri
   FRONTEND_URL=tu_frontend_url
   JWT_SECRET=tu_jwt_secret
   JWT_RESET_PASSWORD_SECRET=tu_reset_secret
   API_PREFIX=/api
   RESEND_API_KEY=tu_resend_key
   ```

4. **Auto-deploy:** ✅ Habilitado (se actualiza automáticamente con cada push)

### URL de producción:
```
https://tu-app-name.onrender.com/api
```

### Troubleshooting común:
- ✅ **IPv6 Error:** Solucionado con rate limiting compatible
- ✅ **MongoDB:** Usa MongoDB Atlas (no local)
- ✅ **CORS:** Configurado para acceso universal
- ✅ **Variables:** Configuradas en Render Dashboard

---

## 📱 Compatibilidad Móvil

La API está configurada para máxima compatibilidad:

- ✅ **CORS Universal:** Acepta peticiones desde cualquier origen
- ✅ **Headers Flexibles:** Compatible con todos los navegadores
- ✅ **Cookies Permisivas:** Funcionan en HTTP y HTTPS
- ✅ **Rate Limiting Suave:** 100 intentos por 5 minutos

---

## 🏗️ Arquitectura

```
Frontend → API Routes → Controllers → DAOs → Models → MongoDB Atlas
    ↓         ↓            ↓         ↓       ↓         ↓
 Requests   CRUD       Business   Data    Schema   Cloud DB
           Routes      Logic     Access
```

### Patrón DAO Implementado:
- **BaseDAO:** Operaciones CRUD genéricas
- **UserDAO:** Métodos específicos de usuario
- **TaskDAO:** Métodos específicos de tareas

---

## 🚀 Ejemplo Completo

```bash
# 1. Registrar usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana",
    "lastName": "García",
    "age": 28,
    "email": "ana@ejemplo.com",
    "password": "MiPassword123!"
  }'

# 2. Iniciar sesión
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ana@ejemplo.com",
    "password": "MiPassword123!"
  }' -c cookies.txt

# 3. Crear tarea
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Estudiar para examen",
    "details": "Repasar capítulos 1-5",
    "date": "2025-09-20",
    "status": "Por hacer"
  }'

# 4. Ver todas las tareas
curl -X GET http://localhost:5000/api/tasks -b cookies.txt

# 5. Actualizar tarea
curl -X PUT http://localhost:5000/api/tasks/{TASK_ID} \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"status": "Hecho"}'

# 6. Eliminar tarea
curl -X DELETE http://localhost:5000/api/tasks/{TASK_ID} -b cookies.txt

# 7. Cerrar sesión
curl -X POST http://localhost:5000/api/auth/logout -b cookies.txt
```

---

## 📞 Soporte

Para preguntas o problemas:
- **Email:** tu@email.com
- **GitHub:** [tu-usuario/task-manager](https://github.com/tu-usuario/task-manager)

---

**¡API Task Manager - Gestiona tus tareas de forma eficiente! 🎯**
