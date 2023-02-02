import zalgo, { banish, chars } from "@favware/zalgo";
import GlitchedWriter from 'glitched-writer'



export default class TextHandler {
  constructor(webgl) {
    this.topTextEl = document.getElementById('topText')
    this.topText = '∂▓5░24▒▓∆∂'.split('');
    this.topTextBackEl = document.getElementById('topTextBack')
    this.topTextBack = 'zckdzckd'.split('');
    this.backChars = '¡™£¢∞§¶•ªº–≠åß∂ƒ©˙∆˚¬…æ≈ç√∫˜µ≤≥÷Ʃ/?░▒▓<>/                                                '.split('');
    // this.allowedChars = '¡™£¢∞§¶•ªº–≠åß∂ƒ©˙∆˚¬…æ≈ç√∫˜µ≤≥÷/?░▒▓<>/'.split('');
    this.allowedChars = '1234567890░▒▓∂∆æ˚'.split('');
    this.topTextIndex = 0;
    this.topTargetText = '';
    this.isActive = false;
    this.cleared = false;
    this.clearing = false;
    this.isActive = false;
    this.changeTo = this.changeTo.bind(this);
    webgl.onUpdate(this.update.bind(this));
    this.glitchedEl = document.getElementById('glitchedText')
    // this.writer = new GlitchedWriter(this.glitchedEl, {

    // })
    // this.writer.endless(true);
    // this.writer.write('PASSWORD');
    this.isHover = false;
    this.isWriting = false;
    this.chars = '一二三四五六七八九十百千上下左右中大小月日年早木林山川土空田天生花草虫犬人名女男子目耳口手足見音力気円入出立休先夕本文字学校村町森正水火玉王石竹糸貝車金雨赤青白数多少万半形太細広長点丸交光角計直線矢弱強高同親母父姉兄弟妹自友体毛頭顔首心時曜朝昼夜分週春夏秋冬今新古間方北南東西遠近前後内外場地国園谷野原里市京風雪雲池海岩星室戸家寺通門道話言答声聞語読書記紙画絵図工教晴思考知才理算作元食肉馬牛魚鳥羽鳴麦米茶色黄黒来行帰歩走止活店買売午汽弓回会組船明社切電毎合当台楽公引科歌刀番用何'.split('')
    this.text = '牛'.split('')

    this.inActiveTimeout = null;
    this.activeTimeout = null;
    this.activeIndex = 0;
    this.current = '';
    this.startInactiveAnim()
  }

  startInactiveAnim() {
    function doInactive() {
      if (!this.current) {
        if (this.text.length > 1) {
          Math.random() > 0.5 ? this.text[this.text.length - 1] = this.chars[Math.floor(Math.random() * this.chars.length)] : this.text.pop()
        } else {
          this.text = this.chars[Math.floor(Math.random() * this.chars.length)].split('')
        }

        this.glitchedEl.innerHTML = this.text.join('');
        this.inActiveTimeout = setTimeout(doInactive, 50);
      }
    }
    doInactive = doInactive.bind(this);
    doInactive();
  }

  startActiveAnim(t) {
    function doActive() {

      if (this.current && this.current == t) {

        if (this.text[this.activeIndex] == t[this.activeIndex]) {
          this.activeIndex++;
        }
        if (this.activeIndex >= t.length) {
          // console.log('reached end')
          // console.log(this.text)
          if (this.text.join('') !== t) {
            Math.random() > 0.5 ? this.text[this.text.length - 1] = this.chars[Math.floor(Math.random() * this.chars.length)] : this.text.pop()
            this.glitchedEl.innerHTML = this.text.join('');
            this.activeTimeout = setTimeout(doActive, 10);
          }
        } else {
            // Try random chars
            // this.text[this.activeIndex] = Math.random() > 0.5 ? this.chars[Math.floor(Math.random()*this.chars.length)] : t[Math.floor(Math.random() * t.length)]
            this.text[this.activeIndex] = Math.random() > 0.5 ?
              this.chars[Math.floor(Math.random() * this.chars.length)] :
              t[this.activeIndex]
            this.glitchedEl.innerHTML = this.text.join('');
            this.activeTimeout = setTimeout(doActive, 50);
        }

      }
    }
    doActive = doActive.bind(this);
    doActive();
  }

  changeOneTop() {
    if (!this.isActive) {
      this.topText[Math.floor(Math.random() * 10)] = zalgo(this.allowedChars[Math.floor(Math.random() * this.allowedChars.length)])
      this.topTextEl.innerHTML = this.topText.join('');
    }

  }

  changeOneTopBack() {
    this.topTextBack[Math.floor(Math.random() * this.topTextBack.length)] = this.backChars[Math.floor(Math.random() * this.backChars.length)]
    this.topTextBackEl.innerHTML = this.topTextBack.join('');
  }

  changeTo(text) {
    // console.log(text)
    if (!this.current || this.current !== text) {
      this.current = text;
      this.activeIndex = 0;
      this.startActiveAnim(text)
    }
    // if (!this.isHover ){
    //   // this.isHover = true;
    //   // this.writer.goalText = 'OOOO'
    //   // this.writer.endless(false)
    //   // console.log('changeto')

    // }
  }




  clearActive() {
    if (this.current) {
      this.current = '';
      this.startInactiveAnim()
    }
  }

  zalgify() {
    this.topTextEl.innerHTML = zalgo(this.topText.join(''));

  }

  update(dt, time) {
    // console.log(this)
    if (Math.random() > 0.801) {
      // this.topText.innerHTML = time;
      // this.changeOneTop()
    }
    if (Math.random() > 0.961) {
      // this.zalgify()
      // this.changeOneTopBack()
    }
  }
}