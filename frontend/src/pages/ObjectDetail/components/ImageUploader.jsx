import React, { useState } from "react";
import { Grid, IconButton, Button, Box, FormLabel } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { useSnackBars } from "../../../hooks/useSnackbars";

const ImageUploader = ({
  label,
  name,
  images,
  onListChange,
  allowedImageTypes,
}) => {
  const { addAlert } = useSnackBars();
  const imageURLs = images.map((fileOrUrlString) => {
    if (fileOrUrlString instanceof File) {
      return URL.createObjectURL(fileOrUrlString);
    }
    return fileOrUrlString;
  });

  const allowedTypesLabel = allowedImageTypes.join(", ");

  const handleImageUpload = (e) => {
    const newFilesArray = Array.from(e.target.files);
    // Get types
    const fileTypes = newFilesArray.map((file) => file.name.split(".").pop());
    const expectedFileTypes = allowedImageTypes;
    // Check if file type is allowed
    if (fileTypes.some((fileType) => !expectedFileTypes.includes(fileType))) {
      addAlert("Tipo de archivo no permitido");
      return;
    }
    onListChange((prevState) => ({
      ...prevState,
      [name]: [...images, ...newFilesArray],
    }));
  };

  const handleDeleteImage = (index) => {
    const imagesWithoutRemovedIndex = images.filter((_, i) => i !== index);
    onListChange((prevState) => ({
      ...prevState,
      [name]: imagesWithoutRemovedIndex,
    }));
  };

  return (
    <Grid container rowGap={2}>
      <FormLabel component="legend">{label}</FormLabel>
      <Grid container rowGap={2}>
        <Grid item>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Cargar más imágenes ({allowedTypesLabel})
            <input type="file" multiple hidden onChange={handleImageUpload} />
          </Button>
        </Grid>
        <Grid container spacing={2}>
          {imageURLs.map((preview, index) => (
            <Grid item key={index}>
              <Box position="relative">
                <img
                  src={preview}
                  alt={`image-${index}`}
                  width="100"
                  height="100"
                />
                <CustomIconButton onClick={() => handleDeleteImage(index)}>
                  <DeleteIcon />
                </CustomIconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 4,
  right: 4,
  width: 24,
  height: 24,
  padding: 0,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: "50%",
  color: "red",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
}));

export default ImageUploader;
