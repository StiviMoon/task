const mongoose = require("mongoose");

/**
 * Mongoose schema for the Task model.
 * Defines the structure and validation rules for task documents in the database.
 *
 * Fields:
 * - title: Title of the task (String, required, max 50 characters).
 * - details: Additional details about the task (String, optional, max 500 characters).
 * - date: Deadline date to complete the task (Date, optional, cannot be in the past).
 * - hour: Deadline time to complete the task (String, optional, format HH:mm).
 * - status: Current status of the task (String, required, allowed values: "To Do", "In Progress", "Done").
 * - userId: ID of the user who created the task (ObjectId, reference to User model, required).
 * - createdAt: Task creation date (Date, automatically set by timestamps).
 * - updatedAt: Last update date of the task (Date, automatically set by timestamps).
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