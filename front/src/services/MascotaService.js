import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/mascotas';

class MascotaService {
  getAllMascotas() {
    return axios.get(BASE_URL);
  }

  getMascotaById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  createMascota(mascota) {
    return axios.post(BASE_URL, mascota);
  }

  updateMascota(id, mascota) {
    return axios.put(`${BASE_URL}/${id}`, mascota);
  }

  deleteMascota(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new MascotaService();
