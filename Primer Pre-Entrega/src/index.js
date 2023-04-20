
import express from 'express'
import { ProductManager } from './ProductManager.js'

const productManager = new ProductManager('../info.txt')
const app = express()
const PORT = 4000
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Mi primer servidor con express en Coder")
})

app.get('/products', async (req, res) => {
  let { limit } = req.query;
  let products = await productManager.getProducts();
  console.log(products)
  if (limit) {
    products = products.slice(0, limit);
  }
  res.send(products);
});

app.get('/products/:id', async (req, res) => {
  let products = await productManager.getProducts()
  const productId = parseInt(req.params.id);
  let product = products.find(p => p.id === productId);

  if (product) {
    res.send(product);
  } else {
      res.send(`El producto con el id ${req.params.id} no se encuentra`)
  }
});

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

  // Prueba 1 segun desafio. Probar en Browser: 
  //URL: http://localhost:4000/products/3

    // Prueba 2 segun desafio. Probar en Browser:
  //URL: http://localhost:4000/products?limit=5