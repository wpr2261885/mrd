<template>
<div class="body">
  <div>
    <h1>{{$t('m.patrolPlan')}}</h1>
  </div>
  <div class="content">
    <div class="box">
      <div class="content-header-title">
        <span>{{$t('m.taskList')}}</span>
        <span></span>
      </div>
      <div class="row">
        <div style="margin-bottom:20px;" class="col-lg-4 col-xs-12 col-md-12 col-sm-12">
          <div class="header-btn">
            <button @click="headerClick(0)" :class="{clicked:btnClicked}">{{$t('m.myPatrolPlan')}}</button>
            <button @click="headerClick(1)" :class="{clicked:!btnClicked}">{{$t('m.random')}}</button>
          </div>
          <!--今日巡店计划表格-->
          <div v-if="btnClicked" class="header-btn table-plan">
            <ul class="patrol_video_list">
              <li>
                <span>{{$t('m.today')+today}}</span>
              </li>
              <ul class="patrol_video_list_inner">
                <li v-for="(i,index) in todayList">
                <span style="display:flex;" @click.stop="showDetail(index,0)">
                  <span style="margin-right:5%;">
                    <i v-if="index==detailShow" class="glyphicon glyphicon-arrow-up arrow"></i>
                    <i v-if="index!=detailShow" class="glyphicon glyphicon-arrow-down arrow"></i>
                  </span>
                  <span style="width:80%;display:inline-block;">
                    {{i.planTitle+'('+i.state+'/'+i.children.length+')'}}
                  </span>
                </span>
                  <ul v-if="i.children.length!=0&&index==detailShow" class="patrol_video_list_detail">
                    <li v-for="(j,index1) in i.children" @click="handleTransInstance(j.taskId,index,index1,0,j.taskState)"
                        :class="{'patrol-task-clicked':taskIsToday&&taskPlanSelected==index1&&taskSelected==index}">
                      <span v-if="j.customerInstance">{{j.customerInstance.instanceTitle}}</span>
                      <span :class="{'green-text':j.taskState===1}">{{j.taskState===1?$t('m.executing'):$t('m.completed')}}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </ul>
          </div>
          <!--明日巡店计划表格-->
          <div v-if="btnClicked" class="header-btn table-plan">
            <ul class="patrol_video_list">
              <li>
                <span>{{$t('m.tomorrow')+tomorrow}}</span>
              </li>
              <ul class="patrol_video_list_inner">
                <li v-for="(i,index) in tomorrowList">
                <span style="display:flex;" @click.stop="showDetail(index,1)">
                  <span style="margin-right:5%;">
                    <i v-if="index==detailShow1" class="glyphicon glyphicon-arrow-up arrow"></i>
                    <i v-if="index!=detailShow1" class="glyphicon glyphicon-arrow-down arrow"></i>
                  </span>
                  <span>
                    {{i.planTitle+'('+i.state+'/'+i.children.length+')'}}
                  </span>
                </span>
                  <ul v-if="i.children.length!=0&&index==detailShow1" class="patrol_video_list_detail">
                    <li v-for="(j,index1) in i.children">
                      <span v-if="j.customerInstance">{{j.customerInstance.instanceTitle}}</span>
                      <span :class="{'green-text':j.taskState===1}">{{j.taskState===1?$t('m.executing'):$t('m.completed')}}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </ul>
          </div>
          <!--随机计划表格-->
          <!--我的标签-->
          <div v-if="!btnClicked" class="header-btn table-plan">
            <ul class="patrol_video_list patrol_video_list_random">
              <li>
                <span>{{$t('m.myTags')}}</span>
              </li>
              <ul class="patrol_video_list_inner">
                <li v-for="(i,index) in tag">
                <span @click.stop="showDetail(index,2)">
                  <i v-if="index==randomDetailShow" class="glyphicon glyphicon-arrow-up arrow"></i>
                  <i v-if="index!=randomDetailShow" class="glyphicon glyphicon-arrow-down arrow"></i>
                  {{i.text+'('+i.children.length+')'}}
                </span>
                  <span></span>
                  <ul v-if="i.children.length!=0&&index==randomDetailShow" class="patrol_video_list_detail">
                    <li v-for="(j,index1) in i.children" @click="handleTransInstance(j.data.object.instanceId,index,index1,2,1)"
                        :class="{'patrol-task-clicked':taskPlanSelected==index1&&taskSelected==index}">
                      <span v-if="j.data.object">{{j.data.object.instanceTitle}}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </ul>
          </div>
          <!--所有实体树-->
          <div v-if="!btnClicked&&this.instance.length!=0" class="header-btn table-plan">
            <ul class="patrol_video_list patrol_video_list_random">
              <li>
                <span>{{$t('m.instance')}}</span>
              </li>
              <li>
                <el-tree
                  :expand-on-click-node="clickNode"
                  @check-change="handleCheckChange"
                  :data="instance"
                  node-key="id"
                  ref="tree"
                  highlight-current
                  default-expand-all
                  @node-click="handleNodeClick1"
                  :props="defaultProps">
                </el-tree>
              </li>
            </ul>
          </div>
        </div>
        <!--视频控制-->
        <div style="overflow:auto;" class="video-box-item col-lg-8 col-xs-12 col-md-12 col-sm-12">
          <div>
            <h1 style="padding:0 0 15px 0;">{{this.instanceTitle}}</h1>
            <div  v-if="tunnel.length!=0" class="video-controller">
              <div>
                {{$t('m.tunnel')}}
                <el-select v-model="tunnelSelected" @change="tunnelChange">
                  <el-option
                    v-for="item in tunnel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div v-if="tunnel.length!=0" class="video-controller-btn-group">
                <button @click="videoControl(-2)" class="video-HD-off blue-btn video-controller-btn btn-primary">
                  {{this.isHD?$t('m.HD'):$t('m.lowDefinition')}}
                </button>
                <!--截图-->
                <!--<button v-if="!btnClicked" @click="videoControl(-1)" class="video-controller-btn blue-btn btn-primary">-->
                  <!--<span class="glyphicon glyphicon-picture"></span>-->
                  <!--{{$t('m.picShot')}}-->
                <!--</button>-->
                <span v-if="currentTunnel.type=='YS'">
                  <button :disabled="controlButton" @click="videoControl(0)" class="video-controller-btn btn-default">
                  <span class="glyphicon glyphicon-arrow-up"></span>
                </button>
                <button :disabled="controlButton" @click="videoControl(1)" class="video-controller-btn btn-default">
                  <span class="glyphicon glyphicon-arrow-down"></span>
                </button>
                <button :disabled="controlButton" @click="videoControl(2)" class="video-controller-btn btn-default">
                  <span class="glyphicon glyphicon-arrow-left"></span>
                </button>
                <button :disabled="controlButton" @click="videoControl(3)" class="video-controller-btn btn-default">
                  <span class="glyphicon glyphicon-arrow-right"></span>
                </button>
                <button :disabled="controlButton" @click="videoControl(8)" class="video-controller-btn btn-default">
                  <span class="glyphicon glyphicon-plus-sign"></span>
                  {{$t('m.enlarge')}}
                </button>
                <button :disabled="controlButton" @click="videoControl(9)" class="video-controller-btn btn-default">
                  <span class="glyphicon glyphicon-minus-sign"></span>
                  {{$t('m.reduce')}}
                </button>
                <button :disabled="controlButton" @click="videoControl(10)" class="video-controller-btn btn-default">
                  <span class="glyphicon glyphicon-zoom-in"></span>
                  {{$t('m.zoomIn')}}
                </button>
                <button :disabled="controlButton" @click="videoControl(11)" class="video-controller-btn btn-default">
                  <span class="glyphicon glyphicon-zoom-out"></span>
                  {{$t('m.zoomOut')}}
                </button>
                </span>
              </div>
            </div>
          </div>
          <!--视频监控部分-->
          <div v-if="!videoChange" class="no-video">
            {{$t('m.noVideo')}}
          </div>
          <div v-if="videoChange">
            <videoComponent :url="url"></videoComponent>
            <p style="color:gray;margin-top:10px;">{{$t('m.videoTips')}}</p>
          </div>
          <!--考评表部分-->
          <div class="patrol-plan-evaluation" v-if="!hideEvaluate">
            <ul class="evaluation-tab" v-if="detail.evaluation!=null">
              <li v-for="(i,index) in this.detail.evaluation" :class="{'gray-clicked':index==tab}" @click="handleTransEvaluate(index)">{{i.evaluateTitle}}</li>
            </ul>
            <ul class="evaluation-list" v-if="detail.length!=0&&subEvaluation.length!=0">
              <li v-for="(i,index) in subEvaluation.items">
                <span>{{i.itemTitle}}</span>
                <span v-if="i.itemImage==''&&picLoading!=index" @click="handleClickPic(index,0)">
                  <span class="evaluation-no-pic glyphicon glyphicon-camera"></span>
                </span>
                <span style="position:relative;" v-if="i.itemImage!=''&&picLoading!=index" >
                  <img @click.stop="handleClickPic(index,1,i.itemImage.base64,i.itemImage.edited)" class="evaluation-pic"
                       :src="i.itemImage.url">
                  <span @click.stop="removePic(index)" class="red-remove glyphicon glyphicon-minus-sign"></span>
                </span>
                <div v-if="editPic" class="pic-box-zoom">
                  <editPic @picEditorEvent="getPicBase64" :url="picBase64"></editPic>
                </div>
                <span v-if="index==picLoading">
                  <el-button class="loading-btn" type="primary" :loading="true"></el-button>
                </span>
                <span>
                  <span style="margin-right:10px;min-width:90px;display:inline-block;">{{$t('m.totalScore1')+i.itemEvaluateScore}}</span>
                  <span>{{$t('m.score')}}</span>
                  <input :disabled="i.itemEvaluateScore===0" v-model="i.itemScore" @blur="handleScoreBlur(index)"
                         style="width:80px;text-align:center;" type="number">
                </span>
                <span style="text-align:right;">
                  <i @click="handleAudit(index,3)" :class="{'evaluation-audit-clicked':i.itemState===3}" class="glyphicon glyphicon-minus evaluation-audit"></i>
                  <i @click="handleAudit(index,2)" :class="{'evaluation-audit-clicked':i.itemState===2}" class="glyphicon glyphicon-remove evaluation-audit" style="margin-left:30px;"></i>
                  <i @click="handleAudit(index,1)" :class="{'evaluation-audit-clicked':i.itemState===1}" style="margin-left:30px;" class="glyphicon glyphicon-ok evaluation-audit"></i>
                </span>
              </li>
              <p style="margin-top:30px;">
                <span style="margin-right:15px;">{{$t('m.pass')}}</span>
                <span style="margin-right:30px;">{{subEvaluation.recordEvaluateQualified+'/'+subEvaluation.items.length}}</span>
                <span style="margin-right:15px;">{{$t('m.noPass')}}</span>
                <span style="margin-right:30px;">{{subEvaluation.recordEvaluateUnqualified+'/'+subEvaluation.items.length}}</span>
                <span style="margin-right:15px;">{{$t('m.noFit')}}</span>
                <span style="margin-right:30px;">{{subEvaluation.recordEvaluateInapplicable+'/'+subEvaluation.items.length}}</span>
                <span style="margin-right:15px;">{{$t('m.totalScore')}}</span>
                <span>{{this.subEvaluation.recordEvaluateScore+'/'+this.subEvaluation.evaluateTotalScore}}</span>
              </p>
              <p style="text-align:right;margin-top:30px;">
                <button :disabled="button" class="btn btn-success" @click="handleSave">{{$t('m.save')}}</button>
              </p>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import videoComponent from "../../components/patrol/videoComponent"
  import editPic from "../../components/patrol/picEditor"

    export default {
      components:{
        videoComponent,editPic
      },
      data(){
        return {
          accountId:this.getAccountId,
          customerId:this.getCustomerId,
          port:this.getPort,
          accountDemo:this.getAccountDemo,
          //视频控制按钮
          controlButton:false,
          //隐藏考评表
          hideEvaluate:false,
          //实体树
          tree:[],
          defaultProps: {
            children: 'children',
            label: 'text',
            id:'id'
          },
          clickNode:false,
          //任务id
          taskId:"",
          //图片地址
          picUrl:"",
          picBase64:"",
          //图片是否已编辑过
          edited:false,
          //图片截图loading
          picLoading:-1,
          //视频播放地址
          url:"",
          //高清开关
          isHD:true,
          //当前通道信息
          currentTunnel:{},
          //视频刷新开关
          videoChange:false,
          //列表手风琴开关
          detailShow:-1,
          detailShow1:-1,
          randomDetailShow:-1,
          //考评表tab切换
          tab:0,
          //通道
          tunnel: [],
          tunnelSelected:"",
          //门店名称
          instanceTitle:"",
          //从函数return拿到日期
          today:this.getDateStr(0),
          tomorrow:this.getDateStr(1),
          dayAfterTomorrow:this.getDateStr(2),
          //按钮样式开关
          btnClicked:true,
          button:false,
          //今日巡店计划表格
          todayList: [],
          //明日巡店计划表格
          tomorrowList: [],
        // 随机巡店标签列表
          tag:[],
        //  当前计划id
          planId:"",
          //当前计划巡店方式
          recordType:1,
          //所有考评表总分
          totalMaxScore:0,
          //所有考评表得分
          totalScore:0,
          //总合格数
          totalQualified:0,
          //总不合格数
          totalUnqualified:0,
          //总不适用数
          totalInapplicable:0,
          //  随机巡店实体列表\
          instance:[],
          //点击实体详情
          detail:[],
        //  考评表子项
          subEvaluation:[],
        //  当前考评子项下标
          evaluationIndex:0,
        //  今日当前任务选中
          taskSelected:-1,
          taskPlanSelected:-1,
          taskIsToday:true,
        //  总数据
          data:[],
        //  编辑图片开关
          editPic:false,
          picIndex:-1
        }
      },
      beforeMount(){
        this.getTaskList();
      //  获取随便看看数据
        var params1={
          customerId:this.customerId,
          accountId:this.accountId
        }
        this.$ajax.post(this.port+"/customer/patrol/patrolShop/random/group",params1).then((res)=>{
          if(res.data.data&&res.data.data.length!=0){
            this.tag=res.data.data;
          }
          //console.log("随便",this.tag)
        });
        //第一层实体树
        this.getInstanceTree("#");
      },
      methods:{
        //获取计划巡店列表
        getTaskList(){
          //获取计划巡店数据
          var params={
            customerId:this.customerId,
            accountId:this.accountId
          };
          this.$ajax.post(this.port+"/customer/patrol/patrolShop/task/list",params).then((res)=>{
            //console.log(res)
            var today=[];
            var tomorrow=[];
            if(res.data.data!=null&&res.data.data.today.length!=0){
              //今日数据分类
              today=this.getListByPlan(res.data.data.today,today);
              this.todayList=today;
              //console.log("today",this.todayList)
            }
            //明日数据分类
            if(res.data.data!=null&&res.data.data.tomorrow.length!=0){
              tomorrow=this.getListByPlan(res.data.data.tomorrow,tomorrow);
              this.tomorrowList=tomorrow;
              //console.log("tomorrow",this.tomorrowList)
            }
          });
        },
        //获取实体树
        getInstanceTree(id){
          var params={
            customerId:this.customerId,
            accountId:this.accountId,
            id:id
          };
          this.$ajax.post(this.port+"/customer/patrol/patrolShop/random/tree",params).then((res)=>{
            if(res.data.data&&res.data.data.length!=0){
              this.instance=res.data.data;
            }
            //console.log("实体",this.instance)
          });
        },
        //保存
        handleSave(){
          this.countScore();
          this.countAudit();
          //console.log(this.totalInapplicable,this.totalUnqualified,this.totalQualified)
          //console.log("汇总",this.detail)
          var recordEvaluates = [];
          for(var i of this.detail.evaluation) {
            var items = [];
            for (var j of i.items) {
              if(!j.itemState||typeof j.itemState!=="number"){
                swal(
                  this.$t('m.warning'),
                  this.$t('m.stateWarning'),
                  "warning"
                );
                return;
              }else{
                items.push({
                  itemEvaluateName:i.evaluateTitle,
                  itemEvaluateItemTitle:j.itemTitle,
                  itemEvaluateItemId:j.itemId,
                  itemEvaluateScore:j.itemEvaluateScore,
                  itemImage:j.itemImage==""?"":j.itemImage.url,
                  itemScore:j.itemScore,
                  itemState:j.itemState
                });
              }
            }
            recordEvaluates.push({
              recordEvaluateTitle:i.evaluateTitle,
              recordEvaluateMaxScore:i.evaluateTotalScore,
              recordEvaluateScore:i.recordEvaluateScore,
              recordEvaluateQualified:i.recordEvaluateQualified,
              recordEvaluateUnqualified:i.recordEvaluateUnqualified,
              recordEvaluateInapplicable:i.recordEvaluateInapplicable,
              items:items
            });
          }
          var record = {
            recordQualified:this.totalQualified,
            recordUnqualified:this.totalUnqualified,
            recordInapplicable:this.totalInapplicable,
            recordInstanceId:this.detail.customerInstance.instanceId,
            recordPlanId:this.planId,
            recordType:this.recordType,
            recordMaxScore:this.totalMaxScore,
            recordScore:this.totalScore,
            patrolRecordEvaluates:recordEvaluates
          };
          //console.log(record);
          if(!this.accountDemo){
            var params={
              data:JSON.stringify(record),
              customerId:this.customerId,
              accountId:this.accountId,
              taskId:this.taskId
            };
            //console.log(params)
            this.button=true;
            this.$ajax.post(this.port+"/customer/patrol/patrolShop/record/save",params).then((res)=> {
              //console.log(res.data.status)
              if(res.data.status==0){
                swal(
                  this.$t('m.success'),
                  this.$t('m.saved'),
                  "success"
                );
                this.getTaskList();
                this.hideEvaluate=true;
              }else if(res.data.status==30003){
                swal(
                  this.$t('m.warning'),
                  this.$t('m.taskCompletedWarn'),
                  "warning"
                );
                this.hideEvaluate=true;
              }else{
                swal(
                  this.$t('m.warning'),
                  this.$t('m.saveFailed'),
                  "warning"
                );
                this.button=false;
              }
            });
          }else{
            swal(
              this.$t('m.warning'),
              this.$t('m.trialAccountWarn'),
              "warning"
            );
          }
          //console.log("总数据",record)
        },
        //点击考评按钮 合格，不合格，不适用
        handleAudit(index,i){
          switch(i){
            //不适用
            case 3:
              this.subEvaluation.items[index].itemState=3;
              this.subEvaluation.items[index].itemEvaluateScore=0;
              this.subEvaluation.items[index].itemScore=0;
              this.countScore();
              break;
            //  不合格
            case 2:
              this.subEvaluation.items[index].itemState=2;
              this.subEvaluation.items[index].itemScore=0;
              this.subEvaluation.items[index].itemEvaluateScore=this.subEvaluation.items[index].itemScoreCopy;
              this.countScore();
              break;
            //  合格
            default:
              this.subEvaluation.items[index].itemState=1;
              this.subEvaluation.items[index].itemEvaluateScore=this.subEvaluation.items[index].itemScoreCopy;
              this.subEvaluation.items[index].itemScore=this.subEvaluation.items[index].itemEvaluateScore;
              this.countScore();
              break;
          }
          this.countAudit();
          //console.log(index,this.subEvaluation,this.subEvaluation.items[index].itemState)
        },
        //点击评分项图片
        handleClickPic(index,i,base64,edited){
          if(i==0){
          //  没有图片时去截图
            if(this.tunnel==null||this.tunnel.length==0){
              //没有通道直接提示无法截图
              swal(
                this.$t('m.warning'),
                this.$t('m.picShotFailed'),
                "warning"
              )
            }else{
              //有通道就进行截图
              var params={
                customerId:this.customerId,
                accountId:this.accountId,
                deviceSerial:this.currentTunnel.deviceSerial,
                channelNo:this.currentTunnel.cameraNo
              };
              //console.log(params)
              this.picLoading=index;
              this.$ajax.post(this.port+"/customer/patrol/patrolShop/ysCapture",params).then((res)=>{
                if(res.data.status==0){
                  //console.log("截图",res.data)
                  this.subEvaluation.items[index].itemImage=res.data.data
                  this.subEvaluation.items[index].itemImage.edited=false;
                  this.subEvaluation.items.push()
                }else{
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.picShotFailed'),
                    "warning"
                  )
                }
                //console.log("当前图片",this.subEvaluation.items[index].itemImage)
                this.picLoading=-1;
              });
            }
          }else{
          //  有图片就编辑图片
            if(!edited){
              this.picIndex=index;
              this.picBase64=base64;
            }else{
              this.picBase64=this.subEvaluation.items[index].itemImage.url;
            }
            this.picUrl=this.subEvaluation.items[index].itemImage.url;
            this.editPic=true;
            //console.log(this.subEvaluation.items[index].itemImage)
          }
        },
        //删除图片
        removePic(index){
          this.subEvaluation.items[index].itemImage="";
          this.subEvaluation.items.push()
        },
        //从图片编辑器获取图片
        getPicBase64(data){
          this.editPic=false;
          if(data){
            //如果保存了编辑后的图片,没有编辑不进行处理
            this.picBase64=data.viewPath;
            this.subEvaluation.items[this.picIndex].itemImage.edited=true;
            this.subEvaluation.items[this.picIndex].itemImage.url=data.viewPath;
          }
          //console.log(data)
        },
        //评分限制
        handleScoreBlur(index){
          this.subEvaluation.items[index].itemScore=Math.ceil(this.subEvaluation.items[index].itemScore);
          //如果大于总分
          if(this.subEvaluation.items[index].itemEvaluateScore<this.subEvaluation.items[index].itemScore){
            //就和总分一样
            this.subEvaluation.items[index].itemScore=this.subEvaluation.items[index].itemEvaluateScore;
          }else if(this.subEvaluation.items[index].itemScore<1){
            this.subEvaluation.items[index].itemScore=1;
          }
          this.detail.evaluation[this.evaluationIndex].items[index].itemScore=this.subEvaluation.items[index].itemScore;
          this.totalScore=0;
          event.currentTarget.value=this.subEvaluation.items[index].itemScore;
          this.countScore();
        },
        //计算合格不合格不适用数
        countAudit(){
          //计算合格和不合格和不适用数
          this.subEvaluation.recordEvaluateQualified=0;
          this.subEvaluation.recordEvaluateUnqualified=0;
          this.subEvaluation.recordEvaluateInapplicable=0;
          this.totalQualified=0;
          this.totalUnqualified=0;
          this.totalInapplicable=0;
          for(var i of this.subEvaluation.items){
            if(i.itemState===1){
              //  合格
              this.detail.evaluation[this.evaluationIndex].recordEvaluateQualified=this.subEvaluation.recordEvaluateQualified++;
              this.subEvaluation.recordEvaluateQualified++;
            }else if(i.itemState===2){
              this.detail.evaluation[this.evaluationIndex].recordEvaluateUnqualified=this.subEvaluation.recordEvaluateUnqualified++;
              this.subEvaluation.recordEvaluateUnqualified++;
            }else if(i.itemState===3){
              this.detail.evaluation[this.evaluationIndex].recordEvaluateInapplicable=this.subEvaluation.recordEvaluateInapplicable++;
              this.subEvaluation.recordEvaluateInapplicable++;
            }
          }
          for(var j of this.detail.evaluation){
            this.totalQualified+=j.recordEvaluateQualified;
            this.totalUnqualified+=j.recordEvaluateUnqualified;
            this.totalInapplicable+=j.recordEvaluateInapplicable;
          }
          //console.log(this.totalQualified,this.totalUnqualified,this.totalInapplicable)
        },
        //计算总分数和得分
        countScore(){
          //单个表总分和得分
          this.detail.evaluation[this.evaluationIndex].recordEvaluateScore=0;
          this.detail.evaluation[this.evaluationIndex].evaluateTotalScore=0;
          for(var i of this.detail.evaluation[this.evaluationIndex].items){
            this.detail.evaluation[this.evaluationIndex].recordEvaluateScore+=i.itemScore;
            this.detail.evaluation[this.evaluationIndex].evaluateTotalScore+=i.itemEvaluateScore;
          }
          //所有表总分和得分
          this.totalMaxScore=0;
          this.totalScore=0;
          for(var i of this.detail.evaluation){
            this.totalMaxScore+=i.evaluateTotalScore;
            for(var j of i.items){
              this.totalScore+=j.itemScore;
            }
          }
          this.subEvaluation.recordEvaluateScore=this.detail.evaluation[this.evaluationIndex].recordEvaluateScore;
          this.subEvaluation.items.push();
          //console.log(this.subEvaluation.recordEvaluateScore,"总得分",this.totalScore,"总分",this.totalMaxScore)
        },
        //点击切换考评表tab
        handleTransEvaluate(index){
          if(this.picLoading==-1){
            this.tab=index;
            this.subEvaluation=this.detail.evaluation[index];
            this.evaluationIndex=index;
            this.countScore();
            //console.log(this.subEvaluation)
          }
        },
        //点击实体切换任务
        handleTransInstance(id,index,index1,i,state){
          this.detail=[];
          this.button=false;
          if(state===1){
            this.url="";
            this.videoChange=false;
            this.taskSelected=index;
            this.taskPlanSelected=index1;
            if(i===0){
              //  今日列表
              this.taskIsToday=true;
            }else{
              this.taskIsToday=false;
            }
            //如果是计划巡店 数据处理方式
            if(i<2){
              this.hideEvaluate=false;
              this.planId=this.todayList[index].planId;
              this.recordType=this.todayList[index].children[index1].taskWay;
              //计划巡店
              this.taskId=id;
              var params={
                customerId:this.customerId,
                accountId:this.accountId,
                taskId:id
              };
              //console.log(params)
              this.$ajax.post(this.port+"/customer/patrol/patrolShop/task/detail",params).then((res)=>{
                //获取详情数据
                //console.log(res.data.data)
                if(res.data.data!=null&&res.data.data.length!=0){
                  this.detail=res.data.data;
                  //  获取考评表数据
                  if(this.detail.evaluation!=null&&this.detail.evaluation.length!=0){
                    //给考评表添加默认数据
                    for(var i of this.detail.evaluation){
                      for(var j of i.items){
                        //如果有默认合格
                        if(!i.evaluateIsForce){
                          j.itemState=1;
                        }
                        j.itemScore=j.itemEvaluateScore;
                        j.itemScoreCopy=j.itemEvaluateScore;
                        j.itemImage="";
                      }
                      //没默认合格
                      if(i.evaluateIsForce){
                        i.recordEvaluateQualified=0;
                      }else{
                        i.recordEvaluateQualified=i.evaluateItem
                      }
                      i.recordEvaluateUnqualified=0;
                      i.recordEvaluateInapplicable=0;
                      i.recordEvaluateScore=0;
                    }
                    this.subEvaluation=this.detail.evaluation[0];
                    this.evaluationIndex=0;
                    this.countScore();
                  }else{
                    this.subEvaluation=[];
                  }
                }else{
                  this.detail=[];
                }
                this.tab=0;
                //获取通道数据
                //console.log(res.data)
                if(res.data.data!=null&&res.data.data.channel!=null&&res.data.data.channel.length!=0){
                  var value=0;
                  this.tunnel=res.data.data.channel;
                  for(var i of this.tunnel){
                    i.value=value++;
                    i.label=i.cameraData.title;
                  }
                  this.tunnelSelected=0;
                  if(this.tunnel[0].cameraCode=="YS"){
                    //萤石设备
                    this.getVideoUrl(this.isHD,this.tunnel[0].cameraCode,
                      this.tunnel[0].cameraData.deviceSerial,this.tunnel[0].cameraData.cameraNo);
                  }else{
                    //  其他设备
                    //
                    //
                  }
                }else{
                  this.tunnel=[];
                  this.tunnelSelected="";
                }
                this.instanceTitle=this.detail.customerInstance.instanceTitle;
                //console.log("详情",this.detail,"通道",this.tunnel)
                //console.log("考评",this.detail.evaluation,"子项",this.subEvaluation)
              });
            }else{
              //console.log(i)
              //  随机巡店
              var params={
                customerId:this.customerId,
                accountId:this.accountId,
                instanceId:id
              };
              this.$ajax.post(this.port+"/customer/patrol/patrolShop/random/detail",params).then((res)=>{
                //获取详情数据
                //console.log(res)
                if(res.data.data!=null&&res.data.data.length!=0){
                  this.detail=res.data.data;
                }else{
                  this.detail=[];
                }
                this.tab=0;
                //获取通道数据
                if(res.data.data.channel!=null&&res.data.data.channel.length!=0){
                  var value=0;
                  this.tunnel=res.data.data.channel;
                  for(var i of this.tunnel){
                    i.value=value++;
                    i.label=i.cameraData.title;
                  }
                  this.tunnelSelected=0;
                  if(this.tunnel[0].cameraCode=="YS"){
                    //萤石设备
                    this.getVideoUrl(this.isHD,this.tunnel[0].cameraCode,
                      this.tunnel[0].cameraData.deviceSerial,this.tunnel[0].cameraData.cameraNo);
                  }else{
                    //  其他设备
                    //
                    //
                  }
                }else{
                  this.tunnel=[];
                  this.tunnelSelected="";
                }
                this.instanceTitle=this.detail.customerInstance.instanceTitle;
                //console.log("详情",this.detail,"通道",this.tunnel)
                //console.log("考评",this.detail.evaluation,"子项",this.subEvaluation)
              });

            }
          }else{
            this.detail=[];
          }
        },
        //获取播放地址
        getVideoUrl(HD,type,deviceSerial,cameraNo){
          var params={
            customerId:this.customerId,
            accountId:this.accountId,
            isHD:HD,
            type:type,
            deviceSerial:deviceSerial,
            channelNo:cameraNo
          };
          this.videoChange=false;
          this.$ajax.post(this.port+"/customer/patrol/patrolShop/getCameraPlayURL",params).then((res)=>{
            if(res.data.data==null){
              swal(
                this.$t('m.warning'),
                this.$t('m.getVideoFailed'),
                "warning"
              )
            }else{
              this.url=res.data.data
              this.videoChange=true;
            }
            this.currentTunnel={
              type:type,
              deviceSerial:deviceSerial,
              cameraNo:cameraNo,
            }
            //console.log("当前通道",this.currentTunnel)
          })
        },
        //计划列表详情
        showDetail(index,i){
          if(i==0){
          //  今日列表
            if(index==this.detailShow){
              this.detailShow=-1;
            }else{
              this.detailShow=index;
            }
          }else if(i==1){
            //  明日列表
            if(index==this.detailShow1){
              this.detailShow1=-1;
            }else{
              this.detailShow1=index;
            }
          }else{
          //随机列表
            //console.log(1)
            if(index==this.randomDetailShow){
              this.randomDetailShow=-1;
            }else{
              this.randomDetailShow=index;
            }
          }
        },
        //数据分类
        getListByPlan(data,arr){
          for(var i of data){
            arr.push({
              planId:i.taskPlanId,
              planTitle:i.patrolPlan.planTitle,
              state:0,
              children:[]
            });
          }
          arr=this.hashArray(arr);
          for(var i of arr){
            for(var j of data){
              if(i.planId==j.taskPlanId){
                i.children.push(j)
                if(j.taskState==2){
                  i.state++
                }
              }
            }
          }
          return arr;
        },
        //数组去重
        hashArray(arr){
          var hash = {};
          arr = arr.reduce(function(item, next) {
            hash[next.planId] ? '' : hash[next.planId] = true && item.push(next);
            return item
          }, [])
          return arr;
        },
        //通道切换
        tunnelChange(value){
          if(this.tunnel[value].cameraCode=="YS"){
            //萤石设备
            this.getVideoUrl(this.isHD,this.tunnel[value].cameraCode,
              this.tunnel[value].cameraData.deviceSerial,this.tunnel[value].cameraData.cameraNo);
            //保存当前通道信息
          }else{
            //  其他设备
            //
            //
          }
        },
        //拿取日期
        getDateStr:function(AddDayCount) {
          var dd = new Date();
          //获取AddDayCount天后的日期
          dd.setDate(dd.getDate()+AddDayCount);
          var y = dd.getFullYear();
          //获取当前月份的日期
          var m = dd.getMonth()+1;
          //月份小于十前面加0
          if(m<10){
            m="0"+m;
          }
          var d = dd.getDate();
          return "("+y+"-"+m+"-"+d+")";
        },
        //顶部按钮切换计划
        headerClick:function(trans){
          //判断参数
          if(trans>0){
            //选择随机巡店
            this.btnClicked=false;
            this.hideEvaluate=true;
          }else{
            //选择计划巡店
            this.btnClicked=true;
            this.hideEvaluate=false;
          }
        },
      //  视频控制
        videoControl(direction){
          if(direction>=0){
          //  如果大于等于0 就是视频云台控制
            var params={
              customerId:this.customerId,
              accountId:this.accountId,
              deviceSerial:this.currentTunnel.deviceSerial,
              channelNo:this.currentTunnel.cameraNo,
              direction:direction
            };
            this.controlButton=true;
            this.$ajax.post(this.port+"/customer/patrol/patrolShop/ysCloud",params).then((res)=>{
              //console.log(this.controlButton)
              this.controlButton=false;
            })
          }else if(direction==-1){
          //  截图

          }else if(direction==-2){
          //  高清切换
            this.isHD=!this.isHD;
            if(this.currentTunnel.type=="YS"){
              //萤石设备
              this.getVideoUrl(this.isHD,this.currentTunnel.type,
                this.currentTunnel.deviceSerial,this.currentTunnel.cameraNo);
              //保存当前通道信息
            }else{
              //  其他设备
              //
              //
            }
          }
        },
        //勾选实体树节点
        handleCheckChange(data,self,son){
          //当前勾选的id值
          this.instanceIdSelected=this.$refs.tree.getCheckedKeys();
          this.instanceSelected=this.$refs.tree.getCheckedNodes();
          //////console.log("已选实体",this.instanceSelected);
        },
        //  点击实体树节点
        handleNodeClick1(data){
          this.handleTransInstance(data.id,0,0,2,1);
          //console.log("节点信息",data);
          //如果有子集,懒加载子节点
          if(data.children){
            var params = {
              "accountId": this.accountId,
              "customerId": this.customerId,
              "id": data.id
            };
            this.$ajax.post(this.port+"/customer/patrol/patrolShop/random/tree",params).then((res)=>{
              if(res.data.data.length!=0&&res.data.data!=null){
                //console.log("非最上层实体结构树:",res.data.data);
                data.children=[];
                for(var i of res.data.data){
                  data.children.push(i);
                }
              }
            })
          }else{
            return;
          }
        }
      }
    }
</script>

<style scoped>

</style>
