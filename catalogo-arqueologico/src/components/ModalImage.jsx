import { useState } from 'react'
import { Modal,Button} from '@mui/material';
import { styled } from '@mui/material/styles';

const ModalImage = ({path}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <img src={path} alt="lazy" style={{ width:'200px', height:'200px' }} onClick={handleOpen} />
            <CustomModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    <img src={path} alt="lazy" />
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

export default ModalImage;