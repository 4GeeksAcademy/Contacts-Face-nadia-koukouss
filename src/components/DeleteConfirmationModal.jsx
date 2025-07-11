import PropTypes from 'prop-types';

export const DeleteConfirmationModal = ({ show, onClose, onConfirm, message }) => {

    if (!show) {
        return null;
    }

    return (

        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered"
                style={{ marginTop: '-80px' }}
            >
                <div className="modal-content rounded-xl shadow-lg"> {/* Esquinas redondeadas y sombra */}
                    <div className="modal-header">
                        <h5 className="modal-title">¿Estas seguro de borrar?</h5> {/* Título del modal */}
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p> {/* Mensaje dinámico */}
                    </div>
                    <div className="modal-footer">
                        {/* Botón "Oh no!" para cancelar la acción */}
                        <button type="button" className="btn btn-outline-primary rounded-lg font-bold" onClick={onClose}>No</button>
                        {/* Botón "Yes baby!" para confirmar la acción */}
                        <button type="button" className="btn btn-danger rounded-lg font-bold" onClick={onConfirm}>Si</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Definición de PropTypes para validar las propiedades recibidas
DeleteConfirmationModal.propTypes = {
    show: PropTypes.bool.isRequired, // Indica si el modal debe mostrarse
    onClose: PropTypes.func.isRequired, // Función para cerrar el modal (cancelar)
    onConfirm: PropTypes.func.isRequired, // Función para confirmar la acción
    message: PropTypes.string.isRequired, // Mensaje a mostrar en el cuerpo del modal
};
