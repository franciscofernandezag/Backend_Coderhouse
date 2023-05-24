import { Router } from "express";
import CartModel from "../models/Carts.js";
import ProductModel from "../models/Products.js";

const cartRouter = Router();



// Crear un nuevo carrito
cartRouter.post("/", async (req, res) => {
  try {
    const cart = new CartModel();
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.log("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// Ver todos los productos del carrito
cartRouter.get("/", async (req, res) => {
  try {
    const carts = await CartModel.find();
    res.json(carts);
  } catch (error) {
    console.log("Error al obtener los carritos:", error);
    res.status(500).json({ error: "Error al obtener los carritos" });
  }
});

// Ver productos de un carrito por ID
cartRouter.get("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
  } catch (error) {
    console.log("Error al obtener los productos del carrito:", error);
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
});

// Agregar producto a un carrito
cartRouter.post("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findById(cartId);
    const product = await ProductModel.findById(productId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    cart.products.push({ id: productId, quantity });
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.log("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

// Modificar cantidad de un producto en el carrito
cartRouter.put("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.log("Error al modificar la cantidad del producto en el carrito:", error);
    res.status(500).json({ error: "Error al modificar la cantidad del producto en el carrito" });
  }
});
// Eliminar producto del carrito
cartRouter.delete("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.log("Error al eliminar el producto del carrito:", error);
    res.status(500).json({ error: "Error al eliminar el producto del carrito" });
  }
});

// Crear un nuevo carrito
cartRouter.post("/", async (req, res) => {
  try {
    const cart = new CartModel();
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.log("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

export default cartRouter;
