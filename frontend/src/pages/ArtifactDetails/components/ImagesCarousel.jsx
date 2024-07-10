import React from "react";
import ImageModal from "./ImageModal";
import styled from "@mui/material/styles/styled";

/**
 * ImagesCarousel displays a carousel of images with ImageModal components.
 * Each image can be clicked to open in a modal for a larger view.
 * @param {Array} images - Array of image paths to be displayed.
 * @returns {JSX.Element|null} Component for displaying a carousel of images.
 */
const ImagesCarousel = ({ images }) => {
  return (
  // Renders the carousel only if there are images
    images.length >= 1 && (
      <CustomBox>
      {/* Container for the list of images */}
        <CustomImageList>
        {/* Maps through the images array to display each image */}
          {images.map((item, index) => (
            <CustomImageListItem key={index}>
            {/* ImageModal component for each image */}
              <ImageModal key={index} path={item} />
            </CustomImageListItem>
          ))}
        </CustomImageList>
      </CustomBox>
    )
  );
};

// Styled components for custom styling
const CustomImageList = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(0.5),
}));

const CustomBox = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  width: theme.spacing(45.2),
  position: "relative",
}));

const CustomImageListItem = styled("div")(({ theme }) => ({
  display: "flex",
  width: theme.spacing(12.5),
  height: theme.spacing(12.5),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1.25),
  backgroundColor: "#bdbdbd",
  justifyContent: "center",
}));
export default ImagesCarousel;
