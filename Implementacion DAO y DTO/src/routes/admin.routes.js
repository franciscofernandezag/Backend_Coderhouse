import express from "express";
import productDao from "../dao/productDao.js";
import ProductDTO from "../dto/productDto.js";

const adminRouter = express.Router();

adminRouter.get("/", async (req, res) => {
  try {
    const { limit = 12, page = 1, sort, query, message } = req.query;
    const userName = req.session.user.first_name;
    const email = req.session.user.email;
    const rol = req.session.user.rol;
    const cartId = req.session.user.cartId;
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };
    console.log("Valor de cart:", cartId);

    const queryOptions = query ? { title: { $regex: query, $options: "i" } } : {};

    const totalCount = await productDao.countDocuments(queryOptions);
    const totalPages = Math.ceil(totalCount / options.limit);

    let products = await productDao.getProducts(queryOptions, options);

    if (sort === "asc") {
      products = products.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      products = products.sort((a, b) => b.price - a.price);
    }

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

    res.render("admin", {
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
      message: message || "",
    });

  } catch (error) {
    console.log("Error al recibir los productos:", error);
    res.status(500).send("Error al recibir los productos:");
  }
});

adminRouter.post("/products/:id/update-stock", async (req, res) => {
  try {
    const productId = req.params.id;
    const { amount } = req.body;

    await productDao.updateStock(productId, parseInt(amount));

    req.session.message = "Se ha actualizado el stock del producto.";
    res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.log("Error al actualizar el stock:", error);
    res.status(500).send("Error al actualizar el stock");
  }
});

adminRouter.post("/products/:id/update-price", async (req, res) => {
  try {
    const productId = req.params.id;
    const { amount } = req.body;

    await productDao.updatePrice(productId, parseInt(amount));

    req.session.message = "Se ha actualizado el precio del producto.";
    res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.log("Error al actualizar el precio:", error);
    res.status(500).send("Error al actualizar el precio");
  }
});

adminRouter.post("/products/:id/delete-product", async (req, res) => {
  try {
    const productId = req.params.id;

    await productDao.deleteProduct(productId);

    req.session.message = "Has eliminado un producto.";
    console.log(`Producto con ID ${productId} eliminado con éxito.`);
  
    res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.error("Error al eliminar un producto:", error);
    res.status(500).send("Error al eliminar un producto");
  }
});

adminRouter.post("/products/owner/addproduct", async (req, res) => {
  try {
    const { code, title, description, stock, id, price, thumbnail } = req.body;

    const productData = new ProductDTO(code, title, description, stock, id, price, thumbnail);

    await productDao.addProduct(productData);

    req.session.message = "Producto agregado exitosamente.";
    res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.error("Error al agregar un producto:", error);
    res.status(500).send("Error al agregar un producto");
  }
});

export default adminRouter;
