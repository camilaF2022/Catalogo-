import { useState,useEffect } from 'react'
import { Modal, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';

const ModalImage = ({ path }) => {
    const [open, setOpen] = useState(false);
    const [isWideImage, setIsWideImage] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleImageSize = (path) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            if ((img.width/img.height)>2) {
                setIsWideImage(true);
            }else{
                setIsWideImage(false);
            }
        }
    }
    useEffect(() => {
        handleImageSize(path);
    }, [path])    
    return (
        <div>
            <img src={path} alt="lazy" style={{ width: '180px', height: '180px' }} onClick={handleOpen}  />
            <CustomModal
                open={open}
                onClose={handleClose}
            >
                <CustomBox >
                    <CancelIcon onClick={handleClose} style={{ cursor: 'pointer', color: "white" }} />
                    <ImageContainer iswideimage={isWideImage? isWideImage.toString():undefined}>
                        <img src={path} alt="modalImage"  onClick={handleOpen}/>
                    </ImageContainer>
                </CustomBox>
            </CustomModal>
        </div>
    );
}

const CustomBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
    justifyContent: 'center',
    backgroundColor: 'black',
    padding: theme.spacing(1),
}))

const CustomModal = styled(Modal)(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
}))

const ImageContainer = styled(Box)(({ theme,iswideimage}) => ({
    padding: theme.spacing(4),
    display: 'flex',
    height: "600px",
    width: '400px',
    overflow: iswideimage?'auto':'hidden',
    justifyContent: iswideimage ? 'flex-start' : 'center',
    [theme.breakpoints.up('sm')]: {
        width: '550px',
    },
    [theme.breakpoints.up('md')]: {
        width: '860px',
    },
    [theme.breakpoints.up('lg')]: {
        width: '1150px',
    },
}))


export default ModalImage;