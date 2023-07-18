import { useEffect, useState } from 'react';

interface Cita {
    date: string | null;
    medico: Medico;
    paciente: Paciente;
  }
  
  interface Medico {
    tarjetaProfesional: number;
    nombre: string;
    apellido: string,
    consultorio: string,
    telefono: string,
    email: string,
    especialidad: string,
    // Add more properties specific to the advisor if needed
  }
  
  interface Paciente {
    cedula: string;
    nombre: string,
    apellido: string,
    telefono: string,
    fechaNacimiento: string,
    // Add more properties specific to the student if needed
  }

const CitaTable = () => {
  const [cita, setCita] = useState<Cita[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/cita');
        const data = await response.json();

        const citaData = [];
        for (const cita of data._embedded.cita) {
          const medicoResponse = await fetch(cita._links.medico.href);
          if (!medicoResponse.ok) {
            continue
          }
          
          
          const medicoData = await medicoResponse.json();

          console.log(medicoData);

          const pacienteResponse = await fetch(cita._links.paciente.href);
          const pacienteData = await pacienteResponse.json();
          

          citaData.push({
            medico: medicoData,
            paciente: pacienteData,
            date: cita.date,
          });
        }

        setCita(citaData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Medico Nombre</th>
          <th>Paciente Nombre</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {cita.map((cita, index) => (
          <tr key={index}>
            <td>{cita.medico.nombre}</td>
            <td>{cita.paciente.nombre}</td>
            <td>{cita.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CitaTable;