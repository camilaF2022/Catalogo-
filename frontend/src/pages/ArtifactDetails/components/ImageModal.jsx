import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import CancelIcon from "@mui/icons-material/Cancel";

const ImageModal = ({ path }) => {
  const [open, setOpen] = useState(false);
  const [isWideImage, setIsWideImage] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageSize = (path) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      if (img.width / img.height > 2) {
        setIsWideImage(true);
      } else {
        setIsWideImage(false);
      }
    };
  };
  useEffect(() => {
    handleImageSize(path);
  }, [path]);
  return (
    <div>
      <CustomImage src={path} alt="lazy" onClick={handleOpen} />
      <CustomModal open={open} onClose={handleClose}>
        <CustomBox>
          <CancelIcon
            onClick={handleClose}
            style={{ cursor: "pointer", color: "white" }}
          />
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
