import { useEffect, useState } from 'react'
import { Typography, ImageList, ImageListItem, Button, Chip, Grid, Container, Stack, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ModalButton from './ModalButton';
import PieceVisualization from './PieceVisualization';
import DownloadForm from './DownloadForm';

const ObjectDetail = ({ pieceId }) => {
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

    return (
        <CenterGrid container>
            <CenterGrid item lg={7}>
                <LeftBox>
                    <CenterGrid container>
                        <Grid item xs={7}>
                            <Typography variant='h4'># ID: {piece && piece.id}</Typography>
                        </Grid>
                        <Grid item xs>
                            <ModalButton>
                                <DownloadForm />
                            </ModalButton>
                        </Grid>
                        <Grid item xs>
                            <Button variant="contained">Editar Pieza</Button>
                        </Grid>
                    </CenterGrid>
                    <PieceBoxContainer >
                        {piece && <PieceVisualization objPath={piece.model.object} mtlPath={piece.model.material} />}
                        {piece && <ImageList cols={3} rows={1}>
                            {piece.images.map((imgPath, index) =>
                                <ImageListItem key={index}>
                                    <img src={imgPath} alt="lazy" style={{ maxWidth: '180px' }} />
                                </ImageListItem>
                            )}
                        </ImageList>}
                    </PieceBoxContainer>
                </LeftBox>
            </CenterGrid>
            
            <Grid item lg>
                <RightBox >
                <Stack  spacing={4}>
                    <Stack direction={"row"} alignItems={'center'} spacing={1}><Typography variant='h5'>Cultura:</Typography>  <Typography> {piece && piece.atributes.culture} </Typography></Stack>
                    <Stack direction={"row"} alignItems={'center'} spacing={1}><Typography variant='h5'> Forma: </Typography> <Typography> {piece && piece.atributes.shape}</Typography></Stack>
                    <Typography>{piece && piece.atributes.description}</Typography>
                    {<Stack direction={"row"} alignItems={'center'} spacing={1}><Typography variant='h5'>Etiquetas:</Typography> <Container>
                        {piece && piece.atributes.tags.map((tag, index) =>
                            <Chip key={index} label={tag} />
                        )}
                    </Container></Stack>}
                </Stack>
                </RightBox>
            </Grid>
        </CenterGrid>
    )
}

const LeftBox = styled(Box)(({ theme }) => ({
    width: theme.spacing(50),
    
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
}));

const RightBox = styled(Box)(({ theme }) => ({
    paddingRight: theme.spacing(7),
    marginTop: theme.spacing(15),
    
    [theme.breakpoints.down('lg')]: {
        marginLeft: theme.spacing(5),
    },
    [theme.breakpoints.down('md')]: {
        marginLeft: theme.spacing(8),
        marginTop: theme.spacing(3),
    }
}));
const CenterGrid = styled(Grid)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
}));


const PieceBoxContainer = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width:"100%"
}));


export default ObjectDetail;