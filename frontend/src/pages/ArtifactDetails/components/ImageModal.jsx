import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import CancelIcon from "@mui/icons-material/Cancel";

/**
 * ImageModal component displays an image in a modal.
 * @param {string} path - The URL or path of the image to display.
 */
const ImageModal = ({ path }) => {
  // State variables
  const [open, setOpen] = useState(false); // Controls modal open state
  const [isWideImage, setIsWideImage] = useState(false); // Indicates if image is wide

  // Opens the modal
  const handleOpen = () => setOpen(true);

  // Closes the modal
  const handleClose = () => setOpen(false);

  // Determines if the image is wide based on its dimensions
  const handleImageSize = (path) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      if (img.width / img.height > 2) {
        setIsWideImage(true); // Sets isWideImage to true if image is wide
      } else {
        setIsWideImage(false); // Sets isWideImage to false if image is not wide
      }
    };
  };
  
   // Effect hook to handle changes in the path prop
  useEffect(() => {
    handleImageSize(path); // Calls handleImageSize when path changes
  }, [path]);
  
  // Renders the component
  return (
    <div>
      {/* Image displayed as a clickable thumbnail */}
      <CustomImage src={path} alt="lazy" onClick={handleOpen} />

      {/* Modal dialog for displaying the image */}
      <CustomModal open={open} onClose={handleClose}>
        <CustomBox>
          {/* Close icon */}
          <CancelIcon
            onClick={handleClose}
            style={{ cursor: "pointer", color: "white" }}
          />
          
          {/* Container for the image */}
          <ImageContainer
            iswideimage={isWideImage ? isWideImage.toString() : undefined}
          >
            <img
              src={path}
              loading="lazy"
              alt="ImageModal"
              onClick={handleOpen}
            />
          </ImageContainer>
        </CustomBox>
      </CustomModal>
    </div>
  );
};
// Styled components

// Styled image thumbnail
const CustomImage = styled("img")(() => ({
  cursor: "pointer",
  width: "100%",
  height: "100%",
  objectFit: "cover",
}));

// Styled box container for modal content
const CustomBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "end",
  justifyContent: "center",
  backgroundColor: "black",
  padding: theme.spacing(1),
}));

// Styled modal dialog
const CustomModal = styled(Modal)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

// Styled container for the image within the modal
const ImageContainer = styled(Box)(({ theme, iswideimage }) => ({
  padding: theme.spacing(4),
  display: "flex",
  height: theme.spacing(75),
  width: theme.spacing(50),
  overflow: iswideimage ? "auto" : "hidden",
  justifyContent: iswideimage ? "flex-start" : "center",
  [theme.breakpoints.up("sm")]: {
    width: theme.spacing(68.5),
  },
  [theme.breakpoints.up("md")]: {
    width: theme.spacing(107.5),
  },
  [theme.breakpoints.up("lg")]: {
    width: theme.spacing(143.75),
  },
}));

export default ImageModal;
