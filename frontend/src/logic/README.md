# Dashboard Logic Modules

Este directorio contiene todos los módulos de lógica del dashboard, organizados de manera modular para facilitar el mantenimiento y la escalabilidad.

## Estructura

```
logic/
├── index.js              # Exportaciones centralizadas
├── taskLogic.js          # Lógica de tareas
├── uiLogic.js            # Lógica de interfaz de usuario
├── modalLogic.js         # Lógica de modales
├── renderLogic.js        # Lógica de renderizado
└── README.md            # Este archivo
```

## Módulos

### 1. taskLogic.js
Maneja toda la lógica relacionada con las tareas:
- Carga de tareas desde el servidor
- Creación, actualización y eliminación de tareas
- Validación de datos de tareas
- Mapeo de estados entre frontend y backend
- Gestión del estado local de tareas

**Funciones principales:**
- `loadTasks()` - Carga todas las tareas
- `createNewTask(taskData)` - Crea una nueva tarea
- `updateExistingTask(taskId, taskData)` - Actualiza una tarea existente
- `deleteExistingTask(taskId)` - Elimina una tarea
- `toggleTaskStatus(taskId)` - Cambia el estado de una tarea
- `validateTaskData(taskData)` - Valida los datos de una tarea

### 2. uiLogic.js
Maneja la lógica de la interfaz de usuario:
- Notificaciones toast
- Manejo de errores
- Formateo de fechas y horas
- Gestión del sidebar móvil
- Navegación del menú

**Funciones principales:**
- `showToast(message, type)` - Muestra notificación toast
- `showError(message)` - Muestra error
- `formatDate(dateString)` - Formatea fechas
- `setupMobileSidebar()` - Configura sidebar móvil
- `setupMenuItems(handler)` - Configura elementos del menú

### 3. modalLogic.js
Maneja la lógica de todos los modales:
- Modal de detalles de tarea
- Modal de perfil de usuario
- Modal de papelera
- Modal de información

**Clases principales:**
- `TaskDetailModal` - Maneja el modal de detalles de tarea
- `UserProfileModal` - Maneja el modal de perfil de usuario
- `TrashModal` - Maneja el modal de papelera
- `AboutUsModal` - Maneja el modal de información

### 4. renderLogic.js
Maneja la lógica de renderizado:
- Renderizado de tareas en el tablero Kanban
- Actualización de contadores
- Estados de carga y error
- Formularios de edición

**Funciones principales:**
- `renderTask(task, onTaskClick)` - Renderiza una tarea
- `renderAllTasks(tasks, onTaskClick)` - Renderiza todas las tareas
- `renderKanbanBoard(tasks, onTaskClick)` - Renderiza el tablero completo
- `updateTaskCounts(tasks)` - Actualiza contadores de tareas

## Uso

### Importación simple
```javascript
import {
  loadTasks,
  showToast,
  TaskDetailModal,
  renderKanbanBoard
} from '../logic/index.js';
```

### Importación específica
```javascript
import { loadTasks } from '../logic/taskLogic.js';
import { showToast } from '../logic/uiLogic.js';
```

## Ventajas de la modularización

1. **Separación de responsabilidades**: Cada módulo tiene una responsabilidad específica
2. **Reutilización**: Las funciones pueden ser reutilizadas en otros componentes
3. **Mantenimiento**: Es más fácil mantener y debuggear código organizado
4. **Testing**: Cada módulo puede ser probado independientemente
5. **Escalabilidad**: Fácil agregar nuevas funcionalidades sin afectar el código existente

## Convenciones

- Todas las funciones están documentadas con JSDoc
- Los nombres de funciones son descriptivos y en camelCase
- Las constantes están en UPPER_CASE
- Los módulos exportan solo lo que es necesario
- Se evita la duplicación de código

## Configuración

La configuración del dashboard se encuentra en `../config/dashboardConfig.js` y contiene:
- Estados de tareas
- IDs de elementos
- Clases CSS
- Mensajes
- Reglas de validación
- Configuración de timing
