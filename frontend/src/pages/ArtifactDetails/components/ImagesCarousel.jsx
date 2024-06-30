import React from "react";
import ImageModal from "./ImageModal";
import styled from "@mui/material/styles/styled";

const ImagesCarousel = ({ images }) => {
  return (
    images.length >= 1 && (
      <CustomBox>
        <CustomImageList>
          {images.map((item, index) => (
            <CustomImageListItem key={index}>
              <ImageModal key={index} path={item} />
            </CustomImageListItem>
          ))}
        </CustomImageList>
      </CustomBox>
    )
  );
};
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
