import React, { useEffect, useRef } from "react";
import { Text } from "@react-three/drei";

import WavesCPCBase from '../fonts/wavesCPC/WavesBlackletterCPC-Base.otf'
import { DoubleSide, Material, MeshBasicMaterial, CustomBlending,  SubtractEquation, SrcAlphaFactor, DstAlphaFactor, RepeatWrapping} from "three";

import blurredMap from '../images/ouside-afternoon-blurred-hdr.jpg'
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import useWindowDimensions from "../Hooks/UseWindowDimensions";

export default function Logo(props){

    const blurredMapText = useLoader(TextureLoader, blurredMap );
    blurredMapText.wrapS = RepeatWrapping;
    blurredMapText.wrapT = RepeatWrapping;
    blurredMapText.repeat.x = 0.6;
    blurredMapText.repeat.y = 0.6;
    const text = useRef();

    var characters = 'ZCKD'
    var fontSize="2.2"

    const { height, width } = useWindowDimensions();

    if (width/height < 789/1182){
        console.log('she small')
        characters = 'Z\nC\nK\nD'
        fontSize = 1;
    }

    
    useFrame(({ clock }) => {
        // console.log("Hey, I'm executing every frame!")
        blurredMapText.offset.x = clock.getElapsedTime() / 32;
      })
    
    return(

            <Text  font={WavesCPCBase} sdfGlyphSize={512} fontSize={fontSize} anchorX="center" anchorY="middle" position={[0, 0, -30]} scale={[-1, 1, 1]}>
                {characters}
                <meshBasicMaterial attach="material" color={0xaaffaa} side={DoubleSide} blending={CustomBlending} blendEquation={SubtractEquation} blendSrc={SrcAlphaFactor} blendDst={DstAlphaFactor} map={blurredMapText}/>
            </Text>

    
    )
}