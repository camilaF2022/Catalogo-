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

/**
 * DownloadArtifactForm component renders a form for users to request and download artifacts.
 * It includes input fields for user information and handles submission and validation.
 * 
 * @param {object} artifactInfo - Information about the artifact being downloaded.
 * @param {function} handleClose - Function to close the form modal.
 */
const DownloadArtifactForm = ({ artifactInfo, handleClose }) => {
  const { token } = useToken(); // Retrieves authentication token using custom hook
  const { addAlert } = useSnackBars(); // Retrieves snack bar utility functions using custom hook

  // State variables to manage form inputs, errors, and loading state
  const [institutions, setInstitutions] = useState([]);
  const [formValues, setFormValues] = useState({
    fullName: "",
    rut: "",
    email: "",
    institution: { id: "", value: "" },
    comments: "",
  });
  const [rutError, setRutError] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for API fetch
  const [errors, setErrors] = useState(false); // Error state for API fetch

  // Fetches list of institutions when component mounts
  useEffect(() => {
    fetch(API_URLS.ALL_INSTITUTIONS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        response.json().then((data) => {
          if (!response.ok) {
            throw new Error(data.detail);
          }
          let institutions = Array.from(data.data);
          setInstitutions(institutions);
        }).catch((error) => {
          setErrors(true);
          addAlert(error.message);
        }).finally(() => {
          setLoading(false)
        })})
      }, []);

    // Handles input changes in the form fields
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({
        ...formValues,
        [name]: value,
      });
    };

    // Handles form submission to initiate artifact download
    const handleDownload = async (formValues) => {
      let body = {
        fullName: formValues.fullName,
        rut: formValues.rut,
        email: formValues.email,
        institution: formValues.institution.id,
        comments: formValues.comments,
      };
      try {
        // First fetch request to initiate artifact download request
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

        // Handle error if request fails
        if (!response.ok) {
          addAlert(data.detail);
          return;
        }

        // If the code reaches here, the first fetch was successful
        // Proceed with the second fetch to actually download the artifact
        const downloadResponse = await fetch(
          `${API_URLS.DETAILED_ARTIFACT}/${artifactInfo.id}/download`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Generate download URL and trigger download using <a> element
        const url = window.URL.createObjectURL(new Blob([await downloadResponse.blob()]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `artifact_${artifactInfo.id}.zip`;
        link.click();
        link.remove();
        addAlert("Descarga exitosa");
      } catch (error) {
        // Handle any errors during the download process
        addAlert("Error al descargar pieza");
      }
    };

    // Handles form submission validation and initiates download process
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
      handleClose(); // Close the form modal after successful submission
    };

    // Renders the form using MUI components
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
                id="comments"
                name="comments"
                multiline
                margin="normal"
                value={formValues.comments}
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

  // Styled component for customizing Stack layout
  const CustomStack = styled(Stack)(({ theme }) => ({
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  }));

  // Styled component for customizing Typography appearance
  const CustomTypography = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(3),
  }));

  // Styled component for customizing Box layout and styling
  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  }));

  // Styled component for customizing Button appearance
  const CustomButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3.5),
  }));

  // Styled component for customizing Box layout and styling in OptionBox
  const OptionBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: theme.spacing(3),
    gap: theme.spacing(2),
  }));

  /**
   * validateRut function validates the Chilean RUT (Rol Único Tributario) format.
   * 
   * @param {string} rutStr - RUT string to validate.
   * @returns {boolean} - Returns true if the RUT is valid; otherwise, false.
   */
  const validateRut = (rutStr) => {
    let rut = rutStr.replace(/\./g, "").replace(/-/g, ""); // Remove dots and dashes
    rut = rut.split(""); // Convert to array of characters
    if (rut.length !== 9) {
      return false; // RUT length must be 9 characters
    }
    const last = rut[8];
    const inverse = rut.slice(0, 8).reverse();
    let total = 0; // Initialize total for RUT validation
    for (let i = 0; i < inverse.length; i++) {
      total += parseInt(inverse[i]) * ((i % 6) + 2);
    }
    const rest = 11 - (total % 11);
    if (
      (rest === 10 && (last === "K" || last === "k")) ||
      rest === parseInt(last)
    ) {
      return true; // Valid RUT format
    }
    return false; // Invalid RUT format
  };

  export default DownloadArtifactForm;
