import { useState } from "react";
import { Modal, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";


/**
 * DownloadArtifactButton component renders a button that triggers a modal when clicked.
 * The modal displays content passed as children.
 * 
 * @param {string} text - Text to display on the button.
 * @param {ReactNode} children - Content to display inside the modal.
 */
const DownloadArtifactButton = ({ text, children }) => {

  // State to manage the open/close state of the modal
  const [open, setOpen] = useState(false);

  // Function to open the modal
  const handleOpen = () => setOpen(true);

  // Function to close the modal
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* Button that triggers the modal */}
      <Button onClick={handleOpen} variant="contained">
        {text}
      </Button>
      {/* Modal component with custom styling */}
      <CustomModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Render children inside the modal and pass handleClose function */}
        <div>{children && React.cloneElement(children, { handleClose })}</div>
      </CustomModal>
    </div>
  );
};

/**
 * CustomModal component is a styled MUI Modal that centers its content vertically and horizontally.
 */
const CustomModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

export default DownloadArtifactButton;
