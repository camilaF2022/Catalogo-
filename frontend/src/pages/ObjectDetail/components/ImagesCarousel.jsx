import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ModalImage from './ModalImage';
import styled from '@mui/material/styles/styled';

const ImagesCarousel = ({ images }) => {
    const itemsPerPage = 3;
    const totalItems = images.length;
    const [currentPage, setCurrentPage] = useState(1);
    return (
        images.length >= 1 && (
            <CustomBox >
                <CustomImageList    >
                    {images.map((item, index) => (
                        <CustomImageListItem  key={index} >
                            <ModalImage key={index} path={item} />
                        </CustomImageListItem>
                    ))}
                </CustomImageList>
            </CustomBox>
        )
    );
}
const CustomImageList = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(0.5),    
   
}))

const CustomBox = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: theme.spacing(45.2),
    position: 'relative',
}))

const CustomImageListItem = styled('div')(({theme}) => ({   
    display: 'flex',
    width: theme.spacing(12.5),
    height: theme.spacing(12.5),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1.25),
    backgroundColor: "#bdbdbd" ,
    justifyContent: 'center',
}))
export default ImagesCarousel;
