import http from '../api'

const URL = '/servicios'

class ServicioService {
  getAllServicios() {
    return http.get(URL)
  }

  createServicio(servicio) {
    return http.post(URL, servicio)
  }

  updateServicio(id, servicio) {
    return http.put(`${URL}/${id}`, servicio)
  }

  deleteServicio(id) {
    return http.delete(`${URL}/${id}`)
  }
}

export default new ServicioService()
