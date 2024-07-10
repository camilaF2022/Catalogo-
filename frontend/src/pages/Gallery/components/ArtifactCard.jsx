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

/**
 * ArtifactCard Component
 *
 * Represents a card displaying information about a specific artifact.
 * Clicking on the card navigates to the detailed view of the artifact.
 *
 * @param {Object} artifact - The artifact object containing details like id, attributes, and previewPath.
 */
const ArtifactCard = ({ artifact }) => {
  const navigate = useNavigate();
  const { id, attributes, preview: previewPath } = artifact;
  const { shape, tags, culture, description } = attributes;

  // Format artifact number
  const artifactNumber = String(id).padStart(4, "0");

  // Create full title with artifact number and description
  const fullTitle = `#${artifactNumber} ${description}`;
  
  // Create full description by joining tags values with commas
  const fullDescription = tags.map(tag=>tag.value).join(", ");

  // Handle click on card to navigate to artifact detail page
  const handleRedirect = () => {
    navigate(`/catalog/${id}`);
  };
  
  return (
    <Card>      
      {/* Card media (preview image) with click handler for navigation */}
      <CustomCardMedia
        component="img"
        height="140"
        image={previewPath}
        alt={id}
        onClick={handleRedirect}
      />
      <CustomCardContent>
        <CustomBox>
          {/* Title of the artifact */}
          <CardTitle variant="p">{fullTitle}</CardTitle>
        </CustomBox>
        <CustomBox>
          {/* Description of the artifact */}
          <CardDescription variant="p">{fullDescription}</CardDescription>
        </CustomBox>
        {/* Container for metadata (shape and culture tags) */}
        <MetadataContainer>
          {/* Chip component for shape tag */}
          <CustomShapeTag label={shape.value} size="small" />
          {/* Chip component for culture tag */} 
          <CustomCultureTag label={culture.value} size="small" />
        </MetadataContainer>
      </CustomCardContent>
    </Card>
  );
};

// Styled components for custom styling of Material-UI components

// Custom styled CardMedia for the artifact preview image
const CustomCardMedia = styled(CardMedia)(({ theme }) => ({
  cursor: "pointer",
}));

// Custom styled Box component for layout and text overflow handling
const CustomBox = styled(Box)(({ theme }) => ({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

// Custom styled CardContent for the artifact card content
const CustomCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  rowGap: 5,
}));

// Custom styled Typography component for the artifact title
const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: 18,
}));

// Custom styled Typography component for the artifact description
const CardDescription = styled(Typography)(({ theme }) => ({
  fontSize: 10,
}));

// Custom styled Box component for metadata container (shape and culture tags)
const MetadataContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  gap: theme.spacing(1),
}));

// Custom styled Chip component for shape tag
const CustomShapeTag = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.tags.shape,
  fontSize: 10,
}));

// Custom styled Chip component for culture tag
const CustomCultureTag = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.tags.culture,
  fontSize: 10,
}));

export default ArtifactCard;
