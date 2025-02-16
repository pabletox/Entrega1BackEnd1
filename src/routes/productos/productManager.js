const fs = require('fs');

class ProductManager {

    constructor() {
        this.path = "./src/archivos/products.json"
    }

        async getProducts() {
        
            try{
                if(fs.existsSync(this.path)) {
                    return JSON.parse(await fs.promises.readFile(this.path,'utf-8'))
                }else{
                    return []
                }
            }catch(err){
                console.error("Error al obtener productos: ", err.message)
                return []
            }
        }

        async getProduct(id) {

            try{    
                let productos=await this.getProducts()

                let producto=productos.find(d=>d.id==id)

                if(producto){
                    return producto
                }else{
                    return null
                }
            }catch(err){
                console.error("Error al obtener producto: ", err.message)
                return []
            }

        }

        async addProduct(product) {

            try{
                let productos=await this.getProducts()

                let id=1
                if(productos.length>0){
                    id=Math.max(...productos.map(d=>d.id))+1
                }
                console.log(product)
                let newProduct = {id, ...product}
                productos.push(newProduct)

                await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'))
                return newProduct
            }catch(err){
                console.error("Error al agregar producto: ", err.message)
                return null
            }
           
        }

        async updateProduct(id, product) {

            try{
                let productos=await this.getProducts()

                let index=productos.findIndex(d=>d.id==id)

                if(index!=-1){
                    productos[index]={id, ...product}
                    await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'))
                    return productos[index]
                }else{
                    return null
                }
            }catch(err){
                console.error("Error al actualizar producto: ", err.message)
                return null
            }
        }

        async deleteProduct(id) {

            try{
                let productos=await this.getProducts()

                let index=productos.findIndex(d=>d.id==id)

                if(index!=-1){
                    let product=productos[index]
                    productos.splice(index,1)
                    await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'))
                    return "Borrado con exito"
                }else{
                    return null
                }
            }catch{
                console.error("Error al eliminar producto: ", err.message)
                return null
            }
        }

  
}

module.exports ={ProductManager}

/*  const test_products = async ()  =>{

let productos = new ProductManager()
console.log(await productos.getProducts())

productoNuevo = {
    "title": "title 3",
    "description": "description 3",
    "code": "code 3",
    "price": 150,
    "status": true,
    "stock": 7,
    "category": "category 3",
    "thumbnails": ["cambio 1", "cambio 2", "cambio 3"]
}

//await productos.addProduct(productoNuevo)
//await productos.addProduct(productoNuevo)
//await productos.updateProduct(1, productoNuevo)
//await productos.deleteProduct(1)

//console.log("await productos.getProducts()")
//console.log(await productos.getProducts())
//console.log("await productos.getProduct(1)")
//console.log(await productos.getProduct(1))


}

test_products()  */