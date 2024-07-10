import { Canvas, useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from '@react-three/drei'
import { styled } from "@mui/material/styles";

/**
 * PieceVisualization Component
 *
 * Component for visualizing a 3D piece using OBJ and MTL files.
 *
 * @param {string} objPath - Path to the OBJ file.
 * @param {string} mtlPath - Path to the MTL file.
 */
const PieceVisualization = ({ objPath, mtlPath }) => {
    // Load MTL material
    const material = useLoader(MTLLoader, mtlPath)

    // Load OBJ object and set materials
    const object = useLoader(OBJLoader, objPath, loader => {
        material.preload()
        loader.setMaterials(material)
    })

    return (
        <CustomDiv id="canvas-container">
            {/* Canvas for 3D rendering */}
            <Canvas style={{ background: '#2e2d2c' }} camera={{ fov: 25, position: [0, 0, -500] }}>
                <ambientLight intensity={4} />
                {/* Render OBJ object */}
                <primitive position={[0, 0, 0]} object={object} />
                {/* OrbitControls for interaction */}
                <OrbitControls />
            </Canvas>
            
        </CustomDiv>
    )
}

// Styled div component to contain the Canvas
const CustomDiv = styled('div')(() => ({
    width: '100%', // Full width
    height: '500px', // Fixed height for the visualization
  }));
  
export default PieceVisualization;