// autentificacion
export function authenticate(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}



// Manejo de errores
const errorDictionary = {
  "code_zero": "Error al generar uno de los productos : el código del producto es 0 : Detalle",
  "stock_zero": "Error al generar uno de los productos : el stock del producto es 0 : Detalle",
  "price_zero": "Error al generar uno de los productos : el precio del producto es 0 : Detalle",
};

export function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  const errorCode = err.code || "unknown_error";
  const errorMessage = errorDictionary[errorCode] || "Error desconocido";

  // Si el objeto de error tiene propiedades de index y product, incluirlas en la respuesta de error
  const errorResponse = {
    error: errorMessage,
    index: err.index,
    product: err.product,
  };

  res.status(500).json(errorResponse);
}

// Verificación de productos
export function verifyProducts(req, res, next) {
  const mockProducts = [];
  const numberOfProducts = 100;

  for (let i = 1; i <= numberOfProducts; i++) {
    const code = Math.floor(Math.random() * 100); // Generar número aleatorio entre 0 y 100
    const stock = Math.floor(Math.random() * 100); // Stock aleatorio entre 0 y 100
    const price = Math.random() * 1000; // Precio aleatorio entre 0 y 1000

    const mockProduct = {
      code: code,
      title: `Producto ${i}`,
      description: `Descripcion de producto ${i}`,
      stock: stock,
      id: i,
      status: true,
      price: price,
      thumbnail: `https://ejemplo/thumbnail_${i}.jpg`, 
    };

    // Verificar si el producto está mal generado (código, stock o precio es igual a 0)
    if (code === 0) {
      const error = {
        code: "code_zero",
        index: i,
        product: mockProduct,
      };
      return next(error);
    }

    if (stock === 0) {
      const error = {
        code: "stock_zero",
        index: i,
        product: mockProduct,
      };
      return next(error);
    }

    if (price === 0) {
      const error = {
        code: "price_zero",
        index: i,
        product: mockProduct,
      };
      return next(error);
    }

    mockProducts.push(mockProduct);
  }

  // Si todos los productos se generaron correctamente, continuamos 
  req.mockProducts = mockProducts;
  next();
}
