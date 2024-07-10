import React, { useRef, useState, useEffect } from "react";
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
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import * as THREE from "three";

/**
 * ModelVisualization component displays a 3D model using Three.js within a React Three Fiber Canvas.
 * It supports loading OBJ and MTL files, controlling camera, zooming, fullscreen mode, and tooltips.
 * @param {Object} props - Component props.
 * @param {string} props.objPath - Path to the OBJ model file.
 * @param {string} props.mtlPath - Path to the MTL material file for the OBJ model.
 * @returns {JSX.Element} Component for visualizing a 3D model with interactive controls.
 */
const ModelVisualization = ({ objPath, mtlPath }) => {
  const material = useLoader(MTLLoader, mtlPath); // Load MTL material
  material.side = THREE.DoubleSide; // Ensure material is double-sided

  // Load OBJ model and set materials
  const object = useLoader(OBJLoader, objPath, (loader) => {
    material.preload();
    loader.setMaterials(material);
  });

  const canvasRef = useRef(null); // Reference to the Canvas element
  const cameraControlsRef = useRef(null); // Reference to OrbitControls for camera manipulation
  const [isFullscreen, setIsFullscreen] = useState(false); // State for fullscreen mode

  useEffect(() => {
    // Event listener to detect fullscreen changes
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement !== null);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Function to request fullscreen mode
  const handleFullscreenClick = () => {
    canvasRef.current.requestFullscreen();
  };

  // Function to exit fullscreen mode
  const handleExitFullscreenClick = () => {
    document.exitFullscreen();
  };

  // Function to zoom in on the model
  const handleZoomIn = () => {
    const currentPosition = cameraControlsRef.current.object.position;
    const zoomFactor = 0.9;
    const newX = currentPosition.x * zoomFactor;
    const newY = currentPosition.y * zoomFactor;
    const newZ = currentPosition.z * zoomFactor;
    cameraControlsRef.current.object.position.set(newX, newY, newZ);
    cameraControlsRef.current.update();
  };

  // Function to zoom out from the model
  const handleZoomOut = () => {
    const currentPosition = cameraControlsRef.current.object.position;
    const zoomFactor = 1.1;
    const newX = currentPosition.x * zoomFactor;
    const newY = currentPosition.y * zoomFactor;
    const newZ = currentPosition.z * zoomFactor;
    cameraControlsRef.current.object.position.set(newX, newY, newZ);
    cameraControlsRef.current.update();
  };

  return (
    <CustomDiv ref={canvasRef} id="canvas-container">
      {/* Three.js Canvas for rendering the 3D model */}
      <CustomCanvas camera={{ fov: 25, position: [0, 0, -500] }}>
        <ambientLight intensity={4} /> {/* Ambient light for the scene */}
        <primitive position={[0, 0, 0]} object={object} /> {/* OBJ model */}
        <OrbitControls ref={cameraControlsRef} /> {/* OrbitControls for camera */}
      </CustomCanvas>
      
      {/* Container for control buttons */}
      <CustomContainer>
        {isFullscreen ? (
          // Button to exit fullscreen mode
          <Tooltip
            title="Pantalla normal"
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
            title="Pantalla completa"
            arrow
            PopperProps={{ container: canvasRef.current }}
            placement="bottom-start"
          >
            <CustomIconButton onClick={handleFullscreenClick}>
              <FullscreenIcon />
            </CustomIconButton>
          </Tooltip>
        )}
        
        {/* Tooltip for help information */}
        <Tooltip
          placement="bottom-start"
          title={
            <>
              <h3>Ayuda:</h3>
              <p><CachedIcon /> Orbitar: Click izquierdo</p>
              <p><ZoomInIcon /> Zoom: scroll o rueda</p>
              <p><OpenWithIcon /> Arrastrar: Click derecho</p>
            </>
          }
          arrow
          PopperProps={{ container: canvasRef.current }}
        >
          <CustomIconButton>
            <QuestionMarkIcon />
          </CustomIconButton>
        </Tooltip>
        
        {/* Button to zoom in */}
        <Tooltip
          title="Ampliar Zoom"
          arrow
          PopperProps={{ container: canvasRef.current }}
        >
          <CustomIconButton onClick={handleZoomIn}>
            <ZoomInIcon />
          </CustomIconButton>
        </Tooltip>
        
        {/* Button to zoom out */}
        <Tooltip
          title="Alejar Zoom"
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

// Styled components for customizing the Canvas and IconButton
const CustomCanvas = styled(Canvas)({
  backgroundColor: "#2e2d2c",
});

const CustomDiv = styled("div")(({ theme }) => ({
  width: "100%",
  height: theme.spacing(75),
  position: "relative",
}));

const CustomIconButton = styled(IconButton)({
  color: "white",
});

const CustomContainer = styled("div")(({ theme }) => ({
  backgroundColor: "transparent",
  height: "50px",
  position: "absolute",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  paddingLeft: "2%",
  paddingRight: "2%",
  paddingTop: "1%",
  justifyContent: "flex-start",
  top: 0,
}));

export default ModelVisualization;
