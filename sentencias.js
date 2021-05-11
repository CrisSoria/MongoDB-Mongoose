//* MÉTODOS PARA INSERTAR DOCUMENTOS EN COLECCIONES

//! insertOne

var user2 = {
  name: "Fernando",
  last_name: "García",
  age: 24,
  email: "fernando@codigofacilito.com",
};
//ejecucion del método para insertar uno
db.users.insertOne(user2);

//! insertMany

var user3 = {
  name: "Uriel",
  last_name: "Camacho",
  age: 27,
  email: "uriel@codigofacilito.com",
};
var user4 = {
  name: "Marines",
  last_name: "Méndez",
  age: 25,
  email: "marines@codigofacilito.com",
};
//recibe como argumento una lista de documentos
db.users.insertMany([user3, user4]);
db.books.insertMany([
  { title: "Don Quijote de la Mancha", sales: 500 },
  { title: "Historia de dos ciudades", sales: 200 },
  { title: "El señor de los anillos", sales: 150 },
  { title: "El principito", sales: 140 },
  { title: "El hobbit", sales: 100 },
  { title: "Alicia en el país de las maravillas", sales: 100 },
  { title: "El código Da Vinci", sales: 80 },
  { title: "El alquimista", sales: 65 },
]);

var user5 = {
  name: "Rafael",
  email: "rafa@codigofacilito.com",
  support: true,
  createdAt: new Date(),
};

//* CONSULTAS

//! método find
// prettier-ignore
db.users.find(
    //son opcionales sus argumentos
    { age: 25 }, //Criterios de busqueda -> Where
    { name: true, email: true, _id: false } //Atributos que queremos recibir de la búsqueda -> Select
  ).pretty(); //.pretty() es solo para leerlos con mejor formato en la consola

//obtener un solo elemento a partir de un criterio de busqueda (el primero que cumpla las condiciones)
//! método findOne
db.users.findOne({
  age: {
    $ne: 25,
  },
}); // .pretty() se ejecuta solo en éste caso

//? OPERADORES RELACIONALES
// $gt >
// $gte >=
// $lt <
// $lte <=
// $eq ==
// $ne !=

//obtener todos los usuarios cuya edad sea mayor o igual a 26
//? $gte: greater than or equal -> mayor o igual que
db.users.find({
  age: {
    $gte: 26, // >=
  },
});

//? operador $ne: no equals -> diferente a...
//ejem: todos los usuarios cuya edad sea diferente a 25
// prettier-ignore
db.users.find({
  age: {
    $ne: 25,
  },
}).pretty();

//? OPERADORES LÓGICOS
// $and y $or

//obtener todos los usuarios cuyo nombre sea Eduardo Ismael o Uriel o edad sea mayor a 20 y menor a 25
// prettier-ignore
db.users.find(
  {
    $or: [
      { name: 'Eduardo Ismael'},
      { name: 'Uriel'},
      {
        $and: [
          {age: {$gt: 20}},
          {age: {$gt: 25}}
        ]
      }
    ]
  }
)

//? CLAUSULA LIKE
// like se simila usando una expresion regular

//obtener todos los libros cuyo título comience con El
//obtener todos los libros cuyo título finalice con s
//obtener todos los libros que posean en su título la palabra la

db.books.find({
  title: /^El/, //WHERE title LIKE "El%"
});
db.books.find({
  title: /s$/, //WHERE title LIKE "%s"
});
db.books.find({
  title: /la/, //WHERE title LIKE "%la%"
});

//? OPERADOR $in permite buscar valores dentro de una lista (mejor que $or)

//obtener todos los usuarios cuyo nombre sea Eduardo o Uriel o Marines
db.users.find({
  $or: [{ name: "Eduardo" }, { name: "Uriel" }, { name: "Marines" }],
});
//mejor performance:
db.users.find({
  name: {
    $in: ["Eduardo", "Uriel", "Marines"], //! $nin hace lo contrario
  },
});

//obtener documentos por atributos (ya no por valores)
//obtener todos los usuarios que posean apellido
//? OPERADOR $exists true o false para traer los documentos que tengan o no ese atributo
db.users.find({
  last_name: {
    $exists: true,
  },
});

//obtener todos los usuarios cuyo attr createdAt sea del tipo date
//? OPERADOR $type se fija que primero exista elatributo y luego que sea del tipo indicado
db.users.find({
  createdAt: {
    $type: "date",
  },
});
// double string Object array objectId boolean date null regex timestamp

//* OBTENER Y ACTUALIZAR DOCUMENTOS

var rafael = db.users.findOne({ name: "Rafael" });

rafael.support = false;
//! método save recibe como argumento el objeto que queremos guardar.
//! Si el objeto a guardar no posee attr _id entonces se crea un nuevo documento, caso contrario se actualiza
db.users.save(rafael);

//! método updateMany recibe dos argumentos OBLIGATORIOS 1° criterios de busqueda y 2° cambios a implementar usando operador $set
// poner el attr support en false a todos aquellos usuarios que no lo tengan
db.users.updateMany(
  {
    support: {
      $exists: false,
    },
  },
  {
    $set: {
      support: false,
    },
  }
);
//poner el attr support en true a Fernando
db.users.updateOne(
  {
    name: "Fernando",
  },
  {
    $set: {
      support: true,
    },
  }
);

//? OPERADOR $unset permite eliminar attr de un documento
db.users.updateOne(
  {
    createdAt: { $exists: true },
  },
  {
    $unset: { createdAt: true }, //attr a eliminar : true
  }
);

//? OPERADOR $inc permite aumenar o disminuir el valor de un attr ( del tipo int ) en un documento
//aumento la edad en 1 de Rafael
db.users.updateOne(
  {
    name: "Rafael",
  },
  {
    $inc: {
      age: 1,
    },
  }
);

//! upsert modificar un documento que no sabemos si existe. Si existe lo modifica sino lo crea
db.users.updateOne(
  {
    name: "Luis",
  },
  {
    $set: {
      edad: 27,
    },
  },
  {
    upsert: true, // si existe lo modifica sino lo crea
  }
);

//! método remove({}) ELIMINA ELEMENTOS
db.users.remove({
  name: "Luis", //condiciones para ser eliminados
});
//* OJO si se ejecuta así: remove({}) ELIMINA TODO lo que contenga la colección

//! método drop() -> elimina una colección
db.books.drop(); //devuelve true si se eliminó la colección

//! método dropDatabase() -> elimina una base de datos
db.dropDatabase();

//* CURSORES
// el método find retorna un cursor
// tienen un límite de 20 elementos, con it nos dan los 20 siguientes
for (i = 0; i < 100; i++) {
  db.demo.insert({ name: "user" + i });
}

//* MÉTODOS DE LOS CURSORES

//! pretty()
//! count()
db.demo.find().count();
//obtener todos los usuarios con correo codigofacilito
//prettier-ignore
db.users.find({
  email: /codigofacilito.com$/
}).count();
//! limit() limitar la cantidad de documentos que queremos obtener RETORNA NUEVO CURSOR
//obtenerlos primeros dos usuarios de la colección users
db.users.find().limit(2);
//! skip() evita una cantidad de resultados RETORNA NUEVO CURSOR
//obtener el tercer usuario de la colección users
db.users.find().skip(2).limit(1);
//!sort() ordenar datos RETORNA NUEVO CURSOR
//obtener el nombre de todos los usuarios ordenados alfabeticamente
//prettier-ignore
db.users.find(
  {},//sin criterios de busqueda porque quiero todos
  {
    _id: false,
    name: true,
  }
).sort(
  {
    name:1 // 1 ASC || -1 DESC 
  }
)

//obtener el tercer usuario ordenado por su nombre de forma DESC
//prettier-ignore
db.users.find().sort({
  name:-1
}).skip(2).limit(1)

//

//! método findAndModify obtener un doc para luego modificarlo. Args query y update oblegatorios.
//! retorna el objeto antes de modificarlo
// obtener el documento de nombre Rafael y actializar en 1 su edad
db.users.findAndModify({
  query: {
    //criterios de busqueda para encontrar el doc a modificar
    name: "Rafael",
  },
  update: {
    //cambios a establecer
    $inc: {
      age: 1,
    },
  },
  new: true, // opcional para que retorne el objeto post actualización
  // otros atributos opcionales: sort, remove, upsert...
});

//* RENOMBRAR ATRIBUTOS DE DOCUMENTOS
db.users.updateMany(
  {}, // criterio de busqueda vacio para aplicar el cambio a todos los doc de la colección
  {
    $rename: {
      last_name: "lastName",
    },
  }
);

//? OPERADOR $all buscar dentro de listas (arrays)
db.users.updateOne(
  { name: "Eduardo" },
  {
    $set: {
      courses: ["Python", "MongoDb", "SQL", "Java"],
    },
  }
);
db.users.updateOne(
  { name: "Rafael" },
  {
    $set: {
      courses: ["Git", "Escritura para programadores", "Redes"],
    },
  }
);
//obtener todos los usuarios que posean por curso SQL y MongoDb
//prettier-ignore
db.users.find({
  courses: {
    $all: ["SQL", "MongoDb"],//no importa el orden pero deben estar TODOS 
  },
}).pretty()

//obtener todos los usuarios que posean por curso SQL o Git
//prettier-ignore
db.users.find({
  $or:[
    {courses: "Git"},
    {courses: "SQL"}
  ]
}).pretty()

//usando operadores relacionales
db.users.updateOne(
  { name: "Fernando" },
  { $set: { scores: [9, 8, 9, 5, 10] } }
);
//prettier-ignore
db.users.updateOne(
  { name: "Uriel" },
  { $set: { scores: [10, 9, 9, 8, 10] } }
);

//obtener todos los usuarios que posean por lo menos una calificación de 10
db.users.find({ scores: 10 }).pretty();
//obtener todos los usuarios que hayan reprobado por lo menos una calificación
//prettier-ignore
db.users.find({
    scores: {
      $lte: 5,
    },
  }).pretty();

//? MODIFICANDO LISTAS $push $pull $pop
//agregar cursos a Rafa y Edu
db.users.updateOne(
  { name: "Rafael" },
  {
    $push: {
      courses: "Python",
    },
  }
);
//? $push $ each
db.users.updateOne(
  { name: "Eduardo" },
  {
    $push: {
      courses: {
        $each: ["Django", "Rails", "Rust"], //agrega un array de elementos
      },
    },
  }
);
//? $position  elijo la posición donde se inserta lo nuevo
db.users.updateOne(
  { name: "Rafael" },
  {
    $push: {
      courses: {
        $each: ["Base de datos"],
        $position: 0,
      },
    },
  }
);
//? $sort agregar nuevos elemetos a una lista manteniendo un orden ASC o DESC
db.users.updateOne(
  { name: "Fernando" },
  {
    $push: {
      scores: {
        $each: [10, 10],
        $sort: 1,
      },
    },
  }
);
//? $pull o pop eliminar elementos
//elimino Python de los cursos
db.users.updateMany(
  {
    courses: { $exists: true },
  },
  {
    $pull: {
      courses: "Python",
    },
  }
);
//eliminar multiples elementos
db.users.updateMany(
  {
    courses: { $exists: true },
  },
  {
    $pull: {
      courses: {
        $in: ["Base de datos", "C#"], //lista de elementos a eliminar
      },
    },
  }
);
// modificar elementos por índice
db.users.updateMany(
  {
    scores: { $exists: true },
  },
  {
    $set: {
      "scores.0": 5, //el primer elemento de los score será el 5
    },
  }
);
//si no conocemos el índice
db.users.updateMany(
  {
    scores: { $exists: true },
    scores: 9, //elemento del cual quiero su índice
  },
  {
    $set: {
      "scores.$": 6, //como la posición es desconocida se pone $
    },
  }
);
//? OPERADOR $slice permite obtener elementos por posición o índice
//prettier-ignore
db.users.findOne(
  { name:"Eduardo"},
  {
    _id: false,
    name:true, 
    courses: {
      $slice: [0,3] //int -> position o [] -> index
    }
  }
)
//obtener elementos segun el tamaño de sus listas
//? OPERADOR $size permite buscar un tamaño exacto (nada de menor o mayor que)
// obtener todos usuarios que tengan 5 cursos
db.users.find({
  courses: {
    $size: 5, // tamaño buscado del array
  },
});
//? OPERADOR $where mongo recorre todos los elementos uno por uno así que podemos usar this. para referirnos a cada uno de ellos
//obtener todos los usuarios que tengan por ls menos 3 cursos
db.users.find({
  $and: [
    //como tengo usuarios que no tienen el attr courses
    {
      courses: { $exists: true }, //debo ver que exista antes de comparar, sino rompe
    },
    {
      $where: "this.courses.length >= 3", //string código JS
    },
  ],
});

//* DOCUMENTOS ANIDADOS documentos dentro de documentos
// Uriel y Marines tendrán un nuevo atributo address que es un doc
db.users.updateOne(
  { name: "Uriel" },
  {
    $set: {
      address: {
        state: "CDMX",
        city: "CDMX",
        postalCode: 1,
      },
    },
  }
);
db.users.updateOne(
  { name: "Marines" },
  {
    $set: {
      address: {
        state: "CDMX",
        city: "CDMX",
        number: 10,
        street: "Calle número 1",
        postalCode: 1,
        references: ["Casa color azul", "al lado de una tienda"],
      },
    },
  }
);
//obtener todos los usuarios que posean una dirección postal
db.users.find({
  address: { $exists: true },
});
//obtener todos los usuarios que posean un código postal 1 y un número mayor o igual 10
//prettier-ignore
db.users.find({
  $and: [
    {"address.postalCode": 1},//como es un doc embebido puedo poner punto
    {"address.number": {$gte: 10}}
  ]
}).pretty()
//obtener la primera referencia de los usuarios con código postal y referencias
//prettier-ignore
db.users.find(
    {
      $and: [
        { address: { $exists: true } }, //como es un doc embebido puedo poner punto
        { "address.references": { $exists: true } },
      ],
    },
    {
      _id: false,
      name: true,
      "address.references": {
        $slice: 1 //para obtener la primera referencia
      },
    }
  ).pretty();
//agregando nuevos valores a los docs anidados
db.users.updateOne(
  { name: "Uriel" },
  {
    $set: {
      "address.number": 20,
      "address.references": [
        "Fuera de la casa se encuentra un parque",
        "Fuera de la casa se encuentra un pino (árbol)",
      ],
    },
  }
);
//agrego a Marines una referencia nueva
db.users.updateOne(
  { name: "Marines" },
  {
    $push: {
      "address.references": {
        $each: [
          "Fuera de la casa hay un río",
          "Fuera de la casa hay un campo de tenis",
        ],
      },
    },
  }
);
//cambiaré los cursos por documentos
db.users.updateMany(
  {
    courses: { $exists: true },
  },
  {
    $unset: {
      courses: true, //borro los cursos actuales
    },
  }
);
db.users.updateOne(
  { name: "Rafael" },
  {
    $set: {
      courses: [
        {
          title: "MongoDb",
          progress: 50,
          completed: false,
        },
        {
          title: "Base de datos",
          progress: 100,
          completed: true,
        },
        {
          title: "Git",
          progress: 100,
          completed: true,
        },
      ],
    },
  }
);
db.users.updateOne(
  { name: "Eduardo" },
  {
    $set: {
      courses: [
        {
          title: "MongoDb",
          progress: 50,
          completed: false,
        },
        {
          title: "Python",
          progress: 100,
          completed: true,
        },
        {
          title: "Ruby",
          progress: 80,
          completed: false,
        },
      ],
    },
  }
);
db.users.updateOne(
  { name: "Fernando" },
  {
    $set: {
      courses: [
        {
          title: "Vue",
          progress: 50,
          completed: false,
        },
        {
          title: "Docker",
          progress: 100,
          completed: true,
        },
      ],
    },
  }
);

//? OPERADOR $elemMatch permite buscar atributos de elementos que se encuentran dentro de listas
//obtener todos los usuarios que hayan completado al menos un curso
db.users.find({
  courses: {
    $elemMatch: {
      completed: true,
    },
  },
});
//obtener todos los usuarios con un progreso mayor a 80
db.users.find({
  courses: {
    $elemMatch: {
      progress: { $gt: 80 },
    },
  },
});
//obtener el nombre del usuario junto con el título de cada uno de sus cursos
//prettier-ignore
db.users.find(
    {},
    {
      id: false,
      name: true,
      "courses.title": true,
    }
  ).pretty();
//Fer completa el curso de Docker
db.users.updateOne(
  {
    name: "Fernando",
    "courses.title": "Docker",
  },
  {
    $set: {
      "courses.$.progress": 100,
      "courses.$.completed": true,
    },
  }
);

//* FRAMEWORK AGREGATE
//*se le pasan tareas que funcionan como pipelines (el output de una es el input de otra)
//* aggregate([tareas])   RETORNA UN CURSOR
//* cada tarea se ejecuta SOLO en el output de la tarea anterior
//encontrar todos los usuarios que tienen mas de 25 años
//sin framework:
db.users.find({ age: { $gt: 25 } });
//usando el framework de agregación:
//prettier-ignore
db.users.aggregate(
  [//lista de tareas en orden de ejecución
    {
      $match: {
        //operador para filtrar
        age: { $gt: 25 },
      },
    },
  ]
).pretty()

//obtener nombre y listado de cursos de todos los mayores de 25
// prettier-ignore
db.users.aggregate([
  {
    $match: {
      age: { $gt: 25 },
    },
  },
  {
    $match: {
      courses: { $exists: true },
    },
  },
  {
    $project: { //atributos que deseo ver
      _id: false,
      name: true,
      courses: true,
    },
  },
]).pretty()
//? $slice de lo anterior solo los dos primeros cursos
//? OPERADOR $arrayElemAt permite obtener un elemento de una lista, de lo anterior el nombre del primer curso
//? $addFields permite agregar nuevos atributos
//prettier-ignore
db.users.aggregate([
    {
      $match: {
        age: { $gt: 25 },
      },
    },
    {
      $match: {
        courses: { $exists: true },
      },
    },
    {
      $project: {
        //atributos que deseo ver
        _id: false,
        name: true,
        courses: true,
      },
    },
    {
      $project: {
        //atributos que deseo ver
        name: true,
        firstCourses: {//me creo un nuevo atributo donde guardar lo que quiero
          $slice: ["$courses", 2], //recibe dos attr:
          //1° string lista sobre la que queremos trabajar con $ delante
          //2° número entero que referencie a los elementos que queremos obtener
        },
      },
    },
    {
      $project: {
        name: true,
        course:{ //de nuevo me creo attr donde guardar datos que quiero
          $arrayElemAt:["$firstCourses",0] //igual que slice
        }
      }
    },
    {
      $addFields:{
        currentDate: new Date(),
        suma: 10 + 20,
        newName: "$name"
      }
    },
  ]).pretty();

//? $set tambien permite agragar campos nuevos pero se usa para efectuar operaciones con los documentos
//obtener el promedio de las calificaciones
db.users.aggregate(
  {
    $match: {
      scores: { $exists: true },
    },
  },
  {
    $project: {
      _id: false,
      name: true,
      scores: true,
    },
  },
  {
    $set: {
      sum: { $sum: "$scores" }, //operador para sumar
    },
  },
  {
    $set: {
      avg: { $avg: "$scores" }, //operador para obtener promedio
    },
  },
  {
    $match: {
      avg: { $gt: 8 }, // quiero los que tengan promedio mayor a 8
    },
  }
);

//? $concat permite concatenar varios atributos de nuestros documentos
//obtener nombre completo de cada usuario
db.users.aggregate(
  {
    $match: {
      $and: [
        {
          name: { $exists: true },
        },
        {
          lastName: { $exists: true },
        },
      ],
    },
  },
  {
    $project: {
      _id: false,
      name: true,
      lastName: true,
    },
  },
  {
    $project: {
      fullName: {
        $concat: ["$name", " ", "$lastName"],
      },
    },
  }
);

//? OPERADOR $group permite agrupar documentos a partir de ciertos attr

db.items.insertMany([
  { type: "Camera", color: "Red", price: 120 },
  { type: "Laptop", color: "White", price: 400 },
  { type: "Laptop", color: "Black", price: 600 },
  { type: "Camera", color: "Silver", price: 200 },
  { type: "Microphone", color: "Black", price: 200 },
  { type: "Mouse", color: "White", price: 50 },
  { type: "Monitor", color: "White", price: 50 },
]);

//agrupar y contar la cantidad de items según su tipo
//prettier-ignore
db.items.aggregate(
  {
    $group: {//recibe como argumento un objeto
      _id: "$type", //obligatorio indicar con que attr queremos agrupar
      total: { $sum: 1 },
    },
  },
  {
    $match: {
      total: { $gt: 1 }, //quiero los que sean 2 o +
    },
  }
);

//? OPERADORES $limit y $sort limitar y ordenar respuestas obtenidas
//obtener al usuario más joven
db.users.aggregate([
  {
    $sort: { age: 1 }, //ordeno ASC
  },
  {
    $limit: 1, //entero que indíca la cantidad de respuestas que quiero obtener
  },
  {
    $project: {
      _id: false,
      name: true,
      age: true,
    },
  },
]);

//? OPERADOR $map permite aplicar una expresion para cada uno de los elementos de una lista
//multiplicar cada score por 10
db.users.aggregate(
  {
    $match: {
      scores: { $exists: true },
    },
  },
  {
    $project: {
      _id: false,
      name: true,
      scores: true,
    },
  },
  {
    $project: {
      newListScores: {
        $map: {
          //objeto con tres atributos obligatorios
          input: "$scores", //define la lista con la cual trabajar
          as: "calificación", //alias para identificar cada elemento de la lista
          in: {
            //expresión aplicada a cada elemento
            $multiply: ["$$calificación", 10], //array de numeros a multiplicar //! calificación lleva $$ por ser el alias
          },
        },
      },
    },
  }
);

//! MongoDb ES NO RELACIONAL PERO PODEMOS ANALOGAR
//* Relación uno a uno
// objetos embebidos. Un usuario tiene una direccion postal

var usuario = {
  nombre: "Raquel",
  apellido: "Dominguez",
  edad: 27,
  correo: "raquel@mail.com",
  direccionpostal: {
    calle: "calle",
    ciudad: "ciudad",
    estado: "estado",
    codigoPostal: 1,
    numeroExt: 10,
  },
};

db.users.insertOne(usuario);

//* Relación uno a muchos

// primera opción: Listas
var autor = {
  nombre: "Stephen King",
  nacionalidad: "Estadounidense",
  libros: [
    {
      titulo: "it",
      fechaLanzamiento: 1986,
    },
    {
      titulo: "El resplandor",
      fechaLanzamiento: 1977,
    },
    {
      titulo: "Misery",
      fechaLanzamiento: 1987,
    },
  ],
};

// segunda opción: llaves foraneas -> ObjectsId
// separo documentos en dos colecciones: Autores y Libros
// caso de tener muchos atributos que se actualizan constantemente conviene separar así:

var autor = {
  nombre: "Stephen King",
  nacionalidad: "Estadounidense",
};

db.autores.insertOne(autor);

var libro1 = {
  titulo: "it",
  fechaLanzamiento: 1986,
  autor_id: ObjectId("609774b8100d08dab86ea021"),
};
var libro2 = {
  titulo: "El resplandor",
  fechaLanzamiento: 1977,
  autor_id: ObjectId("609774b8100d08dab86ea021"),
};
var libro3 = {
  titulo: "Misery",
  fechaLanzamiento: 1987,
  autor_id: ObjectId("609774b8100d08dab86ea021"),
};

db.libros.insertMany([libro1, libro2, libro3]);

//* CREAR ÍNDICES SOBRE NUESTRAS COLECCIONES
//* consultar atributos indexados es más rápido
//! método createIndex
db.libros.createIndex({
  // todos aquellos atributos que queremos indexar
  autor_id: 1, //indexación ASC
});

db.libros.getIndexes(); //ver indexación

//? $lookup permite unir diferentes documentos de diferentes colecciones cuando dos de sus atributos son iguales

db.autores.insertMany([
  { name: "J.K Rowling", nacionality: "Britain" },
  { name: "George R. R. Martin", nacionality: "American" },
]);

db.libros.insertMany([
  {
    title: "Harry Pottter y la Piedra Filosofal",
    fechaLanzamiento: 1997,
    autor_id: ObjectId("60977480100d08dab86ea01f"),
  },
  {
    title: "Harry Pottter y el prisionero de Azkaban",
    fechaLanzamiento: 1999,
    autor_id: ObjectId("60977480100d08dab86ea01f"),
  },
]);

//obtener todos los autores con sus correspondientes libros
//prettier-ignore
db.autores.aggregate([
  {
    $lookup: {
      //obligatorios los cuatro atributos
      from: "libros", //colección a unir
      localField: "_id", //campo de autores a unir
      foreignField: "autor_id", //campo de libros usado para unir
      as: "listadoLibros", //alias de la union
    },
  },
]).pretty();

//? OPERADOR $unwind permite desenvolver la union de documentos
//prettier-ignore
db.autores.aggregate([
  {
    $lookup: {
      //obligatorios los cuatro atributos
      from: "libros", //colección a unir
      localField: "_id", //campo de autores a unir
      foreignField: "autor_id", //campo de libros usado para unir
      as: "listadoLibros", //alias de la union
    },
  },
  {
    $unwind:"$listadoLibros"//sobre que listado deseamos trabajar
  },
  {
    $project:{
      _id: false,
      nombre:true,
      libro: "$listadoLibros"
    }
  }
]).pretty()

//! método explain datos sobre cómo se realizó la búsqueda
db.autores.find().explain("executionStats");

//! método createCollection crear colecciones y establecer reglas para los documentos
//ejemplo de documentación oficial de MongoDb https://docs.mongodb.com/manual/reference/method/db.createCollection/
db.createCollection("contacts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["phone"], //obligatorio que el contacto tenga telefono
      properties: {
        phone: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        email: {
          bsonType: "string",
          pattern: "@mongodb.com$", //expresion regular de como debe ser el email
          description:
            "must be a string and match the regular expression pattern",
        },
        status: {
          enum: ["Unknown", "Incomplete"],
          description: "can only be one of the enum values",
        },
      },
    },
  },
});

//TODO investigar como hacerlo en windows:
//* RESPALDAR INFORMACIÓN
//* mongodump: para copia de respaldo
//* mongostore: para restaurar el resplando
