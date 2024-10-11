import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Typography,
    Button,
    TextField,
    FormLabel,
    Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import UploadButton from "../sharedComponents/UploadButton";
import { API_URLS } from "../../api";
import { useToken } from "../../hooks/useToken";
import { useSnackBars } from "../../hooks/useSnackbars";




const BulkLoading = () => {
    const { token } = useToken();
    const { addAlert } = useSnackBars();

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(false);
    const [newObjectAttributes, setNewObjectAttributes] = useState({
        excel: {},
        zip: {},
    });
    
    useEffect(() => {
        setLoading(false);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("excel", newObjectAttributes.excel);
        formData.append("zip", newObjectAttributes.zip);
        await fetch(`${API_URLS.DETAILED_ARTIFACT}/bulkloading`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }).then((response) => {
                if (response.ok) {
                    addAlert("Carga masiva exitosa");
                } else {
                    addAlert("Error en la carga masiva");
                }
            })
            .catch((error) => {
                addAlert(error.message);
            });

    };
    
    return (
        <Container>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container rowGap={4}>
                    <Grid item xs={12}>
                        <CustomTypography variant="h1">
                            Carga masiva
                        </CustomTypography>
                    </Grid>
                    <CustomBox>
                        <Typography variant="p">
                            Instrucciones para la carga masiva: 
                        </Typography><br />
                        <Typography variant="p">
                            1. Descargar la plantilla de Excel.
                        </Typography><br />
                        <Typography variant="p">
                            2. Llenar la plantilla con la información correspondiente.
                        </Typography><br />
                        <Typography variant="p">
                            3. Subir la plantilla de Excel y el archivo ZIP con la información multimedia (modelos 3D, texturas, imagenes, etc).
                        </Typography><br />
                        <Typography variant="p">
                            4. Hacer clic en el botón "Subir".
                        </Typography>
                    </CustomBox>    
                    <Grid item xs={12}>
                    <ColumnGrid item xs={12}  rowGap={2}>
                        <UploadButton
                            label="Excel *"
                            name="excel"
                            isRequired
                            setStateFn={setNewObjectAttributes}
                        />
                        <UploadButton
                            label="Zip *"
                            name="zip"
                            isRequired
                            setStateFn={setNewObjectAttributes}
                        />
                    </ColumnGrid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Subir
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};


const CustomTypography = styled(Typography)({
    textAlign: "center",
    marginBottom: "1rem",
});


const ColumnGrid = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
  }));

const CustomBox = styled("div")(({ theme }) => ({
    border: "1px solid #000",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
    width: "100%",
}));


export default BulkLoading;