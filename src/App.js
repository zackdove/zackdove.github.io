import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import './App.css';
import ZckdScene from './Components/ZckdScene';
import Logo from './Components/Logo';



export default function App() {
    const [enter, setEnter] = useState(false);
    const handleCanvasClick = () => {
        setEnter(true);
    }
  return (
    <Canvas onClick={handleCanvasClick}>
        <ZckdScene enter={enter}/>
        <Logo/>

    </Canvas>
  )
}
