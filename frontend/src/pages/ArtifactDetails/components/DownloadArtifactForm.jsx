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
    comment: "",
  });
  const [rutError, setRutError] = useState(false);
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
      comment: formValues.comment,
    };
    try {
      const response = await fetch(
        `${API_URLS.DETAILED_ARTIFACT}/${artifactInfo.id}/download`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        addAlert(data.detail);
        return;
      }

      // If the code reaches here, the first fetch was successful
      // Proceed with the second fetch
      const downloadResponse = await fetch(
        `${API_URLS.DETAILED_ARTIFACT}/${artifactInfo.id}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const downloadData = await response.json();

      if (!downloadResponse.ok) {
        addAlert(downloadData.detail);
        return;
      }
      const url = window.URL.createObjectURL(new Blob([downloadData]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `artifact_${artifactInfo.id}.zip`;
      link.click();
      link.remove();
      addAlert("Descarga exitosa");
    } catch (error) {
      addAlert("Error al descargar pieza");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Assuming formValues contains a 'rut' field that needs to be validated
    if (!validateRut(formValues.rut)) {
      setRutError(true);
      return; // Stop the form submission process
    }
    // Reset RUT error if validation passes
    setRutError(false);
    handleDownload(formValues);
    handleClose();
  };

  return (
    <Paper>
      <CustomStack>
        <CustomBox
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit}
          onChange={handleChange}
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
              id="fullName"
              name="fullName"
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
              margin="normal"
              placeholder="123456789"
              value={formValues.rut}
              error={rutError} // Show error style if there's a RUT error
              helperText={"Sin puntos ni guión"} // Display the RUT error message
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
              id="comment"
              name="comment"
              multiline
              margin="normal"
              value={formValues.comment}
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

            <CustomButton variant="contained" color="primary" type="submit">
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

const validateRut = (rutStr) => {
  let rut = rutStr.replace(/\./g, "").replace(/-/g, ""); // Change `const` to `let` for reassignment
  rut = rut.split(""); // Correct splitting into an array of characters
  if (rut.length !== 9) {
    return false; // Return false if the length is not 9
  }
  const last = rut[8];
  const inverse = rut.slice(0, 8).reverse();
  let total = 0; // Initialize `total` with `let` to allow updates
  for (let i = 0; i < inverse.length; i++) {
    total += parseInt(inverse[i]) * ((i % 6) + 2);
  }
  const rest = 11 - (total % 11);
  if (
    (rest === 10 && (last === "K" || last === "k")) ||
    rest === parseInt(last)
  ) {
    return true; // Assuming the validation logic should return true if conditions are met
  }
  return false; // Return false as default if conditions are not met
};

export default DownloadArtifactForm;
