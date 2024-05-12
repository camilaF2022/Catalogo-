import React, { useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { Paper, TextField, Modal, Typography, ImageList, ImageListItem, Button, Chip, Grid, Container, Stack, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadForm from './DownloadModalForm';

function Scene({ objPath, mtlPath }) {
    const material = useLoader(MTLLoader, mtlPath)
    const object = useLoader(OBJLoader, objPath, loader => {
        material.preload()
        loader.setMaterials(material)
    })

    return (
        <div style={{ width: '800px', height: '500px' }} id="canvas-container">
            <Canvas style={{ background: '#2e2d2c' }} camera={{ fov: 25, position: [0, 0, -500] }}>
                <ambientLight intensity={2} />
                <primitive position={[0, 0, 0]} object={object} />
                <OrbitControls />
            </Canvas>
        </div>

    )
}


function ObjectDetail({ pieceId }) {
    const [piece, setPiece] = useState();

    useEffect(() => {
        fetch('./pieces_models/response.json')
            .then(response => response.json())
            .then(response => {
                //with the api  should retrieve a  single object
                const object = response.data.find(obj => obj.id === pieceId);
                setPiece(object);
            })
            .catch(error => console.error(error));
    }, [])

    function ModalDownloadButton() {
        const [open, setOpen] = useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);

        return (
            <div>
                <Button onClick={handleOpen } variant="contained">Descargar </Button>
                <CustomModal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div>
                    <DownloadForm></DownloadForm>
                    </div>
                </CustomModal>
            </div>
        );
    }
    return (
        <CustomGrid container>
            <CustomGridItem item lg={8}>
                <Box >
                    <CustomGrid container >
                        <Grid item xs={6}>
                            <Typography variant='h3'># ID: {piece && piece.id}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ModalDownloadButton />
                        </Grid>
                        <Grid item xs>
                            <Button variant="contained">Editar Pieza</Button>
                        </Grid>
                    </CustomGrid>

                    <CustomBox >
                        {piece && <Scene objPath={piece.model.object} mtlPath={piece.model.material} />}
                        {piece && <ImageList cols={3} rows={1}>
                            {piece.images.map((imgPath, index) =>
                                <ImageListItem key={index}>
                                    {console.log(imgPath)}
                                    <img src={imgPath} alt="lazy" style={{ maxWidth: '200px' }} />
                                </ImageListItem>
                            )}
                        </ImageList>}
                    </CustomBox>
                </Box>
            </CustomGridItem>

            <Grid item lg>
                <Stack direction={"column"} spacing={7}>
                    <Stack direction={"row"} alignItems={'center'} spacing={1}><Typography variant='h4'>Cultura:</Typography>  <Typography> {piece && piece.atributes.culture} </Typography></Stack>
                    <Stack direction={"row"} alignItems={'center'} spacing={1}><Typography variant='h4'> Forma: </Typography> <Typography> {piece && piece.atributes.shape}</Typography></Stack>
                    <Typography>{piece && piece.atributes.description}</Typography>
                    {<Stack direction={"row"} alignItems={'center'} spacing={1}><Typography variant='h4'>Etiquetas:</Typography> <Container>
                        {piece && piece.atributes.tags.map((tag, index) =>
                            <Chip key={index} label={tag} />
                        )}
                    </Container></Stack>}
                </Stack>
            </Grid>
        </CustomGrid>
    )
}

const CustomGrid = styled(Grid)(({ theme }) => ({
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
    marginTop: theme.spacing(6),
    alignItems: 'center',
    justifyContent: 'center'

}));

const CustomGridItem = styled(Grid)(({ theme }) => ({
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const CustomBox = styled(Box)(({ theme }) => ({
    width: '800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}));

const CustomModal =styled(Modal)(({theme})=>({
    display:"flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',

}))
export default ObjectDetail;