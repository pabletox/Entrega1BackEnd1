const express = require('express')
const app = express()
const {ProductManager} = require('./DAO/productos/productManager')
const {CartManager} = require('./DAO/carrito/cartManager')

const PORT = 8080

const productosManager = new ProductManager()
const carritoManager = new CartManager()

//Midelware para poder trabajar con datos JSON
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Metodos HTTP

//GET productos
app.get('/api/products', async (req, res) => {
    try{
        const productos = await productosManager.getProducts()
        res.setHeader('Content-Type','application/json');
        res.json(productos)
    }catch(err){
        console.error("Error en la API: ", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
    
})

//get productos por id
app.get('/api/products/:id', async (req, res) => {
        const id = Number(req.params.id)

        if (!id){
            res.status(400).json({error: 'Id es requerido'})
            return
        }

        //validar si el id es un numero
        if (isNaN(id) || id < 1 ||!Number.isInteger(id)){
            res.status(400).json({error: 'Id debe ser Numero y positivo'})
            return
        }

        try{
            const producto = await productosManager.getProduct(id)

            if(producto){
                res.json(producto)
            }else{
                res.status(404).json({error: 'Producto no encontrado'})
            }
        }catch(err){
            console.error("Error en la API: ", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    
})

//POST para agregar producto
app.post('/api/products', async (req, res) => {
    const producto = req.body
    //ver si existe el producto por title
    const product = await productosManager.getProducts()
    const exist = product.find(p => p.title === producto.title)
    if(exist){
        
        return res.status(400).json({error: 'Producto ya existe'})
    }
    //sino lo agregamos
    const newProduct = await productosManager.addProduct(producto)
    if(newProduct){
        res.status(201).json(newProduct)
    }else{
        res.status(400).json({error: 'No se pudo agregar el producto'})
    }
})

//put para actualizar producto
app.put('/api/products/:id', async (req, res) => {
    const id = req.params.id
    const producto = req.body

    try{
        const product = await productosManager.getProduct(id)
        if(!product){
            res.status(204).json({error: 'Producto no encontrado'})
            return
        }else{
            const updatedProduct = await productosManager.updateProduct(id, producto)
            if(updatedProduct){
                res.status(200).json(updatedProduct)
            }
        }
    }catch(err){
        console.error("Error al obtener producto: ", err.message)
        return []
    }


    
})

//delete para borrar producto
app.delete('/api/products/:id', async (req, res) => {
    const id = req.params.id
    const deletedProduct = await productosManager.deleteProduct(id)
    if(deletedProduct){
        res.json(deletedProduct)
    }else{
        res.status(204).json({error: 'Producto no encontrado'})
    }
})

//get para carrito por id
app.get('/api/carts/:cid', async (req, res) => {
    const id = req.params.cid
    const cart = await carritoManager.getcart(id)
    if(cart){
        res.json(cart)
    }else{
        res.status(204).json({error: 'Carrito no encontrado'})
    }
})

//post crea carro vacio
app.post('/api/carts', async (req, res) => {
    const newCart = await carritoManager.addCart()
    if(newCart){
        res.status(201).json(newCart)
    }else{
        res.status(400).json({error: 'No se pudo agregar el carrito'})
    }
})

//post para agregar producto al carrito
app.post('/api/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid
    //revisar si carrito existe
    const cart = await carritoManager.getcart(cartId)
    if(!cart){
        res.status(204).json({error: 'Carrito no encontrado'})
        return
    }
    //revisar si producto existe
    const productId = req.params.pid
    const product = await productosManager.getProduct(productId)
    if(!product){
        res.status(204).json({error: 'Producto no encontrado'})
        return
    }
    //agregar producto al carrito
    await carritoManager.addProductToCart(cartId, productId)
    //revisar si se agrego el producto
    const updatedCart = await carritoManager.getcart(cartId)
    if(!updatedCart){
        res.status(204).json({error: 'Producto no agregado al carrito'})
    }else{
        res.status(201).json({message: 'Producto agregado al carrito'})
    }
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})