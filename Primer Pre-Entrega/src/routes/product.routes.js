import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const productManager = new ProductManager('./info.txt')

const productRouter = Router() //productRouter voy a definir mis rutas


productRouter.get("/", async (req, res) => {
    let { limit } = req.query;
    let products = await productManager.getProducts();
  
    if (limit) {
      products = products.slice(0, limit);
    }
  
    res.send(products);
  });

  productRouter.get("/:id", async (req, res) => {
    const products = await productManager.getProducts();
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
  
    if (product) {
      res.send(product);
    } else {
        res.send(`El producto con el id ${req.params.id} no se encuentra`)
    }
  });


  productRouter.post("/", async (req, res) => {
    const { code, title, description, price, thumbnail, stock } = req.body;
    const producto = { code, title, description, price, thumbnail, stock };
    const result = await productManager.addProduct(producto);
    if (result === "Producto creado") {
      res.send(result);
    } else {
      res.status(400).send("Producto con datos incompletos");
    }
  });
  

productRouter.put("/:id", async (req, res) => {
    const id = req.params.id
    const { title, description, price, thumbnail, code, stock } = req.body

    const mensaje = await productManager.updateProduct(id, { title, description, price, thumbnail, code, stock })

    res.send(mensaje)
})

productRouter.delete("/:id", async (req, res) => {
    const id = req.params.id
    const mensaje = await productManager.deleteProduct(id)
    res.send(mensaje)
})

export default productRouter