import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack, Paper } from "@mui/material";

const RequestForm = ({ handleClose }) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formValues); // Send credentials to the server
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Emulate POST delay
        // send to the server
        console.log("Request sent to the server");
        handleClose();
    };

    return (
        <Paper >
            <CustomBox
                component="form"
                autoComplete="off"
                onChange={handleChange}
                onSubmit={handleSubmit}
            >
            <CustomTypography variant="h6">Para descargar los datos debe llenar este formulario de solicitud</CustomTypography>
                <CustomStack>
                    <TextField
                        required
                        id="nombreCompleto"
                        name="fullName"
                        label="Nombre Completo"
                        margin="normal"
                        value={formValues.fullName}

                    />
                    <TextField
                        required
                        id="rut"
                        name="rut"
                        label="Rut"
                        margin="normal"
                        value={formValues.rut}
                    />
                    <TextField
                        required
                        id="email"
                        name="email"
                        label="Correo electrónico"
                        type="email"
                        margin="normal"
                        value={formValues.email}
                    />

                    <TextField
                        required
                        id="institution"
                        name="institution"
                        label="Institucion"
                        margin="normal"
                        value={formValues.institution}
                    />

                    <TextField
                        required
                        id="description"
                        name="description"
                        label="Motivo de la solicitud"
                        margin="normal"
                        value={formValues.description}
                    />
                </CustomStack>
                    <OptionBox >
                        <CustomButton variant="outlined" color="primary" onClick={handleClose} >
                            Cancelar
                        </CustomButton>
                        <CustomButton variant="contained" color="primary" type="submit" >
                            Enviar
                        </CustomButton>
                    </OptionBox>
            </CustomBox>
        </Paper>
    );
};

const CustomStack = styled(Stack)(({ theme }) => ({
    justifyContent: "center",
    alignItems: "center",
    rowGap: theme.spacing(1),
    
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(3),
}));

const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
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
export default RequestForm;
