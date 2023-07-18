import React, { useEffect, useState } from "react";
import "./AdvisorForm.css"; // Import CSS for animation

interface cita {
    idCita: number;
    cedula: string;
    tarjeta_profesional: string;
}

interface Medico {
    nombre: string;
    apellido:string;
    email: string;
    phone: string;
    consultorio: string;
    especialidad: string;
    tarjeta_profesional: string;
    _links: Record<string, { href: string }>;
}

interface Paciente {
    _links: any;
    cedula: string;
    nombre: string,
    apellido: string,
    telefono: string,
    fechaNacimiento: string,
}

const citaForm = () => {
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


        const cita: cita = ({
            cedula: e.target.cedula.value,
            tarjeta_profesional: e.target.tarjeta_profesional.value,
            idCita: e.target.id_cita.value,
        });


        try {
            const response = await fetch("http://localhost:8080/cita", {
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
            <form onSubmit={handleSubmit}>
                <select name="paciente">
                    <option value="0">Seleccione un Estudiante</option>
                    {paciente.map((paciente) => (
                        <option key={getIdPaciente(paciente._links.paciente.href)} value={paciente._links.paciente.href}>
                            {paciente.nombre}
                        </option>
                    ))}
                </select>
                <select name="medico">
                    <option value="0">Seleccione un Consejero</option>
                    {medico.map((medico) => (
                        <option key={medico._links.advisor.href} value={medico._links.advisor.href}>
                            {medico.nombre}
                        </option>
                    ))}
                </select>
                <input type="date" name="date" placeholder="Fecha" />
                <button type="submit">Guardar</button>
            </form>
            {submitted && <div className="success-message">Record inserted successfully!</div>}
        </div>
    );
};

export default citaForm;