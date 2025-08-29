# Task Manager - Documentación de la API

## 🌐 Información General

- **Base URL**: `http://localhost:5000/api` (desarrollo)
- **Base URL**: `https://tu-app.onrender.com/api` (producción)
- **Versión**: v1.0.0
- **Formato**: JSON
- **Autenticación**: JWT Bearer Token

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Incluye el token en el header de todas las peticiones autenticadas:

```
Authorization: Bearer <tu-jwt-token>
```

## 📋 Endpoints

### 🔑 Autenticación

#### POST /auth/register
Registra un nuevo usuario.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

#### POST /auth/login
Inicia sesión de un usuario existente.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

### 📝 Tareas

#### GET /tasks
Obtiene todas las tareas del usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `status` (opcional): Filtrar por estado (`pending`, `in-progress`, `completed`)
- `priority` (opcional): Filtrar por prioridad (`low`, `medium`, `high`)
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "title": "Completar proyecto",
        "description": "Terminar la implementación del CRUD",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2024-01-20T23:59:59.000Z",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

#### POST /tasks
Crea una nueva tarea.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2024-01-25T23:59:59.000Z"
}
```

**Campos requeridos:**
- `title` (string): Título de la tarea
- `description` (string): Descripción de la tarea

**Campos opcionales:**
- `status` (string): Estado de la tarea (`pending`, `in-progress`, `completed`)
- `priority` (string): Prioridad (`low`, `medium`, `high`)
- `dueDate` (Date): Fecha límite

**Response (201):**
```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "title": "Nueva tarea",
    "description": "Descripción de la tarea",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2024-01-25T23:59:59.000Z",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### GET /tasks/:id
Obtiene una tarea específica por ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Completar proyecto",
    "description": "Terminar la implementación del CRUD",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2024-01-20T23:59:59.000Z",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Tarea no encontrada"
}
```

#### PUT /tasks/:id
Actualiza una tarea existente.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Tarea actualizada",
  "status": "completed",
  "priority": "low"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tarea actualizada exitosamente",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Tarea actualizada",
    "description": "Terminar la implementación del CRUD",
    "status": "completed",
    "priority": "low",
    "dueDate": "2024-01-20T23:59:59.000Z",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### DELETE /tasks/:id
Elimina una tarea.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tarea eliminada exitosamente"
}
```

### 👤 Usuario

#### GET /auth/profile
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### PUT /auth/profile
Actualiza el perfil del usuario.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

## 📊 Códigos de Estado HTTP

- **200** - OK - Petición exitosa
- **201** - Created - Recurso creado exitosamente
- **400** - Bad Request - Datos de entrada inválidos
- **401** - Unauthorized - Token inválido o expirado
- **403** - Forbidden - No tienes permisos para acceder
- **404** - Not Found - Recurso no encontrado
- **500** - Internal Server Error - Error del servidor

## 🔒 Validaciones

### Usuario
- **email**: Debe ser un email válido y único
- **password**: Mínimo 6 caracteres
- **name**: Mínimo 2 caracteres, máximo 50

### Tarea
- **title**: Mínimo 3 caracteres, máximo 100
- **description**: Máximo 500 caracteres
- **status**: Debe ser uno de: `pending`, `in-progress`, `completed`
- **priority**: Debe ser uno de: `low`, `medium`, `high`
- **dueDate**: Debe ser una fecha futura válida

## 📝 Ejemplos de Uso

### Crear y Autenticar Usuario

```javascript
// 1. Registrar usuario
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

const { data: { token } } = await registerResponse.json();

// 2. Crear tarea usando el token
const taskResponse = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Mi primera tarea',
    description: 'Descripción de la tarea',
    priority: 'high'
  })
});
```

### Obtener Tareas con Filtros

```javascript
const tasksResponse = await fetch('/api/tasks?status=pending&priority=high&page=1&limit=5', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data: { tasks, pagination } } = await tasksResponse.json();
```

## 🚨 Manejo de Errores

La API devuelve errores en formato consistente:

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    {
      "field": "email",
      "message": "El email es requerido"
    }
  ]
}
```

## 📈 Rate Limiting

- **Límite**: 100 peticiones por minuto por IP
- **Headers de respuesta**:
  - `X-RateLimit-Limit`: Límite de peticiones
  - `X-RateLimit-Remaining`: Peticiones restantes
  - `X-RateLimit-Reset`: Tiempo de reset

## 🔄 Paginación

Para endpoints que devuelven listas:

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

## 📱 CORS

La API está configurada para permitir peticiones desde:
- `http://localhost:3000` (desarrollo)
- `https://tu-frontend.vercel.app` (producción)

---

*Documentación de la API v1.0.0*
*Última actualización: $(date)*
