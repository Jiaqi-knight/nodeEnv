import * as THREE from 'three'
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
const {Scene,PerspectiveCamera,WebGLRenderer} = THREE

export default class Physics{
    /**
     * @param {{camera:PerspectiveCamera,scene:Scene,renderer:WebGLRenderer}}threeBox
     */
    constructor(threeBox){
        this.name = 'Physics'
        this.threeBox = threeBox
        this.Event = {
          clickEvent:null
        }
        this.mountArray = []
        this.boxGroup = new THREE.Group()
        this.boxGroup.name = 'boxGroup'
        this.initEvent()
        this.init()
    }
    init(){
      let geo  =new THREE.ConeBufferGeometry(2, 4, 4)
      let mat = new THREE.MeshLambertMaterial({
            color: 0xffffff * Math.random(),
            transparent: true,
            opacity: 0.8
        })
      let boxArr = []
      for(let i =0 ;i<10;i++){
        let box = new THREE.Mesh(geo,mat);
        box.position.x = i+Math.random() * 3;
        box.position.z = i+Math.random() * 5;
        this.boxGroup.add(box)
        boxArr.push(box)
      }
      this.threeBox.scene.add(this.boxGroup)

      this.controls = new TrackballControls(
        this.threeBox.camera,
        this.threeBox.renderer.domElement
      );

      this.transform = new TransformControls(
        this.threeBox.camera,
        this.threeBox.renderer.domElement
      );
      this.threeBox.scene.add(this.transform);

      this.dragControl = new DragControls(
        [...boxArr],
        this.threeBox.camera,
        this.threeBox.renderer.domElement
      );

      this.listener()
    }
    listener() {
      let param = {distance:0.001}
      window.gui.add(param,'distance',0.1,10).onChange((val)=>{
        param.distance = val
      })
      this.dragControl.addEventListener('hoveron',event => {
        this.threeBox.addSelect(event.object)
        this.transform.attach(event.object)

      })
      this.dragControl.addEventListener('hoveroff',event => {
      })
      this.dragControl.addEventListener('dragstart',event => {
        this.threeBox.controls.enableRotate = false
      })
      this.dragControl.addEventListener('dragend',(event)=>{
        console.log('dragend',event)
        let collidableMeshList = this.boxGroup.children.map(el=>{if(el.uuid!==event.object.uuid) return el})
        let origin = event.object
        let originPoint = event.object.position.clone()
        let vector = new THREE.Vector3()
        for(let i = 0; i < originPoint.length;i++){
          let position = originPoint.geometry.attributes.position
          vector.fromBufferAttribute(position,i)
          let globalVertex = vector.applyMatrix4(origin.matrixWorld)
          let directionVector = globalVertex.sub(origin.position)

          let ray = new THREE.Raycaster(originPoint,directionVector.clone().normalize())
          let collisionResults = ray.intersectObjects(collidableMeshList)
          if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
            console.log('发生碰撞')
          }
        }
        this.threeBox.controls.enableRotate = true
        // for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++)
        // {
        //   var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
        //   var globalVertex = localVertex.applyMatrix4( MovingCube.matrix );
        //   var directionVector = globalVertex.sub( MovingCube.position );
        //
        //   var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        //   var collisionResults = ray.intersectObjects( collidableMeshList );
        //   if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
        //     appendText(" Hit ");
        // }
      })
    }
    initEvent(){
        // this.Event.resizeEvent
        this.Event.clickEvent = (e,meshs)=>{

        }
    }
    render(){
        this.boxGroup.children.forEach(el=>{
          el.geometry.attributes.position.needsUpdate = true
          el.geometry.verticesNeedUpdate  = true
        })
    }
}