import { promises as fs } from "fs";

const Products = [];

export class ProductManager {
  constructor(path) {
    this.path = path;
  }
  static incrementarID() {
    if (this.idIncrement) {
      this.idIncrement++;
    } else {
      this.idIncrement = 1;
    }
    return this.idIncrement;
  }

  async addProduct(producto) {
    try {
      const prodsJSON = await fs.readFile(this.path, "utf-8");
      const prods = JSON.parse(prodsJSON);
      if (
        !producto.code ||
        !producto.title ||
        !producto.description ||
        !producto.price ||
        !producto.stock
      ) {
        throw new Error("Ha ingresado un producto con datos incompletos");
      }
      producto.id = ProductManager.incrementarID();
      producto.status = true;
      prods.push(producto);
      await fs.writeFile(this.path, JSON.stringify(prods, null, 2));
      return "Producto creado";
    } catch (error) {
      return error;
    }
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const getProductos = JSON.parse(data);
      //   console.log(getProductos);
      return getProductos;
    } catch (err) {
      console.log(`Error al leer el archivo: ${err}`);
    }
  }
  async getProductsById(id) {
    try {
      const data = await fs.readFile(this.path, "utf-8");
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

  async updateProduct(
    id,
    { title, description, price, thumbnail, code, stock }
  ) {
    try {
      const prodsJSON = await fs.readFile(this.path, "utf-8");
      const prods = JSON.parse(prodsJSON);
      if (prods.some((prod) => prod.id === parseInt(id))) {
        let index = prods.findIndex((prod) => prod.id === parseInt(id));
        prods[index].title = title;
        prods[index].description = description;
        prods[index].price = price;
        prods[index].thumbnail = thumbnail;
        prods[index].code = code;
        prods[index].stock = stock;
        await fs.writeFile(this.path, JSON.stringify(prods));
        return "Producto actualizado";
      } else {
        return "Producto no encontrado";
      }
    } catch (err) {
      console.log(`Error al leer el archivo: ${err}`);
    }
  }

  // Funcion para eliminar productos por ID

  async deleteProduct(id) {
    try {
      const prodsJSON = await fs.readFile(this.path, "utf-8");
      const prods = JSON.parse(prodsJSON);
      if (prods.some((prod) => prod.id === parseInt(id))) {
        const prodsFiltrados = prods.filter((prod) => prod.id !== parseInt(id));
        await fs.writeFile(this.path, JSON.stringify(prodsFiltrados));
        return "Producto eliminado";
      } else {
        return "Producto no encontrado";
      }
    } catch (err) {
      console.log(`Error al leer el archivo: ${err}`);
    }
  }
}

const producto = new ProductManager("../info.txt");

/// Ejecucion de  "addProduct" para agregar nuevos productos al array original
// producto.addProduct( "CA-121","Camisa","Camisa de algodón para mujer",15.99,"URL Imagen6",5);
// producto.addProduct("IN-345","interior","ropa interior",15.99,"URL Imagen7",50);
// producto.addProduct("CO-22","corbata","corbata negra",88.55,"URL Imagen8",80);
// producto.addProduct("CA-123","calcetin","calcetin mujer mujer",15.99,"URL Imagen9",50);
// producto.addProduct("GO-329","gorra","gorra negra de invierno",18.99,"URL Imagen10",50);

// Ejecucion getProduct()
// const productos = await producto.getProducts();

// Ejecucion getProductsById(4,path);
// const productos = await producto.getProductsById(4);

//Ejecucion updateProduct(5,"stock",200);
// const productos = await producto.updateProduct(1,"code","AAAAA");

// Ejecucion deleteProduct(1);
// const productos = await producto.deleteProduct(1);
