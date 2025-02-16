const fs = require('fs');

class CartManager {
  constructor() {
    this.path = "./src/archivos/carts.json"
  }

  async getcarts() {
        try {
            if (fs.existsSync(this.path)) {
                return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            }else{
                return []
            }
        }catch(err){
            console.error("Error al obtener carritos: ", err.message)
            return []
        }
    }  

  async getcart(cartId) {
    try {
      if (fs.existsSync(this.path)) {
        const carts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))    
        return carts.find(cart => cart.idCart == cartId)    
      }else{
        return []
      }
    } catch (err) {
      console.error("Error al obtener carrito: ", err.message)
      return []
    }

  }


  //crea un carro vacio
  async addCart() {
    try {
      let carts = await this.getcarts()
      let idCart = 1
      if (carts.length > 0) {
        idCart = Math.max(...carts.map(cart => cart.idCart)) + 1
      }
      let newCart = { "idCart":idCart, "productos": [] }
      carts.push(newCart)
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))
      return newCart
    } catch (err) {
      console.error("Error al agregar carrito: ", err.message)
      return null
    }
    
  }

    async addProductToCart(cartId, productId, qty=1) { 
        try {
            let carts = await this.getcarts()
            let cart = carts.find(cart => cart.idCart == cartId)
            if (cart) {
                let product = cart.productos.find(product => product.idProducto == productId)
                if (product) {
                    product.quantity += qty
                    let index = cart.productos.findIndex(product => product.idProducto == productId)
                    cart.productos[index].quantity = product.quantity

                } else {
                    cart.productos.push({ idProducto: productId, quantity: qty })
                }
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))
            } else {
                console.error("Carrito no encontrado")
            }
        } catch (err) {
            console.error("Error al agregar producto al carrito: ", err.message)
        }
        
    }


} 


module.exports ={CartManager}
/* 
const pruebaCart = async () => {
    const cartManager = new CartManager();
 //   const cart = await cartManager.getcart(2);
 //   console.log("trae carrito id: 2");
 //   console.log(JSON.stringify(cart));

    const newCart = await cartManager.addCart([]);
    console.log("Nuevo carrito agregado");
    console.log(JSON.stringify(newCart.idCart));

    
    await cartManager.addProductToCart(Number(newCart.idCart), 1,5);


} 

pruebaCart();*/