<template>
  <div class="body">
    <div class="content-header">
      <h1>{{$t('m.customerManagement')}}</h1>
    </div>
    <div class="content">
      <div class="box">
        <div class="content-header-title">
          <span>{{$t('m.guestList')}}</span>
          <span></span>
        </div>
        <div class="box-item">
          <span @click="handleTransTab(0)" class="span-tab" :class="{'span-tab-clicked':activeGuest}">{{$t('m.activeGuest')}}</span>
          <span @click="handleTransTab(1)" class="span-tab" :class="{'span-tab-clicked':!activeGuest}">{{$t('m.silenceGuest')}}</span>
        </div>
        <div class="box-item">
          <div>
            <!--选择门店-->
            <span class="box-item-input" @click="openTree">
              <el-input style="width:300px;" :title="treeSelected" :placeholder="$t('m.selectInstance')" v-model="treeSelected" readonly></el-input>
            </span>
            <!--选择顾客-->
            <span class="box-item-input">
              <el-select @change="selectGuestChange" v-model="guestSelected" :placeholder="$t('m.select')">
                <el-option
                  v-for="item in guest"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </span>
            <!--选择周期-->
            <el-date-picker
              v-if="activeGuest"
              @change="pickDateChange"
              :editable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              class="box-item-input"
              v-model="dateRange"
              type="daterange"
              align="right"
              :clearable="false"
              unlink-panels
              :range-separator="$t('m.to')"
              :start-placeholder="$t('m.startDate')"
              :end-placeholder="$t('m.endDate')"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </div>
        <div class="box-item">
          <p>{{$t('m.total')}}
            <!--数据总数-->
            <span class="total-task-count">{{list.length!=0?list.total:0}}</span>
            {{$t('m.data')}}</p>
          <table class="table-responsive table-hover table-bordered">
            <thead>
              <tr>
                <td>{{$t('m.avatar')}}</td>
                <td>{{$t('m.name')}}</td>
                <td>{{$t('m.gender')}}</td>
                <td>{{$t('m.age')}}</td>
                <td>{{$t('m.type')}}</td>
                <td>{{$t('m.lastTime')}}</td>
                <td>{{$t('m.times')}}</td>
                <td>{{$t('m.phoneNum')}}</td>
                <td>{{$t('m.remark')}}</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i,index) in list.rows">
                <td>
                  <img class="avatar-pic" :src="i.guestAvatar">
                </td>
                <td>{{i.guestName==""?"-":i.guestName}}</td>
                <td>{{i.guestGender===1?$t('m.male'):$t('m.female')}}</td>
                <td>{{i.guestAge}}</td>
                <td>
                  {{
                    i.guestType==1?$t('m.employ')
                   :i.guestType==2?$t('m.notGuest')
                   :i.guestType==3?$t('m.vip')
                   :i.guestType==4?$t('m.oldGuest')
                   :$t('m.newGuest')
                  }}
                </td>
                <td>{{i.guestRecentVisitAtStr}}</td>
                <td>
                  {{i.guestDayVisitTimes+$t('m.time')}},
                  <span @click="openTimes(i.guestId)" class="table-inner-detail-btn">{{$t('m.detail')}}</span>
                  <!--到店总次数详情-->
                  <el-dialog :title="$t('m.times')" :visible.sync="dialogTimesDetail">
                    <ul v-if="timesList.length!=0" class="dialog-detail-list">
                      <li v-for="(i,index) in timesList">
                        <span>{{$t('m.No')+i.time+$t('m.timeAtStore')+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"}}</span>
                        <span>{{i.visitTime.split(" ")[0]+"&nbsp;"+i.visitTime.split(" ")[1]+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"}}</span>
                        <span>{{i.instanceName}}</span>
                      </li>
                    </ul>
                    <div v-if="dialogTimesDetail" class="block" style="margin-top:30px;text-align:right;">
                      <el-pagination
                        v-if="timesList.length!=0&&timesList[0].count>10"
                        @current-change="handleCurrentTimesChange"
                        :page-size="10"
                        layout="prev, pager, next"
                        :total="timesList[0].count">
                      </el-pagination>
                    </div>
                    <div slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="dialogTimesDetail = false">{{$t('m.confirm')}}</el-button>
                    </div>
                  </el-dialog>
                </td>
                <td>{{i.guestMobile==""?"-":i.guestMobile}}</td>
                <td>
                  <span v-if="i.guestRemark==''">{{i.guestRemark==""?$t('m.null'):i.guestRemark}}</span>
                  <span v-if="i.guestRemark!=''" @click="openRemark(i.guestId)" class="table-inner-detail-btn">{{$t('m.detail')}}</span>
                  <!--备注详情-->
                  <el-dialog :title="$t('m.remark')" :visible.sync="dialogRemark">
                    <ul v-if="remarkList.length!=0" class="dialog-detail-list">
                      <li v-for="(i,index) in remarkList">
                        <p style="text-align:left;color:black;">{{i.remarkContent}}</p>
                        <p style="text-align:right;color:gray;">{{i.remarkCreateAt|dateTrans}}</p>
                        <hr>
                      </li>
                    </ul>
                    <div v-if="dialogRemark" class="block" style="margin-top:30px;text-align:right;">
                      <el-pagination
                        v-if="remarkExList.length>3"
                        @current-change="handleCurrentRemarkChange"
                        :page-size="3"
                        layout="prev, pager, next"
                        :total="remarkExList.length">
                      </el-pagination>
                    </div>
                    <div slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="dialogRemark = false">{{$t('m.confirm')}}</el-button>
                    </div>
                  </el-dialog>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="list.length!=0&&list.total>15" class="block" style="margin-top:30px;text-align:right;">
            <el-pagination
              @current-change="handleCurrentChange"
              :page-size="15"
              layout="prev, pager, next"
              :total="parseInt(list.total)">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showTree" class="tree-modal">
      <treeComponent @treeEvent="getTreeData" ref="tree"></treeComponent>
    </div>
  </div>
</template>

<script>
  import treeComponent from "./treeRadioComponent";

    export default {
      components:{
        treeComponent
      },
      data(){
        return{
          customerId:this.getCustomerId,
          accountId:this.getAccountId,
          port:this.getPort,
          currentPage:1,
          showTree:false,
          //备注详情开关
          dialogRemark:false,
          //到店次数详情开关
          dialogTimesDetail: false,
          //已选选项
          treeSelected:"",
          storeIdSelected:[],
          //tab切换
          activeGuest:true,
          //选择门店
          storeSelected:[],
        //  顾客类别
          guest:[{
            label:this.$t('m.allGuest'),
            value:"0"
          },{
            label:this.$t('m.employ'),
            value:"1"
          },{
            label:this.$t('m.notGuest'),
            value:"2"
          },{
            label:this.$t('m.vip'),
            value:"3"
          },{
            label:this.$t('m.oldGuest'),
            value:"4"
          },{
            label:this.$t('m.newGuest'),
            value:"5"
          }],
          guestSelected:'0',
          guestId:"",
        //  表格数据
          list:[],
        //  到店次数
          timesList:[],
        //  备注分页前，
          remarkExList:[],
          remarkList:[],
        //  选择周期
          pickerOptions: {
            //限制日期范围
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
            shortcuts: [{
              //今日
              text: this.$t('m.today'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
                picker.$emit('pick', [start, end]);
              }
            },{
              //昨天
              text: this.$t('m.yesterday'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
              }
            },{
              //近一周
              text: this.$t('m.currentWeek'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                picker.$emit('pick', [start, end]);
              }
            }, {
              //近一月
              text: this.$t('m.currentMonth'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 27);
                picker.$emit('pick', [start, end]);
              }
            }, {
              //近三月
              text: this.$t('m.current3Month'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 83);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          dateRange: [this.formatDate(new Date).split(" ")[0],this.formatDate(new Date).split(" ")[0]],
        }
      },
      filters:{
        //时间戳转日期
        dateTrans(timestamp){
          var date = new Date(parseInt(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = date.getDate() + ' ';
          var h = date.getHours() + ':';
          var m = date.getMinutes<10?'0'+date.getMinutes()+':':date.getMinutes()+':';
          var s = date.getSeconds();
          return Y+M+D+h+m+s;
        },
      },
      beforeMount(){
        var params={
          accountId:this.accountId,
          customerId:this.customerId
        }
        this.$ajax.post(this.port+"/app/face/getAllInstances",params).then((res)=>{
          console.log(res)
          if(res.data.data.length!=0){
            this.storeIdSelected.push(res.data.data[0].instanceId);
            this.treeSelected=res.data.data[0].instanceName;
            this.getList(1);
          }
        })
      },
      methods:{
        //选择顾客
        selectGuestChange(value){
          this.guestSelected=value;
          console.log("顾客",this.guestSelected)
          this.getList(1);
        },
        //选择周期
        pickDateChange(value){
          console.log(this.dateRange)
          this.getList(1);
        },
        //tab切换
        handleTransTab(i){
          if(i===0){
          //  切换到活跃客
            this.activeGuest=true;
            this.getList(1);
          }else{
          //  切换到沉默客
            this.activeGuest=false;
            this.getList(1);
          }
        },
        //查看到店次数
        openTimes(id) {
          this.guestId=id;
          this.dialogTimesDetail=true;
          this.getTimesList(1,id);
          console.log(id)
        },
        //查看备注
        openRemark(id) {
          this.dialogRemark=true;
          this.guestId=id;
          this.getRemarkList(id,1,3);
          console.log(id)
        },
        //获取列表
        getList(pageIndex){
          if(this.storeIdSelected.length!=0){
            var params={
              accountId:this.accountId,
              customerId:this.customerId,
              isSilent:this.activeGuest?0:1,
              guestType:parseInt(this.guestSelected),
              instanceId:this.storeIdSelected[0],
              startTime:this.activeGuest?this.dateRange[0]:"-1",
              endTime:this.activeGuest?this.dateRange[1]:"-1",
              pageIndex:(pageIndex-1)*15,
              pageSize:15
            }
            console.log(params)
            this.$ajax.post(this.port+"/web/face/getGuestList",params).then((res)=>{
              this.list=JSON.parse(res.data.data.resultData);
              console.log("顾客",this.list)
            })
          }else{
            swal(
              this.$t('m.warning'),
              this.$t('m.selectStoreWarn'),
              "warning"
            );
          }
        },
      //  获取到店次数列表
        getTimesList(pageIndex){
          var params={
            customerId:this.customerId,
            accountId:this.accountId,
            guestId:this.guestId,
            pageIndex:(pageIndex-1)*10,
            pageSize:10
          }
          console.log(params)
          this.$ajax.post(this.port+"/web/face/getGuestArriveRecord",params).then((res)=>{
            this.timesList=res.data.data;
            var time=this.timesList[0].count-10*(pageIndex-1);
            for(var i of this.timesList){
              i.time=time--
            }
            console.log("到店记录",this.timesList)
          })
        },
      //  获取备注列表
        getRemarkList(id,pageIndex,pageSize){
          var params={
            accountId:this.accountId,
            customerId:this.customerId,
            guestId:id
          }
          this.$ajax.post(this.port+"/web/face/getGuestRemarksRecord",params).then((res)=>{
            this.remarkExList=JSON.parse(res.data.data);
            this.pagination(pageIndex,pageSize);
            console.log("备注",this.remarkExList)
          })
        },
      //  前端分页
        pagination(pageIndex,pageSize){
          if(this.remarkExList.length>pageSize){
            this.remarkList=[];
            var startPage=(pageIndex-1)*pageSize;
            var endPage=pageIndex*pageSize;
            if(pageIndex>1){
              if(startPage>this.remarkExList.length){
                endPage=this.remarkExList.length;
              }else if(endPage>this.remarkExList.length){
                endPage=this.remarkExList.length;
              }
            };
            for(var i=startPage;i<endPage;i++){
              this.remarkList.push(this.remarkExList[i]);
            };
          }else{
            this.remarkList=this.remarkExList;
          }
        },
      //  总列表分页
        handleCurrentChange(value){
          this.getList(value)
        },
      //  到店次数详情分页
        handleCurrentTimesChange(value){
          this.getTimesList(value);
        },
        //备注分页
        handleCurrentRemarkChange(value){
          this.pagination(value,3);
        },
        //打开组织结构树
        openTree(){
          this.showTree=true;
        },
        getTreeData(data){
          this.showTree=false;
          this.list=[];
          //console.log(data)
          if(data.length<2){
            //  用户点击取消按钮
          }else{
            this.storeSelected=[];
            this.storeIdSelected=[];
            this.treeSelected="";
            //  用户点击确认按钮
            if(data[0]=="instance"&&data.length>1){
              //  用户选择实体
              for(var i of data){
                if(i!="instance"){
                  this.storeIdSelected.push(i.id);
                  this.storeSelected.push(i.text);
                }
              }
              if(this.storeSelected.length>3){
                this.storeSelected=this.storeSelected.slice(0,3);
                this.treeSelected=this.storeSelected.join(",")+this.$t('m.etc')
                  +this.storeIdSelected.length+this.$t('m.instances')
              }else{
                this.treeSelected=this.storeSelected.join(",");
              }
            }else if(data[0]=="area"&&data.length>2){
              //  用户选择区域
              for(var i of data[2]){
                this.storeIdSelected.push(i.instanceId);
              }
              this.treeSelected=data[1].name;
            }else{
              //用户选择table
              if(data.length>0){
                for(var i of data){
                  if(i!="table"){
                    this.storeSelected.push(i.instanceTitle);
                    this.storeIdSelected.push(i.instanceId);
                  }
                }
                if(this.storeSelected.length>3){
                  this.storeSelected=this.storeSelected.slice(0,3);
                  this.treeSelected=this.storeSelected.join(",")+this.$t('m.etc')
                    +this.storeIdSelected.length+this.$t('m.instances')
                }else{
                  this.treeSelected=this.storeSelected.join(",")
                }
              }
            }
          }
          if(this.treeSelected!=""){
            this.getList(1)
          }
        }
      }
    }
</script>

<style scoped>

</style>
