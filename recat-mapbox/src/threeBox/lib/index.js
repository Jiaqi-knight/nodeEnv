import ThreeBox from "../ThreeBox"
import Scan from "./effectStore/Scan"
import Shine from "./effectStore/Shine"
import Physics from "./effectStore/Physics"
import FixBug from "./effectStore/FixBug"

import Shader from "./effectStore/Shader"

class THREE extends ThreeBox{
  constructor(map,size,threeDomId,center,react){
    super(map,size,threeDomId,center)
    // this.register(new Scan(this))
    // this.disRegisterAll()
    this.init()
  }
  loaded(){
    // this.register(new Shine(this))
    // this.register(new Physics(this))
    // this.register(new FixBug(this))
    this.register(new Shader(this))
  }
}
export default THREE