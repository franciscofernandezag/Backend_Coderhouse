import { Router } from "express";
import CartModel from "../models/Carts.js";
import ProductModel from "../models/Products.js";
import purchaseModel from "../models/Purchase.js";
import { sumarProductosIguales, calcularTotal } from "../utils/utilsCarts.js";

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

// Finalizar compra
cartRouter.post("/:cartId/purchase", async (req, res) => {
  try {
    const { cartId } = req.params;
    // Obtener el ID y correo del usuario de la sesión
    const userId = req.session.user._id;
    const userEmail = req.session.user.email;
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productsToPurchase = [];
    let total = 0;
    let successful = true;

    for (const product of cart.products) {
      const { id, quantity } = product;
      const productFromDB = await ProductModel.findById(id);

      if (!productFromDB) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      if (productFromDB.stock >= quantity) {
        // Restar la cantidad del producto del stock
        productFromDB.stock -= quantity;
        const subtotal = productFromDB.price * quantity;
        total += subtotal;
        productsToPurchase.push({
          product: productFromDB,
          Id: productFromDB._id,
          quantity: quantity,
          price: productFromDB.price,
          subtotal: subtotal
        });
      } else {
        successful = false;
        productsToPurchase.push({
          product: productFromDB,
          Id: productFromDB._id,
          quantity: quantity,
          price: productFromDB.price,
          subtotal: productFromDB.price * quantity
        });
      }
    }
    // Obtener y actualizar el campo "ticket" autoincrementalmente
    const purchase = await purchaseModel.findOneAndUpdate(
      {},
      { $inc: { ticket: 1 } },
      { new: true, upsert: true }
    );
    if (!purchase) {
      return res.status(500).json({ error: "Error al finalizar la compra" });
    }
    console.log("Valor de ticket:", purchase.ticket);
    // Guardar los productos en la colección "purchase" con el estado "successful"
    const newPurchase = await purchaseModel.create({
      userId: userId,
      userEmail: userEmail,
      products: productsToPurchase,
      successful: successful,
      total: successful ? total : 0,
      ticket: purchase.ticket,
      purchaseDate: Date.now()
    });
    if (successful) {
      // Todos los productos tienen suficiente stock
      // Guardar los cambios en los productos y vaciar el carrito
      await Promise.all(productsToPurchase.map(item => item.product.save()));
      cart.products = [];
      await cart.save();
      req.session.products = productsToPurchase; 
      const cartId = req.session.user.cartId;
      return res.render("purchase-successful", { products: productsToPurchase, total: total, cartId: cartId });
    } else {

      req.session.products = productsToPurchase; 
      const cartId = req.session.user.cartId;
      return res.render("purchase-failed", { products: productsToPurchase, total: total, cartId: cartId });
    }
  } catch (error) {
    console.log("Error al finalizar la compra:", error);
    res.status(500).json({ error: "Error al finalizar la compra" });
  }
});


export default cartRouter;