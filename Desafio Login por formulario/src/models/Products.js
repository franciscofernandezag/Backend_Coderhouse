import { Schema, model } from "mongoose";
import paginate from 'mongoose-paginate-v2';

const productSchema = Schema({
    code: String,
    title: String,
    description: String,
    stock: Number,
    id: Number,
    status: Boolean,
    price: Number,
    thumbnail: String
});

productSchema.plugin(paginate);

const productModel = model("Product", productSchema);

export default productModel;
