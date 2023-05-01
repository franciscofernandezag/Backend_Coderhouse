const socket = io()

const Formproducto = document.getElementById("Formproducto")

Formproducto.addEventListener('submit', (e) => {
e.preventDefault()
const prodsIterator = new FormData(e.target)
const prod = Object.fromEntries(prodsIterator)
socket.emit("nuevoProducto", {prod})
})