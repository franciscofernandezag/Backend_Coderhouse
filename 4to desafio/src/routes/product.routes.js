import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const productManager = new ProductManager('./productos.txt')

const productRouter = Router() 

productRouter.get("/", async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.render("home", { products });
    } catch (error) {
        res.render("error", { error });
    }
  });

  productRouter.get("/realtimeproducts", async (req, res, next) => {
    try {
      const products = await productManager.getProducts();
      res.render("realtimeproducts", { products });
      next();
    } catch (error) {
      res.send(error);
    }
  });

productRouter.get("/:id", async (req, res) => {
    const product = await productManager.getProductById(req.params.id)
    res.render('product', {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        code: product.code,
        stock: product.stock

    })
   
})

productRouter.post("/", async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body
    await productManager.addProduct({ title, description, price, thumbnail, code, stock })
    req.io.emit("mensaje", "hola")
    res.send("Producto creado")
})

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