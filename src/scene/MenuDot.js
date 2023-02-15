import * as THREE from 'three'
import { CSS3DObject } from '../utils/CSS3DRenderer';

const sphereGeo = new THREE.SphereGeometry(0.05, 20, 20);
const cylinderGeo = new THREE.CylinderGeometry(0.003, 0.003);
const whiteMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('blue') })
const raycaster = new THREE.Raycaster();
const length = 2;

const allowedChars = '一二三四五六七八九十百千上下左右中大小月日年早木林山川土空田天生花草虫犬人名女男子目耳口手足見音力気円入出立休先夕本文字学校村町森正水火玉王石竹糸貝車金雨赤青白数多少万半形太細広長点丸交光角計直線矢弱強高同親母父姉兄弟妹自友体毛頭顔首心時曜朝昼夜分週春夏秋冬今新古間方北南東西遠近前後内外場地国園谷野原里市京風雪雲池海岩星室戸家寺通門道話言答声聞語読書記紙画絵図工教晴思考知才理算作元食肉馬牛魚鳥羽鳴麦米茶色黄黒来行帰歩走止活店買売午汽弓回会組船明社切電毎合当台楽公引科歌刀番用何'.split('');


export default class MenuDot extends THREE.Group {
  constructor(webgl, section) {
    super()
    this.webgl = webgl
    this.isHit = false;
    this.section = section;


    const outerPoint = new THREE.Mesh(sphereGeo, whiteMat);
    this.outerPoint = outerPoint;
    outerPoint.position.set(2.0, 0, 0);
    this.raycastSphere = new THREE.Mesh(new THREE.SphereGeometry(this.webgl.isTouch ? 0.3 : 0.1), new THREE.MeshBasicMaterial());
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
    this.xVelocity = (Math.random() * 0.1 + 0.1) * (Math.random() < 0.5 ? -1 : 1)
    this.yVelocity = (Math.random() * 0.1 + 0.1) * (Math.random() < 0.5 ? -1 : 1)

    this.css3DRenderer = this.webgl.cssHandler.css3DRenderer;

    const div = document.createElement('div');
    this.text = this.section.title.split('');
    div.innerHTML = this.section.title
    div.classList.add('menuDotLabel')
    div.classList.add('hidden')
    this.div = div;
    this.cssGroup = new THREE.Group();
    this.objectCSS = new CSS3DObject(div);
    this.objectCSS.position.copy(this.outerPoint.position)
    this.objectCSS.position.multiplyScalar(110)
    this.cssGroup.add(this.objectCSS)
    // this.objectCSS.position.set(100,1,0)
    // this.cssGroup.rotation.copy(this.rotation);
    this.cssGroup.position.set(0, 0, -6)
    this.cssGroup.scale.setScalar(0.01)
    this.webgl.cssHandler.scene.add(this.cssGroup)


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
      this.outerPoint.getWorldPosition(this.objectCSS.position).multiplyScalar(110)
      // console.log(this.objectCSS.position.z)
      this.div.style.opacity = this.webgl.isMobileLayout ?
        this.webgl.scene.rock.menuDots.scale.x * (this.objectCSS.position.z + 102) / 30 :
        this.webgl.scene.rock.menuDots.scale.x * (this.objectCSS.position.z + 170) / 50;
      // this.cssGroup.rotation.x += dt * this.xVelocity
      // this.cssGroup.rotation.y += dt * this.yVelocity;
    }
    if (Math.random() > 0.97) {
      this.changeChar();
    } else if (Math.random() > 0.8) {
      this.resetChar();
    }
  }

  resetText() {
    this.text = this.section.title.split('');
    this.div.innerHTML = this.text.join('')
  }

  resetChar() {
    const i = Math.floor(Math.random() * this.section.title.length);
    this.text[i] = this.section.title[i];
    this.div.innerHTML = this.text.join('')

  }

  changeChar() {
    this.text[Math.floor(Math.random() * this.section.title.length)] = allowedChars[Math.floor(Math.random() * allowedChars.length)]
    this.div.innerHTML = this.text.join('')
  }

  handleHover() {

    this.webgl.textHandler.changeTo(this.section.title)
    this.isHit = true;
    this.webgl.scene.rock.littleDots.setSlerpTo(this.quaternion)
  }

  handleNoHover() {

    this.isHit = false;
    // Needs to be called on parent
    this.webgl.scene.rock.littleDots.clearSlerp()

  }

  handleClick() {
    this.webgl.scene.rock.moveToTopLeft();
    history.replaceState(null, '', '?' + this.section.title.toLowerCase());
    setTimeout(() => this.section.switchTo(), 1000)
  }



}