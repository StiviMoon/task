const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
*
* Mongoose schema for the User model.
* Defines the structure and validations for user documents in the database.
* Fields:
* - name: User's first name (String, required).
* - lastName: User's last name (String, required).
* - age: User's age (Number, required, minimum 13).
* - email: User's email address (String, required, unique, valid format).
* - password: User's password (String, required, minimum 6 characters, must include one capital letter, one number, and one special character).
* - createdAt: User creation date (Date, defaults to the current date). -> With the timestamp
* - updatedAt: User last update date (Date, defaults to the current date). -> With the timestamp
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
* Mongoose middleware that runs before saving a User document.
*
* - Checks if the `password` field has been modified.
* - If it has been modified (or is new), generates a salt and hashes the password with bcrypt.
* - Replaces the plaintext password with the hash before saving to the database.
*
* @function
* @name preSavePasswordHash
* @memberof UserSchema
* @param {Function} next - Callback that tells Mongoose to continue with the save operation.
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


