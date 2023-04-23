
import express from 'express'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'

const app = express()
const PORT = 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
}) 

//PRODUCTOS 

  // Prueba 1 aplicar metodo GET en postman para devolver productos con limite  :
  //URL: http://localhost:4000/api/products?limit=2

  // Prueba 2  Aplicar metodo GET en Postman con id para traer solo el producto deseado por id 
  //URL: http://localhost:4000/api/products/3

    // Prueba 3  Aplicar metodo POST en Postman para crear producto
  //URL: http://localhost:4000/api/products
  //Body: {"code":"JO-234","title":"jokey","description":"Jokey Nike","price":10.55,"thumbnail":"","stock":500}

    // Prueba 4 Aplicar metodo PUT en Postman para actualizar producto 
  //URL: http://localhost:4000/api/products/1
  //Body:{"code":"","title":"","description":"","price":,"thumbnail":"","stock":}

// Prueba 5 Aplicar metodo DELETE en Postman para borrar producto 
  //URL: http://localhost:4000/api/products/2

  //CARRITO

 // Prueba 1 Aplicar metodo POST en Postman para crear carrito nuevo con id=1.
  //URL: http://localhost:4000/api/carts/1

   // Prueba 2 Aplicar metodo GET en Postman para visualizar carrito creado segun id1.
  //URL: http://localhost:4000/api/carts/1

 // Prueba 3 Aplicar metodo POST en Postman para crear productos dentro del carrito ingresando el id como "params" y la cantidad como body.
  //URL: http://localhost:4000/api/carts/1/products/1
  //Body:   {"quantity": 100,}  
// Probar por 2da vez con el mismo ID en "params" para verificar que los productos se suman