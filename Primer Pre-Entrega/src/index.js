
import express from 'express'
import productRouter from './routes/product.routes.js'


const app = express()
const PORT = 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/products', productRouter)

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
}) 

  // Prueba 1 segun desafio. Probar en Browser: 
  //URL: http://localhost:4000/products/3

    // Prueba 2 segun desafio. Probar en Browser:
  //URL: http://localhost:4000/products?limit=5
