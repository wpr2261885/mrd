<template>
<div class="body">
  <div>
    <h1>{{$t('m.patrolPlanManage')}}</h1>
  </div>
  <div class="content">
    <div class="box">
      <div class="content-header-title">
        <span>{{$t('m.patrolPlanList')}}</span>
        <span>
          <button @click="createPlan(-1)" class="btn-create-task">{{$t('m.newPlan')}}</button>
        </span>
      </div>
      <!--巡店计划-->
      <div>
        <div class="box-item">
          <!--巡店计划总数-->
          <p>{{$t('m.dataNum1')}}
            <span class="total-task-count">{{list.total?list.total:0}}</span>
            {{$t('m.dataNum2')}}</p>
          <table class="table-responsive table-hover table-bordered">
            <thead>
            <tr>
              <td>{{$t('m.id')}}</td>
              <td>{{$t('m.planTitle')}}</td>
              <td>{{$t('m.storeNum')}}</td>
              <td>{{$t('m.startDate')}}</td>
              <td>{{$t('m.endDate')}}</td>
              <td>{{$t('m.method')}}</td>
              <td>{{$t('m.status')}}</td>
              <td>{{$t('m.createTime')}}</td>
              <td>{{$t('m.operation')}}</td>
            </tr>
            </thead>
            <tbody v-if="list.length!=0">
            <tr v-for="(i,index) in list.rows">
              <td>{{(pageNo-1)*15+index+1}}</td>
              <td>{{i.planTitle}}</td>
              <td class="green-text">{{i.instances.length}}</td>
              <td>{{i.planStart}}</td>
              <td>{{i.planEnd}}</td>
              <td style="color:#9F9B99;">{{i.planWay==1?$t('m.online'):$t('m.offline')}}</td>
              <td :class="{'green-text':i.planState==1,'red-text':i.planState==3}">{{i.planState===1?$t('m.executing1'):i.planState===2?$t('m.completed'):$t('m.executing')}}</td>
              <td>{{i.planCreate}}</td>
              <td>
                <button :disabled="i.planState===2||i.planAccountId!=accountId" @click.stop="createPlan(i.planId)" class="btn btn-info">{{$t('m.edit')}}</button>
                <button :disabled="i.planState===2||i.planAccountId!=accountId" @click.stop="handleStop(i.planId)" class="btn btn-danger">{{$t('m.stop')}}</button>
              </td>
            </tr>
            </tbody>
          </table>
          <div v-if="list!=null&&list.total>15" class="block col-md-offset-9 col-sm-offset-9">
            <el-pagination
              @current-change="handleCurrentChange"
              :page-size="15"
              layout="prev, pager, next"
              :total="list.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
    export default {
      data(){
        return {
          accountId:this.getAccountId,
          customerId:this.getCustomerId,
          port:this.getPort,
          accountDemo:this.getAccountDemo,
        //  列表
          list:[],
        //  分页
          pageNo:1
        }
      },
      beforeMount(){
        this.getList(1);
      },
      methods:{
        //分页
        handleCurrentChange(value){
          this.getList(value);
          this.pageNo=value;
        },
        //获取列表
        getList(pageNo){
          var params={
            accountId:this.accountId,
            customerId:this.customerId,
            pageSize:15,
            pageIndex:pageNo
          };
          this.$ajax.post(this.port+"/customer/patrol/plan/list",params).then((res)=>{
            //console.log(res.data.data)
            if(res.data.data&&res.data.data.length!=0){
              this.list=res.data.data;
            }
          });
        },
        handleStop(pid){
          if(!this.accountDemo){
            swal({
              title:this.$t('m.warning'),
              text: this.$t('m.stopConfirm'),
              icon: "warning",
              closeOnClickOutside: false,
              buttons: [this.$t('m.no'),this.$t('m.yes')],
              dangerMode: true,
            }).then((stop)=>{
              if(stop){
                var params={
                  customerId:this.customerId,
                  accountId:this.accountId,
                  planId:pid
                };
                this.$ajax.post(this.port+"/customer/patrol/plan/terminate",params).then((res)=>{
                  //console.log(res)
                  if(res.data.status==0){
                    swal(
                      this.$t('m.success'),
                      this.$t('m.stoppedSuccess'),
                      "success"
                    );
                    this.getList(1);
                  }else{
                    swal(
                      this.$t('m.warning'),
                      this.$t('m.stoppedFailed'),
                      "warning"
                    )
                  }
                });
              }
            })
          }else{
            swal(
              this.$t('m.warning'),
              this.$t('m.trialAccountWarn'),
              "warning"
            );
          }
        },
        createPlan(pid=-1){
          if(pid!=-1){
          //  编辑
            this.$router.push("create_patrol_plan/"+pid);
          }else{
            this.$router.push("create_patrol_plan");
          }
        },
      }
    }
</script>

<style scoped>

</style>
