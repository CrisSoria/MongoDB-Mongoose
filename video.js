//*ejemplo de relación entre documentos
const mongoose = require("mongoose");

let videoSchema = new mongoose.Schema({
  title: String,
  //cada video pertenece a un curso => usamos un campo de referencia
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  //*Subdocumentos: para ésto es que fueron pensadas las bases de datos no relacionales
  //!si necesitas hacer relaciones entonces usá una BD relacional
  tags: [
    new mongoose.Schema({
      title: String,
    }),
  ],
});

mongoose.model("Video", videoSchema);
