<template>
  <div class="body task-preview">
    <h1>{{$t('m.taskPre')}}</h1>
    <ul>
      <li>
        <h1><!-- ：陈列任务标题-->{{data.title}}</h1>
        <span><!--动态：发布人账户名-->{{accountName}}</span>
        <span><!-- ：发布日期-->{{nowDate}}</span>
      </li>
      <hr>
      <li>
        <label><!-- ：执行区域-->{{$t('m.area')}}</label>
        <span>
          <em v-for="s in storeSelected">{{s}}</em>
        </span>
      </li>
      <li>
        <label><!-- ：执行人-->{{$t('m.executor')}}</label>
        <span>
          <em v-for="s in executorSelected">{{s}}</em>
        </span>
      </li>
      <li>
        <label><!-- ：完成时间-->{{$t('m.completeTime')}}</label>
        <span>{{date.startDate.split(" ")[0]}}</span>
        {{$t('m.to')}}
        <span>{{date.endDate.split(" ")[0]}}</span>
      </li>
      <!--附件-->
      <!--<li>-->
        <!--<label>{{$t('m.adjunct')}}</label>-->
        <!--<span>-->
          <!--<em v-for="f in adjunctName">{{f}}</em>-->
        <!--</span>-->
      <!--</li>-->
      <hr>
      <li>
        <label class="input_title">{{$t('m.taskDesc')}}</label>
        <pre>{{data.description}}</pre>
      </li>
      <hr>
      <li>
        <div v-if="picUrl.length>0" @click="picZoom" v-for="url in picUrl" class="pic-box">
          <img :title="$t('m.clickToZoom')" class="pic" :src="url">
        </div>
      </li>
      <li>
        <button @click="handleJump('/create_task')" class="btn btn-info">{{$t('m.edit')}}</button>
        <button :disabled="button" @click="saveDraft" class="btn btn-default">{{$t('m.save')}}</button>
        <button :disabled="button" @click="submit" class="btn btn-success">{{$t('m.confirmPub')}}</button>
      </li>
    </ul>
    <!--发布中-->
    <el-button class="loading" v-if="loading" type="warning" :loading="true">{{$t('m.publishing')}}</el-button>
  </div>
</template>

<script>
    export default {
        data(){
          return {
            button:false,
            accountName:window.sessionStorage.accountName,
            port:this.getPort,
            accountId:this.getAccountId,
            customerId:this.getCustomerId,
            loading:false,
            instancesFault:"",
            //elmentUI 上传附件
            fileList: [],
            //输入信息
            data:{
              title:"",
              description:"",
              radio:"1"
            },
            value: [],
            value1:[],
            executorSelected:[],
            storeSelected:[],
            nameIds:[],
            //开始结束日期
            date:{
              startDate:"",
              endDate:""
            },
            showUpload:false,
            picUrl:[],
            adjunct:[],
            adjunctName:[],
            nowDate:"",
            checkCode:[0],
            instanceIdSelected:[],
            roleIdSelected:[],
            executorSelected:[]
          }
        },
      beforeMount:function(){
        var storage=window.sessionStorage;
        this.radio=storage.radio;
        this.data.title=storage.title;
        this.adjunct=storage.adjunct;
        this.nowDate=storage.nowDate;
        this.data.description=storage.description;
        this.value=storage.value;
        this.date.startDate=storage.startDate;
        this.date.endDate=storage.endDate;
        if(storage.nameIds!=undefined&&storage.nameIds.length!=0){
          this.nameIds=JSON.parse(storage.nameIds);
        }
        if(storage.executorIdSelected!=undefined&&storage.executorIdSelected.length!=0){
          this.executorSelected=storage.executorSelected
        }
        if(storage.instanceIdSelected!=undefined&&storage.instanceIdSelected.length!=0){
          this.instanceIdSelected=storage.instanceIdSelected.split(",");
        }
        if(storage.roleIdSelected!=undefined&&storage.instanceIdSelected.length!=0){
          this.roleIdSelected=storage.roleIdSelected.split(",");
        }
        if(storage.picUrl!=undefined&&storage.picUrl.length!=0){
          this.picUrl=storage.picUrl.split(",");
        }
        if(storage.adjunct!=undefined&&storage.adjunct.length!=0){
          this.adjunct=storage.adjunct.split(",");
        }
        if(storage.adjunctName!=undefined&&storage.adjunctName.length!=0){
          this.adjunctName=storage.adjunctName.split(",");
        }
        if(storage.storeSelected!=undefined&&storage.storeSelected!="undefined"){
          this.storeSelected=storage.storeSelected.split(",");
        }
        if(storage.executorSelected!=undefined&&storage.executorSelected!="undefined"){
          this.executorSelected=storage.executorSelected.split(",");
        }
      },
      methods:{
        handleJump(path){
          this.$router.push(path);
        },
        //图片放大查看
        picZoom:function(){
          $(event.currentTarget)
             .toggleClass("pic-box-zoom")
             .find("img")
             .toggleClass("pic-zoom");
        },
        //重置
        reset:function(){
          this.data.title="";
          this.data.description="";
          this.picUrl=[];
          this.date.startDate="";
          this.date.startDate="";
          this.date.endDate="";
          this.checkCode=[0];
          this.value=[];
          this.value1=[];
          this.adjunct=[];
          this.adjunctName=[];
          this.radio="1";
          this.executorSelected=[];
          this.storeSelected=[];
          window.sessionStorage.clear();
          window.sessionStorage.accountId=this.accountId;
          window.sessionStorage.customerId=this.customerId;
          window.sessionStorage.ctx=this.port;
        },
        //发布
        submit:function(){
          if(this.data.description==undefined||this.data.title==undefined||
            this.data.description==""||this.data.title==""){
            swal(
              this.$t('m.warning'),
              this.$t('m.checkTitle'),
              "warning"
            )
          }else{
            var params={
              customerId:this.customerId,
              accountId:this.accountId,
              imgUrls:this.picUrl,
              dixUrls:this.adjunct==undefined?[]:this.adjunct,
              instances:this.instanceIdSelected,
              roles:this.roleIdSelected,
              nameIds:this.nameIds,
              taskId:this.taskId==undefined?null:this.taskId,
              taskName:this.data.title,
              taskRemark:this.data.description,
              taskStartDate:this.date.startDate+" 00:00:00",
              taskEndDate:this.date.endDate+" 00:00:00",
              taskAudit:Math.fround(this.radio),
              ways:this.checkCode
            };
            ////console.log(params)
            if(params.taskStartDate==""||params.taskStartDate==undefined
              ||params.taskEndDate==""||params.taskEndDate==undefined){
              swal(
                this.$t('m.warning'),
                this.$t('m.errDate'),
                "warning"
              );
            }else if(params.instances.length==0||params.instances==[]
              ||params.roles.length==0||params.roles==[]||params.nameIds==[]
              ||params.nameIds.length==0){
              swal(
                this.$t('m.warning'),
                this.$t('m.errSelect'),
                "warning"
              );
            }else if(params.taskAudit!=0&&params.taskAudit!=1){
              swal(
                this.$t('m.warning'),
                this.$t('m.errAudit'),
                "warning"
              );
            }else{
              //拿取无法匹配角色的实体列表
              var params1={
                customerId:this.customerId,
                accountId:this.accountId,
                instances:this.instanceIdSelected,
                roles:this.roleIdSelected
              }
              this.button=true;
              this.$ajax.post(this.port+"/"+this.getPath+"/display/checkInstancesAndRoles",params1).then((res)=>{
                this.instancesFault=""
                for(var i of res.data.data){
                  this.instancesFault+=i.instanceName+=",";
                }
                //如果有实体匹配不到角色,给出提示是否继续发布
                if(this.instancesFault!=undefined&&this.instancesFault!=""){
                  swal({
                    title:this.$t('m.warning'),
                    text: this.$t('m.storesRemaining1')+this.instanceIdSelected.length
                    +this.$t('m.storesRemaining2')+this.instancesFault+this.$t('m.storesRemaining3'),
                    icon: "warning",
                    closeOnClickOutside: false,
                    buttons: [this.$t('m.no'),this.$t('m.yes')],
                    dangerMode: true,
                  })
                  //根据选择执行回调
                    .then((publish) => {
                      if (!publish) {
                        //取消发布
                        swal(
                          this.$t('m.warning'),
                          this.$t('m.cancelPublish'),
                          "success"
                        );
                        this.button=false;
                      } else {
                        //发布
                        this.loading=true;
                        this.$ajax.post(this.port+"/"+this.getPath+"/display/releaseTaskWeb",params).then((res)=>{
                          this.loading=false;
                          if(res.data.status==0){
                            swal(
                              this.$t('m.warning'),
                              this.$t('m.publishSucc'),
                              "success"
                            );
                            this.reset();
                            this.$router.push('/task_list');
                          }else{
                            swal(
                              this.$t('m.warning'),
                              this.$t('m.publishFailed'),
                              "warning"
                            );
                            this.$router.push('/task_list');
                          }
                          this.button=false;
                        })
                      }
                    });
                }else{
                  //发布
                  this.loading=true;
                  this.$ajax.post(this.port+"/"+this.getPath+"/display/releaseTaskWeb",params).then((res)=>{
                    this.loading=false;
                    if(res.data.status==0){
                      swal(
                        this.$t('m.warning'),
                        this.$t('m.publishSucc'),
                        "success"
                      );
                      this.$emit('watchInput',0);
                      this.reset();
                      this.$router.push('/task_list');
                    }else{
                      swal(
                        this.$t('m.warning'),
                        this.$t('m.publishFailed'),
                        "warning"
                      );
                      this.$router.push('/task_list');
                    }
                  })
                }
              });
            }
          }
        },
        //保存草稿
        saveDraft:function(){
          var params={
            customerId:this.customerId,
            accountId:this.accountId,
            imgUrls:this.picUrl,
            dixUrls:this.adjunct==undefined?[]:this.adjunct,
            instances:this.instanceIdSelected,
            roles:this.roleIdSelected,
            nameIds:this.nameIds,
            taskId:this.taskId==undefined?null:this.taskId,
            taskName:this.data.title,
            taskRemark:this.data.description,
            taskStartDate:this.date.startDate+" 00:00:00",
            taskEndDate:this.date.endDate+" 23:59:59",
            taskAudit:Math.fround(this.radio)
          };
          ////console.log(params)
          if(params.taskStartDate==""||params.taskStartDate==undefined
            ||params.taskEndDate==""||params.taskEndDate==undefined){
            swal(
              this.$t('m.warning'),
              this.$t('m.errDate'),
              "warning"
            );
          }else if(params.instances.length==0||params.instances==[]
            ||params.roles.length==0||params.roles==[]||params.nameIds==[]
            ||params.nameIds.length==0){
            swal(
              this.$t('m.warning'),
              this.$t('m.errSelect'),
              "warning"
            );
          }else if(params.taskAudit!=0&&params.taskAudit!=1){
            swal(
              this.$t('m.warning'),
              this.$t('m.errAudit'),
              "warning"
            );
          }else{
            this.button=true;
            this.$ajax.post(this.port+"/"+this.getPath+"/display/saveTaskWeb",params).then((res)=>{
              if(res.data.status==0){
                swal(
                  this.$t('m.warning'),
                  this.$t('m.draftSaved'),
                  "success"
                );
                this.$emit('watchInput',0);
                this.reset();
                this.$router.push('/task_list');
              }else{
                swal(
                  this.$t('m.warning'),
                  this.$t('m.saveFailed'),
                  "warning"
                );
              }
              this.button=false;
            })
          }
        }
      }
    }
</script>

<style scoped>

</style>
