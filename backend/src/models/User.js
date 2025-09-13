const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**    
 *  
 * Esquema de Mongoose para el modelo User.
 * Define la estructura y validaciones para los documentos de usuario en la base de datos.
 * Campos:
 * - name: Nombre del usuario (String, requerido).
 * - lastName: Apellido del usuario (String, requerido).
 * - age: Edad del usuario (Number, requerido, mínimo 13).
 *  - email: Correo electrónico del usuario (String, requerido, único, formato válido).
 * - password: Contraseña del usuario (String, requerido, mínimo 6 caracteres, debe incluir una mayúscula, un número y un carácter especial).
 * - createdAt: Fecha de creación del usuario (Date, por defecto la fecha actual). -> Con el timestamp
 * - updatedAt: Fecha de última actualización del usuario (Date, por defecto la fecha actual). -> Con el timestamp
 * 
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


