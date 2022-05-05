const express = require('express')
const { Router } = express
const multer = require('multer')
const archivo1 = require('./contenedor.js')
const app = express()
const Contenedor = require('./contenedor.js')
const rProductos = new Router();

// multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
const upload = multer({ storage: storage })
app.post('/subir', upload.single('archivo'), (req,res) => {
    console.log(req.file)
    res.send('Subido correctamente')
})



app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



rProductos.get('/', async (req, res) => {
    const objeto = await Contenedor.getAll()
    res.send(objeto)
})


rProductos.get('/:id', async (req, res) => {

    const obj = await Contenedor.getAll()
    const { id } = req.params
    let object = await Contenedor.getById(id)

    if (isNaN(id)) {
        return res.send({ error: 'El caracter ingresado no es un número' })
    }

    if (id < 1 || id > obj.length) {
        return res.send({ error: 'El numero introducido está fuera de rango' })
    }
    res.json(object)
})


rProductos.post('/', async (req, res) => {
    const { name, price, thumbnail } = req.body
    const add = await Contenedor.save({ name, price, thumbnail })
    res.send(add)
})

rProductos.delete('/:id', async (req, res) => {
    const all = await Contenedor.getAll()
    const { id } = req.params
    let deleted = await Contenedor.deleteById(id)

    if (isNaN(id)) {
        return res.send({ error: 'El caracter ingresado no es un número' })
    }

    if (id < 1 || id > all.length) {
        return res.send({ error: 'El numero introducido está fuera de rango' })
    }
    res.json(deleted)
})


rProductos.put('/:id', async (req, res) => {
    const objput = await Contenedor.getAll()
    const { id } = req.params
    const { name, price, thumbnail } = req.body
    let objectput = await Contenedor.updateById({id, name, price, thumbnail})

    if (isNaN(id)) {
        return res.send({ error: 'El caracter ingresado no es un número' })
    }

    if (id < 1 || id > objput.length) {
        return res.send({ error: 'El numero introducido está fuera de rango' })
    }
    res.json(objectput)
})

app.use('/api/productos', rProductos)

const PORT = 8000
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))





