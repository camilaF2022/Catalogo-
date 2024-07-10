import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack, Paper, InputLabel, Select } from "@mui/material";
import useSnackBars from "../../../hooks/useSnackbars";

/**
 * DownloadForm Component
 *
 * Component for downloading artifact data after filling out a request form.
 * Handles form submission, data download, and user notifications.
 *
 * @param {object} pieceInfo - Information about the artifact to download.
 * @param {function} handleClose - Function to close the form dialog.
 */
const DownloadForm = ({ pieceInfo, handleClose }) => {
  const { addAlert } = useSnackBars();

  // State to manage form input values
  const [formValues, setFormValues] = useState({
    fullName: "",
    rut: "",
    email: "",
    institution: "",
    description: "",
  });

   // Function to update form values on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Function to download a file from a Blob object
  const downloadFile = (resourceBlob, downloadName) => {
    const url = URL.createObjectURL(resourceBlob);
    var link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    link.click();
    link.remove();
  }

  // Function to handle the download process
  const handleDownload = () => {
    // Download metadata as JSON
    const jsonObj = {
      attributes: pieceInfo.attributes,
    };

    const jsonStr = JSON.stringify(jsonObj);
    const jsonBlob = new Blob([jsonStr], { type: "application/json" });
    downloadFile(jsonBlob, "metadata.json");

    // Download model, material, and textures
    fetch(pieceInfo.model.object)
      .then((response) => response.blob()).then((response) =>
        downloadFile(response, pieceInfo.model.object.split("/").pop())
      )

    fetch(pieceInfo.model.material)
      .then((response) => response.blob())
      .then((response) => downloadFile(response, pieceInfo.model.material.split("/").pop()));

    fetch(pieceInfo.model.texture)
      .then((response) => response.blob())
      .then((response) => downloadFile(response, pieceInfo.model.texture.split("/").pop()));

    // Download images
    pieceInfo.images.map((image, index) => {
      fetch(image).then((response) => response.blob())
        .then((response) =>
          downloadFile(response, image.split("/").pop())
        )
      return null;
    });

  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Request sent to the server", formValues);
    addAlert("¡Solicitud enviada con éxito! La descarga comenzará pronto.");
    handleDownload(); // Initiate download process
    handleClose(); // Close the form dialog
  };

  return (
    <Paper>
      <CustomStack>
        <CustomBox
          component="form"
          autoComplete="off"
          onChange={handleChange}
          onSubmit={handleSubmit}
        >
          {/* Title */}
          <CustomTypography variant="h6">
            Para descargar los datos debe llenar este formulario de solicitud
          </CustomTypography>

          {/* Form fields */}
          <Stack>
            <InputLabel>
              <b>Nombre Completo *</b>
            </InputLabel>
            <TextField
              required
              id="nombreCompleto"
              name="fullName"
              label="Nombre y Apellido"
              margin="normal"
              value={formValues.fullName}
            />
          </Stack>

          <Stack>
            <InputLabel>
              <b>Rut *</b>
            </InputLabel>
            <TextField
              required
              id="rut"
              name="rut"
              label="Rut"
              margin="normal"
              value={formValues.rut}
            />
          </Stack>

          <Stack>
            <InputLabel>
              <b>Correo Electrónico*</b>
            </InputLabel>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              type="email"
              margin="normal"
              value={formValues.email}
            />
          </Stack>
          <Stack>
            <InputLabel>
              <b>Institución *</b>
            </InputLabel>
            <Select
              // required
              id="institution"
              name="institution"
              label="Institucion"
              value={formValues.institution}
              // Add options and onChange handler as needed
            />
          </Stack>

          <Stack>
            <InputLabel>
              <b>Motivo de solicitud (Opcional)</b>
            </InputLabel>
            <TextField
              id="description"
              name="description"
              label="Comentario"
              multiline
              margin="normal"
              value={formValues.description}
            />
          </Stack>

          {/* Buttons */}
          <OptionBox>
            <CustomButton variant="outlined" color="primary" onClick={handleClose}>
              Cancelar
            </CustomButton>

            <CustomButton variant="contained" color="primary" type="submit" onClick={handleSubmit}>
              Enviar
            </CustomButton>
          </OptionBox>
        </CustomBox>
      </CustomStack>
    </Paper>
  );
};

// Styled Stack component for custom styling
const CustomStack = styled(Stack)(({ theme }) => ({
  justifyContent: "center",
  alignItems: "center",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

// Styled Typography component for custom styling of title
const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(3),
}));

// Styled Box component for custom styling of form container
const CustomBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

// Styled Button component for custom styling of buttons
const CustomButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3.5),
}));

// Styled Box component for custom styling of option buttons
const OptionBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "flex-end",
  padding: theme.spacing(3),
  gap: theme.spacing(2),
}));
export default DownloadForm;
