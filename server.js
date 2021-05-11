const express = require("express");
const mongoose = require("mongoose");

//configuraciones explicitas para evitar warnings
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
//Método connect de mongoose
//primer argumento: string de conección (uris string)
//segundo argumento: callback que se ejecutará cuando el proceso de conección finalice
mongoose.connect("mongodb://localhost/cursoMongoDB", () => {
  console.log("Me conecté a la BD");
});

const app = express();

app.get("/", (req, res) => {
  res.send("Hola");
});

app.listen(8080, () => {
  console.log(`Server started on 8080`);
});
