
import { promises as fs } from 'fs'

const Products = [];

export class ProductManager {
  constructor(path) {
    this.path = path;
  }


  static incrementarID() {
    if (this.idIncrement) {
        this.idIncrement++
    } else {
        this.idIncrement = 1
    }
    return this.idIncrement
}

  async addProduct(code, title, description, price, thumbnail, stock) {
    try {
      for (let i = 0; i < Products.length; i++) {
        if (Products[i].code === code) {
          console.log("El código del producto ya existe ");
          return;
        }
      }
      // verifica que todos los parámetros hayan sido proporcionados
      if (!code ||!title ||!description ||!price ||!thumbnail ||!stock) {
        console.log("Ha ingresado un producto con datos incompletos");
        return;
      } else {
        const id = ProductManager.incrementarID()
        const newProduct = { id, code, title, description, price, thumbnail, stock };
        Products.push(newProduct);

        console.log(`Ha ingresado un nuevo producto exitosamente con el ID #${id}`);
        console.log([newProduct]);
      }
      await fs.writeFile(this.path, JSON.stringify(Products, null, 2));
    } catch (error) {
      return error;
    }
  }

  // Funcion para leer todos los productos de archivo info.txt
  async  getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const getProductos = JSON.parse(data);
       console.log(getProductos);
      return getProductos;

    } catch (err) {
      console.log(`Error al leer el archivo: ${err}`);
    }
  }
  async  getProductsById(id) {
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

  //Funcion para actualizar productos. Se debe ingresar ID de producto a actualizar , Field ( campo a actualizar) y el valor.
  async  updateProduct(id, field, value) {
    try {
      if (field === "id") {
        console.log(" No se puede modificar el campo ID");
      } else {
        const data = await fs.readFile(this.path, "utf-8");
        const getProductos = JSON.parse(data);
        const productUpdate = getProductos.find((p) => p.id === id);
        if (!productUpdate) {
          console.log(`El producto con id ${id} no existe.`);
          return;
        } else if (!Object.keys(productUpdate).includes(field)) {
          console.log(`El campo ${field} no coincide con los campos del producto. Debe indicar los siguientes campos: code , title, descripcion , price, thumbnail y stock`);
          return;
        } else {
          productUpdate[field] = value;
          await fs.writeFile(this.path , JSON.stringify(getProductos, null, 2));
          console.log(`Se ha actualizado el producto con id ${id} y el campo ${field} ha sido modificado a ${value}.`);
        }
      }
    } catch (err) {
      console.log(`Error al leer el archivo: ${err}`);
    }
  }

  // Funcion para eliminar productos por ID
  async  deleteProduct(id) {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const getProductos = JSON.parse(data);
      const deleteindex = getProductos.findIndex((p) => p.id === id);
      if (deleteindex !== -1) {
        const deletedProducto = getProductos[deleteindex];
        getProductos.splice(deleteindex, 1);
        console.log("Se ha eliminado el producto con el ID : " + id)
        console.table(deletedProducto);
        console.log("Tabla Actualizada")
        console.table(getProductos);
        await fs.writeFile(this.path, JSON.stringify(getProductos, null, 2));

      } else {
        console.log(`No existe el producto con ID ${id}`);
      }
    } catch (err) {
      console.log(`Error al leer el archivo: ${err}`);
    }
  }

}
const producto = new ProductManager('./info.txt')

 
// Ejecucion de  "addProduct" para agregar nuevos productos al array original
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