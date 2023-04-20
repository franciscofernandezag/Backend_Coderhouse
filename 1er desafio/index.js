class ProductManager {
  constructor(id,code, title, description, price, thumbnail, stock) {
    this.id = id;
    this.code = code;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.stock = stock;
  }
}

const Products = [];
// agrego productos para array original
if (Products.length === 0) {
  Products.push(new ProductManager(Products.length +1 , "CH-113","chaqueta","chaqueta de cuero para hombre",20.9,"URL Imagen1",10));
  Products.push(new ProductManager(Products.length +1 ,"PA-212","pantalon","pantalon de vestir",10.9,"URL Imagen2",20));
  Products.push(new ProductManager(Products.length +1 ,"PO-216", "polera", "polera de mujer", 5.55, "URL Imagen3", 10));
  Products.push(new ProductManager(Products.length +1 ,"ZA-117","zapatilla","zapatillas deportivas", 88.9, "URL Imagen4",100 ) );
  Products.push(new ProductManager(Products.length +1 ,"GO-319","gorro", "Gorro de invierno", 9.99, "URL Imagen5", 10));
}

function addProduct(id, code, title, description, price, thumbnail, stock) {

  for (let i = 0; i < Products.length; i++) {
      if (Products[i].code === code) {
        console.log("El código del producto ya existe ");
        return;
                }
      }

  // verifica que todos los parámetros hayan sido proporcionados
  if (!id || !code || !title || !description || !price || !thumbnail || !stock) {
    console.log("Ha ingresado un producto con datos incompletos");
    return;
  }
  else{
    Products.push(new ProductManager(id , code, title, description, price, thumbnail, stock)); 
    console.log( "Ha ingresado un producto exitosamente con el ID #:  " + id)
  }

}

function getProduct() {
  console.table(Products)
}

function getProductsById(id) {
  const ProductFiltered = Products.filter((item) => item.id == id);
  if (ProductFiltered.length === 0) {
    console.log("Producto no encontrado con el ID #" + id);
  } else {
    console.log("Su producto fue encontrado:");
    console.table(ProductFiltered);
  }
}

// Ejecucion de funcion "addProduct" para agregar nuevos productos al array original
    addProduct(Products.length +1 ,"CA-121", "Camisa", "Camisa de algodón para mujer", 15.99, "URL Imagen6", 50);
    addProduct(Products.length +1 ,"IN-345", "interior", "ropa interior", 15.99, "URL Imagen7", 50);
    addProduct(Products.length +1 ,"CO-22", "corbata", "corbata negra", 88.55, "URL Imagen8", 80);
    addProduct(Products.length +1 ,"CA-123", "calcetin", "calcetin mujer mujer", 15.99, "URL Imagen9", 50);
    addProduct(Products.length +1 ,"GO-329", "gorra", "gorra negra de invierno", 18.99, "URL Imagen10", 50);

//Ejecucion de funcion " getProduct" para devolver arreglo con todos los productos del array. Solo se ejecuta "console.log" del arreglo products.
getProduct();


// Ejecucion de funcion "getProductsById" para buscar un producto con codigo especifico.
getProductsById(9);



