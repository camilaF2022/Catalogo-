import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import CancelIcon from "@mui/icons-material/Cancel";

/**
 * ImageModal component displays an image in a modal with an option to close.
 * It adjusts modal size based on image dimensions.
 * @param {string} path - The URL path to the image.
 * @returns {JSX.Element} Component for displaying an image in a modal.
 */
const ImageModal = ({ path }) => {

  // State variables for managing modal visibility and image size
  const [open, setOpen] = useState(false); // State for modal open/close
  const [isWideImage, setIsWideImage] = useState(false); // State for wide image detection

  
  // Opens the modal
  const handleOpen = () => setOpen(true);

  // Closes the modal
  const handleClose = () => setOpen(false);

  // Checks if the image is wide when loaded
  const handleImageSize = (path) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
    // Determines if the image is wide based on width to height ratio
      if (img.width / img.height > 2) {
        setIsWideImage(true);
      } else {
        setIsWideImage(false);
      }
    };
  };
  
  // Effect to handle image size when `path` prop changes
  useEffect(() => {
    handleImageSize(path);
  }, [path]);
  
  
  return (
    <div>
     {/* Image thumbnail that opens the modal */}
      <CustomImage src={path} alt="lazy" onClick={handleOpen} />
      {/* Modal that displays the image */}
      <CustomModal open={open} onClose={handleClose}>
        <CustomBox>
        {/* Close icon */}
          <CancelIcon
            onClick={handleClose}
            style={{ cursor: "pointer", color: "white" }}
          />
          {/* Image container */}
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

// Styled components for custom styling
const CustomImage = styled("img")(() => ({
  cursor: "pointer",
  width: "100%",
  height: "100%",
  objectFit: "cover",
}));

const CustomBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "end",
  justifyContent: "center",
  backgroundColor: "black",
  padding: theme.spacing(1),
}));

const CustomModal = styled(Modal)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

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
