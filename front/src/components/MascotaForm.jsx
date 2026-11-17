import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MascotaService from '../services/MascotaService';

const MascotaForm = () => {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('Perro');
  const [dueno, setDueno] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      MascotaService.getMascotaById(id).then(response => {
        setNombre(response.data.nombre);
        setEspecie(response.data.especie);
        setDueno(response.data.dueno);
      });
    }
  }, [id]);

  const saveOrUpdateMascota = (e) => {
    e.preventDefault();
    const mascota = { nombre, especie, dueno };

    if (id) {
      MascotaService.updateMascota(id, mascota).then(() => {
        navigate('/mascotas');
      });
    } else {
      MascotaService.createMascota(mascota).then(() => {
        navigate('/mascotas');
      });
    }
  };

  return (
    <section className="contenedor-formulario">
      <h1 className="titulo-azul">{id ? 'Editar mascota' : 'Registrar mascota'}</h1>
      <form className="formulario" onSubmit={saveOrUpdateMascota}>
        <div className="grupo-form">
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="grupo-form">
          <label>Especie:</label>
          <select value={especie} onChange={(e) => setEspecie(e.target.value)}>
            <option>Perro</option>
            <option>Gato</option>
            <option>Conejo</option>
            <option>Ave</option>
          </select>
        </div>
        <div className="grupo-form">
          <label>Dueño:</label>
          <input
            type="text"
            value={dueno}
            onChange={(e) => setDueno(e.target.value)}
            required
          />
        </div>
        <button className="btn boton-verde" type="submit">{id ? 'Actualizar' : 'Guardar'}</button>
      </form>
    </section>
  );
};

export default MascotaForm;
