const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * User Schema definition for MongoDB using Mongoose.
 *
 * Defines the structure, constraints, and validations for user documents.
 *
 * Fields:
 * - name {String} - User's first name (required).
 * - lastName {String} - User's last name (required).
 * - age {Number} - User's age (required, must be >= 13).
 * - email {String} - Unique email address (required, valid format).
 * - password {String} - User's password (required, min length 8,
 *   must include at least one uppercase letter, one number, and one special character).
 * - resetPasswordJti {String|null} - Token ID for password reset, defaults to null.
 * - createdAt {Date} - Automatically set creation timestamp.
 * - updatedAt {Date} - Automatically set last update timestamp.
 *
 * @module User
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Los nombres son obligatorios"],
      trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Los apellidos son obligatorios."]
    },
    age: {
        type: Number,
        required: [true, "La edad es obligatoria."],
        min: [13,"{VALUE} no es válido, la edad debe ser mayor o igual a 13."]
        
    },

    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      match:
            [                     
            /^\S+@\S+\.\S+$/,
            "El formato del email no es válido"
            ]
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: 8,
        match: [
                /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial"
                ]
    },
    resetPasswordJti:{ type: String  , default: null }
  },
  { timestamps: true ,
   versionKey: false }
);


/**
 * Middleware executed before saving a User document.
 *
 * - Hashes the password if it is new or has been modified.
 * - Uses bcrypt to generate a salt and replace the plain password with its hash.
 *
 * @function preSavePasswordHash
 * @memberof UserSchema
 * @param {Function} next - Callback to continue with the save operation.
 * @throws {Error} If bcrypt hashing fails.
 */
userSchema.pre("save", async function (next){
   if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});



const User = mongoose.model("User", userSchema);


module.exports = User;


