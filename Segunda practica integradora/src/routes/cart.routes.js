import { Router } from "express";
import CartModel from "../models/Carts.js";
import ProductModel from "../models/Products.js";

const cartRouter = Router();

// Crear un nuevo carrito
cartRouter.get("/createcart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = new CartModel();
    cart.userId = userId; // Asigna el ID del usuario al campo userId del carrito
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.log("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
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

    cart.products.push({ id: productId, quantity }); // Utiliza el mismo nombre de campo
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.log("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

// Eliminar todos los productos del carrito
cartRouter.delete("/:cartId/products", async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    cart.products = []; // Vaciar el array de productos
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.log("Error al eliminar productos del carrito:", error);
    res.status(500).json({ error: "Error al eliminar productos del carrito" });
  }
});

// Eliminar  un  productos del producto a un carrito en vase a su ID
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
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.log("Error al eliminar producto del carrito:", error);
    res.status(500).json({ error: "Error al eliminar producto del carrito" });
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

// Ver todos los carritos y obtener los productos completos con populate
cartRouter.get("/", async (req, res) => {
  try {
    const carts = await CartModel.find().populate("products.id"); // Utilizar populate para obtener los productos completos
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
    const cart = await CartModel.findById(cartId).populate("products.id"); // Utilizar populate para obtener los productos completos
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
  } catch (error) {
    console.log("Error al obtener los productos del carrito:", error);
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
});

export default cartRouter;
