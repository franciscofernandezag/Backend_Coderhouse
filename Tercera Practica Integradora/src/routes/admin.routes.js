import { Router } from "express";
import productModel from "../models/Products.js";
import { userModel } from "../models/Users.js";
import { loggerDev, loggerProd } from "../utils/logger.js";

const adminRouter = Router();

adminRouter.get("/", async (req, res) => {
  try {
    const { limit = 12, page = 1, sort, query, message } = req.query;
    const userName = req.session.user.first_name;
    const email = req.session.user.email;
    const rol = req.session.user.rol;
    const cartId = req.session.user.cartId;
    const options = {};
    options.limit = parseInt(limit);
    options.skip = (parseInt(page) - 1) * parseInt(limit);


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

    // Utiliza el logger para registrar información debug si el usuario es administrador
    if (rol === "administrador") {

      // Si el usuario es administrador, accede a la ruta adminrouter
      res.render('admin', {
        layout: false,
        partials: {
          navbar: 'navbar',
        },
        products: products,
        response: response,
        userName: userName,
        email: email,
        rol: rol,
        cartId: cartId,
      });
    } else {
      loggerProd.error(`Usuario '${email}' no autorizado accediendo a la ruta '/admin'.`);
      // Si el usuario tiene rol "usuario", redirigir a la raíz "/"
      res.redirect("/");
    }

  } catch (error) {
    // Utiliza el logger para registrar errores
    loggerProd.error("Error al recibir los productos:", error);
    res.status(500).send(`Error al recibir los productos: ${error.message}`); // Envía el mensaje de error real al cliente
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
    loggerProd.info(`Se ha actualizado el stock del producto con ID ${productId}. Stock actualizado: ${amount}.`);
    res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    // Utiliza el logger para registrar errores
    loggerProd.error("Error al actualizar el stock:", error);
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
      loggerProd.info(`Se ha actualizado el precio del producto con ID ${productId}. Precio actualizado: ${amount}.`);
      res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
    } catch (error) {
      loggerProd.error("Error al actualizar precio:", error);
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
      loggerProd.info(`Producto con ID ${productId} eliminado con ID ${productId}`);
  
      res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
    } catch (error) {
      loggerProd.error("Error al eliminar un producto:", error);
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
