<template>
  <div class="body">
    <div class="content-header">
      <h1>{{$t('m.guestAnalysis')}}</h1>
    </div>
    <div class="content">
      <div class="box">
        <div class="content-header-title">
          <span>{{$t('m.analysis')}}</span>
          <span></span>
        </div>
        <div class="box-item">
          <div>
            <!--选择门店-->
            <span class="box-item-input" @click="openTree">
              <el-input style="width:450px;" :title="treeSelected" :placeholder="$t('m.selectInstance')" v-model="treeSelected" readonly></el-input>
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
        <div class="box-item" v-if="storeIdSelected.length!=0">
          <div class="box-item-data">
            <div style="display:flex;">
              <div>
                <p style="color:#FF6600;font-size:28px;margin:0;">{{data.lerAft}}</p>
                <p>{{guest[guestSelected].label}}</p>
              </div>
              <div style="margin-left:200px;">
                <p>{{$t('m.ler')}}</p>
                <p>{{$t('m.yoy')}}</p>
              </div>
              <div style="margin-left:50px;">
                <p :class="data.lerPercent>0?'arrow-up-red'
                          :data.lerPercent<0?'arrow-down-green':''">{{data.lerPercent}}% ({{data.lerAft}})</p>
                <p :class="data.yoyPercent>0?'arrow-up-red'
                          :data.yoyPercent<0?'arrow-down-green':''">{{data.yoyPercent}}% ({{data.lerAft}})</p>
              </div>
            </div>
          </div>
        </div>
        <div  v-if="storeIdSelected.length!=0" class="box-item" style="display:flex;flex-wrap:wrap;">
          <!--客流统计-->
          <div class="box-item-dashboard">
            <div style="margin-top:18px;" ref="guest" class="analysis-echarts"></div>
          </div>
          <!--年龄统计-->
          <div class="box-item-dashboard">
            <div ref="age" class="analysis-echarts"></div>
          </div>
          <!--性别统计-->
          <div class="box-item-dashboard">
            <div ref="gender" class="analysis-echarts"></div>
          </div>
          <!--门店对比-->
          <div v-if="storeIdSelected.length>1" class="box-item-dashboard">
            <div v-if="guestSelected!=0" style="text-align:right;float:right;">
              <el-select @change="selectTypeChange" v-model="typeSelected" :placeholder="$t('m.selectCondition')">
                <el-option
                  v-for="item in type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div ref="store" style="margin-top:18px;" class="analysis-echarts"></div>
            <div v-if="storeComp.length>0&&storeComp.series[0].data.length>10" style="text-align:right;">
              <el-pagination
                @current-change="handleCurrentChange"
                :page-size="10"
                layout="prev, pager, next"
                :total="storeComp.series[0].data.length">
              </el-pagination>
            </div>
            <div class="no-data" v-if="storeCompNoData">
              {{$t('m.noneData')}}
            </div>
          </div>
          <!--到店次数-->
          <div v-if="guestSelected!=5" class="box-item-dashboard">
            <div ref="storeTimes" class="analysis-echarts"></div>
          </div>
          <!--到店间隔-->
          <div v-if="guestSelected!=5" class="box-item-dashboard">
            <div style="margin-top:18px;" ref="storePeriod" class="analysis-echarts"></div>
            <div class="no-data" v-if="storePeriodNoData">
              {{$t('m.noneData')}}
            </div>
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
  import treeComponent from "./treeComponent";

    export default {
      components:{treeComponent},
      data(){
        return{
          accountId:this.getAccountId,
          customerId:this.getCustomerId,
          port:this.getPort,
          showTree:false,
          treeSelected:"",
          //顾客数据
          data:{},
          //暂无数据
          storePeriodNoData:false,
          storeCompNoData:false,
          //图表数据
          guestNumber:{},
          optionAge:{},
          optionGender:{},
          storeComp:{},
          storeTimes:{},
          storePeriod:{},
          //选择门店对比类别
          typeSelected:"",
          type:[{
            label:this.$t('m.byNum'),
            value:1
          },{
            label:this.$t('m.byPercent'),
            value:2
          }],
          //选择门店
          storeSelected:[],
          storeIdSelected:[],
          //选择顾客
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
          guestSelected:"0",
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
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
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
          dateRange: [this.formatDate(new Date).split(" ")[0],
                        this.formatDate(new Date).split(" ")[0]],
        }
      },
      mounted(){
        var params={
          accountId:this.accountId,
          customerId:this.customerId
        }
        this.$ajax.post(this.port+"/app/face/getAllInstances",params).then((res)=>{
          console.log(res)
          if(res.data.data.length!=0){
            for(var i of res.data.data){
              this.storeIdSelected.push(i.instanceId);
            }
            this.treeSelected=this.$t('m.allInstance');
            this.getData();
          }
        })
      },
      methods:{
        //选择顾客
        selectGuestChange(value){
          if(value==0){
            this.typeSelected="";
          }
          this.guestSelected=value;
          console.log("顾客",this.guestSelected)
          this.getData();
        },
        //选择日期
        pickDateChange(value){
          console.log(this.dateRange)
          this.getData();
        },
      //  选择门店对比类别
        selectTypeChange(value){
          console.log(value)
          this.getCompData(1);
        },
      //  获取数据
        getData(){
          if(this.storeIdSelected.length!=0){
            //获取顾客统计数据
            var params1={
              accountId:this.accountId,
              customerId:this.customerId,
              instanceIds:this.storeIdSelected.join(","),
              guestType:parseInt(this.guestSelected),
              startTime:this.dateRange[0],
              endTime:this.dateRange[1]
            }
            this.$ajax.post(this.port+"/web/face/getGuestDataStatistics",params1).then((res)=>{
              console.log("数据",res)
              this.data=res.data.data;
              this.data.yoyDif=this.data.yoyAft-this.data.yoyBef;
              this.data.lerDif=this.data.lerAft-this.data.lerBef;
              if(res.data.data.yoyBef!=0){
                this.data.yoyPercent=this.data.yoyDif/this.data.yoyBef*100;
                this.data.yoyPercent=this.data.yoyPercent.toFixed(2);
              }else if(res.data.data.yoyAft!=0){
                this.data.yoyPercent=100;
              }else{
                this.data.yoyPercent=0;
              }
              if(res.data.data.lerBef!=0){
                this.data.lerPercent=this.data.lerDif/this.data.lerBef*100;
                this.data.lerPercent=this.data.lerPercent.toFixed(2);
              }else if(res.data.data.lerAft!=0){
                this.data.lerPercent=100;
              }else{
                this.data.lerPercent=0;
              }
            });
            var params={
              accountId:this.accountId,
              customerId:this.customerId,
              instanceIds:this.storeIdSelected.join(","),
              guestType:parseInt(this.guestSelected),
              startTime:this.dateRange[0],
              endTime:this.dateRange[1]
            }
            console.log(params)
            //  获取客流趋势数据
            this.$ajax.post(this.port+"/web/face/getGuestFlowTrend",params).then((res)=>{
              console.log(res)
              this.guestNumber=JSON.parse(res.data.data);
              this.drawGuest(this.$refs.guest,this.guestNumber);
            })
            //  获取年龄性别
            this.$ajax.post(this.port+"/web/face/getGuestAgeGenderStatistics",params).then((res)=>{
              this.optionAge=JSON.parse(res.data.data.option_age);
              this.optionGender=JSON.parse(res.data.data.option_gender);
              console.log("年龄",this.optionAge,"性别",this.optionGender)
              this.drawGuest(this.$refs.age,this.optionAge);
              this.drawGuest(this.$refs.gender,this.optionGender);
            })
            //获取门店对比数据
            if(this.storeIdSelected.length>1){
              //选了多个门店才显示这个模块
              this.getCompData(1);
            }
            //获取到店次数数据
            this.$ajax.post(this.port+"/web/face/getGuestArriveTimesStatistics",params).then((res)=>{
              this.storeTimes=JSON.parse(res.data.data);
              console.log("到店",this.storeTimes)
              this.drawGuest(this.$refs.storeTimes,this.storeTimes);
            })
            //  获取到店间隔数据
            this.$ajax.post(this.port+"/web/face/getGuestIntervalDays",params).then((res)=>{
              this.storePeriod=JSON.parse(res.data.data);
              console.log("间隔",this.storePeriod)
              this.drawGuest(this.$refs.storePeriod,this.storePeriod);
              if(this.storePeriod.series[0].data){
                this.storePeriodNoData=false;
              }else{
                this.storePeriodNoData=true;
              }
            })
          }else{
            swal(
              this.$t('m.warning'),
              this.$t('m.selectStoreWarn'),
              "warning"
            )
          }
        },
        //获取门店对比数据
        getCompData(pageIndex=1){
          var params1={
            accountId:this.accountId,
            customerId:this.customerId,
            instanceIds:this.storeIdSelected.join(","),
            guestType:parseInt(this.guestSelected),
            startTime:this.dateRange[0],
            endTime:this.dateRange[1],
            selectType:this.typeSelected==""?0:this.typeSelected,
            pageIndex:(pageIndex-1)*10,
            pageSize:10
          }
          console.log(params1)
          this.$ajax.post(this.port+"/web/face/instanceDataComp",params1).then((res)=>{
            this.storeComp=JSON.parse(res.data.data);
            if(this.storeComp.series[0].data){
              this.storeCompNoData=false;
            }else{
              this.storeCompNoData=true;
            }
            console.log("对比",this.storeComp)
            this.drawGuest(this.$refs.store,this.storeComp);
          });
        },
        //画柱形图
        drawGuest(element,option) {
          var chartBox=document.getElementsByClassName("box-item-dashboard")[0];
          //如果dom存在
          if(element){
            element.style.width = chartBox.style.width + 'px'
            element.style.height = chartBox.style.height + 'px'
            console.log(element.style.width)
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(element);
            // 绘制图表
            myChart.setOption(option,true);
          }
        },
        //门店对比翻页
        handleCurrentChange(value){
          this.getCompData(value);
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
            this.getData()
          }
        }
      }
    }
</script>

<style scoped>

</style>
