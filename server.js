const e = require("express");
const express = require("express");
const mongoose = require("mongoose");
require("./course");
require("./video");

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

const Course = mongoose.model("Course"); //tal cual lo haya llamado al modelo
const Video = mongoose.model("Video");

app.get("/", (req, res) => {
  //* busqueda tipo %Like%
  //* ejmplo con paginación
  const page = 0;
  const perpage = 2;
  Course.find(
    {
      title: {
        $regex: /curso/, //expresion regular
        $options: "i", //para que no detecte mayus y minus
      },
    }, //array de parametros que deseo traer. tambien se puede usar select(...)
    ["-_id", "+password"],
    //objeto con opciones
    {
      limit: perpage,
      skip: page * perpage,
      sort: {
        numberOfTopics: 1, //primero ordenará por número de tópicos
        title: -1, //para descendente
      },
    }
  )
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/cursos", (req, res) => {
  Course.countDocuments({ numberOfTopics: 2 })
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/cursos/:id", (req, res) => {
  Course.findById(req.params.id)
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/cursos", (req, res) => {
  Course.create({
    //método que viene con el modelo. promesa que resuelve al documento recien creado
    title: "Curso de Ruby",
    description:
      "lorem ipsum dolor sit amet, consectetur adip,lorem ipsum dolor sit amet, consectetur adip",
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.put("/cursos/:id", (req, res) => {
  //! OJO éste camino no dispara uso de middlewares
  //1- Actualizar multiples documentos a la vez de 0 a N
  /*
  Course.update(
    { numberOfTopics: 0 },
    { publishedAt: new Date() },
    { multi: true }
  )
    //primer argumento lacondicion de actualización y segundo lo que se actualiza. El multi:true es para que actualice a multiples documentos
    .then((r) => {
      res.json(r);
    })
    .catch((err) => {
      res.json(err);
    });
*/

  //2- findOneAndUdate o findByIdAndUpdate
  Course.findByIdAndUpdate(
    req.params.id,
    { publishedAt: new Date() },
    { new: true }
  )
    .then((r) => {
      //recibimos el documento antes de ser actualizado salvo que pongamos new:true
      res.json(r);
    })
    .catch((err) => {
      res.json(err);
    });

  //3- Encontrar el documento y luego guardarlo
  /*
  Course.findById(req.params.id)
    .then((course) => {
      course.publishedAt = new Date();
      return course.save();
    })
    .then((saveResponse) => res.json(saveResponse))
    .catch((err) => {
      res.json(err);
    });
    */
});
app.delete("/cursos/:id", (req, res) => {
  //! OJO éste camino no dispara uso de middlewares
  //1- Eliminar multiples documentos a la vez de 0 a N
  /*
  Course.deleteMany(
    { numberOfTopics: 0 },
  )
    //primer argumento la condicion de eliminación
    .then((r) => {
      res.json(r);
    })
    .catch((err) => {
      res.json(err);
    });
*/

  //2- findByIdAndDelete
  Course.findByIdAndDelete(req.params.id)
    //promesa que resuelve al documento eliminado
    .then((r) => {
      res.json(r);
    })
    .catch((err) => {
      res.json(err);
    });

  //3- Encontrar el documento y luego eliminarlo
  /*
  Course.findById(req.params.id)
    .then((course) => {
      return course.delete();
    })
    .then((deleteResponse) => res.json(deleteResponse))
    .catch((err) => {
      res.json(err);
    });
    */
});

app.post("/video", (req, res) => {
  Video.create({
    title: "Primer video",
    course: "609ad8919220272ee424935a",
    tags: [
      {
        title: "Ruby",
      },
      { title: "Web" },
    ],
  })
    .then((video) => {
      //pero tengo que agregar al nuevo video a su correspondiente curso
      return Course.findById("609ad8919220272ee424935a").then((course) => {
        course.videos.push(video.id);
        return course.save();
      });
    })
    .then((r) => {
      res.json(r);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

//*método populate para trer la info del doc asociado
app.get("/cursos/videos", (req, res) => {
  Course.find()

    .then((collection) => {
      res.json(collection);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.get("/videos", (req, res) => {
  Video.find()
    .populate("course")
    .then((videos) => {
      res.json(videos);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.get("/cursos/:id/videos", (req, res) => {
  Course.findById(req.params.id).then((cursos) => {
    cursos.videosVirtual.then((videos) => res.json(videos));
  });
});

//*eliminar un subdocumento
app.delete("/videos/:id/tags/:tag_id", (req, res) => {
  //busco el video
  const video = Video.findById(req.params.id)
    .then((video) => {
      //ahora borro el subdocumento
      const tag = video.tag.id(req.params.tag_id).remove();
      //uso el metodo remove() y luego guardo
      return video.save();
    })
    .then((video) => {
      res.json(video);
    })
    .catch((error) => {
      console.log(error);
      res.json(error);
    });
});

app.listen(8080, () => {
  console.log(`Server started on 8080`);
});
