import React from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OrbitControls } from "@react-three/drei";
import { styled } from "@mui/material/styles";
import { Tooltip, IconButton } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

/**
 * ModelVisualization component renders a 3D model using OBJLoader and MTLLoader,
 * allowing interaction with the model through OrbitControls and various UI controls.
 * @param {string} objPath - Path to the .obj file of the 3D model.
 * @param {string} mtlPath - Path to the .mtl file (material file) associated with the model.
 */
const ModelVisualization = ({ objPath, mtlPath }) => {
  const material = useLoader(MTLLoader, mtlPath); // Load materials for the model
  material.side = THREE.DoubleSide; // Ensure materials are applied on both sides of the model

  // Load the 3D object using OBJLoader and apply loaded materials
  const object = useLoader(OBJLoader, objPath, (loader) => {
    material.preload(); // Preload materials
    loader.setMaterials(material); // Set loaded materials to the loader
  });

  const canvasRef = useRef(null); // Reference to the canvas element
  const cameraControlsRef = useRef(null); // Reference to the OrbitControls instance

  const [isFullscreen, setIsFullscreen] = useState(false); // State for fullscreen mode

  useEffect(() => {
    // Event listener to detect fullscreen change
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement !== null); // Update fullscreen state
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange); // Add listener
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange); // Cleanup on unmount
    };
  }, []);

  // Request fullscreen for the canvas
  const handleFullscreenClick = () => {
    canvasRef.current.requestFullscreen();
  };

  // Exit fullscreen
  const handleExitFullscreenClick = () => {
    document.exitFullscreen();
  };

  // Zoom in functionality
  const handleZoomIn = () => {
    const currentPosition = cameraControlsRef.current.object.position;
    const zoomFactor = 0.9; // Zoom factor
    const newX = currentPosition.x * zoomFactor; // New X position after zoom
    const newY = currentPosition.y * zoomFactor; // New Y position after zoom
    const newZ = currentPosition.z * zoomFactor; // New Z position after zoom

    cameraControlsRef.current.object.position.set(newX, newY, newZ); // Update camera position
    cameraControlsRef.current.update(); // Update controls
  };

  // Zoom out functionality
  const handleZoomOut = () => {
    const currentPosition = cameraControlsRef.current.object.position;
    const zoomFactor = 1.1; // Zoom factor
    const newX = currentPosition.x * zoomFactor; // New X position after zoom
    const newY = currentPosition.y * zoomFactor; // New Y position after zoom
    const newZ = currentPosition.z * zoomFactor; // New Z position after zoom

    cameraControlsRef.current.object.position.set(newX, newY, newZ); // Update camera position
    cameraControlsRef.current.update(); // Update controls
  };

  return (
    <CustomDiv ref={canvasRef} id="canvas-container">
      {/* Canvas for rendering the 3D model */}
      <CustomCanvas camera={{ fov: 25, position: [0, 0, -500] }}>
        <ambientLight intensity={4} /> {/* Ambient light for the scene */}
        <primitive position={[0, 0, 0]} object={object} /> {/* Render the loaded 3D object */}
        <OrbitControls ref={cameraControlsRef} /> {/* Orbit controls for camera interaction */}
      </CustomCanvas>

      {/* Container for UI controls */}
      <CustomContainer>
        {isFullscreen ? (
          // Button to exit fullscreen mode
          <Tooltip
            title="Exit Fullscreen"
            arrow
            PopperProps={{ container: canvasRef.current }}
            placement="bottom-start"
          >
            <CustomIconButton onClick={handleExitFullscreenClick}>
              <FullscreenExitIcon />
            </CustomIconButton>
          </Tooltip>
        ) : (
          // Button to enter fullscreen mode
          <Tooltip
            title="Fullscreen"
            arrow
            PopperProps={{ container: canvasRef.current }}
            placement="bottom-start"
          >
            <CustomIconButton onClick={handleFullscreenClick}>
              <FullscreenIcon />
            </CustomIconButton>
          </Tooltip>
        )}

        {/* Tooltip with help information */}
        <Tooltip
          title={
            <>
              <h3>Help:</h3>
              <p>
                <CachedIcon /> Orbit: Left click
              </p>
              <p>
                <ZoomInIcon /> Zoom: Scroll wheel
              </p>
              <p>
                <OpenWithIcon /> Pan: Right click
              </p>
            </>
          }
          arrow
          PopperProps={{ container: canvasRef.current }}
          placement="bottom-start"
        >
          <CustomIconButton>
            <QuestionMarkIcon />
          </CustomIconButton>
        </Tooltip>

        {/* Button to zoom in */}
        <Tooltip
          title="Zoom In"
          arrow
          PopperProps={{ container: canvasRef.current }}
        >
          <CustomIconButton onClick={handleZoomIn}>
            <ZoomInIcon />
          </CustomIconButton>
        </Tooltip>

        {/* Button to zoom out */}
        <Tooltip
          title="Zoom Out"
          arrow
          PopperProps={{ container: canvasRef.current }}
        >
          <CustomIconButton onClick={handleZoomOut}>
            <ZoomOutIcon />
          </CustomIconButton>
        </Tooltip>
      </CustomContainer>
    </CustomDiv>
  );
};

// Styled Canvas component for 3D rendering
const CustomCanvas = styled(Canvas)({
  backgroundColor: "#2e2d2c", // Background color for the canvas
});

// Styled div for container
const CustomDiv = styled("div")(({ theme }) => ({
  width: "100%", // Full width
  height: theme.spacing(75), // Fixed height using MUI theme spacing
  position: "relative", // Relative positioning
}));

// Styled IconButton for UI controls
const CustomIconButton = styled(IconButton)({
  color: "white", // White color for icon
});

// Styled div for container of UI controls
const CustomContainer = styled("div")(({ theme }) => ({
  backgroundColor: "transparent", // Transparent background
  height: "50px", // Fixed height
  position: "absolute", // Absolute positioning
  width: "100%", // Full width
  maxWidth: "100%", // Maximum width
  boxSizing: "border-box", // Border-box sizing
  display: "flex", // Flex display
  flexDirection: "row", // Row direction
  paddingLeft: "2%", // Left padding
  paddingRight: "2%", // Right padding
  paddingTop: "1%", // Top padding
  justifyContent: "flex-start", // Justify content to the start
  top: 0, // Align to the top of the parent container
}));

export default ModelVisualization;
