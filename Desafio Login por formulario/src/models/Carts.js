import { Schema, model } from "mongoose";
import paginate from 'mongoose-paginate-v2';

const cartSchema = new Schema({
  products: {
    "_id" :false, 
    type: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Product" // Utiliza el mismo nombre del modelo del producto
        },
        quantity: Number
      }
    ],
    default: []
  }
});

cartSchema.plugin(paginate);

const cartModel = model("Cart", cartSchema); // Utiliza el mismo nombre del modelo

export default cartModel;
