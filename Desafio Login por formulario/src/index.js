import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { userModel } from "./models/Users.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import { engine } from 'express-handlebars'
import { __dirname, __filename } from './path.js'
import * as path from 'path'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import session from 'express-session'

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
  store: MongoStore.create({
      mongoUrl: process.env.URL_MONGODB_ATLAS,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 100 // Medido en segundos
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

await mongoose.connect(process.env.URL_MONGODB_ATLAS).then(() => console.log("MongoDB conectado"));

// Handlebars 
app.engine('handlebars', engine()) 
app.set('view engine', 'handlebars') 
app.set('views', path.resolve(__dirname, './views')) 

// Conexion MongoDB
mongoose
  .connect(process.env.URL_MONGODB_ATLAS)
  .then(() => console.log("DB is connected"))
  .catch((error) => console.log("Error en MongoDB Atlas:", error));

// Vista home
app.get('/', (req, res) => {
  res.render('home', { title: 'Página de inicio' });
});

// Ruta POST para el inicio de sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user || user.password !== password) {
      // Usuario o contraseña incorrectos
      return res.render('home', { title: 'Página de inicio', error: 'Correo o contraseña incorrecta' });
    }

    // Inicio de sesión exitoso
    req.session.user = user; // Guarda el usuario en la sesión
    res.redirect('/products');
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor' });
  }
});

// Ruta POST para el registro de usuarios// Ruta POST para el registro de usuarios
app.post('/registro', async (req, res) => {
  const { nombre, apellido, email, edad, genero, rol, password } = req.body;
  try {
    if (!nombre || !apellido || !email || !edad || !genero || !rol || !password) {
      // Si falta algún campo, muestra un mensaje de error
      return res.status(400).render('home', { title: 'Página de inicio', error: 'Faltan campos obligatorios' });
    }
    const user = await userModel.create({
      first_name: nombre,
      last_name: apellido,
      email,
      gender: genero,
      rol,
      password
    });
    res.render('home', { title: 'Página de inicio', success: 'Usuario creado exitosamente', error: null });
  } catch (error) {
    console.error('Error en el registro de usuarios:', error);
    res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor', success: null });
  }
});

// Routes
app.use("/products", productRouter);
app.use("/carts", cartRouter);

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});


//PRODUCTOS 

  // Prueba 1 -LIMIT permitirá devolver sólo elnúmero de elementos solicitados al momento de lapetición, en caso de no recibir limit, éste será de 10.  :
            //URL: http://localhost:4000/products?limit=2
            //URL: http://localhost:4000/products/

  // Prueba 2 - PAGE permitirá devolver lapágina que queremos buscar,en caso de no recibir page, ésta será de 1 :
        //URL: http://localhost:4000/carts    ( devuelve los 10 primeros productos)
        //URL: http://localhost:4000/products?page=2   ( devuelve el producto numero 11 en adelante  )

 // Prueba 3 - QUERY:  query, el tipo de elemento que quiero buscar (es decir, qué filtro aplicar), en caso de no recibir query, realizar la búsqueda general :
                //URL:http://localhost:4000/products?query=title   ( se filtra por titulo)
                //URL:http://localhost:4000/products?query=    ( si no se agrega query lista todos los productos)

// Prueba 4 - SORT: asc/desc, para realizarordenamiento ascendente odescendente por precio, encaso de no recibir sort, no realizar ningún ordenamiento :
                //URL:http://localhost:4000/products?sort=asc
                //URL:http://localhost:4000/products?sort=desc

  //CARRITO

 //  CREAR con metodo POST un carrito nuevo mediante metodo POST en Postman para crear carrito nuevo. 
 // se crea coleccion "carts" en mongo DB
        //URL: http://localhost:4000/carts

   // AGREGAR con metodo productos al carrito creado mediante metodo POST referenciando id de carrito y ID de producto
   //en coleccion "Products"
          //URL: http://localhost:4000/carts/cartId/products/:productId

 // Prueba 1 DELETE deberá eliminar del carrito el producto seleccionado..
          //URL: http://localhost:4000/api/carts/1/products/1

 // Prueba 2 PUT deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
          //URL: http://localhost:4000/carts/:cartId/products/:productId
          //Body:   {"quantity": 100,} 

// Prueba 3 DELETE deberá eliminar todos los productos del carrito
          //URL: http://localhost:4000/carts/:cartId/products
         
// Eliminar producto del carrito por ID:
         //URL: http://localhost:4000/carts/:cartId/products/:productId

// Prueba GET 4 Esta vez, para el modelo de Carts,en su propiedad products, 
//el id decada producto generado dentro del array tiene que hacerreferencia al modelo de 
//Products.Modificar la ruta /:cid para que altraer todos los productos, 
//los traiga completos mediante un“populate”. De esta maneraalmacenamos sólo el Id,
// pero alsolicitarlo podemos desglosar los productos asociados.
 // Muestra todos los productos del carrito
     //URL: http://localhost:4000/carts
// Muestra productos por ID
      //URL: http://localhost:4000/carts/:cartId



// // // AGREGO PRODUCTOS A BD MONGODB coleccion Products
// // await productModel.insertMany([
// //     { code: "GU", title: "Guante de hombre", description: "guente de hombre para el frio", stock: 100,  status: true , price: 199 , thumbnail: "AAAA"},
// //     { code: "POM-456", title: "Polera", description: "Polera de verano", stock: 100, status: true, price: 10 , thumbnail: "AAAA" },
// //     { code: "CA-789", title: "Calcetin", description: "calcetin deposrtivo", stock: 123, status: true, price: 80 , thumbnail: "AAAA" },
// //     { code: "BU-789", title: "bufanda", description: "bufanda de guerra", stock: 200, status: true, price: 50 ,thumbnail: "AAAA" },
// //     { code: "GO-456", title: "Gorro", description: "Gorro de invierno", stock: 500, status: true, price: 10 , thumbnail: "AAAA" },
// //     { code: "PA-789", title: "Pantalon de mujer", description: "Pantalon de mujer para el frio", stock: 456, status: true, price: 599 ,thumbnail: "AAAA" },
// //     { code: "CH-879", title: "Chaleco", description: "chaleco de invierno", stock: 125, status: true, price: 899 , thumbnail: "AAAA" },
// //     { code: "PA-999", title: "Parca", description: "parca de pluma", stock: 789, status: true, price: 1099 , thumbnail: "AAAA" },
// //     { code: "POL-789", title: "Polera", description: "Gorro de invierno", stock: 78, status: true, price: 9 , thumbnail: "AAAA" },
// //     { code: "GU-456", title: "Guante", description: "Guante de cuero", stock: 12, status: true, price: 20 , thumbnail: "AAAA" },
// //     { code: "CAM-456", title: "Camisa", description: "Camisa ejecutiva", stock: 399, status: true, price: 59 , thumbnail: "AAAA" },
// // ])

// // AGREGO PRIMEROS USUARIOS A MODELO USERS
// await userModel.insertMany([
//     { first_name: "Francisco", last_name: "Fernandez", email: "fernandezfco@hotmail.cl", gender: "Masculino", rol: "Administrador",  password: "123456" },
// ])




// Muestro productos en console.log
// const displayProducts = async () => {
//     try {
//       const products = await productModel.find();
//       console.log("Productos agregados:");
//       console.log(products);
//     } catch (error) {
//       console.error("Error al obtener los productos:", error);
//     }
//   };

//   // Llama a la función para mostrar los productos agregados
//   displayProducts();