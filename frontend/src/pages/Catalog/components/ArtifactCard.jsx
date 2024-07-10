import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import { Category, Diversity3 } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

/**
 * Component for displaying an artifact card.
 * Renders artifact metadata and provides navigation to artifact details.
 *
 * @param {Object} artifact - The artifact object containing metadata.
 */
const ArtifactCard = ({ artifact }) => {
  const navigate = useNavigate();

  // Destructure artifact properties
  const { id, attributes, thumbnail: previewPath } = artifact;
  const { shape, tags, culture, description } = attributes;

  // Flatten tags for display
  const flattenTags = tags.map((tag) => tag.value).join(", ");

  // Slice tags to show first two and append count if more
  const slicedTags = tags
    .slice(0, 2)
    .map((tag) => tag.value)
    .join(", ")
    .concat(`${tags.length > 2 ? `, (+${tags.length - 2})` : ""}`);

  // Handle click to navigate to detailed artifact page
  const handleRedirect = () => {
    navigate(`/catalog/${id}`);
  };

  return (
    <Card>
      {/* Display thumbnail or default image */}
      {previewPath ? (
        <CustomCardMedia
          component="img"
          height="140"
          image={previewPath}
          alt={id}
          onClick={handleRedirect}
          style={{ objectFit: "contain", backgroundColor: "black" }}
        />
      ) : (
        <CustomCardMedia
          component="img"
          height="140"
          image="/not_found_image.png"
          alt={id}
          onClick={handleRedirect}
        />
      )}

      <CustomCardContent>
        {/* Metadata container for shape and culture */}
        <MetadataContainer>
          {/* Custom chip for shape */}
          <CustomShapeTag
            label={shape.value}
            size="small"
            icon={<Category color="inherit" fontSize="small" />}
          />
          {/* Custom chip for culture */}
          <CustomCultureTag
            label={culture.value}
            size="small"
            icon={<Diversity3 color="inherit" fontSize="small" />}
          />
        </MetadataContainer>

        {/* Display artifact ID */}
        <Typography variant="h5" component="div">
          Pieza {id}
        </Typography>

        {/* Display tags with tooltip if more than two */}
        <Tooltip arrow title={tags.length > 2 ? flattenTags : ""}>
          <EllipsisBox>
            <Typography color="text.secondary">
              {slicedTags ? `Etiquetas: ${slicedTags}` : "Sin etiquetas"}
            </Typography>
          </EllipsisBox>
        </Tooltip>

        {/* Display description with tooltip if longer than 50 characters */}
        <Tooltip arrow title={description.length > 50 ? description : ""}>
          <EllipsisBox>
            <Typography variant="body2">{description}</Typography>
          </EllipsisBox>
        </Tooltip>
      </CustomCardContent>
    </Card>
  );
};

// Styled components for custom styling
const CustomCardMedia = styled(CardMedia)(({ theme }) => ({
  cursor: "pointer",
}));

const EllipsisBox = styled(Box)(({ theme }) => ({
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

const MetadataContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  gap: theme.spacing(1),
}));

const CustomShapeTag = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.tags.shape,
  fontSize: 10,
  height: 24,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  '& .MuiChip-icon': {
    fontSize: 14,
  },
}));

const CustomCultureTag = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.tags.culture,
  fontSize: 10,
  height: 24,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  '& .MuiChip-icon': {
    fontSize: 14,
  },
}));

export default ArtifactCard;
