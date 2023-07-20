import React, { useEffect, useState } from "react";
import "./MedicoForm.css"; // Import CSS for animation

interface Cita {
  paciente: string;
  medico: string;
  fecha_cita: Date;
}

interface Medico {
  nombre: string;
  apellido: string;
  email: string;
  phone: string;
  consultorio: string;
  especialidad: string;
  tarjeta_profesional: string;
  _links: Record<string, { href: string }>;
  //Agregar los datos necesarios
}

interface Paciente {
  cedula: number;
  nombre: string;
  apellido: string;
  telefono: string;
  fechaNacimiento: string;
  _links: Record<string, { href: string }>;
  //Agregar los datos necesarios
}

const CitaForm = () => {
  const [paciente, setPaciente] = useState<Paciente[]>([]);
  const [medico, setMedico] = useState<Medico[]>([]);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const response = await fetch("http://localhost:8080/paciente");
        const data = await response.json();
        setPaciente(data._embedded.paciente);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPaciente();
  }, []);

  useEffect(() => {
    const fetchMedico = async () => {
      try {
        const response = await fetch("http://localhost:8080/medico");
        const data = await response.json();
        setMedico(data._embedded.medico);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMedico();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const cita: Cita = {
      paciente: e.target.paciente.value,
      medico: e.target.medico.value,
      fecha_cita: e.target.fecha_cita.value,
    };

    try {
      const response = await fetch("http://localhost:8080/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cita),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        //Clear the form
        e.target.reset();

        //Disable the submit button
        e.target.disabled = true;

        setSubmitted(true); // Set the submitted state to true
        setTimeout(() => {
          setSubmitted(false); // Reset the submitted state after 3 seconds
          //Redirect to the list of counselings
          window.location.href = "/cita/list";
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Extract the student id from the href
  const getIdPaciente = (paciente: string) => {
    const pacienteHrefParts = paciente.split("/");
    const IdPaciente = pacienteHrefParts[pacienteHrefParts.length - 1];
    return IdPaciente;
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md"
      >
        <div className="mb-4">
          <select name="paciente">
            <option value="0">Seleccione un Paciente</option>
            {paciente.map((paciente) => (
              <option
                key={getIdPaciente(paciente._links.paciente.href)}
                value={paciente._links.paciente.href}
              >
                {paciente.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <select name="medico">
            <option value="0">Seleccione un Medico</option>
            {medico.map((medico) => (
              <option
                key={medico._links.medico.href}
                value={medico._links.medico.href}
              >
                {medico.nombre}
              </option>
            ))}
          </select>
        </div>

        <input type="date" name="fecha_cita" placeholder="Fecha" />
        <button type="submit">Guardar</button>
      </form>
      {submitted && (
        <div className="success-message">Record inserted successfully!</div>
      )}
    </div>
  );
};

export default CitaForm;
