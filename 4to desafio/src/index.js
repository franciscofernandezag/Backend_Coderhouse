import express from 'express'
import productRouter from './routes/product.routes.js'

import { __dirname, __filename } from './path.js'
import { engine } from 'express-handlebars'
import * as path from 'path'
import { Server } from 'socket.io'


//Configuraciones
const app = express()
const PORT = 4000


const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

app.engine('handlebars', engine()) 
app.set('view engine', 'handlebars') 
app.set('views', path.resolve(__dirname, './views')) 

//Middleware
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 


//ServerIO

const io = new Server( server, {cors: {origin:"*",credentials: true}}) 

io.on('connection', (socket) => {
    console.log("Cliente conectado")
    socket.on("mensaje", info => {
        console.log(info)
        // mensajes.push(info)
        // io.emit("mensaje",  mensaje) 
    })
    socket.on("nuevoProducto",(prod) => {
        io.emit("nuevoProducto", prod)
    })
})


app.use((req, res, next) => {
    req.io =io
    return next()
})

//Routes
app.use('/product', productRouter)
app.use('/products', express.static(__dirname + '/public')) 

//4to Desafio 

  // Prueba 1 Crear vista home.handlears con listado de todos los productos   :
  //URL: http://localhost:4000/product

  // Prueba 2  Crear vista "realtimeProducts.handlebars"
  //URL: http://localhost:4000/product/realtimeproducts
  // Contiene formulario para agregar productos

