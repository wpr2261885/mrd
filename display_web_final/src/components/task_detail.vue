<template>
  <div class="body" @click="closeCheckBox">
    <div class="task-preview">
      <h1 style="float:left;margin-right:10px;">{{$t('m.taskDetail')}}</h1>
      <button @click="jumpToList" class="btn btn-info">{{$t('m.backToList')}}</button>
      <ul v-if="taskDetail!=[]">
        <li>
          <h1><!-- ：陈列任务标题-->{{taskDetail.taskName}}</h1>
          <img class="avatar" v-if="taskDetail.extImage" :src="taskDetail.extImage">
          <img class="avatar" v-if="!taskDetail.extImage" src="../assets/img/default_portrait.png">
          <span style="margin-left:0;" v-if="taskDetail.accountInfo"><!--动态：发布人账户名-->{{taskDetail.accountInfo==undefined?"":taskDetail.accountInfo.accountNickName}}</span>
          <span><!--发布日期-->{{taskDetail.taskCreateTime}}</span>
        </li>
        <hr>
        <li>
          <label><!--执行区域-->{{$t('m.area')}}</label>
          <span v-for="a in taskDetail.areaList">{{a?a.instanceTitle:""}}</span>
        </li>
        <li>
          <label><!--完成时间-->{{$t('m.completeTime')}}</label>
          <span>{{taskDetail.taskStartTime==undefined?"":taskDetail.taskStartTime.split(" ")[0]}}</span>
          {{$t('m.to')}}
          <span>{{taskDetail.taskEndTime==undefined?"":taskDetail.taskEndTime.split(" ")[0]}}</span>
        </li>
        <!--附件-->
        <!--<li>-->
          <!--<label>{{$t('m.adjunct')}}</label>-->
          <!--<span v-if="taskDetail.dixList&&taskDetail.dixList.length!=0">-->
            <!--<a target="_blank" :href="taskDetail.dixList[0].dixUrl">{{$t('m.adjunct1')}}</a>-->
            <!--<a target="_blank" v-if="taskDetail.dixList[1]" :href="taskDetail.dixList[1].dixUrl">{{$t('m.adjunct2')}}</a>-->
          <!--</span>-->
        <!--</li>-->
        <hr>
        <li>
          <label>{{$t('m.taskDesc')}}</label>
          <br>
          <pre>{{taskDetail.taskRemark}}</pre>
        </li>
        <!--图片-->
        <li>
          <div v-if="taskDetail.imgList.length!=0" @click="picZoom" v-for="url in taskDetail.imgList" class="pic-box">
            <img :title="$t('m.clickToZoom')" class="pic" :src="url.imgUrl">
          </div>
        </li>
      </ul>
    </div>
    <div class="task-preview">
      <ul>
        <li>
          <label>{{$t('m.completeStatus')}}</label>
          <span style="color:green;margin-left:10px;">
            ({{reply}}
          </span>/{{total}})
        </li>
        <li style="background:#E1DEDF;">
          <p>
            <!--回复详情-->
            <!--已完成-->
            <label>{{$t('m.completed')}}</label>
            <span style="margin-left:10px;" v-for="i in instancesReplyed">{{i}}</span>
          </p>
          <p>
            <!--未完成-->
            <label style="color:red;">{{$t('m.uncompleted')}}</label>
            <span style="margin-left:10px;" v-for="i in instancesNotReplyed">{{i}}</span>
          </p>
        </li>
        <!--循环回复人列表，回复人不拥有实体就不显示-->
        <li v-for="(r,index) in res">
          <img class="avatar" v-if="r.extImage" :src="r.extImage">
          <img class="avatar" v-if="!r.extImage" src="../assets/img/default_portrait.png">
          <!--动态：区域-->
          <span v-if="r!=null&&r.customerInstance!=null" style="margin-right:30px;">{{r.customerInstance?r.customerInstance.instanceTitle:""}}</span>
          <!--动态：用status审核状态-->
          <!--查看原因-->
          <span class="status" @click.stop="viewReason(r.taskId,r.auditStatus,0,index)" :style="{color:r.auditStatus==2?'red':'black'}">{{!taskAudit?$t('m.pass'):r.auditStatus==0?$t('m.auditPending'):r.auditStatus==1?$t('m.pass'):$t('m.noPass')}}
            <span v-if="taskAudit&&(r.auditStatus==0||r.auditStatus==2)" class="redPoint"></span>
          </span>
          <!--审核按钮-->
          <button style="margin-left:18%;" @click.stop="viewReason(r.taskId,r.auditStatus,1,index)" v-if="r.auditStatus==0&&taskAudit" class="btn btn-success">{{$t('m.audit')}}</button>
          <p><!--动态：发布日期-->{{r.displayInstanceAccountReplyText.textTime|date}}</p>
          <p style="margin-top:30px;">{{r.displayInstanceAccountReplyText.textValue}}</p>
          <div v-if="r.imgList&&r.imgList.length!=0" @click="picZoom" v-for="" class="pic-box">
            <img v-for="url in r.imgList" :title="$t('m.clickToZoom')" class="pic" :src="url.imgUrl">
          </div>
          <hr>
          <div @click.stop="showCheckBox" class="checkBox" v-if="checkBox" :class="{pass:isPass}">
            <div>
              <el-row>
                <el-button @click="noPass" type="primary" icon="el-icon-edit" circle></el-button>
                <span>{{$t('m.noPass')}}</span>
                <el-button @click="pass" type="success" icon="el-icon-check" circle></el-button>
                <span>{{$t('m.pass')}}</span>
              </el-row>
            </div>
            <div>
              <textarea v-model="auditRemark" maxlength="300" v-if="!isPass" :placeholder="$t('m.reason')" name="reason" id="" cols="30" rows="15"></textarea>
            </div>
            <button :disabled="button" @click="submitAudit(r.taskId,index)" style="margin:10px;border-radius:20px;" class="btn btn-success">{{$t('m.submit')}}</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
    export default {
        data(){
          return {
            i:"",
            taskId:"",
            button:false,
            port:this.getPort,
            accountId:this.getAccountId,
            customerId:this.getCustomerId,
            taskDetail:[],
            res:[],
            taskAudit:this.$route.params.auditable=='0'?false:true,
            auditable:true,
            checkBox:false,
            reply:this.$route.params.reply,
            total:this.$route.params.total,
            instances:[],
            instancesReplyed:[],
            instancesNotReplyed:[],
            isPass:true,
            auditRemark:""
          }
        },
      beforeMount:function(){
          if(this.$route.params.auditable=="0"){
            this.taskAudit=false;
          }
          if(this.$route.params.pid="null"){
            this.$route.params.pid=null;
          }
        var params={
          "customerId":this.customerId,
          "accountId":this.accountId,
          "taskId":this.$route.params.tid,
          "createID":this.$route.params.cid,
          "parentTaskId":this.$route.params.pid
        };
        this.$ajax.post(this.port+"/"+this.getPath+"/display/releaseTaskDetail",params).then((res)=>{
          //console.log("详情",res)
          if(res.data.data&&res.data.data.accountInfo){
            this.taskDetail=res.data.data;
            this.taskDetail.accountName=res.data.data.accountInfo.accountUsername;
          }
          //所有区域
          for(var i of this.taskDetail.areaList){
            if(i!=null&&i!=undefined){
              this.instances.push(i.instanceTitle);
            }
          }
          this.$ajax.post(this.port+"/"+this.getPath+"/display/severalInstanceTaskDetail",params).then((res)=>{
            this.res=res.data.data.list;
            //已完成区域
            //console.log("回复",res.data.data)
            if(res.data.data.list.length==0){
              this.instancesReplyed=[];
            }else{
              for(var i of this.res){
                if(i.customerInstance!=null){
                  this.instancesReplyed.push(i.customerInstance.instanceTitle);
                }
              }
            }
            //拿出未回复的区域,在全部区域里去除已回复里的重复值
            var instances=[];
            for(var i of this.instances){
              instances.push(i)
            }
            if(res.data.data.list.length==0){
              this.instancesNotReplyed=this.instances
            }else{
              for(var i=0;i<this.instancesReplyed.length;i++){
                for(var j=0;j<instances.length;j++){
                  if(instances[j]==this.instancesReplyed[i]){
                    instances.splice(j,1);
                    j--;
                  }
                }
              }
              this.instancesNotReplyed=instances;
            }
            //console.log("全部实体",this.instances,"已回复实体",this.instancesReplyed,"没回复实体",this.instancesNotReplyed)
          });
        });
      },
      //时间戳转字符串
      filters:{
          date:function(value){
            var newDate = new Date();
            newDate.setTime(value);
            var formatDate=function(date){
              var y = date.getFullYear();
              var m = date.getMonth() + 1;
              m = m < 10 ? ('0' + m) : m;
              var d = date.getDate();
              d = d < 10 ? ('0' + d) : d;
              var h = date.getHours();
              h=h < 10 ? ('0' + h) : h;
              var minute = date.getMinutes();
              minute = minute < 10 ? ('0' + minute) : minute;
              var second=date.getSeconds();
              second=second < 10 ? ('0' + second) : second;
              return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
            };
            var date=formatDate(newDate);
            return date;
          }
      },
      methods:{
          jumpToList(){
            this.$router.push("/task_list");
          },
        //图片放大查看
        picZoom:function(){
          $(event.currentTarget)
            .toggleClass("pic-box-zoom")
            .find("img")
            .toggleClass("pic-zoom");
        },
        pass:function(){
          this.isPass=true;
        },
        noPass:function(){
          this.isPass=false;
        },
        //提交审核
        submitAudit:function(taskId,i){
          this.button=true;
          var params={
            "taskId":this.taskId,
            "customerId":this.customerId,
            "accountId":this.accountId,
            "auditRemark":this.auditRemark,
            "auditStatus":this.isPass?1:2,
            "ways":[0]
          };
          //console.log(this.taskId,this.i)
          this.$ajax.post(this.port+"/"+this.getPath+"/display/checkWeb",params).then((res)=> {
            //console.log(res)
            if (res.data.status == 0) {
              if(this.isPass==true){
                this.res[this.i].auditStatus=1;
                swal(
                  this.$t('m.success'),
                  this.$t('m.auditCompleted'),
                  "success"
                );
              }else{
                this.res[this.i].auditStatus=2;
                swal(
                  this.$t('m.success'),
                  this.$t('m.auditNoCompleted'),
                  "success"
                );
              }
            }
            this.checkBox = false;
            this.button = false;
          });
        },
        closeCheckBox:function(){
          this.checkBox=false;
        },
        showCheckBox:function(){
          this.checkBox=true;
        },
        //查看不合格原因
        viewReason:function(taskId,auditStatus,i,index){
          //状态为待审核就进行审核，否则查看原因
          //console.log(taskId)
          this.taskId=taskId;
          this.i=index;
          this.auditRemark="";
          if(auditStatus==0){
            if(i==1){
              this.checkBox=true;
            }
          }else if(auditStatus==2){
            if(i==0){
              var params={
                "accountId":this.accountId,
                "customerId":this.customerId,
                taskId:taskId
              };
              this.$ajax.post(this.port+"/"+this.getPath+"/display/checkDetail",params).then((res)=>{
                var remark=res.data.data.auditRemark;
                swal(
                  this.$t("m.auditRemark"),
                  remark,
                  "info"
                );
              })
            }
          }
        }
      }
    }
</script>

<style scoped>

</style>
