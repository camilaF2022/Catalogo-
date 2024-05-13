import { useState } from 'react'
import { Modal,Button} from '@mui/material';
import { styled } from '@mui/material/styles';

const ModalDownloadButton = ({text,children}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen} variant="contained"> {text} </Button>
            <CustomModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    {children}
                </div>
            </CustomModal>
        </div>
    );

}
const CustomModal = styled(Modal)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',

}))

export default ModalDownloadButton;