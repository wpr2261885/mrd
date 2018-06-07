<template>
  <div class="body">
    <div>
      <h1>{{$t('m.patrolRecord')}}</h1>
    </div>
    <div class="content">
      <div class="box">
        <div class="content-header-title">
          <span>{{$t('m.patrolRecordList')}}</span>
          <span></span>
        </div>
        <div class="box-item">
          <!--巡店记录总数-->
          <p>{{$t('m.dataNum1')}}
            <span class="total-task-count">{{list.total?list.total:0}}</span>
            {{$t('m.dataNum2')}}</p>
          <table class="table-responsive table-hover table-bordered">
            <thead>
            <tr>
              <td>{{$t('m.id')}}</td>
              <td>{{$t('m.storeTitle')}}</td>
              <td>{{$t('m.scoreTotal')}}</td>
              <td>{{$t('m.checkOption')}}</td>
              <td>{{$t('m.patrolMethod')}}</td>
              <td>{{$t('m.patrolPlanTitle')}}</td>
              <td>{{$t('m.patrolTime')}}</td>
              <td>{{$t('m.patrolExecutor')}}</td>
              <td>{{$t('m.operation')}}</td>
            </tr>
            </thead>
            <tbody v-if="list.length!=0">
            <!--表格内容-->
            <template v-for="(l,index) in list.rows">
              <tr>
                <td style="color:#949494;">{{(pageNo-1)*15+index+1}}</td>
                <td>{{l.customerInstance.instanceTitle}}</td>
                <td class="green-text">{{l.recordScore}}/{{l.recordMaxScore}}</td>
                <td style="color:#949494;">{{l.recordQualified+$t('m.pass')+','+l.recordUnqualified+$t('m.noPass')}}</td>
                <td style="color:#949494;">{{l.recordType==1?$t('m.online'):$t('m.offline')}}</td>
                <td v-if="l.patrolPlan!=null" style="color:#949494;">{{l.patrolPlan.planTitle}}</td>
                <td v-if="l.patrolPlan==null">-</td>
                <td style="color:#949494;">{{l.recordCreate}}</td>
                <td v-if="l.accountInfo!=null" style="color:#949494;">{{l.accountInfo.accountNickName}}</td>
                <td v-if="l.accountInfo==null">-</td>
                <td @click="handleSlide(index,l.recordId)" style="cursor:pointer;color:#29C7C6;">
                  <span>{{$t('m.detail')}}</span>
                </td>
              </tr>
              <!--下拉部分-->
              <tr v-if="index==detailIndex">
                <td style="padding:0;" colspan="10">
                  <ul class="patrol-record-detail" v-if="gotDetail">
                    <li>
                      <!--下拉内容头部-->
                      <ul class="patrol-record-detail-header" v-if="tabs.length!=0">
                        <li>
                          <span>{{$t('m.scoreTotal')}}:</span>
                          <span>{{score}}/{{totalScore}}</span>
                        </li>
                        <li v-for="(i,index1) in tabs" @click="tabTrans(index1,l.recordId)" :class="{'span-tab-btn-clicked':tabNum==index1}">
                          <span>{{i.name}}：</span>
                          <span>{{i.num}}{{$t('m.option')}}</span>
                        </li>
                      </ul>
                    </li>
                    <li class="patrol-record-detail-row-header" style="color:#949494;">
                      <div>{{$t('m.evaluateOption')}}</div>
                      <div>{{$t('m.picShot')}}</div>
                      <div>{{$t('m.evaluate')}}</div>
                      <div>{{$t('m.score')}}</div>
                      <div>{{$t('m.status')}}</div>
                    </li>
                    <!--下拉内容主体-->
                    <li class="patrol-record-detail-row" v-for="(j,index2) in detail">
                      <div>{{j.itemEvaluateItemTitle}}</div>
                      <div @click="picZoom(j.itemImage)" class="pic-box">
                        <img v-if="j.itemImage!=''" style="width:20px;" :src="j.itemImage">
                        <img v-if="j.itemImage==''" style="width:20px;" src="../../assets/img/no_picture.png">
                      </div>
                      <div>{{j.itemEvaluateName}}</div>
                      <div>{{$t('m.scoreTotal')}}:{{j.itemScore+'/'+j.itemEvaluateScore}}</div>
                      <div>{{j.itemState===1?$t('m.pass'):j.itemState===2?$t('m.noPass'):$t('m.noFit')}}</div>
                    </li>
                  </ul>
                </td>
              </tr>
            </template>
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
</template>

<script>
    export default {
        data(){
          return{
            customerId:this.getCustomerId,
            accountId:this.getAccountId,
            port:this.getPort,
            button:false,
          //  序号
            pageNo:1,
          //  详情开关
            detailIndex:-1,
            gotDetail:false,
          //  切换随机巡店开关
            random:false,
            list:[],
            detail:[],
          //  下拉内容头部tab
            tabs:[],
            tabNum:-1,
          //  合格
            qualified:0,
            unqualified:0,
            inapplicable:0,
            score:0,
            totalScore:0
          }
        },
      beforeMount(){
          this.getList(1);
      },
      methods:{
        //  收起或展开详情
        handleSlide(index,rid){
          //收起
          if(this.detailIndex==index){
            this.detailIndex=-1;
          }else{
            //展开
            this.gotDetail=false;
            this.detailIndex=index;
            this.getDetail(rid,0);
          }
          this.tabNum=0;
        },
        //  获取列表
        getList(pageIndex){
          var params={
            customerId:this.customerId,
            accountId:this.accountId,
            pageSize:15,
            pageIndex:pageIndex
          };
          this.$ajax.post(this.port+"/customer/patrol/patrolShop/record/list",params).then((res)=>{
            //console.log(res.data.data)
            if(res.data.data&&res.data.data.length!=0){
              this.list=res.data.data
            }
          })
        },
        //获取详情
        getDetail(rid,state){
          var params={
            customerId:this.customerId,
            accountId:this.accountId,
            recordId:rid,
            state:state
          };
          this.$ajax.post(this.port+"/customer/patrol/patrolShop/record/detail",params).then((res)=>{
            this.detail=res.data.data
            if(!this.gotDetail){
              this.qualified=0;
              this.unqualified=0;
              this.inapplicable=0;
              this.score=0;
              this.totalScore=0;
              for(var i of this.detail){
                if(i.itemState===1){
                  this.qualified++
                }
                if(i.itemState===2){
                  this.unqualified++
                }
                if(i.itemState===3){
                  this.inapplicable++
                }
                this.score+=i.itemScore;
                this.totalScore+=i.itemEvaluateScore;
              }
              this.tabs=[{
                name:this.$t('m.checkOption'),
                num:this.detail.length
              },{
                name:this.$t('m.pass'),
                num:this.qualified
              },{
                name:this.$t('m.noPass'),
                num:this.unqualified
              },{
                name:this.$t('m.noFit'),
                num:this.inapplicable
              }]
            }
            this.gotDetail=true;
            //console.log("详情",this.detail,this.tabs)
          })
        },
        //图片放大查看
        picZoom(img){
          if(img!=""){
            $(event.currentTarget)
              .toggleClass("pic-box-zoom")
              .find("img")
              .toggleClass("pic-zoom");
          }
        },
        //  切换详情tab
        tabTrans(index,id){
          this.tabNum=index;
          this.getDetail(id,index)
        },
        //切换顶部按钮
        handleTrans(i){
          if(i==0){
          //  切换到随机巡店
            this.random=true;
          }else{
            //切换到计划巡店
            this.random=false;
          }
        },
        //分页
        handleCurrentChange(value){
          this.getList(value);
          this.pageNo=value;
        }
      }
    }
</script>

<style scoped>

</style>
