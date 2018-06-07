<template>
  <div class="body">
    <div>
      <h1>{{$t('m.patrolFormList')}}</h1>
    </div>
    <div class="content">
      <div class="box">
        <div class="content-header-title">
          <span>{{$t('m.formList')}}</span>
          <span>
            <button class="btn-create-task" @click="createForm(0)">{{$t('m.createForm')}}</button>
          </span>
        </div>
        <div class="box-item">
          <p>{{$t('m.dataNum1')}}
            <!--巡店表单数据总数-->
            <span class="total-task-count">{{data.length}}</span>
            {{$t('m.dataNum2')}}</p>
          <div class="table-outer">
            <table class="table-responsive table-hover table-bordered">
              <thead>
              <tr>
                <td>{{$t('m.id')}}</td>
                <td>{{$t('m.formTitle')}}</td>
                <td>{{$t('m.typeNum')}}</td>
                <td>{{$t('m.totalScore')}}</td>
                <td>{{$t('m.status')}}</td>
                <td>{{$t('m.operation')}}</td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(l,index) in list">
                <td>{{l.num}}</td>
                <td>{{l.evaluateTitle}}</td>
                <td>{{l.evaluateItem}}</td>
                <td>{{l.evaluateTotalScore}}</td>
                <td>
                  <span :class="l.evaluateState?'green-text':'red-text'">{{l.evaluateState?$t('m.enable'):$t('m.disabled')}}</span>
                </td>
                <td>
                  <button :disabled="button" @click.stop="createForm(l.evaluateId,1)" class="btn btn-info">{{$t('m.edit')}}</button>
                  <button :disabled="button" @click.stop="handleDelete(l.evaluateId)" class="btn btn-danger">{{$t('m.delete')}}</button>
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
        accountId:this.getAccountId,
        accountDemo:this.getAccountDemo,
      //  按钮
        button:false
      }
    },
    beforeMount(){
      this.getList();
    },
    methods:{
      //获取列表
      getList(){
        var params = {
          customerId:this.customerId,
          accountId:this.accountId
        };
        // list接口
        this.$ajax.post(this.port+'/customer/patrol/evaluate/list',params).then((res)=>{
          this.data=res.data;
          this.pagination(1);
          //console.log("列表",res.data)
        });
      },
      //分页
      pagination:function(pageNo=1){
        var num=0;
        for(var i in this.data){
          ++num;
          this.data[i].num=num;
        }
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
      },
      //删除按钮
      handleDelete:function(fid){
        if(!this.accountDemo){
          swal({
            title:this.$t('m.warning'),
            text: this.$t('m.delConfirm'),
            icon: "warning",
            buttons: [this.$t('m.no'),this.$t('m.yes')],
            dangerMode: true,
          })
          //根据选择执行回调
            .then((del) => {
              if(del){
                var params={
                  accountId:this.accountId,
                  customerId:this.customerId,
                  evaluateId:fid
                };
                this.button=true;
                this.$ajax.post(this.port+'/customer/patrol/evaluate/remove',params).then((res)=>{
                  if(res.data.status==0){
                    swal(
                      this.$t('m.success'),
                      this.$t('m.deleteSucc'),
                      "success"
                    );
                  }else if(res.data.status==30001){
                    swal(
                      this.$t('m.warning'),
                      this.$t('m.formIsUsing'),
                      "warning"
                    )
                  }else{
                    swal(
                      this.$t('m.warning'),
                      this.$t('m.deleteFailed'),
                      "warning"
                    );
                  }
                  this.getList();
                  this.button=false;
                })
              }
            });
        }else{
          swal(
            this.$t('m.warning'),
            this.$t('m.trialAccountWarn'),
            "warning"
          );
        }
      },
      //巡店表单详情跳转
      createForm:function(fid,jump){
        //判断jump，0为新建表单，1为编辑
        if(jump>0){
          this.$router.push("/create_patrol_form/"+fid);
        }else{
          this.$router.push("/create_patrol_form")
        }
      },
      handleCurrentChange(val) {
        this.pagination(val);
      }
    }
  }
</script>

<style scoped>

</style>
