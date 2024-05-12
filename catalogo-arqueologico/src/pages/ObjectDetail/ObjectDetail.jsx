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
        <CustomGrid container>
            <Grid item lg={8}>
                    <CustomGrid container>
                        <Grid item xs={8}>
                            <Typography variant='h3'># ID: {piece && piece.id}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <ModalButton>
                                <DownloadForm />
                            </ModalButton>
                        </Grid>
                        <Grid item xs>
                            <Button variant="contained">Editar Pieza</Button>
                        </Grid>
                    </CustomGrid>
                </Grid>
                <Grid item lg></Grid>
                <CustomGridItem item lg={8}>
                    <CustomBox >
                        {piece && <PieceVisualization objPath={piece.model.object} mtlPath={piece.model.material} />}
                        {piece && <ImageList cols={3} rows={1}>
                            {piece.images.map((imgPath, index) =>
                                <ImageListItem key={index}>
                                    <img src={imgPath} alt="lazy" style={{ maxWidth: '200px' }} />
                                </ImageListItem>
                            )}
                        </ImageList>}
                    </CustomBox>
                </CustomGridItem>
        
            <Grid item lg>
                <CustomStack spacing={7}>
                    <Stack direction={"row"} alignItems={'center'} spacing={1}><Typography variant='h4'>Cultura:</Typography>  <Typography> {piece && piece.atributes.culture} </Typography></Stack>
                    <Stack direction={"row"} alignItems={'center'} spacing={1}><Typography variant='h4'> Forma: </Typography> <Typography> {piece && piece.atributes.shape}</Typography></Stack>
                    <Typography>{piece && piece.atributes.description}</Typography>
                    {<Stack direction={"row"} alignItems={'center'} spacing={1}><Typography variant='h4'>Etiquetas:</Typography> <Container>
                        {piece && piece.atributes.tags.map((tag, index) =>
                            <Chip key={index} label={tag} />
                        )}
                    </Container></Stack>}
                </CustomStack>
            </Grid>
        </CustomGrid>
    )
}
const CustomStack = styled(Stack)(({ theme }) => ({
    // justifyContent: ,
    alignItems: "flex-start",
    direction: 'column',    
    spacing: theme.spacing(10),
}));
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

const CustomBox = styled(Box)(() => ({
    width: '800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}));


export default ObjectDetail;