import { Html } from "@react-three/drei";
import { useRef, useEffect } from "react";


export default function Menu(props) {
    const enter = props.enter;
    const refs = useRef([]);
    // const menuPopup = useRef();
    // const htmlObj = useRef();
    useEffect(() => {
        console.log(enter)
        if (enter){
           setTimeout( () => {
            refs.current[1].classList.add('visible');
           }, 1000);
        }
    }, [enter]);

    useEffect(() => {
        console.log(props.backwards)
        console.log(refs.current[0]);
        if (props.backwards){
            refs.current[0].scale.x = -1;
        } else {
            refs.current[0].scale.x = 1;
        }
    }, [props.backwards]);

    return (
    <group ref={(el) => {refs.current[0] = el}}>
        <Html  transform position={[0, 8.3, 0]} scale={[0.5, 0.5, 0.5]}>
            <div id="menuPopup" ref={(el) => {refs.current[1] = el}}>
                <div>Z C K D</div>
                <div>Creative Technologist / 3D Designer</div>
                <div>Website in (Re)Development</div>
                <div><a href="mailto:zack@zckd.me">zack@zckd.me</a></div>
            </div>
        </Html>
    </group>
    );
}

