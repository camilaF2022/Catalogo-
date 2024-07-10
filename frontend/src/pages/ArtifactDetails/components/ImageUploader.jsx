import React, { useMemo } from "react";
import { Grid, IconButton, Button, Box, FormLabel } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { useSnackBars } from "../../../hooks/useSnackbars";


/**
 * ImageUploader component allows users to upload and manage multiple images.
 * It displays uploaded images with an option to delete them.
 * @param {Object} props - Component props.
 * @param {string} props.label - Label for the image uploader component.
 * @param {string} props.name - Name identifier for the uploader component.
 * @param {Array} props.images - Array of currently uploaded images.
 * @param {Function} props.onListChange - Callback function to update the image list.
 * @param {Array} props.allowedImageTypes - Array of allowed image file types.
 * @returns {JSX.Element} Component for uploading and managing images.
 */
const ImageUploader = ({
  label,
  name,
  images,
  onListChange,
  allowedImageTypes,
}) => {
  const { addAlert } = useSnackBars();
  
  // Memoize image URLs to avoid unnecessary re-renders
  const imageURLs = useMemo(
    () =>
      images.map((fileOrUrlString) => {
        if (fileOrUrlString instanceof File) {
          return URL.createObjectURL(fileOrUrlString);
        }
        return fileOrUrlString;
      }),
    [images]
  );

// Concatenate allowed image types for display
  const allowedTypesLabel = allowedImageTypes.join(", ");

// Handle image upload event
  const handleImageUpload = (e) => {
    const newFilesArray = Array.from(e.target.files);
    
     // Extract file types from uploaded files
    const fileTypes = newFilesArray.map((file) => file.name.split(".").pop());
    const expectedFileTypes = allowedImageTypes;
    
    // Check if file type is allowed
    if (fileTypes.some((fileType) => !expectedFileTypes.includes(fileType))) {
      addAlert("Tipo de archivo no permitido");
      return;
    }
    
    // Update the image list with newly uploaded files
    onListChange((prevState) => ({
      ...prevState,
      [name]: [...images, ...newFilesArray],
    }));
  };

 // Handle image deletion
  const handleDeleteImage = (index) => {
    const imagesWithoutRemovedIndex = images.filter((_, i) => i !== index);
    
    // Update the image list by removing the selected image
    onListChange((prevState) => ({
      ...prevState,
      [name]: imagesWithoutRemovedIndex,
    }));
  };

  return (
    <Grid container rowGap={2}>
    {/* Label for the image uploader */}
      <FormLabel component="legend">{label}</FormLabel>
      <Grid container rowGap={2}>
        <Grid item>
        {/* Button to trigger file input */}
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
         {/* Display uploaded images with delete option */}
          {imageURLs.map((preview, index) => (
            <Grid item key={index}>
              <Box position="relative">
                <img
                  src={preview}
                  alt={`image-${index}`}
                  width="100"
                  height="100"
                />
                {/* Delete button for each image */}
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

// Custom styled IconButton for the delete button
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
