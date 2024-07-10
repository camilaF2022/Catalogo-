import { useState,useEffect } from 'react'
import { Modal, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * ModalImage Component
 *
 * Component that displays an image thumbnail and opens a modal with the full-size image on click.
 *
 * @param {string} path - URL or path to the image.
 */
const ModalImage = ({ path }) => {

    const [open, setOpen] = useState(false); // State to control modal open/close
    const [isWideImage, setIsWideImage] = useState(false); // State to track if the image is wide
    
    /**
     * Opens the modal dialog.
     */
    const handleOpen = () => setOpen(true);

    /**
     * Closes the modal dialog.
     */
    const handleClose = () => setOpen(false);
    
    /**
     * Determines if the image is wide (landscape orientation).
     * Sets the isWideImage state accordingly.
     *
     * @param {string} path - URL or path to the image.
     */
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

    // Effect to calculate image size on path change
    useEffect(() => {
        handleImageSize(path);
    }, [path])    
    return (
        <div>
            {/* Thumbnail image with onClick handler to open modal */}
            <img src={path} alt="lazy" style={{ width: '160px', height: '160px' }} onClick={handleOpen}  />
            {/* Modal dialog */}
            <CustomModal
                open={open}
                onClose={handleClose}
            >
                <CustomBox >
                    {/* Close icon */}
                    <CancelIcon onClick={handleClose} style={{ cursor: 'pointer', color: "white" }} />
                    
                    {/* Container for the full-size image */}
                    <ImageContainer iswideimage={isWideImage? isWideImage.toString():undefined}>
                        <img src={path} alt="modalImage"  onClick={handleOpen}/>
                    </ImageContainer>
                </CustomBox>
            </CustomModal>
        </div>
    );
}

// Custom styled Box component for modal content
const CustomBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end', // Align close icon to the right
    justifyContent: 'center',
    backgroundColor: 'black', // Background color of modal content
    padding: theme.spacing(1),
}))

// Custom styled Modal component
const CustomModal = styled(Modal)(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
}))

// Custom styled Box component for image container inside the modal
const ImageContainer = styled(Box)(({ theme,iswideimage}) => ({
    padding: theme.spacing(4),
    display: 'flex',
    height: '600px', // Fixed height for the image container
    width: '400px', // Initial width for the image container
    overflow: iswideimage ? 'auto' : 'hidden', // Enable overflow for wide images
    justifyContent: iswideimage ? 'flex-start' : 'center', // Align content based on image width
    [theme.breakpoints.up('sm')]: {
        width: '550px', // Adjust width for small screens
    },
    [theme.breakpoints.up('md')]: {
        width: '860px', // Adjust width for medium screens
    },
    [theme.breakpoints.up('lg')]: {
        width: '1150px', // Adjust width for large screens
    },
}))


export default ModalImage;