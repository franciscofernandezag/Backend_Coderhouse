// const fs = require('fs').promises;
// import * as fs from 'fs';
import { promises as fs } from "fs";

const path = "./info.txt";
const Products = [];

class ProductManager {
  constructor(id, code, title, description, price, thumbnail, stock) {
    this.id = id;
    this.code = code;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.stock = stock;
  }
}
// agrego productos para array original
// Products.push(new ProductManager(Products.length + 1,"CH-113","chaqueta","chaqueta de cuero para hombre",20.9,"URL Imagen1",10));
// Products.push(new ProductManager(Products.length + 1,"PA-212","pantalon","pantalon de vestir",10.9,"URL Imagen2",20));
// Products.push(new ProductManager(Products.length + 1,"PO-216","polera", "polera de mujer",5.55,"URL Imagen3",10));
// Products.push(new ProductManager(Products.length + 1,"ZA-117","zapatilla","zapatillas deportivas",88.9,"URL Imagen4",100));
// Products.push(new ProductManager(Products.length + 1,"GO-319","gorro","Gorro de invierno",9.99, "URL Imagen5",10));

// Agregar productos metodo sincronico
fs.writeFile(path, JSON.stringify(Products, null, 2))
  .then(() => console.log("Archivo guardado correctamente"))
  .catch((error) => console.log(`Error al guardar el archivo:  ` + error));

// Agregar productos con funcion asincronica
async function addProduct(
  id,
  code,
  title,
  description,
  price,
  thumbnail,
  stock
) {
  try {
    for (let i = 0; i < Products.length; i++) {
      if (Products[i].code === code) {
        console.log("El código del producto ya existe ");
        return;
      }
    }
    // verifica que todos los parámetros hayan sido proporcionados
    if (!id ||!code ||!title ||!description ||!price ||!thumbnail ||!stock) {
      console.log("Ha ingresado un producto con datos incompletos");
      return;
    } else {
      const lastAddedIndex = Products.length;
      Products.push(new ProductManager(id,code,title,description,price,thumbnail,stock));
      // console.log("Ha ingresado un producto exitosamente con el ID #:  " + id);
      // console.table([Products[lastAddedIndex]]);
    }
    await fs.writeFile(path, JSON.stringify(Products, null, 2));
  } catch (error) {
    return error;
  }
}

// Funcion para leer todos los productos de archivo info.txt
async function getProducts() {
  try {
    const data = await fs.readFile(path, "utf-8");
    const getProductos = JSON.parse(data);
  //  console.log(getProductos);
    return getProductos;

  } catch (err) {
    console.log(`Error al leer el archivo: ${err}`);
  }
}
async function getProductsById(id, path) {
  try {
    const data = await fs.readFile(path, "utf-8");
    const getProductos = JSON.parse(data);
    const ProductFiltered = getProductos.filter((item) => item.id == id);
    if (ProductFiltered.length === 0) {
      console.log("Producto no encontrado con el ID #" + id);
    } else {
      console.log("Su producto fue encontrado:");
      console.table(ProductFiltered);
    }
  } catch (err) {
    console.log(`Error al leer el archivo: ${err}`);
  }
}

//Funcion para actualizar productos. Se debe ingresar ID de producto a actualizar , Field ( campo a actualizar) y el valor.
async function updateProduct(id, field, value) {
  try {
    if (field === "id") {
      console.log(" No se puede modificar el campo ID");
    } else {
      const data = await fs.readFile(path, "utf-8");
      const getProductos = JSON.parse(data);
      const productUpdate = getProductos.find((p) => p.id === id);
      if (!productUpdate) {
        console.log(`El producto con id ${id} no existe.`);
        return;
      } else if (!Object.keys(productUpdate).includes(field)) {
        console.log(
          `El campo ${field} no coincide con los campos del producto. Debe indicar los siguientes campos: code , title, descripcion , price, thumbnail y stock`
        );
        return;
      } else {
        productUpdate[field] = value;
        await fs.writeFile(path, JSON.stringify(getProductos, null, 2));
        console.log(
          `Se ha actualizado el producto con id ${id} y el campo ${field} ha sido modificado a ${value}.`
        );
      }
    }
  } catch (err) {
    console.log(`Error al leer el archivo: ${err}`);
  }
}

// Funcion para eliminar productos por ID
async function deleteProduct(id) {
  try {
    const data = await fs.readFile(path, "utf-8");
    const getProductos = JSON.parse(data);
    const deleteindex = getProductos.findIndex((p) => p.id === id);
    if (deleteindex !== -1) {
      const deletedProducto = getProductos[deleteindex];
      getProductos.splice(deleteindex, 1);
      console.log("Se ha eliminado el producto con el ID : " + id)
      console.table(deletedProducto);
      console.log("Tabla Actualizada")
      console.table(getProductos);
      await fs.writeFile(path, JSON.stringify(getProductos, null, 2));
     
    } else {
      console.log(`No existe el producto con ID ${id}`);
    }
  } catch (err) {
    console.log(`Error al leer el archivo: ${err}`);
  }
}

// Ejecucion de funcion "addProduct" para agregar nuevos productos al array original
 addProduct(Products.length + 1, "CA-121","Camisa","Camisa de algodón para mujer",15.99,"URL Imagen6",5);
// addProduct(Products.length + 1,"IN-345","interior","ropa interior",15.99,"URL Imagen7",50);
// addProduct(Products.length + 1,"CO-22","corbata","corbata negra",88.55,"URL Imagen8",80);
// addProduct(Products.length + 1,"CA-123","calcetin","calcetin mujer mujer",15.99,"URL Imagen9",50);
// addProduct(Products.length + 1,"GO-329","gorra","gorra negra de invierno",18.99,"URL Imagen10",50);

// export { getProducts };
//  getProducts();

//getProductsById(4,path);

// updateProduct(5,"stock",200);

// deleteProduct(10);