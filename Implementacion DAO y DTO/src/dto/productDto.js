export default class ProductDTO {
    constructor(code, title, description, stock, id, price, thumbnail, session) {
      this.code = code;
      this.title = title;
      this.description = description;
      this.stock = stock;
      this.id = id;
      this.price = price;
      this.thumbnail = thumbnail;
  
      // Datos de session
      if (session) {
        this.userName = session.first_name;
        this.email = session.email;
        this.rol = session.rol;
        this.cartId = session.cartId;
      }
    }
  }
  