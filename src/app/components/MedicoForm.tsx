import { useEffect, useState } from "react";

interface Especialidad {
  nombre: string;
  _links: Record<string, { href: string }>;
  code: number;
}

interface Medico {
  tarjetaProfesional: number;
  nombre: string;
  apellido: string;
  consultorio: string;
  telefono: string;
  email: string;
  especialidad: string;
  // Add more properties specific to the student if needed

}
const MedicoForm = () => {
  const [especialidad, setEspecialidad] = useState<Especialidad[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const medico: Medico = {
      tarjetaProfesional: e.target.tarjetaProfesional.value,
      nombre: e.target.nombre.value,
      apellido: e.target.apellido.value,
      consultorio: e.target.consultorio.value,
      telefono: e.target.telefono.value,
      email: e.target.email.value,
      especialidad: e.target.especialidad.value,
    };

    try {
      const response = await fetch("http://localhost:8080/medico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medico),
      });

      const data = await response.json();
      console.log(data);

      e.target.reset(); // Clear the form
      setSubmitted(true); // Set the submitted state to true
      setTimeout(() => setSubmitted(false), 10000); // Reset the submitted state after 3 second
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchEspecialidad = async () => {
      try {
        const response = await fetch("http://localhost:8080/especialidad");
        const data = await response.json();
        console.log(data);

        setEspecialidad(data._embedded.especialidad);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEspecialidad();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="tarjetaProfesional"
          placeholder="Tarjeta Profesional"
        />
        <input type="text" name="nombre" placeholder="Nombre" />
        <input type="text" name="apellido" placeholder="Apellido" />
        <input type="email" name="email" placeholder="Correo" />
        <input type="text" name="telefono" placeholder="Teléfono" />
        <input type="text" name="consultorio" placeholder="consultorio" />
        <select name="especialidad">
          <option value="" key="">
            Seleccione un Esecialidad
          </option>
          {especialidad.map((especialidad) => (
            <option
              key={especialidad.code}
              value={especialidad._links.especialidad.href}
            >
              {especialidad.nombre}
            </option>
          ))}
        </select>
        <button type="submit">Guardar</button>
      </form>
      {submitted && (
        <div className="success-message">Record inserted successfully!</div>
      )}
    </div>
  );
};
export default MedicoForm;
