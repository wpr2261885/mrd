import Vue from 'vue'
import Router from 'vue-router'
import taskList from '../components/task_list'
import taskCreation from '../components/task_creation'
import taskPreview from '../components/task_preview'
import taskDetail from '../components/task_detail'
import treeComponent from '../components/treeComponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: taskList
    },
    {
      path:'/task_list',
      component:taskList
    },
    {
      path:'/create_task',
      component:taskCreation
    },
    {
      path:'/create_task/:tid',
      component:taskCreation
    },
    {
      path:'/task_preview',
      component:taskPreview
    },
    {
      path:'/task_detail/:tid/:cid/:pid/:total/:reply/:auditable',
      component:taskDetail
    },
    {
      path:'/tree',
      component:treeComponent
    }
  ]
})
