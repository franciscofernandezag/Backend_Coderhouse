import express from "express";
import productDao from "../dao/productDao.js";
import ProductDTO from "../dto/productDto.js";
import { loggerDev, loggerProd } from  "../utils/logger.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  try {
    const { limit = 12, page = 1, sort, query, message } = req.query;
    const sessionData = new ProductDTO(req.session);

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };
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
      prevLink: page > 1 ? `http://localhost:4000/products?limit=${limit}&page=${parseInt(page) - 1}` : null,
      nextLink: page < totalPages ? `http://localhost:4000/products?limit=${limit}&page=${parseInt(page) + 1}` : null,
    };

    // Registro de información en el logger
    loggerProd.info(`Productos obtenidos satisfactoriamente. Cantidad de productos: ${products.length}`);

    const productDTOs = products.map(product => new ProductDTO(
      product.code,
      product.title,
      product.description,
      product.stock,
      product.id,
      product.price,
      product.thumbnail,
      sessionData
    ));

    res.render('products', {
      navbar: 'navbar',
      products: productDTOs,
      response: response,
      ...sessionData,
      message: message || ""
    });

  } catch (error) {
    loggerProd.fatal("Error al recibir los productos:", error);
    res.status(500).send("Error al recibir los productos:");
  }
});


export default productRouter;
