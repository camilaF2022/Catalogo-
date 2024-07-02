import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack, Paper, InputLabel, Autocomplete } from "@mui/material";
import { API_URLS } from "../../../api";
import { useSnackBars } from "../../../hooks/useSnackbars";
import { useToken } from "../../../hooks/useToken";

const DownloadArtifactForm = ({ artifactInfo, handleClose }) => {
  const { token } = useToken();
  const { addAlert } = useSnackBars();
  const [institutions, setInstitutions] = useState([]);
  const [formValues, setFormValues] = useState({
    fullName: "",
    rut: "",
    email: "",
    institution: { id: "", value: "" },
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(false);

  useEffect(() => {
    fetch(API_URLS.ALL_INSTITUTIONS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.detail);
        }
        return response.json();
      })
      .then((response) => {
        let institutions = Array.from(response.data);
        setInstitutions(institutions);
      })
      .catch((error) => {
        setErrors(true);
        addAlert("Error al cargar las instituciones");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDownload = async (formValues) => {
    let body = {
      fullName: formValues.fullName,
      rut: formValues.rut,
      email: formValues.email,
      institution: formValues.institution.id,
      description: formValues.description,
    };
    await fetch(`${API_URLS.DETAILED_ARTIFACT}/${artifactInfo.id}/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.detail);
        }
      })
      .catch((error) => {
        setErrors(true);
        addAlert("Error al descargar pieza");
      });
    await fetch(`${API_URLS.DETAILED_ARTIFACT}/${artifactInfo.id}/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.detail);
        }
        console.log(response);
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `artifact_${artifactInfo.id}.zip`;
        link.click();
        link.remove();
      })
      .catch((error) => {
        setErrors(true);
        addAlert("Error al descargar pieza");
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
            <InputLabel>
              <b>Institución *</b>
            </InputLabel>
            <Autocomplete
              id="institution"
              name="institution"
              value={formValues.institution}
              onChange={(name, value) => {
                setFormValues({
                  ...formValues,
                  institution: value,
                });
              }}
              options={institutions}
              noOptionsText="No hay instituciones disponibles"
              getOptionLabel={(option) => option.value ?? ""}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  key={"institution"}
                  {...params}
                  required={true}
                  placeholder={"Seleccione una institución"}
                />
              )}
              disabled={loading || errors}
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
