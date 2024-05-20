import { useEffect, useState } from 'react'
import { Typography, Button, Chip, Grid, Container, Stack, Box, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import ModalFormButton from './components/ModalFormButton';
import EditForm from './components/EditForm';
import PieceVisualization from './components/PieceVisualization';
import ImagesCarousel from './components/ImagesCarousel';
import { useParams } from 'react-router-dom';
import DownloadForm from './components/DownloadForm';

const ObjectDetail = ({ loggedIn }) => {
    const [piece, setPiece] = useState();
    const { pieceId } = useParams();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    console.log(piece)
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    const handleOpenSnackbar = () => {
        setOpenSnackbar(true);
    };

    useEffect(() => {
        fetch('/pieces_models/response.json')
            .then(response => response.json())
            .then(response => {
                //with the api  should retrieve a  single object
                const object = response.data.find(obj => obj.id === parseInt(pieceId));
                setPiece(object);
            })
            .catch(error => console.error(error));
    }, [pieceId])

    return (
        <ContainerGrid container>
            <CenterGrid item lg={7}>
                <LeftBox>
                    <CustomContainer >
                        <Typography variant='h3'><b>#{piece && String(pieceId).padStart(4, '0')}</b> </Typography>
                        {loggedIn ? (
                            <HorizontalStack >
                                <Button variant='contained'>
                                    Descargar Pieza
                                </Button>

                                <ModalFormButton text={"Editar Pieza"}>
                                    <EditForm />
                                </ModalFormButton>

                            </HorizontalStack>
                        ) : (
                            <ModalFormButton text={"Solicitar datos"}>
                                {piece && <DownloadForm handleOpenSnackBar={handleOpenSnackbar} pieceInfo={piece}></DownloadForm>}
                            </ModalFormButton>
                        )}
                    </CustomContainer>
                    {piece && (
                        <>
                            <PieceVisualization objPath={piece.model.object} mtlPath={piece.model.material} />
                            <ImagesCarousel images={piece.images} ></ImagesCarousel>
                        </>
                    )}

                </LeftBox>
            </CenterGrid>
            <Grid item lg>
                <RightBox >
                    <HorizontalStack><Typography variant='h5'>Cultura:</Typography>  <CustomCultureTag label={piece && piece.attributes.culture} /></HorizontalStack>
                    <HorizontalStack><Typography variant='h5'> Forma: </Typography> <CustomShapeTag label={piece && piece.attributes.shape} /> </HorizontalStack>
                    <Typography>{piece && piece.attributes.description}</Typography>
                    {<HorizontalStack><Typography variant='h5'>Etiquetas:</Typography>
                        <TagContainer >
                            {piece && piece.attributes.tags.map((tag, index) =>
                                <Chip key={index} label={tag} />
                            )}
                        </TagContainer>
                    </HorizontalStack>}

                </RightBox>
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} message={"Solicitud enviada correctamente.La descarga comenzará en unos segundos"}>
            </Snackbar>
        </ContainerGrid>
    )
}

const CustomContainer = styled(Container)(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

}));
const HorizontalStack = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1)

}));

const LeftBox = styled(Box)(({ theme }) => ({
    width: theme.spacing(73),

    [theme.breakpoints.up('md')]: {
        width: theme.spacing(83),
    },
    [theme.breakpoints.up('xl')]: {
        width: theme.spacing(106),
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
}));

const RightBox = styled(Stack)(({ theme }) => ({
    paddingRight: theme.spacing(7),
    marginTop: theme.spacing(10),

    [theme.breakpoints.down('lg')]: {
        marginLeft: theme.spacing(15),
    },
    [theme.breakpoints.down('md')]: {
        marginLeft: theme.spacing(8),
        marginTop: theme.spacing(3),
    },
    gap: theme.spacing(4)
}));

const CenterGrid = styled(Grid)(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}));

const ContainerGrid = styled(Grid)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
}));


const TagContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: theme.spacing(1),

}))

const CustomShapeTag = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.tags.shape,
}));

const CustomCultureTag = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.tags.culture,
}))

export default ObjectDetail;