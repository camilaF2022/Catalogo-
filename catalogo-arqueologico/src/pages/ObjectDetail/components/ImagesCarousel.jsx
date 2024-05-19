import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {  Box, ImageList, ImageListItem } from '@mui/material'
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
        <CustomBox  >
            <ArrowBackIosIcon onClick={handlePrev} />
            <Box >
                <ImageList cols={3} rowHeight={250} >
                    {images.slice((currentPage - 1) * itemsPerPage, currentPage * 3).map((item, index) => (
                        <ImageListItem key={index}>
                            <ModalImage key={index} path={item} />
                        </ImageListItem>
                    ))}
                </ImageList>

            </Box>
            <ArrowForwardIosIcon onClick={handleNext} />
        </CustomBox>

    );
}

const CustomBox = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
}))
export default ImagesCarousel;
