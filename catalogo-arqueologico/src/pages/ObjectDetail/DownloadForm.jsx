// import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import {Paper,Typography} from "@mui/material";

const DownloadForm = () => {
    // const [formValues, setFormValues] = useState({
    //     email: "",
    //     password: "",
    // });

    return (
        <CustomPaper sx={{ backgroundColor: "white" }}>
        Formulario de descarga
        </CustomPaper>
        // <CustomPaper>
        //     <CustomStack>
        //         <Typography>Para descargar los datos debe llenar este formulario de solicitud</Typography>
        //         <CustomBox
        //             component="form"
        //             autoComplete="off"
        //         //   onChange={}
        //         //   onSubmit={}
        //         >
        //             <TextField
        //                 required
        //                 id="nombreCompleto"
        //                 name="nombreCompleto"
        //                 label="Nombre Completo"
        //                 type="text"
        //                 margin="normal"
                
        //             />
        //             <TextField
        //                 required
        //                 id="password"
        //                 name="password"
        //                 label="Rut"
        //                 type="password"
        //                 margin="normal"
                        
        //             />
        //             <TextField
        //                 required
        //                 id="nombreCompleto"
        //                 name="nombreCompleto"
        //                 label="Correo Electrónico"
        //                 type="text"
        //                 margin="normal"
                        
        //             />
        //             <TextField
        //                 required
        //                 id="nombreCompleto"
        //                 name="nombreCompleto"
        //                 label="Institución"
        //                 type="text"
        //                 margin="normal"
                        
        //             />
        //             <TextField
        //                 required
        //                 id="nombreCompleto"
        //                 name="nombreCompleto"
        //                 label="Motivo de Solicitud"
        //                 type="text"
        //                 margin="normal"
                        
        //             />
                    
        //             <Box>
        //             <CustomButton variant="contained" color="primary" type="submit">
        //                 Cancelar 
        //             </CustomButton>
        //             <CustomButton variant="contained" color="primary" type="submit">
        //                 Enviar
        //             </CustomButton>
        //             </Box>
                    
        //         </CustomBox>
        //     </CustomStack>
        // </CustomPaper>
    );
};

const CustomStack = styled(Stack)(({ theme }) => ({
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing(8),
    rowGap: theme.spacing(1),
}));

const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
}));

const CustomButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3.5),
}));
const CustomPaper =styled(Paper)(({ theme }) => ({
    width:"600px",
    height:"600px",

}));

export default DownloadForm;
