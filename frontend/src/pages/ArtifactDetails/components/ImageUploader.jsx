import React, { useMemo } from "react";
import { Grid, IconButton, Button, Box, FormLabel } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { useSnackBars } from "../../../hooks/useSnackbars";

/**
 * ImageUploader component allows users to upload and manage multiple images.
 * @param {string} label - The label for the image uploader.
 * @param {string} name - The name of the image uploader.
 * @param {Array<string | File>} images - The array of image URLs or File objects.
 * @param {Function} onListChange - Callback function triggered on image list change.
 * @param {Array<string>} allowedImageTypes - Array of allowed image file types.
 */
const ImageUploader = ({
  label,
  name,
  images,
  onListChange,
  allowedImageTypes,
}) => {
  const { addAlert } = useSnackBars();

  // Memoized array of image URLs from File objects
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

  // Comma-separated string of allowed image types
  const allowedTypesLabel = allowedImageTypes.join(", ");

  // Handles file upload event
  const handleImageUpload = (e) => {
    const newFilesArray = Array.from(e.target.files);

    // Check file types against allowed types
    const fileTypes = newFilesArray.map((file) => file.name.split(".").pop());
    const expectedFileTypes = allowedImageTypes;
    if (fileTypes.some((fileType) => !expectedFileTypes.includes(fileType))) {
      addAlert("Tipo de archivo no permitido");
      return;
    }

    // Update the list of images
    onListChange((prevState) => ({
      ...prevState,
      [name]: [...images, ...newFilesArray],
    }));
  };

  // Handles image deletion
  const handleDeleteImage = (index) => {
    const imagesWithoutRemovedIndex = images.filter((_, i) => i !== index);
    onListChange((prevState) => ({
      ...prevState,
      [name]: imagesWithoutRemovedIndex,
    }));
  };

  // Renders the component
  return (
    <Grid container rowGap={2}>
      <FormLabel component="legend">{label}</FormLabel>
      <Grid container rowGap={2}>
        <Grid item>
          {/* Upload button for selecting files */}
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
          {/* Displaying uploaded image previews */}
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

// Custom styled icon button for image deletion
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
