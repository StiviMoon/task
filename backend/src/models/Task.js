const mongoose = require("mongoose");

/**
* 
* Mongoose schema for the Task model.
* Defines the structure and validations for task documents in the database.
* Fields:
* - title: Task title (String, required, 50 characters max).
* - details: Additional details about the task (String, optional, 500 characters max).
* - date: Deadline for task completion (Date, optional).
* - time: Deadline for task completion (String, optional, HH:mm format).
* - status: Task status (String, required, allowed values: "pending", "in progress", "completed").
* - userId: ID of the user who created the task (ObjectId, a reference to the User model, required).
* - createdAt: Task creation date (Date, the current date by default). -> With the timestamp
* - updatedAt: Date the task was last updated (Date, by default the current date). -> With the timestamp
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