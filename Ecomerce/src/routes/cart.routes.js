import { Router } from "express";
import CartModel from "../models/Carts.js";
import ProductModel from "../models/Products.js";
import { sumarProductosIguales, calcularTotal } from "../utils.js";


const cartRouter = Router();


// Ver productos de un carrito por ID de carrito

cartRouter.get("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await CartModel.findById(cartId).populate("products.id");
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const summedProducts = sumarProductosIguales(cart.products); // Agrega esta línea para obtener la lista de productos sumados

    const message = req.session.message; // Obtén el mensaje de la sesión
    req.session.message = null; // Limpia el mensaje de la sesión después de obtenerlo

    res.render("carts", { cart: cart, cartId: cartId, products: summedProducts, total: calcularTotal(summedProducts), message: message }); 
  } catch (error) {
    console.log("Error al obtener los productos del carrito:", error);
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
});


// Agregar producto a un carrito
cartRouter.post("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await CartModel.findById(cartId);
    const product = await ProductModel.findById(productId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const existingProduct = cart.products.find((item) => item.id.equals(productId));

    if (existingProduct) {
      // El producto ya existe en el carrito, actualiza la cantidad
      existingProduct.quantity += 1;
    } else {
      // El producto no existe en el carrito, agrega un nuevo objeto al arreglo de productos
      cart.products.push({ id: productId, quantity: 1 });
    }

    await cart.save();

    req.session.message = "Se ha agregado un producto al carrito.";

    res.redirect(`/products?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.log("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});


// Eliminar todos los productos del carrito
cartRouter.get("/:cartId/products", async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      { $set: { products: [] } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }


    res.redirect(`/carts/${cartId}`);

  } catch (error) {
    console.log("Error al eliminar productos del carrito:", error);
    res.status(500).json({ error: "Error al eliminar productos del carrito" });
  }
});




// Eliminar  un  productos del producto a un carrito en vase a su ID
cartRouter.post("/:cartId/products/:productId/delete", async (req, res) => {
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

    req.session.message = "Has eliminado un producto.";

   

    res.redirect(`/carts/${cartId}`);
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

// // Ver todos los carritos y obtener los productos completos con populate
// cartRouter.get("/", async (req, res) => {
//   try {
//     const carts = await CartModel.find().populate("products.id"); // Utilizar populate para obtener los productos completos
//     res.json(carts);
//   } catch (error) {
//     console.log("Error al obtener los carritos:", error);
//     res.status(500).json({ error: "Error al obtener los carritos" });
//   }
// });




export default cartRouter;
