import Vue from 'vue';
import Router from 'vue-router';

//巡店
import patrolDashboard from "../components/patrol/patrolDashboard";
import patrolPlan from "../components/patrol/patrol_plan";
import createPatrolForm from '../components/patrol/create_patrol_form';
import patrolFormList from '../components/patrol/patrol_form_list';
import patrolPlanList from '../components/patrol/patrol_plan_list';
import createPatrolPlan from '../components/patrol/create_patrol_plan';
import video from '../components/patrol/videoComponent';
import patrolRecord from '../components/patrol/patrol_record';
import picEditor from '../components/patrol/picEditor'
import tree from '../components/patrol/treeComponent'


Vue.use(Router)

export default new Router({
  routes: [
  //  巡店
    {
      path:'/',
      component:patrolPlan
    },
    //巡店总览
    {
      path:'/patrol_dashboard',
      component:patrolDashboard
    },
    //新建表单
    {
      path:'/create_patrol_form',
      component:createPatrolForm
    },
    //表单列表
    {
      path:'/patrol_form_list',
      component:patrolFormList
    },
    //修改表单
    {
      path:'/create_patrol_form/:fid',
      component:createPatrolForm
    },
    //计划列表
    {
      path:'/patrol_plan_list',
      component:patrolPlanList
    },
    //新建计划
    {
      path:'/create_patrol_plan',
      component:createPatrolPlan
    },
  //  编辑计划
    {
      path:'/create_patrol_plan/:pid',
      component:createPatrolPlan
    },
    {
      path:'/patrol_record',
      component:patrolRecord
    },
  //  监控
    {
      path:'/video',
      component:video
    },
  //  图片编辑器
    {
      path:'/edit_pic',
      component:picEditor
    },
    {
      path:'/tree',
      component:tree
    }
  ]
})
