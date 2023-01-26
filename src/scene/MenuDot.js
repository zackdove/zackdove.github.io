import * as THREE from 'three'

const sphereGeo = new THREE.SphereGeometry(0.05, 20, 20);
const cylinderGeo = new THREE.CylinderGeometry(0.003, 0.003);
const whiteMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('blue') })
const raycaster = new THREE.Raycaster();
const length = 2;


export default class MenuDot extends THREE.Group {
  constructor(webgl, section) {
    super()
    this.webgl = webgl
    this.isHit = false;
    this.section = section;

    const outerPoint = new THREE.Mesh(sphereGeo, whiteMat);
    this.outerPoint = outerPoint;
    outerPoint.position.set(2.0, 0, 0);
    this.raycastSphere = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial());
    this.raycastSphere.visible = false;
    outerPoint.add(this.raycastSphere)
    this.add(outerPoint)
    this.point = outerPoint;
    const line = new THREE.Mesh(cylinderGeo, whiteMat);
    line.scale.set(1, length, 1);
    line.position.set(length / 2, 0, 0)
    line.rotation.set(0, 0, Math.PI / 2)
    this.add(line);
    this.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, 0)
    this.xVelocity = (Math.random() * 0.5 + 0.1) * (Math.random() < 0.5 ? -1 : 1)
    this.yVelocity = (Math.random() * 0.5 + 0.1) * (Math.random() < 0.5 ? -1 : 1)

    webgl.hoverables.push(this.raycastSphere);
    webgl.clickables.push(this.raycastSphere)
    this.raycastSphere.handleHover = this.handleHover.bind(this);
    this.raycastSphere.handleNoHover = this.handleNoHover.bind(this);
    this.raycastSphere.handleClick = this.handleClick.bind(this)


  }
  update(dt, time) {
    if (!this.isHit) {
      this.rotation.x += dt * this.xVelocity
      this.rotation.y += dt * this.yVelocity;
    }
  }

  handleHover(){

    this.webgl.textHandler.changeTo(this.section.title)
    this.isHit = true;
    this.webgl.scene.rock.littleDots.setSlerpTo(this.quaternion)
  }

  handleNoHover(){
   
    this.isHit = false;
    // Needs to be called on parent
    this.webgl.scene.rock.littleDots.clearSlerp()

  }

  handleClick(){
    this.section.switchTo();
    this.webgl.scene.rock.moveToTopLeft();
  }

 

}