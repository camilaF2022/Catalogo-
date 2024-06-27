import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const ArtifactCard = ({ artifact }) => {
  const navigate = useNavigate();
  const { id, attributes, preview: previewPath } = artifact;
  const { shape, tags, culture, description } = attributes;
  const artifactNumber = String(id).padStart(4, "0");
  const fullTitle = `#${artifactNumber} ${description}`;
  
  const fullDescription = tags.map(tag=>tag.value).join(", ");
  const handleRedirect = () => {
    navigate(`/catalog/${id}`);
  };
  
  return (
    <Card>
      {previewPath ? (
        <CustomCardMedia
          component="img"
          height="140"
          image={previewPath}
          alt={id}
          onClick={handleRedirect}
        />
      ): 
        <CustomCardMedia
          component="img"
          height="140"
          image="/not_found_image.png"
          alt={id}
          onClick={handleRedirect}
        />
      }  
      <CustomCardContent>
        <CustomBox>
          <CardTitle variant="p">{fullTitle}</CardTitle>
        </CustomBox>
        <CustomBox>
          <CardDescription variant="p">{fullDescription}</CardDescription>
        </CustomBox>
        <MetadataContainer>
          <CustomShapeTag label={shape.value} size="small" />
          <CustomCultureTag label={culture.value} size="small" />
        </MetadataContainer>
      </CustomCardContent>
    </Card>
  );
};

const CustomCardMedia = styled(CardMedia)(({ theme }) => ({
  cursor: "pointer",
}));

const CustomBox = styled(Box)(({ theme }) => ({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const CustomCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  rowGap: 5,
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: 18,
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  fontSize: 10,
}));

const MetadataContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  gap: theme.spacing(1),
}));

const CustomShapeTag = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.tags.shape,
  fontSize: 10,
}));

const CustomCultureTag = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.tags.culture,
  fontSize: 10,
}));

export default ArtifactCard;
