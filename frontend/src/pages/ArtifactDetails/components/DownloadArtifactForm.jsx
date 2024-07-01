import React, { useState,useEffect } from "react";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack, Paper, InputLabel, Select, MenuItem } from "@mui/material";
import { useSnackBars } from "../../../hooks/useSnackbars";
import { API_URLS } from "../../../api";
import AutocompleteExtended from "../../sharedComponents/AutocompleteExtended";
const DownloadArtifactForm = ({ artifactInfo, handleClose }) => {
  const [institutions, setInstitutions] = useState([]);
  const { addAlert } = useSnackBars();
  const [formValues, setFormValues] = useState({
    fullName: "",
    rut: "",
    email: "",
    institution: "",
    description: "",
  });

  useEffect(() => {
    fetch(API_URLS.INSTITUTIONS)
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched institutions
        setInstitutions(data);
      })
      .catch((error) => {
        console.error("Error fetching institutions:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDownload = (formValues) => {
    console.log(formValues)
    fetch(API_URLS.DETAILED_ARTIFACT + "/" + artifactInfo.id + "/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    })
      .then((response) => {
        response.blob().then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.download = `artifact_${artifactInfo.id}.zip`
          link.click()
          link.remove()
        }
        )
      })
      .catch((error) => {
        console.error("Error downloading artifact:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Request sent to the server", formValues);
    addAlert("¡Solicitud enviada con éxito! La descarga comenzará pronto.");
    handleDownload(formValues);
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
            {/* <InputLabel>
              <b>Institución *</b>
            </InputLabel>
            <AutocompleteExtended
              required
              id="institution"
              name="institution"
              label="Institucion"
              value={formValues.institution.name}
              options={institutions}
              setValue={}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                // setFormValues({
                  ...formValues,
                  institution: newValue ? newValue.id : "",
                });
              }}
            />
             */}
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
