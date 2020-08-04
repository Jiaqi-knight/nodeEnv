import React from "react";

import Hellopoint from "@/pages/webGlSimpleTutorial/HelloPoint1";
import Hellopoint2 from "@/pages/webGlSimpleTutorial/HelloPoint2";
import HelloTriangle from "@/pages/webGlSimpleTutorial/HelloTriangle";
import HelloTriangle2 from "@/pages/webGlSimpleTutorial/HelloTriangle2";
import TriangleMVPMatrix from "@/pages/webGlSimpleTutorial/TriangleMVPMatrix";
import TriangleMVPMatrix2 from "@/pages/webGlSimpleTutorial/TriangleMVPMatrix2";
import TriangleMVPMatrix3 from "@/pages/webGlSimpleTutorial/TriangleMVPMatrix3";
// import TriangleMVPMatrix4 from '@/pages/webGlSimpleTutorial/TriangleMVPMatrix4'
import TerrainViewer from "@/pages/webGlSimpleTutorial/TerrainViewer";
import TerrainViewer2 from "@/pages/webGlSimpleTutorial/TerrainViewer2";
import TerrainViewer3 from "@/pages/webGlSimpleTutorial/TerrainViewer3";
import TerrainViewer4 from "@/pages/webGlSimpleTutorial/TerrainViewer4";
import TerrainViewer5 from "@/pages/webGlSimpleTutorial/TerrainViewer5";
import TerrainViewer6 from "@/pages/webGlSimpleTutorial/TerrainViewer6";
import TerrainViewer7 from "@/pages/webGlSimpleTutorial/TerrainViewer7";

class webGlSimpleTutorial extends React.Component {
  render() {
    return (
      <div id="container">
        <Hellopoint />
        <Hellopoint2 />
        <HelloTriangle />
        <HelloTriangle2 />
        <TriangleMVPMatrix />
        <TriangleMVPMatrix2 />
        <TriangleMVPMatrix3 />
        <TerrainViewer />
        <TerrainViewer2 />
        <TerrainViewer3 />
        <TerrainViewer4 />
        <TerrainViewer5 />
        <TerrainViewer6 />
        <TerrainViewer7 />
      </div>
    );
  }
}
export default webGlSimpleTutorial