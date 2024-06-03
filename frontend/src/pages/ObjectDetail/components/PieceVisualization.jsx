import { Canvas, useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from '@react-three/drei'
import { styled } from "@mui/material/styles";

const PieceVisualization = ({ objPath, mtlPath }) => {
    const material = useLoader(MTLLoader, mtlPath)
    const object = useLoader(OBJLoader, objPath, loader => {
        material.preload()
        loader.setMaterials(material)
    })

    return (
        <CustomDiv id="canvas-container">
            <Canvas style={{ background: '#2e2d2c' }} camera={{ fov: 25, position: [0, 0, -500] }}>
                <ambientLight intensity={4} />
                <primitive position={[0, 0, 0]} object={object} />
                <OrbitControls />
            </Canvas>
            
        </CustomDiv>
    )
}

const CustomDiv = styled('div')(() => ({
    width: '100%',
    height: '500px',
  }));
  
export default PieceVisualization;