import { useEffect, useState } from 'react'
import { Typography, ImageList, ImageListItem, Button, Chip, Grid, Container, Stack, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ModalButton from './components/ModalButton';
import PieceVisualization from './components/PieceVisualization';
import ModalImage from './components/ModalImage';
import { useParams } from 'react-router-dom';

const ObjectDetail = ({ loggedIn }) => {
    const [piece, setPiece] = useState();
    const { pieceId } = useParams();

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
                            <HorizontalStack>
                                <ModalButton text={"Descargar"}>
                                </ModalButton>
                                <Button variant="contained">Editar Pieza</Button>
                            </HorizontalStack>
                        ) : (
                            <Button variant="contained">Solicitar Pieza</Button>
                        )}
                    </CustomContainer>
                    {piece && (
                        <>
                            <PieceVisualization objPath={piece.model.object} mtlPath={piece.model.material} />
                            <ImageList cols={3} rows={1}>
                                {piece.images.map((imgPath, index) =>
                                    <ImageListItem key={index}>
                                        <ModalImage path={imgPath} />
                                    </ImageListItem>
                                )}
                            </ImageList>
                        </>
                    )}

                </LeftBox>
            </CenterGrid>

            <Grid item lg>
                <RightBox >
                    <HorizontalStack><Typography variant='h5'>Cultura:</Typography>  <CustomCultureTag label={piece && piece.atributes.culture} /></HorizontalStack>
                    <HorizontalStack><Typography variant='h5'> Forma: </Typography> <CustomShapeTag label={piece && piece.atributes.shape} /> </HorizontalStack>
                    <Typography>{piece && piece.atributes.description}</Typography>
                    {<HorizontalStack><Typography variant='h5'>Etiquetas:</Typography>
                        <TagContainer >
                            {piece && piece.atributes.tags.map((tag, index) =>
                                <Chip key={index} label={tag} />
                            )}
                        </TagContainer>
                    </HorizontalStack>}

                </RightBox>
            </Grid>
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