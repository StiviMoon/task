const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Mongoose schema for the User model.
 * Defines the structure and validation rules for user documents in the database.
 *
 * Fields:
 * - name: User's first name (String, required).
 * - lastName: User's last name (String, required).
 * - age: User's age (Number, required, minimum 13).
 * - email: User's email (String, required, unique, valid email format).
 * - password: User's password (String, required, minimum 8 characters, must include at least one uppercase letter, one number, and one special character).
 * - resetPasswordJti: Identifier for password reset (String, optional, default null).
 * - createdAt: User creation date (Date, automatically set by timestamps).
 * - updatedAt: Last user update date (Date, automatically set by timestamps).
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
 * Middleware de Mongoose que se ejecuta antes de guardar un documento User.
 *
 * - Verifica si el campo `password` fue modificado.
 * - Si fue modificado (o es nuevo), genera una sal y hashea la contraseña con bcrypt.
 * - Reemplaza la contraseña en texto plano por el hash antes de guardar en la base de datos.
 *
 * @function
 * @name preSavePasswordHash
 * @memberof UserSchema
 * @param {Function} next - Callback que indica a Mongoose que continúe con la operación de guardado.
 *
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


