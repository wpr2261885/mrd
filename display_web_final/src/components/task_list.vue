<template>
  <div class="body">
    <h1>{{$t('m.titleDisplayTask')}}</h1>
    <div class="task_list">
      <button class="btn-create-task" @click="createTask">{{$t('m.createTask')}}</button>
      <p>{{$t('m.dataNum1')}}
        <span class="total-task-count">{{data.length}}<!--陈列任务数量--></span>
        {{$t('m.dataNum2')}}</p>
      <div class="table-outer">
        <table class="table-responsive table-hover table-bordered">
          <thead>
          <tr>
            <td>{{$t('m.id')}}</td>
            <td>{{$t('m.taskTitle')}}</td>
            <td>{{$t('m.creationTime')}}</td>
            <td>{{$t('m.needAudit')}}</td>
            <td>{{$t('m.status')}}</td>
            <td>{{$t('m.operation')}}</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(l,index) in list" @click.stop="taskDetail(l.id,l.createId,l.parentTaskId,0,l.totolExecutorNumber,l.validReplyNumber,l.taskAudit)">
            <td>{{l.num}}</td>
            <td>{{l.name}}</td>
            <td>{{l.date}}</td>
            <td>{{l.taskAudit==1?$t('m.yes'):$t('m.no')}}</td>
            <td>
              <span class="status">{{l.status}}
                <span class="redPoint" v-if="l.status==$t('m.auditPending')||l.status==$t('m.replyPending')"></span>
              </span>
              <span v-if="l.taskStatus>0">({{l.validReplyNumber}}/{{l.totolExecutorNumber}})</span>
            </td>
            <td>
              <button :disabled="l.validReplyNumber>0||l.checkNumInDB>0" @click.stop="taskDetail(l.id,1)" class="btn btn-info">{{$t('m.edit')}}</button>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-if="data.length>15" class="block col-md-offset-9 col-sm-offset-9">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="15"
            layout="prev, pager, next"
            :total="data.length">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      data(){
        return{
          list:[],
          data:[],
          port:this.getPort,
          customerId:this.getCustomerId,
          accountId:this.getAccountId
        }
      },
      beforeMount(){
        this.$ajax.post(this.port+"/getInfo").then((res)=>{
          //console.log("getInfo:");
          //console.log(res);
        }).catch((err)=>{
          //console.log("err");
          //console.log(err);
        })
        var params = {
          "customerId":this.customerId,
          "accountId":this.accountId,
          'isFromMobile': 'adadsfdsaf'
        };
        // list接口
        this.$ajax.post(this.port+"/"+this.getPath+"/display/list", params).then((res)=>{
          console.log(res)
          this.data=res.data.data.arr==null?[]:res.data.data.arr;
          //console.log(this.data)
          //判断状态
          var status;
          for(var i of this.data){
            if(i.taskStatus==0){
              status=this.$t('m.draft');
            }else if(i.taskAudit==0){
              status=this.$t('m.published');
            }else if(i.validAuditNumber>0){
              status=this.$t('m.auditPending');
            }else if(i.totolExecutorNumber==i.validReplyNumber&&i.validAuditNumber==0){
              status=this.$t('m.published');
            }else{
              status=this.$t('m.replyPending');
            }
            i.status=status;
          }
          var num=0;
          for(var i in this.data){
            ++num;
            this.data[i].num=num;
          }
          this.pagination()
        })
      },
      methods:{
        //分页
        pagination:function(pageNo=1){
          if(this.data.length>15){
            this.list=[];
            var startPage=(pageNo-1)*15;
            var endPage=pageNo*15;
            if(pageNo>1){
              if(startPage>this.data.length){
                endPage=this.data.length;
              }else if(endPage>this.data.length){
                endPage=this.data.length;
              }
            };
            for(var i=startPage;i<endPage;i++){
              this.list.push(this.data[i]);
            };
          }else{
            this.list=this.data;
          }
          //console.log(pageNo,startPage,endPage,this.list);
        },
        //陈列任务详情跳转与编辑跳转,path判断跳转
        taskDetail:function(tid,cid,pid,path,total,reply,audit){
          if(path==0){
            this.$router.push('/task_detail/'+tid+"/"+cid+"/"+pid+"/"+total+"/"+reply+"/"+audit);
          }else{
            this.$router.push("/create_task/"+tid);
          }
        },
        createTask:function(){
          window.sessionStorage.clear();
          window.sessionStorage.accountId=this.accountId;
          window.sessionStorage.customerId=this.customerId;
          window.sessionStorage.ctx=this.port;
          this.$router.push("/create_task");
        },
        handleCurrentChange(val) {
          //console.log(val);
          this.pagination(val);
        }
      }
    }
</script>

<style scoped>

</style>
