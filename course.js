//ejemplo de modelo de cursos
const mongoose = require("mongoose");

//1° Definir el schema (configuración)
// npm install validator    para simplificar validaciones
//si pasamosun array a la validación el segundo parametro es el mensaje de error
let courseSchema = new mongoose.Schema({
  //_id: ObjectId secrea automaticamente es el identificador único del documento
  title: {
    //nombre del campo: tipo de dato u objeto de configuración
    type: String,
    required: true, //campo obligatorio
    validate: {
      //validación personalizada
      validator: function (value) {
        //función de validación. Value es el valor ingresado
        return true; //entonces el value se acepta
        //return false //se rechaza el value
      },
      message: (props) =>
        `El valor ${props.value} no fue aceptado por X motivo`, //mensaje en caso de no aceptar el ingreso
    },
  },
  description: {
    type: String,
    //enum: ["Bueno", "Malo"],
    minLength: [50, "No se cumple la longitud mínima"], //mínima cantidad de caracteres
    maxLength: 300, //máxima cantidad de caracteres
    match: / /, //expresión regular para comprobar
  },
  numberOfTopics: {
    type: Number,
    default: 0, //valor por defecto
    min: 0, //mínimo y maximo para números
    max: 100,
  },
  publishedAt: Date,
  password: {
    type: String,
    select: false, //pra que por defecto no envíe la contraseña salvo se explicite su selección
  },
  // a cada curso le pertenecen muchos videos => en un campo de referencia le paso un array

  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
});

//Datos virtuales
courseSchema
  .virtual("info")
  .get(function () {
    //this referencia al documento
    return `${this.description}. Temas: ${this.numberOfTopics}. Fecha de lanzamiento: ${this.publishedAt}`;
  })
  .set(function (value) {
    //como tratar los datos asignados a éste virtual que no existe en la DB
  });

//para evitar el guardar los videos podemos hacer uso de un virtual
courseSchema.virtual("videosVirtual").get(function () {
  return mongoose.model("Video").find({ course: this._id });
});

//middlewares: funciones a ejecutar antes o despues de que algo haya sucedido
/*
validate
save
remove
updateOne
deleteOne
init (hook sincrono, distinto a los demás según documentación)
*/
//ejem. hacer algo antes de guardar
courseSchema.pre("save", function (next) {
  //this. => doc
  next(); // si le paso un argumento a next es porque quiero que se muestre cuando algo sale mal
});
//ejem. hacer algo despues de borrar
courseSchema.post("remove", function (next) {
  next();
});

//2° a partir del schema defino el modelo
//primer argumento: nombre del modelo
//segundo argumento: schema
mongoose.model("Course", courseSchema); //el string el nombre del modelo al importarlo
console.log(":)");
