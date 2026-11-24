import http from '../api'

const URL = '/mascotas'

class MascotaService {
  getAllMascotas() {
    return http.get(URL)
  }

  getMascotaById(id) {
    return http.get(`${URL}/${id}`)
  }

  createMascota(mascota) {
    return http.post(URL, mascota)
  }

  updateMascota(id, mascota) {
    return http.put(`${URL}/${id}`, mascota)
  }

  deleteMascota(id) {
    return http.delete(`${URL}/${id}`)
  }
}

export default new MascotaService()
