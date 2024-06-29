import React, { useState } from "react";
import { Grid, IconButton, Button, Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from "@mui/material/styles";

const ImageUploader = ({ initialImages, onImagesChange }) => {
  const [initialPreviews, setInitialPreviews] = useState(initialImages);
  const [newPreviews, setNewPreviews] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const handleImageUpload = (e) => {
    const newFilesArray = Array.from(e.target.files);
    const newPreviewsArray = newFilesArray.map((file) => URL.createObjectURL(file));

    setNewFiles([...newFiles, ...newFilesArray]);
    setNewPreviews([...newPreviews, ...newPreviewsArray]);

    // Update the parent component with both initial and new files
    onImagesChange({ initial: initialPreviews, new: [...newFiles, ...newFilesArray] });
  };

  const handleInitialImageRemove = (index) => {
    const updatedInitialPreviews = initialPreviews.filter((_, i) => i !== index);

    setInitialPreviews(updatedInitialPreviews);

    // Update the parent component with the remaining initial images and new files
    onImagesChange({ initial: updatedInitialPreviews, new: newFiles });
  };

  const handleNewImageRemove = (index) => {
    const updatedNewPreviews = newPreviews.filter((_, i) => i !== index);
    const updatedNewFiles = newFiles.filter((_, i) => i !== index);

    setNewPreviews(updatedNewPreviews);
    setNewFiles(updatedNewFiles);

    // Update the parent component with the remaining initial images and new files
    onImagesChange({ initial: initialPreviews, new: updatedNewFiles });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {initialPreviews.map((preview, index) => (
          <Grid item key={index}>
            <Box position="relative">
              <img src={preview} alt={`image-${index}`} width="100" height="100" />

              <CustomIconButton onClick={() => handleInitialImageRemove(index)}>
                <DeleteIcon />
              </CustomIconButton>
              
            </Box>
          </Grid>
        ))}
        {newPreviews.map((preview, index) => (
          <Grid item key={index + initialPreviews.length}>
            <Box position="relative">
              <img src={preview} alt={`image-${index}`} width="100" height="100" />
              <CustomIconButton onClick={() => handleNewImageRemove(index)}>
                <DeleteIcon />
              </CustomIconButton>
            </Box>
          </Grid>
        ))}
        <Grid item>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            cargar mas imagenes
            <input
              type="file"
              multiple
              hidden
              onChange={handleImageUpload}
            />
          </Button>
        </Grid>
      </Grid>
    </Box>
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
