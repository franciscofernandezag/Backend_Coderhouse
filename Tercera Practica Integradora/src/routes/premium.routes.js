import { Router } from "express";
import productModel from "../models/Products.js";

const premiumRouter = Router();


premiumRouter.get("/", async (req, res) => {
  try {
    res.render('choose-action', {
      layout: false 
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

premiumRouter.get("/admin", async (req, res) => {
  try {
    const { limit = 12, page = 1, sort, query, message } = req.query;
    const { first_name: userName, email, rol, cartId } = req.session.user;
    const options = { limit: parseInt(limit), skip: (parseInt(page) - 1) * parseInt(limit) };
    
    const queryOptions = query ? { title: { $regex: query, $options: "i" } } : {};

    const totalCount = await productModel.countDocuments(queryOptions);
    const totalPages = Math.ceil(totalCount / options.limit);

    const productsQuery = productModel.find({ ...queryOptions, owner: email }, null, options)
      .sort(sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {});

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
      prevLink: page > 1 ? `http://localhost:4000/premium/admin?limit=${limit}&page=${parseInt(page) - 1}` : null,
      nextLink: page < totalPages ? `http://localhost:4000/premium/admin?limit=${limit}&page=${parseInt(page) + 1}` : null,
    };

    if (rol === "premium") {
      res.render("premium", {
        layout: false,
        partials: {
          navbar: "navbar",
        },
        products: products,
        response: response,
        userName: userName,
        email: email,
        rol: rol,
        cartId: cartId,
        message: message || ""
      });
    } else {
      console.error(`Usuario '${email}' no autorizado accediendo a la ruta '/premium'.`);
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error al recibir los productos:", error);
    res.status(500).send(`Error al recibir los productos: ${error.message}`);
  }
});

// Ruta para agregar producto
premiumRouter.post("/products/owner/addproduct", async (req, res) => {
  try {
    const { code, title, description, stock, id, status, price, thumbnail } =
      req.body;

    // Crear un nuevo producto utilizando el modelo y el email del usuario logeado
    const newProduct = new productModel({
      code,
      title,
      description,
      stock,
      id,
      status: true,
      price,
      thumbnail,
      owner: req.session.user.email, // Establecer el owner como el owner logeado
    });

    // Guarda el nuevo producto en la base de datos
    await newProduct.save();

    req.session.message = "Producto agregado exitosamente.";
    // Redirigir a la página adecuada después de agregar el producto
    res.redirect(`/premium/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.error("Error al agregar un producto:", error);
    res.status(500).send("Error al agregar un producto");
  }
});

// Ruta para actualizar stock
premiumRouter.post("/products/:id/update-stock", async (req, res) => {
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

    res.redirect(`/premium/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.log("Error al actualizar el stock:", error);
    res.status(500).send("Error al actualizar el stock");
  }
});

// Ruta para actualizar precio
premiumRouter.post("/products/:id/update-price", async (req, res) => {
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
    console.info(
      `Se ha actualizado el precio del producto con ID ${productId}. Precio actualizado: ${amount}.`
    );
    res.redirect(`/premium/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.error("Error al actualizar precio:", error);
    res.status(500).send("Error al actualizar el stock");
  }
});

// Ruta para eliminar un producto del market
premiumRouter.post("/products/:id/delete-product", async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    // Verificar si el usuario conectado es el propietario del producto
    const { email } = req.session.user;
    if (product.owner !== email) {
      return  res.status(403).render('forbidden', { title: 'Acceso denegado' });

    }
    // Eliminar el producto del modelo
    await productModel.findByIdAndDelete(productId);
    req.session.message = "Has eliminado un producto.";
    console.log(`Producto con ID ${productId} eliminado por el propietario con ID ${productId}`);
    res.redirect(`/premium/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.error("Error al eliminar un producto:", error);
    res.status(500).send("Error al eliminar un producto");
  }
});




export default premiumRouter;
