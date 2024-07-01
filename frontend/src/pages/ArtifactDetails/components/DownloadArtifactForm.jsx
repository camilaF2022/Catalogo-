import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack, Paper, InputLabel, Select } from "@mui/material";
import { useSnackBars } from "../../../hooks/useSnackbars";

const DownloadArtifactForm = ({ artifactInfo, handleClose }) => {
  const { addAlert } = useSnackBars();
  const [formValues, setFormValues] = useState({
    fullName: "",
    rut: "",
    email: "",
    institution: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const downloadFile = (resourceBlob, downloadName) => {
    const url = URL.createObjectURL(resourceBlob);
    var link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    link.click();
    link.remove();
  };

  const handleDownload = () => {
    // metadata
    const jsonObj = {
      attributes: artifactInfo.attributes,
    };
    const jsonStr = JSON.stringify(jsonObj);
    const jsonBlob = new Blob([jsonStr], { type: "application/json" });
    downloadFile(jsonBlob, "metadata.json");

    // model
    fetch(artifactInfo.model.object)
      .then((response) => response.blob())
      .then((response) =>
        downloadFile(response, artifactInfo.model.object.split("/").pop())
      );
    fetch(artifactInfo.model.material)
      .then((response) => response.blob())
      .then((response) =>
        downloadFile(response, artifactInfo.model.material.split("/").pop())
      );

    fetch(artifactInfo.model.texture)
      .then((response) => response.blob())
      .then((response) =>
        downloadFile(response, artifactInfo.model.texture.split("/").pop())
      );

    //images
    artifactInfo.images.map((image, index) => {
      fetch(image)
        .then((response) => response.blob())
        .then((response) => downloadFile(response, image.split("/").pop()));
      return null;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Request sent to the server", formValues);
    addAlert("¡Solicitud enviada con éxito! La descarga comenzará pronto.");
    handleDownload();
    handleClose();
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
          <CustomTypography variant="h6">
            Para descargar los datos debe llenar este formulario de solicitud
          </CustomTypography>
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
          <OptionBox>
            <CustomButton
              variant="outlined"
              color="primary"
              onClick={handleClose}
            >
              Cancelar
            </CustomButton>

            <CustomButton
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
            >
              Enviar
            </CustomButton>
          </OptionBox>
        </CustomBox>
      </CustomStack>
    </Paper>
  );
};

const CustomStack = styled(Stack)(({ theme }) => ({
  justifyContent: "center",
  alignItems: "center",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(3),
}));

const CustomBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const CustomButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3.5),
}));

const OptionBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "flex-end",
  padding: theme.spacing(3),
  gap: theme.spacing(2),
}));
export default DownloadArtifactForm;
