import React from "react";
import ImageModal from "./ImageModal";
import styled from "@mui/material/styles/styled";

/**
 * ImagesCarousel component displays a carousel of images with modal functionality.
 * @param {Array<string>} images - Array of image paths to display in the carousel.
 */
const ImagesCarousel = ({ images }) => {
  return (
    images.length >= 1 && (
      <CustomBox>
        <CustomImageList>
          {images.map((item, index) => (
            <CustomImageListItem key={index}>
              {/* Each image is wrapped in an ImageModal component */}
              <ImageModal key={index} path={item} />
            </CustomImageListItem>
          ))}
        </CustomImageList>
      </CustomBox>
    )
  );
};

// Styled components for customizing layout and appearance

// Styled div for the list of images
const CustomImageList = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(0.5),
}));

// Styled div for the container box of the carousel
const CustomBox = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  width: theme.spacing(45.2), // Fixed width for the carousel
  position: "relative",
}));

// Styled div for each individual image item in the carousel
const CustomImageListItem = styled("div")(({ theme }) => ({
  display: "flex",
  width: theme.spacing(12.5), // Fixed width for each image item
  height: theme.spacing(12.5), // Fixed height for each image item
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1.25), // Rounded corners
  backgroundColor: "#bdbdbd", // Gray background color
  justifyContent: "center",
}));

export default ImagesCarousel;
