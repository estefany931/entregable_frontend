import { useEffect, useState } from "react";

interface Paciente {
  cedula: number;
  nombre: string;
  apellido: string;
  celular: string;
  fechaNacimiento: Date;
}
const PacienteForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const paciente: Paciente = {
      cedula: e.target.cedula.value,
      nombre: e.target.nombre.value,
      apellido: e.target.apellido.value,
      celular: e.target.celular.value,
      fechaNacimiento: e.target.fechaNacimiento.value,
    };

    try {
      const response = await fetch("http://localhost:8080/paciente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paciente),
      });

      const data = await response.json();
      console.log(data);

      e.target.reset(); // Clear the form
      setSubmitted(true); // Set the submitted state to true
      setTimeout(() => setSubmitted(false), 3000); // Reset the submitted state after 3 second
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="number" name="cedula" placeholder="Cedula" />
        <input type="text" name="nombre" placeholder="Nombre" />
        <input type="text" name="apellido" placeholder="Apellido" />
        <input type="text" name="celular" placeholder="Teléfono" />
        <input
          type="date"
          name="fechaNacimiento"
          placeholder="fecha de Nacimiento"
        />

        <button type="submit">Guardar</button>
      </form>
      {submitted && (
        <div className="success-message">Record inserted successfully!</div>
      )}
    </div>
  );
};
export default PacienteForm;
