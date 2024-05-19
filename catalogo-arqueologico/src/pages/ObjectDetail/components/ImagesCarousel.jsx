import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, ImageList, ImageListItem } from '@mui/material'
import ModalImage from './ModalImage';
import styled from '@mui/material/styles/styled';

const ImagesCarousel = ({ images }) => {
    const itemsPerPage = 3;
    const totalItems = images.length;
    const [currentPage, setCurrentPage] = useState(1);

    const handlePrev = () => {
        setCurrentPage(Math.max(1, currentPage - 1));
    }
    const handleNext = () => {
        setCurrentPage(Math.min(currentPage + 1, Math.ceil(totalItems / itemsPerPage)));
    }

    return (
        images.length >= 1 && (
            <CustomBox width={1}>
                <CustomBackIcon onClick={handlePrev} />

                <ImageList cols={3} rowHeight={200} sx={{ width: 1 }}>
                    {images.slice((currentPage - 1) * itemsPerPage, currentPage * 3).map((item, index) => (
                        <CustomImageListItem key={index}>
                            <ModalImage key={index} path={item} />
                        </CustomImageListItem>
                    ))}
                </ImageList>
                <CustomForwardIcon onClick={handleNext} />
            </CustomBox>
        )
    );
}

const CustomBackIcon = styled(ArrowBackIosIcon)(({ theme }) => ({
    cursor: 'pointer',
}))
const CustomForwardIcon = styled(ArrowForwardIosIcon)(({ theme }) => ({
    cursor: 'pointer',
}))
const CustomBox = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
}))

const CustomImageListItem = styled(ImageList)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))
export default ImagesCarousel;
