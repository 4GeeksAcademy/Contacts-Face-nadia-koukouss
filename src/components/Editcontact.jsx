import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"; // Importa el custom hook del estado global
import { addContact, updateContact } from "../components/contactService.js"; // Asegúrate de tener estas funciones

export const Editcontact = () => {
    const { id } = useParams(); // Obtiene el ID del parámetro de la URL si estamos editando
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    // Define un estado inicial vacío para los datos del formulario
    const emptyFormData = {
        full_name: "",
        email: "",
        phone: "",
        address: "",
        agenda_slug: "my_agenda" // ¡Importante! Asegúrate de que este slug coincida con el que usas en tu backend
    };

    const [formData, setFormData] = useState(emptyFormData); // Estado para los datos del formulario
    const [loading, setLoading] = useState(false); // Estado para indicar si la operación está en curso
    const [error, setError] = useState(null);       // Estado para almacenar errores de la operación

    // Determina si estamos en modo edición (si hay un ID en la URL)
    const isEditing = id !== undefined;

    // Efecto para cargar los datos del contacto si estamos editando
    useEffect(() => {
        if (isEditing) {
            // Busca el contacto en el store global para pre-llenar el formulario
            const contactToEdit = store.contacts.find((contact) => contact.id === parseInt(id));

            if (contactToEdit) {
                // Establece los datos del formulario con la información del contacto existente
                setFormData({
                    full_name: contactToEdit.full_name,
                    email: contactToEdit.email,
                    phone: contactToEdit.phone,
                    address: contactToEdit.address,
                    agenda_slug: contactToEdit.agenda_slug || "my_agenda", // Asegura que el slug se mantenga si ya existe
                });
            } else {
                console.warn(`Contacto con ID ${id} no encontrado en el store. Redirigiendo a home.`);
                // Si el contacto no se encuentra en el store (ej. se recargó la página directamente en /editcontact/:id),
                // podrías considerar hacer una llamada a la API aquí para obtenerlo si es necesario,
                // o simplemente redirigir si no es crítico.
                navigate("/"); 
            }
        } else {
            setFormData(emptyFormData); // Si no estamos editando, reinicia el formulario
        }
    }, [id, isEditing, store.contacts, navigate, dispatch]); // Añadido 'dispatch' a las dependencias por buena práctica, aunque no cambia aquí.

    /**
     * Maneja los cambios en los campos del formulario.
     * @param {object} e El evento de cambio.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Maneja el envío del formulario, añadiendo o actualizando un contacto.
     * @param {object} e El evento de envío.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        setLoading(true); // Activa el estado de carga
        setError(null);   // Limpia errores anteriores

        try {
            let result;
            if (isEditing) {
                // Llama a la función de actualización del servicio de API
                result = await updateContact(parseInt(id), formData);
                // Despacha la acción para actualizar el contacto en el store
                dispatch({ type: "UPDATE_CONTACT", payload: { id: parseInt(id), updatedContact: result } });
                console.log("Contacto actualizado exitosamente:", result);
            } else {
                // Llama a la función de añadir del servicio de API
                result = await addContact(formData);
                // Despacha la acción para añadir el nuevo contacto al store
                dispatch({ type: "ADD_CONTACT", payload: result });
                console.log("Contacto añadido exitosamente:", result);
            }
            navigate("/"); // Redirige a la página principal después de la operación exitosa
        } catch (err) {
            console.error("Error al enviar el contacto:", err);
            // Establece el mensaje de error para mostrar al usuario
            setError(`Falló al ${isEditing ? "actualizar" : "añadir"} el contacto: ${err.message}`);
        } finally {
            setLoading(false); // Desactiva el estado de carga
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">
                {isEditing ? "Edit Contact" : "Add a new contact"}
            </h1>

            {/* Muestra un mensaje de error si existe */}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
                <div className="mb-3">
                    <label htmlFor="full_name" className="form-label">
                        Full Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                        Phone
                    </label>
                    <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        Address
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                    {loading ? "Saving..." : (isEditing ? "Update Contact" : "Save")}
                </button>

                <Link to="/" className="text-decoration-none d-block text-center">
                    or get back to contacts
                </Link>
            </form>
        </div>
    );
};