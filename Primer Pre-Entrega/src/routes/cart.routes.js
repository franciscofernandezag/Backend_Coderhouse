import { Router } from "express";
import { CartManager } from "../CartManager.js";


const cartManager = new CartManager('./carrito.txt')
const cartRouter = Router() 

cartRouter.post("/:id", async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body
    await cartManager.createCarrito({ title, description, price, thumbnail, code, stock })
    res.send("carrito creado")
})

cartRouter.get("/:id", async (req, res) => {
    const cartId = req.params.id;
    try {
      const cart = await cartManager.getCartById(cartId);
      res.send(cart);
    } catch (error) {
      res.send(error.message);
    }
  });

  cartRouter.post("/:idCart/products/:id", async (req, res) => {
    const id = req.params.id
    const idCart = req.params.idCart
    const quantity = req.body.quantity
    const cart = await cartManager.addProductCart(id, quantity, idCart);
    res.send(cart);
  });
  

export default cartRouter