import React, { useState } from "react";
import {
  Button,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Clear from "@mui/icons-material/Clear";
import useSnackBars from "../../../hooks/useSnackbars";
import { allowedFileTypes } from "../CreateItem";

/**
 * UploadButton Component
 *
 * Component for uploading files with UI to display selected file(s).
 *
 * @param {string} label - Label text for the upload button.
 * @param {string} name - Name attribute for the input element.
 * @param {boolean} isMultiple - Indicates if multiple files can be uploaded.
 * @param {boolean} isRequired - Indicates if the file upload is required.
 * @param {function} setStateFn - Function to update the state with the selected file(s).
 */
const UploadButton = ({ label, name, isMultiple, isRequired, setStateFn }) => {
  const { addAlert } = useSnackBars();

  const [filename, setFilename] = useState(""); // State to store the filename(s) for display

  // Allowed file types based on input name
  const allowedTypesLabel = allowedFileTypes[name].join(", ");

  // Function to handle file upload
  const handleUploadFile = (inputName, files) => {
    if (files.length === 0) return;

    // Get types (file extensions)
    const fileTypes = Array.from(files).map((file) =>
      file.name.split(".").pop()
    );

    const expectedFileTypes = allowedFileTypes[inputName];

    // Check if file type is allowed
    if (fileTypes.some((fileType) => !expectedFileTypes.includes(fileType))) {
      addAlert("Tipo de archivo no permitido");
      return;
    }

    // Save file in state
    if (inputName === "images") {
      const images = Array.from(files);
      setFilename(images.map((image) => image.name).join("\n"));
      setStateFn((prevState) => ({ ...prevState, [inputName]: images }));
      return;
    }
    const file = files[0];
    setFilename(file.name);
    setStateFn((prevState) => ({ ...prevState, [inputName]: file }));
  };

  return (
    <Grid container direction="column" rowGap={2}>
      <Grid item>
        <FormLabel component="legend">{label}</FormLabel>
      </Grid>
      <Grid item>
        {!filename ? (
          <Button
            fullWidth
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            {isMultiple
              ? `Subir archivo(s) (${allowedTypesLabel})`
              : `Subir archivo (${allowedTypesLabel})`}
            <VisuallyHiddenInput
              type="file"
              name={name}
              multiple={isMultiple}
              required={isRequired}
              onChange={(e) => handleUploadFile(e.target.name, e.target.files)}
            />
          </Button>
        ) : (
          <TextField
            fullWidth
            size="small"
            disabled
            required={isRequired}
            multiline={isMultiple}
            value={filename}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Clear file"
                    onClick={() => {
                      setFilename("");
                      setStateFn((prevState) => ({
                        ...prevState,
                        [name]: isMultiple ? [] : "",
                      }));
                    }}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      </Grid>
    </Grid>
  );
};

// Styling for visually hidden input field
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default UploadButton;
