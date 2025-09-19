const mongoose = require("mongoose");

/**
 * Task Schema definition for MongoDB using Mongoose.
 *
 * Defines the structure, constraints, and validations for task documents.
 *
 * Fields:
 * - title {String} - Task title (required, max length 50).
 * - details {String} - Additional details (optional, max length 500).
 * - date {Date} - Deadline for task completion (optional, cannot be in the past).
 * - hour {String} - Time for task completion (optional, format HH:mm).
 * - status {String} - Task status (required, allowed: "Por hacer", "Haciendo", "Hecho").
 * - userId {ObjectId} - Reference to the user who created the task (required).
 * - createdAt {Date} - Automatically set creation timestamp.
 * - updatedAt {Date} - Automatically set last update timestamp.
 *
 * @module Task
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