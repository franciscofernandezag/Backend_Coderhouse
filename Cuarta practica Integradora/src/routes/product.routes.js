// product.routes.js
import { Router } from "express";
import { loggerProd } from "../utils/logger.js";
import productDao from "../dao/productDao.js"; 

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    
    const { limit = 12, page = 1, sort, query, message} = req.query;
    const userName = req.session.user.first_name;
    const email = req.session.user.email;
    const rol = req.session.user.rol;
    const cartId = req.session.user.cartId;
    const userId = req.session.user._id;
   
    const options = {};
    options.limit = parseInt(limit);
    options.skip = (parseInt(page) - 1) * parseInt(limit);
    const queryOptions = query ? { title: { $regex: query, $options: "i" } } : {};
    const products = await productDao.getProducts(queryOptions, options);

    const totalCount = await productDao.getTotalProductCount(queryOptions);
    const totalPages = Math.ceil(totalCount / options.limit);
    const response = {
      status: "success",
      payload: products, 
      totalPages: totalPages,
      prevPage: page > 1 ? parseInt(page) - 1 : null,
      nextPage: page < totalPages ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `http://localhost:4000/products?limit=${limit}&page=${parseInt(page) - 1}` : null,
      nextLink: page < totalPages ? `http://localhost:4000/products?limit=${limit}&page=${parseInt(page) + 1}` : null,
    };

    loggerProd.info(`Productos obtenidos satisfactoriamente. Cantidad de productos: ${products.length}`);

    res.render('products', { 
      navbar: 'navbar', 
      products: products, 
      response: response,
      userId: userId,   
      userName: userName,  
      cartId: cartId,
      email: email, 
      rol: rol, 
      success: "Bienvenido",
      message: message || ""
    });
  } catch (error) {
    loggerProd.fatal("Error al recibir los productos:", error);
    res.status(500).send("Error al recibir los productos:");
  }
});

export default productRouter;
