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
import { styled } from "@mui/material/styles";

const ArtifactCard = ({ artifact }) => {
  const navigate = useNavigate();
  const { id, attributes, thumbnail: previewPath } = artifact;
  const { shape, tags, culture, description } = attributes;

  const flattenTags = tags.map((tag) => tag.value).join(", ");

  const slicedTags = tags
    .slice(0, 2)
    .map((tag) => tag.value)
    .join(", ")
    .concat(`${tags.length > 2 ? `, (+${tags.length - 2})` : ""}`);

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
        <MetadataContainer>
          <CustomShapeTag label={shape.value} size="small" />
          <CustomCultureTag label={culture.value} size="small" />
        </MetadataContainer>
        <Typography variant="h5" component="div">
          Pieza {id}
        </Typography>
        <Tooltip arrow title={tags.length > 2 ? flattenTags : ""}>
          <EllipsisBox>
            <Typography
              color="text.secondary"
              overflow={"hidden"}
              textOverflow={"ellipsis"}
            >
              {slicedTags ? `Etiquetas: ${slicedTags}` : "Sin etiquetas"}
            </Typography>
          </EllipsisBox>
        </Tooltip>
        <Tooltip arrow title={description.length > 50 ? description : ""}>
          <EllipsisBox>
            <Typography
              variant="body2"
              overflow={"hidden"}
              textOverflow={"ellipsis"}
            >
              {description}
            </Typography>
          </EllipsisBox>
        </Tooltip>
      </CustomCardContent>
    </Card>
  );
};

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
}));

const CustomCultureTag = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.tags.culture,
  fontSize: 10,
}));

export default ArtifactCard;
