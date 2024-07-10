import React, { useState, useEffect } from "react";
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
import { allowedFileTypes } from "../Catalog/CreateArtifact";
import { useSnackBars } from "../../hooks/useSnackbars";

/**
 * UploadButton component for uploading files with additional functionalities:
 * - Supports single or multiple file uploads.
 * - Validates file types against allowed types.
 * - Displays current filename(s) or prompts for file upload.
 * - Enables clearing uploaded files.
 *
 * @param {string} label - The label for the upload button.
 * @param {string} name - The name attribute for file input.
 * @param {boolean} isMultiple - Flag indicating if multiple files can be uploaded.
 * @param {boolean} isRequired - Flag indicating if the file upload is required.
 * @param {function} setStateFn - Callback function to update state with uploaded file(s).
 * @param {string} initialFilename - Initial filename to display (if any).
 * @returns {JSX.Element} - Rendered UploadButton component.
 */
const UploadButton = ({
  label,
  name,
  isMultiple,
  isRequired,
  setStateFn,
  initialFilename = "",
}) => {
  const { addAlert } = useSnackBars();

  const [filename, setFilename] = useState(initialFilename);

  useEffect(() => {
    setFilename(initialFilename);
  }, [initialFilename]);

  const allowedTypesLabel = allowedFileTypes[name].join(", ");

  /**
   * Handles file upload event and validates file types.
   *
   * @param {string} inputName - The name attribute of the input element.
   * @param {FileList} files - List of selected files.
   */
  const handleUploadFile = (inputName, files) => {
    if (files.length === 0) return;

    // Get file types
    const fileTypes = Array.from(files).map((file) =>
      file.name.split(".").pop()
    );

    // Check if file type is allowed
    if (fileTypes.some((fileType) => !allowedFileTypes[inputName].includes(fileType.toLowerCase()))) {
      addAlert("Tipo de archivo no permitido");
      return;
    }

    // Save file(s) in state
    if (isMultiple) {
      const listOfFiles = Array.from(files);
      setFilename(listOfFiles.map((file) => file.name).join("\n"));
      setStateFn((prevState) => ({ ...prevState, [inputName]: listOfFiles }));
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

// Styled component for visually hidden input element
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
