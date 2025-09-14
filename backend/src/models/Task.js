const mongoose = require("mongoose");

/**
 *  
 * Esquema de Mongoose para el modelo Task.
 * Define la estructura y validaciones para los documentos de tarea en la base de datos.
 * Campos:
 * - title: Título de la tarea (String, requerido, 50 caracteres max).
 * - details: Detalles adicionales de la tarea (String, opcional, 500 caracteres max).
 * - fecha: Fecha límite para completar la tarea (Date, opcional).
 * - hora: Hora límite para completar la tarea (String, opcional, formato HH:mm).
 * - estado: Estado de la tarea (String, requerido, valores permitidos: "pendiente", "en progreso", "completada").
 * - userId: ID del usuario que creó la tarea (ObjectId, referencia al modelo User, requerido).
 * - createdAt: Fecha de creación de la tarea (Date, por defecto la fecha actual). -> Con el timestamp
 * - updatedAt: Fecha de última actualización de la tarea (Date, por defecto la fecha actual). -> Con el timestamp
 * 
*/

const taskSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: [true, "El título es obligatorio."],
        maxlength: [50, "El título no puede exceder los 50 caracteres."],
        trim: true
    },
    details: {
        type: String,
        maxlength: [500, "Los detalles no pueden exceder los 500 caracteres."],
        trim: true,
        default: ""
    },
    date: {
        type: Date,
        validate: {
            validator: function(value) {
                return !value || value >= new Date().setHours(0, 0, 0, 0);
            },
            message: "La fecha no puede ser en el pasado."
        }   
    },
    hour: {
        type: String,       
        validate: {
            validator: function(value) {
                return !value || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
            },
            message: "La hora debe estar en formato HH:mm."
        }
    },
    status: {
        type: String,
        required: [true, "El estado es obligatorio."],
        enum: {
            values: ["Por hacer", "Haciendo", "Hecho"],
            message: "El estado debe ser 'Por hacer', 'Haciendo' o 'Hecho'."
        },
        default: "Por hacer"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "El ID de usuario es obligatorio."]
    }   
    },
    { timestamps: true ,
        versionKey: false }
);

module.exports = mongoose.model("Task", taskSchema);