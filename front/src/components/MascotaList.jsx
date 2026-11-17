import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MascotaService from '../services/MascotaService';

const MascotaList = () => {
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    fetchMascotas();
  }, []);

  const fetchMascotas = () => {
    MascotaService.getAllMascotas().then(response => {
      setMascotas(response.data);
    }).catch(error => {
      console.log('Error al cargar mascotas:', error);
    });
  };

  const deleteMascota = (id) => {
    MascotaService.deleteMascota(id).then(() => {
      fetchMascotas();
    }).catch(error => {
      console.log('Error al eliminar mascota:', error);
    });
  };

  return (
    <section className="contenedor-formulario">
      <h1 className="titulo-azul">Mascotas registradas</h1>
      <Link to="/mascotas/nueva" className="btn boton-verde mb-3">Registrar mascota</Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especie</th>
            <th>Dueño</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mascotas.map(mascota => (
            <tr key={mascota.id}>
              <td>{mascota.nombre}</td>
              <td>{mascota.especie}</td>
              <td>{mascota.dueno}</td>
              <td>
                <Link to={`/mascotas/editar/${mascota.id}`} className="btn btn-sm btn-outline-primary me-2">Editar</Link>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteMascota(mascota.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default MascotaList;
