

import React, { useRef, Suspense, useEffect } from "react";
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from "@react-three/drei";
import Bridge from "./Bridge"
import gsap from 'gsap';

export default function ZckdScene({ enter }) {
    const camera = useThree((state) => state.camera)
    if (enter == false){
        camera.position.set(0, 0, -45);
    }
    
    camera.lookAt(0, 0, 20)
    camera.near = 2.5;
    camera.fov = 45;
    camera.updateProjectionMatrix();

    console.log(enter)

    useEffect(() => {
        console.log(enter)
        if (enter){
            gsap.to(camera.position, {
                z: -10,
                duration: 2,
                overwrite: false,
                ease: "power2.inOut",
                onStart: function () {
                    // setTimeout( () => {
                    //     document.getElementById('menuPopup').classList.remove('transparent')
                    // }, 1000)
                },
                onComplete: function () {
    
                }
            })
        }
    }, [enter]);

   

    return (<>
        <ambientLight intensity={0.7} />
        <Suspense fallback={null}>
            <Bridge position={[0, -8, 0]} enter={enter}>
                
            </Bridge>
        </Suspense>
    </>
    );
}

