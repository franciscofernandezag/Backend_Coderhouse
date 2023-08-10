import { Router } from "express";
import productModel from "../models/Products.js";

const adminRouter = Router();

adminRouter.get("/", async (req, res) => {
  try {
    const { limit = 12, page = 1, sort, query, message } = req.query;
    const userName = req.session.user.first_name;
    const email = req.session.user.email;
    const owner = req.session.user.owner;
    const rol = req.session.user.rol;
    const cartId = req.session.user.cartId;
    const options = {};
    options.limit = parseInt(limit);
    options.skip = (parseInt(page) - 1) * parseInt(limit);
    console.log("Valor de cart:", cartId);

    const queryOptions = query ? { title: { $regex: query, $options: "i" } } : {};

    const totalCount = await productModel.countDocuments(queryOptions);
    const totalPages = Math.ceil(totalCount / options.limit);

    let productsQuery = productModel.find(queryOptions, null, options);

    // Verifica si se proporciona el parámetro 'sort' y aplica el método de ordenamiento ascendente y descendente
    if (sort === "asc") {
      productsQuery = productsQuery.sort({ price: 1 }); // Orden ascendente por precio
    } else if (sort === "desc") {
      productsQuery = productsQuery.sort({ price: -1 }); // Orden descendente por precio
    }

    const products = await productsQuery.exec();

    const response = {
      status: "success",
      payload: products,
      totalPages: totalPages,
      prevPage: page > 1 ? parseInt(page) - 1 : null,
      nextPage: page < totalPages ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `http://localhost:4000/admin?limit=${limit}&page=${parseInt(page) - 1}` : null,
      nextLink: page < totalPages ? `http://localhost:4000/admin?limit=${limit}&page=${parseInt(page) + 1}` : null,
    };
    res.render('admin', {
      layout: false, // Desactivar el uso del layout
      partials: {
        navbar: 'navbar', // Incluir el partial del navbar si es necesario en otras vistas
      },
      products: products,
      response: response,
      userName: userName,
      email: email,
      rol: rol,
      cartId: cartId,
      message: message || ""
    });

  } catch (error) {
    console.log("Error al recibir los productos:", error);
    res.status(500).send("Error al recibir los productos:");
  }
});

// Ruta para actualizar stock
adminRouter.post("/products/:id/update-stock", async (req, res) => {
  try {
    const productId = req.params.id;
    const { amount } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    product.stock = parseInt(amount);
    await product.save();
    req.session.message = "Se ha actualizado el stock del producto.";
    res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.log("Error al actualizar el stock:", error);
    res.status(500).send("Error al actualizar el stock");
  }
});

// Ruta para actualizar precio
adminRouter.post("/products/:id/update-price", async (req, res) => {
    try {
      const productId = req.params.id;
      const { amount } = req.body;
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).send("Producto no encontrado");
      }
      product.price = parseInt(amount);
      await product.save();
      req.session.message = "Se ha actualizado el precio del producto.";
      res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
    } catch (error) {
      console.log("Error al actualizar el stock:", error);
      res.status(500).send("Error al actualizar el stock");
    }
  });


  // Ruta para eliminar un producto del market
  adminRouter.post("/products/:id/delete-product", async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).send("Producto no encontrado");
      }

      // Eliminar el producto del modelo
      await productModel.findByIdAndDelete(productId);
  
      req.session.message = "Has eliminado un producto.";
      console.log(`Producto con ID ${productId} eliminado con ID ${productId}`);
  
      res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
    } catch (error) {
      console.error("Error al eliminar un producto:", error);
      res.status(500).send("Error al eliminar un producto");
    }
  });
  
// Ruta para agregar producto
adminRouter.post("/products/owner/addproduct", async (req, res) => {
  try {
    const { code, title, description, stock, id, status, price, thumbnail } = req.body;

    // Crear un nuevo producto utilizando el modelo y el email del usuario logeado
    const newProduct = new productModel({
      code,
      title,
      description,
      stock,
      id,
      status:  true,
      price,
      thumbnail,
      owner: req.session.user.email, // Establecer el owner como el email del usuario logeado
    });

 // Guarda el nuevo producto en la base de datos
 await newProduct.save();

    req.session.message = "Producto agregado exitosamente.";
    // Redirigir a la página adecuada después de agregar el producto
    res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.error("Error al agregar un producto:", error);
    res.status(500).send("Error al agregar un producto");
  }
});

export default adminRouter;
