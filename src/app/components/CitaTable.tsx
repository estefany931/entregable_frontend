import { useEffect, useState } from 'react';

interface Cita {
    fecha_cita: string | null;
    medico: Medico;
    paciente: Paciente;
  }
  
  interface Medico {
    nombre: string;
    // Add more properties specific to the advisor if needed
  }
  
  interface Paciente {
    nombre: string,
    // Add more properties specific to the student if needed
  }

const CitaTable = () => {
  const [cita, setCita] = useState<Cita[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/citas');
        const data = await response.json();
        console.log('data ---->',data);
        
        const citaData = [];
        for (const cita of data._embedded.citas) {
          const medicoResponse = await fetch(cita._links.medico.href);
          if (!medicoResponse.ok) {
            continue
          }
          
          
          const medicoData = await medicoResponse.json();

          const pacienteResponse = await fetch(cita._links.paciente.href);
          const pacienteData = await pacienteResponse.json();
          

          citaData.push({
            medico: medicoData,
            paciente: pacienteData,
            fecha_cita: cita.fecha_cita,
          });
        }
        console.log('cita dta----->',citaData);
        
        setCita(citaData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
//estilos
  return (
    <table className="min-w-full">
      <thead className="bg-white border-b">
        <tr>
          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Medico</th>
          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Paciente </th>
          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Fecha Cita</th>
        </tr>
      </thead>
      <tbody>
        {cita.map((cita, index) => (
          <tr key={index} className="bg-gray-100 border-b">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cita.medico.nombre}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cita.paciente.nombre}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cita.fecha_cita}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CitaTable;