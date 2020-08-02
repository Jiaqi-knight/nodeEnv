import React from 'react';
import './styles/App.css';
import Hellopoint from './pages/HelloPoint1'
import Hellopoint2 from './pages/HelloPoint2'
import HelloTriangle from './pages/HelloTriangle'
import HelloTriangle2 from './pages/HelloTriangle2'
import TriangleMVPMatrix from './pages/TriangleMVPMatrix'
import TriangleMVPMatrix2 from './pages/TriangleMVPMatrix2'
import TriangleMVPMatrix3 from './pages/TriangleMVPMatrix3'
import TriangleMVPMatrix4 from './pages/TriangleMVPMatrix4'
import TerrainViewer from './pages/TerrainViewer'
import TerrainViewer2 from './pages/TerrainViewer2'
import TerrainViewer3 from './pages/TerrainViewer3'
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){
    return(
    <div id="container">
      <Hellopoint />
      <Hellopoint2 />
      <HelloTriangle />
      <HelloTriangle2 />
      <TriangleMVPMatrix />
      <TriangleMVPMatrix2 />
      <TriangleMVPMatrix3 />
      <TriangleMVPMatrix4 />
      <TerrainViewer />
      <TerrainViewer2 />
      <TerrainViewer3 />
    </div>)
  }
}

export default App;
