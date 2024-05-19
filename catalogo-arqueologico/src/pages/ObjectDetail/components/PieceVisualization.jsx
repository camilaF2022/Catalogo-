import { Canvas, useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from '@react-three/drei'

const PieceVisualization = ({ objPath, mtlPath }) => {
    const material = useLoader(MTLLoader, mtlPath)
    const object = useLoader(OBJLoader, objPath, loader => {
        material.preload()
        loader.setMaterials(material)
    })

    return (
        <div style={{ width: '100%', height: '500px', paddingLeft: "30px", paddingRight:"30px" }} id="canvas-container">
            <Canvas style={{ background: '#2e2d2c' }} camera={{ fov: 25, position: [0, 0, -500] }}>
                <ambientLight intensity={2} />
                <primitive position={[0, 0, 0]} object={object} />
                <OrbitControls />
            </Canvas>
        </div>
    )
}

export default PieceVisualization;