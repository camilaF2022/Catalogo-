import { useState } from 'react'
import { Modal, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';

const ModalImage = ({ path }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <img src={path} alt="lazy" style={{ width: '200px', height: '200px' }} onClick={handleOpen} />
            <CustomModal
                open={open}
                onClose={handleClose}
            >
                <CustomBox >
                    <CancelIcon onClick={handleClose} style={{ cursor: 'pointer', color: "white" }} />
                    <ImageContainer>
                        <img src={path} alt="lazy" onClick={handleOpen} />
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

const ImageContainer = styled('div')(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    height: "600px",
    width: '400px',
    overflow: 'auto',
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