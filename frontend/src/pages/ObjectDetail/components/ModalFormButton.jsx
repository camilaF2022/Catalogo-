import { useState } from 'react'
import { Modal,Button} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

/**
 * ModalFormButton Component
 *
 * Component that renders a button which, when clicked, opens a modal dialog.
 *
 * @param {string} text - Text to display on the button.
 * @param {ReactNode} children - Optional React component(s) to render inside the modal dialog.
 */
const ModalFormButton = ({text,children}) => {

    const [open, setOpen] = useState(false);

    /**
     * Opens the modal dialog.
     */
    const handleOpen = () => setOpen(true);

    /**
     * Closes the modal dialog.
     */
    const handleClose = () => setOpen(false);

    return (
        <div>
            {/* Button that triggers the modal */}
            <Button onClick={handleOpen} variant="contained"> {text} </Button>
            
            {/* Modal dialog */}
            <CustomModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    {/* Renders children inside the modal if provided */}
                {children && React.cloneElement(children, { handleClose })}
                </div>
            </CustomModal>
        </div>
    );

}

// Custom styled Modal component using MUI's styled function
const CustomModal = styled(Modal)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',

}))

export default ModalFormButton;