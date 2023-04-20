import { Router } from "express";
import { getProducts } from './ProductManager.js';


const productRouter = Router() //productRouter voy a definir mis rutas

productRouter.get("/", async (req, res) => {
    try {
        const products = await getProducts()
        res.send(products)
    } catch (error) {
        res.send(error)
    }

})



export default productRouter
