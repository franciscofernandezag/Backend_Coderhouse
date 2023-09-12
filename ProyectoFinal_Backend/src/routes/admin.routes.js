import { Router } from "express";
import productModel from "../dao/models/Products.js";
import productDao from "../dao/productDao.js";
import userDao from "../dao/userDao.js";

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

    const totalCount = await productDao.getTotalProductCount(queryOptions);
    const totalPages = Math.ceil(totalCount / options.limit);

    let productsQuery = productDao.getProducts(queryOptions, options);

    // Verifica si se proporciona el parámetro 'sort' y aplica el método de ordenamiento ascendente y descendente
    if (sort === "asc") {
      productsQuery = productsQuery.sort({ price: 1 }); // Orden ascendente por precio
    } else if (sort === "desc") {
      productsQuery = productsQuery.sort({ price: -1 }); // Orden descendente por precio
    }

    const products = await productsQuery;

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
    const product = await productDao.getProductById(productId);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    product.stock = parseInt(amount);
    await productDao.updateStock(productId, parseInt(amount)); 
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
    const product = await productDao.getProductById(productId);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    product.price = parseInt(amount);
    await productDao.updatePrice(productId, parseInt(amount)); // Utilizar el DAO para actualizar el precio
    req.session.message = "Se ha actualizado el precio del producto.";
    res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.log("Error al actualizar el precio:", error);
    res.status(500).send("Error al actualizar el precio");
  }
});


  // Ruta para eliminar un producto del market
  adminRouter.post("/products/:id/delete-product", async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await productDao.getProductById(productId);
      if (!product) {
        return res.status(404).send("Producto no encontrado");
      }
      await productDao.deleteProduct(productId);
      req.session.message = "Has eliminado un producto.";    
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
      status: true,
      price,
      thumbnail,
      owner: req.session.user.email, 
    });
    await productDao.addProduct(newProduct);
    req.session.message = "Producto agregado exitosamente.";
    res.redirect(`/admin?message=${encodeURIComponent(req.session.message)}`);
  } catch (error) {
    console.error("Error al agregar un producto:", error);
    res.status(500).send("Error al agregar un producto");
  }
});


// renderiza perfil de Administraodr
adminRouter.get('/perfil', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = req.session.user;
    const userProfileImage = user.documents && user.documents.find((doc) => doc.name === 'Foto de perfil');
    const userDniImage = user.documents && user.documents.find((doc) => doc.name === 'Identificación');
    const userDomicilioImage = user.documents && user.documents.find((doc) => doc.name ==='comprobante_domicilio');
    const userCuentaImage =user.documents && user.documents.find((doc) => doc.name === 'estado_cuenta');

    res.render('users-premium', { user, userId, userProfileImage, userDniImage, userDomicilioImage, userCuentaImage,  layout: false, partials: { navbar: "" } });
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).send('Error en el servidor');
  }
});

adminRouter.get('/adminUser', async (req, res) => {
  try {
    const { limit = 12, page = 1, query, message } = req.query;
    const userName = req.session.user.first_name;
    const email = req.session.user.email;
    const rol = req.session.user.rol;
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };

    // Obtén la lista de usuarios
    const userList = await userDao.getUserList(query, options);

    // Crea un array de objetos de datos de usuario
    const userData = userList.map(user => {
      const userProfileImage = user.documents.find(doc => doc.name === 'Foto de perfil');
      return {
        username: user.first_name,
        email: user.email,
        rol: user.rol,
        userProfileImage: userProfileImage ? `/documents/profiles/${userProfileImage.reference}` : null
      };
    
    });
    res.render('adminUser', {
      layout: false,
      partials: {
        navbar: 'navbar',
      },
      userList: userData, 
      userName: userName,
      email: email,
      rol: rol,
      message: message || "",
    });

  } catch (error) {
    console.log("Error al recibir la lista de usuarios:", error);
    res.status(500).send("Error al recibir la lista de usuarios:");
  }
});


export default adminRouter;