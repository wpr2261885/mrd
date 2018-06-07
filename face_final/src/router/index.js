import Vue from 'vue';
import Router from 'vue-router';

import cusManagement from "../components/customerManagement";
import faceDevice from "../components/faceDeviceManagement";
import guestAnalysis from "../components/guestAnalysis";
import tree from "../components/treeRadioComponent";
import tree1 from "../components/treeComponent"


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:"/",
      component:cusManagement
    },
    {
      path:"/customer_management",
      component:cusManagement
    },
    {
      path:"/face_device_management",
      component:faceDevice
    },
    {
      path:"/guest_analysis",
      component:guestAnalysis
    },{
      path:"/tree",
      component:tree
    },
    {
      path:"/tree1",
      component:tree1
    }
  ]
})
