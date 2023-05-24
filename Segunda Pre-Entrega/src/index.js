import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
// import productModel from "./models/Products.js"; // importal product model para agregar productos
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import { engine } from 'express-handlebars'
import { __dirname, __filename } from './path.js'
import * as path from 'path'


const app = express();
const PORT = 4000;

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Handlebars 

app.engine('handlebars', engine()) 
app.set('view engine', 'handlebars') 
app.set('views', path.resolve(__dirname, './views')) 

app.get("/", (req, res) => {

    res.render("home") 
  })

// Conexion MongoDB
mongoose
  .connect(process.env.URL_MONGODB_ATLAS)
  .then(() => console.log("DB is connected"))
  .catch((error) => console.log("Error en MongoDB Atlas :", error));

// Routes
app.use("/products", productRouter);
app.use("/carts", cartRouter);



app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});



//PRODUCTOS 

  // Prueba 1 -limit permitirá devolver sólo elnúmero de elementos solicitados al momento de lapetición, en caso de no recibir limit, éste será de 10.  :
            //URL: http://localhost:4000/products?limit=2
            //URL: http://localhost:4000/products/


  // Prueba 2 - page permitirá devolver lapágina que queremos buscar,en caso de no recibir page, ésta será de 1 :
        //URL: http://localhost:4000/products?page=1    ( devuelve los 10 primeros productos)
        //URL: http://localhost:4000/products?page=2   ( devuelve el producto numero 11 en adelante  )

    // Prueba 3 - sort: asc/desc, para realizarordenamiento ascendente odescendente por precio, encaso de no recibir sort, no realizar ningún ordenamiento :
                //URL:http://localhost:4000/products?sort=asc
                //URL:http://localhost:4000/products?sort=desc

  //CARRITO

 // Prueba 1 Aplicar metodo POST en Postman para crear carrito nuevo con id=1.
  //URL: http://localhost:4000/api/carts/1

   // Prueba 2 Aplicar metodo GET en Postman para visualizar carrito creado segun id1.
  //URL: http://localhost:4000/api/carts/1

 // Prueba 3 Aplicar metodo POST en Postman para crear productos dentro del carrito ingresando el id como "params" y la cantidad como body.
  //URL: http://localhost:4000/api/carts/1/products/1
  //Body:   {"quantity": 100,}  
// Probar por 2da vez con el mismo ID en "params" para verificar que los productos se suman



// // AGREGO PRODUCTOS A BD MONGODB coleccion Products
// await productModel.insertMany([
//     { code: "GU", title: "Guante de hombre", description: "guente de hombre para el frio", stock: 100,  status: true , price: 199 , thumbnail: "AAAA"},
//     { code: "POM-456", title: "Polera", description: "Polera de verano", stock: 100, status: true, price: 10 , thumbnail: "AAAA" },
//     { code: "CA-789", title: "Calcetin", description: "calcetin deposrtivo", stock: 123, status: true, price: 80 , thumbnail: "AAAA" },
//     { code: "BU-789", title: "bufanda", description: "bufanda de guerra", stock: 200, status: true, price: 50 ,thumbnail: "AAAA" },
//     { code: "GO-456", title: "Gorro", description: "Gorro de invierno", stock: 500, status: true, price: 10 , thumbnail: "AAAA" },
//     { code: "PA-789", title: "Pantalon de mujer", description: "Pantalon de mujer para el frio", stock: 456, status: true, price: 599 ,thumbnail: "AAAA" },
//     { code: "CH-879", title: "Chaleco", description: "chaleco de invierno", stock: 125, status: true, price: 899 , thumbnail: "AAAA" },
//     { code: "PA-999", title: "Parca", description: "parca de pluma", stock: 789, status: true, price: 1099 , thumbnail: "AAAA" },
//     { code: "POL-789", title: "Polera", description: "Gorro de invierno", stock: 78, status: true, price: 9 , thumbnail: "AAAA" },
//     { code: "GU-456", title: "Guante", description: "Guante de cuero", stock: 12, status: true, price: 20 , thumbnail: "AAAA" },
//     { code: "CAM-456", title: "Camisa", description: "Camisa ejecutiva", stock: 399, status: true, price: 59 , thumbnail: "AAAA" },
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