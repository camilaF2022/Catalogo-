import { Canvas, useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from '@react-three/drei'
import { styled } from "@mui/material/styles";
import { Tooltip, IconButton, List, ListItem } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';


const PieceVisualization = ({ objPath, mtlPath }) => {
    const material = useLoader(MTLLoader, mtlPath)
    material.side = THREE.DoubleSide;
    const object = useLoader(OBJLoader, objPath, loader => {
        material.preload()
        loader.setMaterials(material)
    })
    const canvasRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        function handleFullscreenChange() {
            setIsFullscreen(document.fullscreenElement !== null);
        }
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const handleFullscreenClick = () => {
        canvasRef.current.requestFullscreen();
    }

    const handleExitFullscreenClick = () => {
        document.exitFullscreen();
    }

    return (
        <CustomDiv ref={canvasRef} id="canvas-container">
            <CustomCanvas camera={{ fov: 25, position: [0, 0, -500] }}>
                <ambientLight intensity={4} />
                <primitive position={[0, 0, 0]} object={object} />
                <OrbitControls />
            </CustomCanvas>
            <CustomContainer  >
                {isFullscreen ?
                    <Tooltip title="Pantalla normal" arrow PopperProps={{ container: canvasRef.current }} placement='bottom-start'>
                        <CustomIconButton onClick={handleExitFullscreenClick}>
                            <FullscreenExitIcon />
                        </CustomIconButton>
                    </Tooltip>
                    :
                    <Tooltip title="Pantalla completa" arrow PopperProps={{ container: canvasRef.current }} placement='bottom-start'>
                        <CustomIconButton onClick={handleFullscreenClick} >
                            <FullscreenIcon />
                        </CustomIconButton>
                    </Tooltip>
                }
                <Tooltip
                    placement='bottom-start'
                    title={<>
                        <h3>Ayuda:</h3>
                        <List >
                            <ListItem><CachedIcon /> Orbitar: Click izquierdo </ListItem>
                            <ListItem> <ZoomInIcon /> Zoom: scroll o rueda </ListItem>
                            <ListItem> <OpenWithIcon /> Arrastrar: Click derecho</ListItem>
                        </List>
                    </>}
                    arrow
                    PopperProps={{ container: canvasRef.current }}
                >

                    <CustomIconButton  >
                        <QuestionMarkIcon />
                    </CustomIconButton>
                </Tooltip>
            </CustomContainer>
        </CustomDiv >
    )
}

const CustomCanvas = styled(Canvas)({
    backgroundColor: '#2e2d2c',
})
const CustomDiv = styled('div')(() => ({
    width: '100%',
    height: '600px',
    position: 'relative',
}));

const CustomIconButton = styled(IconButton)({
    color: 'white'
});
const CustomContainer = styled('div')(({ theme }) => ({
    backgroundColor: 'transparent',
    height: "50px",
    position: "absolute",
    width: "100%",
    maxWidth: "100%",
    boxSizing: 'border-box',
    display: "flex",
    flexDirection: "row",
    paddingLeft: "2%",
    paddingRight: "2%",
    paddingTop: "1%",
    justifyContent: "flex-start",
    top: 0,
}));

export default PieceVisualization;