import { Julius_Sans_One } from "next/font/google";
import { useEffect, useState } from "react";




interface Paciente {
    cedula: string;
    nombre: string,
    apellido: string,
    telefono: string,
    fechaNacimiento: string,

}
const PacienteForm = () => {

    const [paciente, setPaciente] = useState<Paciente>({
        cedula: "",
        nombre: "",
        apellido: "",
        telefono: "",
        fechaNacimiento: "",
    });
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: any) => {
        e.prevenDefaut();
        setPaciente({
            cedula: e.target.cedula.value,
            nombre: e.target.nombre.value,
            apellido: e.target.apellido.value,
            telefono: e.target.telefono.value,
            fechaNacimiento: e.target.fechaNacimiento.value
        });
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
                <input type="number" name="number" placeholder="cedula" />
                <input type="text" name="nombre" placeholder="Nombre" />
                <input type="text" name="apellido" placeholder="Apellido" />
                <input type="text" name="celular" placeholder="Teléfono" />
                <input type="number" name="fechaNacimiento" placeholder="fechaNacimiento" />


                <button type="submit">Guardar</button>
            </form>
            {submitted && <div className="success-message">Record inserted successfully!</div>}
        </div>
    );

}
export default PacienteForm;
