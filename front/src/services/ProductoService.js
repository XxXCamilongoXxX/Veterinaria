import http from '../api'

const URL = '/productos'

class ProductoService {
  getAllProductos() {
    return http.get(URL)
  }

  getProductoById(id) {
    return http.get(`${URL}/${id}`)
  }

  createProducto(producto) {
    return http.post(URL, producto)
  }

  updateProducto(id, producto) {
    return http.put(`${URL}/${id}`, producto)
  }

  deleteProducto(id) {
    return http.delete(`${URL}/${id}`)
  }
}

export default new ProductoService()
