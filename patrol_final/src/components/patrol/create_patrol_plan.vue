<template>
  <div class="body" @click.stop="slideUp">
    <div class="content">
      <div class="box">
        <div class="content-header-title">
          <span>{{$t('m.newPatrolPlan')}}</span>
          <span></span>
        </div>
        <div class="box-item" style="padding:10px 8% 10px 8%;">
          <div class="list-title">{{$t('m.newPatrolPlan')}}</div>
          <div class="create-form">
            <ul>
              <!--计划名称-->
              <li>
                <label for="planTitle" class="form-label">{{$t('m.planTitle')}}</label>
                <input @blur="checkInput" maxlength="30" v-model="title" id="planTitle" class="form-input" :placeholder="$t('m.patrolPlanPla')" type="text">
              </li>
              <!--巡店开始日期-->
              <li>
                <label class="form-label">{{$t('m.startDate')}}</label>
                <el-date-picker
                  @change="startDateChange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :editable="editable"
                  v-model="startDate"
                  type="date"
                  :disabled="dateDisabled"
                  :placeholder="$t('m.startDate')">
                </el-date-picker>
              </li>
              <!--巡店结束日期-->
              <li>
                <label class="form-label">{{$t('m.endDate')}}</label>
                <el-date-picker
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :editable="editable"
                  v-model="endDate"
                  type="date"
                  @change="endDateChange"
                  :placeholder="$t('m.endDate')">
                </el-date-picker>
              </li>
              <!--重复间隔-->
              <li>
                <label class="form-label">{{$t('m.repeatPeriod')}}</label>
                <el-select v-model="repeatSelected" @change="repeatChange">
                  <el-option
                    v-for="item in repeat"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </li>
              <!--间隔天数-->
              <li v-if="customDays||repeatSelected=='3'">
                <label class="form-label">{{$t('m.dayPeriod')}}</label>
                <input @blur="daysBlur" v-model="repeatDays" :placeholder="$t('m.periodPlace')" style="width:190px !important;" class="form-input" type="number">
              </li>
              <!--提醒时间-->
              <li>
                <label class="form-label">{{$t('m.remainingTime')}}</label>
                <el-select v-model="remindingSelected" @change="remindingChange">
                  <el-option
                    v-for="item in reminding"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </li>
              <!--设置时间-->
              <li v-if="customerTime">
                <label class="form-label">{{$t('m.setTime')}}</label>
                <el-time-picker
                  format="HH:mm"
                  value-format="HH:mm"
                  :editable="editable"
                  v-model="remainingTime"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }">
                </el-time-picker>
              </li>
              <!--巡店方式-->
              <li>
                <label class="form-label">{{$t('m.patrolMethod')}}</label>
                <el-radio v-model="radio" label="1">{{$t('m.online')}}</el-radio>
                <el-radio v-model="radio" label="2">{{$t('m.offline')}}</el-radio>
              </li>
              <!--添加门店-->
              <li>
                <label class="form-label" for="store">{{$t('m.addCheckStore')}}</label>
                <input v-model="treeSelected" style="cursor:pointer;" id="store" type="text" readonly @click="openModal" class="form-input" :placeholder="$t('m.selectTree')">
              </li>
              <!--添加考评表-->
              <li style="position:relative;">
                <label class="form-label">{{$t('m.addCheckCategory')}}</label>
                <ul class="add-evaluation">
                  <li :class="{'slide-select-clicked':slideDown}" @click.stop="slideDownSelect">
                    <span style="padding:6px;" v-if="!checkCategories">{{$t('m.select')}}</span>
                    <div v-if="checkCategories">
                      <span v-for="(i,index) in categories" v-if="i.selected" class="option-selected-span">
                        {{i.label}}
                        <span @click="removeOption(index)" class="remove-option el-icon-circle-close"></span>
                      </span>
                    </div>
                    <span>
                      <span ref="arrow" class="el-icon-arrow-up"></span>
                    </span>
                  </li>
                  <ul v-if="slideDown" class="slide-select-option">
                    <span class="option-arrow el-icon-caret-top"></span>
                    <li v-for="(i,index) in categories" style="display:flex;justify-content: space-between"
                        @click.stop="optionSelect(index)" :class="{'option-selected':i.selected}"
                        @mouseover="showInfo(index)" @mouseout="hideInfo(index)">
                      {{i.label}}
                      <span v-if="i.selected" style="padding:2px;" class="el-icon-check"></span>
                      <span style="color:#409EFF;padding:2px;" class="el-icon-arrow-right"></span>
                    </li>
                  </ul>
                </ul>
                <!--考评表子项-->
                <ul v-if="subCategories.length>0" class="option-info">
                  <li v-for="(i,index) in subCategories">
                    {{i.itemTitle}}
                  </li>
                </ul>
              </li>
              <!--备注-->
              <li>
                <label class="form-label">{{$t('m.remark')}}</label>
                <el-input
                  @blur="checkInput"
                  maxlength="100"
                  type="textarea"
                  :rows="4"
                  :placeholder="$t('m.inputRemark')"
                  v-model="remark">
                </el-input>
              </li>
              <!--按钮-->
              <li style="text-align:right;margin-top:100px;">
                <button :disabled="button" @click="jumpToList" class="btn btn-default">{{$t('m.cancel')}}</button>
                <button :disabled="button" @click="handleSave" class="btn btn-info">{{$t('m.save')}}</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-tree" v-if="showTree">
      <treeComponent @treeEvent="getTreeData" ref="tree"></treeComponent>
    </div>
  </div>
</template>

<script>
  import treeComponent from './treeComponent';

    export default {
      components:{
        treeComponent
      },
      data(){
        return {
          customerId:this.getCustomerId,
          accountId:this.getAccountId,
          port:this.getPort,
          accountDemo:this.getAccountDemo,
          button:false,
          //时间不可改
          dateDisabled:false,
          //考评表下拉框
          slideDown:false,
          //显示树
          showTree:false,
          treeSelected:"",
          //备注
          remark:"",
          //天数最大间隔
          repeatMaxDays:null,
          //天数间隔
          repeatDays:0,
          //自定义间隔开关
          customDays:false,
          //自定义时间开关
          customerTime:false,
          //日期选择禁止编辑
          editable:false,
          title:"",
          startDate: this.formatDate(new Date()).split(" ")[0],
          endDate:this.formatDate(new Date()).split(" ")[0],
          //巡店方式
          radio:"1",
          //重复间隔
          repeat: [{
            value: '0',
            label: this.$t('m.none'),
            disabled:false
          }, {
            value: '1',
            label: this.$t('m.everyday'),
            disabled:true
          }, {
            value: '2',
            label: this.$t('m.everyweek'),
            disabled:true
          }, {
            value: '3',
            label: this.$t('m.custom'),
            disabled:true
          }],
          //提醒时间
          reminding:[
            {
              value: '0',
              label: this.$t('m.none')
            },
            {
              value: '1',
              label: this.$t('m.custom')
            }
          ],
          //重复间隔已选
          repeatSelected:"0",
          repeatPeriod:null,
          //提醒已选
          remindingSelected:"0",
          remainingTime:null,
          //  添加检查门店
          instanceSelected:[],
          //已选择门店id
          instanceIdSelected:[],
          //添加检查类目
          //考评总列表
          categories:[],
          //已选考评
          checkCategories:false,
          //已选考评子项
          subCategories:[],
          //已选择考评id
          categoriesSelected:[]
        }
      },
      beforeMount(){
        //获取考评表
        var params={
          customerId:this.customerId
        };
        this.$ajax.post(this.port+"/customer/patrol/evaluate/enable",params).then((res)=>{
          if(res.data.data!=null||res.data.data.length!=0){
            var value=0;
            for(var i of res.data.data){
              this.categories.push({
                value:value++,
                id:i.evaluateId,
                label:i.evaluateTitle,
                selected:false,
                items:i.items
              })
            }
            //如果是编辑
            if(this.$route.params.pid){
              this.dateDisabled=true;
              var params1={
                customerId:this.customerId,
                accountId:this.accountId,
                planId:this.$route.params.pid
              };
              this.$ajax.post(this.port+"/customer/patrol/plan/detail",params1).then((res)=>{
                //console.log("详情",res.data.data)
                var detail=res.data.data
                if(detail!=null&&detail!=0){
                  this.title=detail.planTitle;
                  this.startDate=detail.planStart;
                  this.endDate=detail.planEnd;
                  this.remark=detail.planRemark;
                  this.repeatDays=detail.planRepeat;
                  //  给重复间隔选项添加默认选中
                  switch(detail.planRepeat){
                    case 0:
                      this.repeatSelected="0";
                      break;
                    case 1:
                      this.repeatSelected="1";
                      break;
                    case 7:
                      this.repeatSelected="2";
                      break;
                    default:
                      this.repeatSelected="3";
                      this.customDays=true;
                      break;
                  }
                  //  如果有提醒时间 给提醒时间默认选中
                  if(detail.planRemind!=null){
                    this.remainingTime=detail.planRemind;
                    this.remindingSelected="1";
                    this.customerTime=true;
                  }else{
                    this.remindingSelected="0";
                    this.customerTime=false;
                  }
                  //  获取门店
                  if(detail.instances!=null&&detail.instances.length!=0){
                    for(var i of detail.instances){
                      this.instanceIdSelected.push(i.instanceId);
                      this.instanceSelected.push(i.instanceTitle);
                    }
                    if(this.instanceSelected.length>3){
                      this.instanceSelected=this.instanceSelected.slice(0,3);
                      this.treeSelected=this.instanceSelected.join(",")
                        +this.$t('m.etc')+this.instanceIdSelected.length+this.$t('m.instances');
                    }else{
                      this.treeSelected=this.instanceSelected.join(",")
                    }
                  }
                  //  获取考评表
                  if(detail.evaluates!=null&&detail.evaluates.length!=0){
                    //console.log("考评",detail.evaluates)
                    for(var i of this.categories){
                      for(var j of detail.evaluates){
                        if(i.id==j.evaluateId){
                          i.selected=true;
                          this.checkCategories=true;
                          this.categoriesSelected.push(i.id);
                        }
                      }
                    }
                  }
                  this.checkDateRange();
                  this.repeatDays=detail.planRepeat
                }
              })
            }
          }
          //console.log(this.categories)
        });
      },
      methods:{
        //检查日期范围
        checkDateRange:function(){
          for(var i of this.repeat){
            i.disabled=false;
          }
          if(this.startDate!=""&&this.startDate!=undefined&&
            this.endDate!=""&&this.endDate!=undefined) {
            //获取开始和结束日期的时间真实
            var s1 = new Date(this.startDate.replace(/-/g, "/"));
            var s2 = new Date(this.endDate.replace(/-/g, "/"));
            //获取开始和结束日期的字符串直接转数字
            var startDate=parseInt(this.startDate.replace(/[-]/g,""));
            var endDate=parseInt(this.endDate.replace(/[-]/g,""));
            var nowDate=this.formatDate(new Date());
            nowDate=nowDate.split(" ")[0]
            nowDate=parseInt(nowDate.replace(/[-]/g,""));
            if(startDate>endDate){
              endDate=startDate;
              this.endDate=this.startDate;
            }
            if(startDate<=endDate&&endDate>=nowDate){
              if(this.$route.params.pid){
              // 如果是编辑 不判断开始日期
              }else if (startDate<nowDate){
                return false;
              }
              //相差的天数
              // var days = s2.getTime() - s1.getTime();
              // var time = parseInt(days / (1000 * 60 * 60 * 24));
              // //console.log("天数",time)
              // if(time<1){
              // //  如果区间小于1，每天不可选
              //   this.repeat[1].disabled=true;
              //   this.repeat[2].disabled=true;
              //   this.repeat[3].disabled=true;
              //   this.repeatMaxDays=0;
              //   this.customDays=false;
              //   this.repeatSelected='0';
              // }else if(time<7){
              //   //如果区间小于7天，每周不可选
              //   this.repeat[2].disabled=true;
              //   this.repeatMaxDays=time;
              //   if(this.repeatDays===1){
              //     this.repeatSelected="1";
              //     //console.log(1)
              //   }else{
              //     this.repeatSelected="3";
              //     //console.log(3)
              //   }
              // }else{
              //   //区间大于7天，全部可选
              //   this.repeatMaxDays=time;
              // }
              // if(this.repeatMaxDays&&this.repeatDays>this.repeatMaxDays){
              //   this.repeatDays=this.repeatMaxDays;
              // }
              // //console.log("检查",this.repeatDays)
              return true;
            }else{
              // this.repeatDays=0;
              return false;
            }
          }else{
            // this.repeatDays=0;
            return false;
          }
        },
        //结束日期选择完后判断范围给出提示
        startDateChange(){
          if(!this.checkDateRange()){
            swal(
              this.$t('m.warning'),
              this.$t('m.timeWarning'),
              "warning"
            )
          }
        },
        endDateChange(){
          if(!this.checkDateRange()){
            swal(
              this.$t('m.warning'),
              this.$t('m.timeWarning'),
              "warning"
            )
          }
        },
      //  重复间隔改变
        repeatChange(value){
          //如果是每天重复
          this.customDays=false;
          if(value==0){
            this.repeatDays=null;
          }else if(value==1){
            this.repeatDays=1;
          }else if(value==2){
            this.repeatDays=7;
          }else if(value==3){
            this.customDays=true;
          }
          //console.log("选择",this.repeatDays)
        },
        //天数自动取整以及限制
        daysBlur(){
          if(this.repeatDays<1){
            this.repeatDays=1;
          }
          this.repeatDays=Math.ceil(this.repeatDays)
          if(this.repeatMaxDays&&this.repeatDays>this.repeatMaxDays){
            this.repeatDays=this.repeatMaxDays;
          }
        },
      //  提醒时间改变
        remindingChange(value){
          if(value==1){
            this.customerTime=true;
          }else{
            this.customerTime=false;
            this.remainingTime=null;
          }
        },
        //跳转到计划列表
        jumpToList(){
          if(this.title!=""||this.remark!=""||this.startDate!=""||this.endDate!=""){
          //  如果用户已输入内容，提示是否返回
            swal({
              title:this.$t('m.warning'),
              text: this.$t('m.backConfirm'),
              icon: "warning",
              closeOnClickOutside: false,
              buttons: [this.$t('m.no'),this.$t('m.yes')],
              dangerMode: true,
            })
            //根据选择执行回调
              .then((back) => {
                if (back) {
                  this.$router.push("/patrol_plan_list");
                } else {
                  return;
                }
              })
          }else{
            this.$router.push("/patrol_plan_list");
          }
        },
        //保存计划
        handleSave(){
          //console.log("保存",this.repeatDays)
          if(this.title==undefined||this.title==""){
            swal(
              this.$t('m.warning'),
              this.$t('m.checkPatrolTitle'),
              "warning"
            );
          }else if(!this.checkDateRange()){
            swal(
              this.$t('m.warning'),
              this.$t('m.timeWarning'),
              "warning"
            );
          }else if(this.instanceIdSelected==[]||this.instanceIdSelected.length==0||
                    this.categoriesSelected==[]||this.categoriesSelected.length==0){
            swal(
              this.$t('m.warning'),
              this.$t('m.storeWarning'),
              "warning"
            );
          }else if(this.accountDemo){
            swal(
              this.$t('m.warning'),
              this.$t('m.trialAccountWarn'),
              "warning"
            );
          }else{
          //  通过表单验证，调用保存接口
            if(this.$route.params.pid){
            //  通过编辑的保存 update
              var params={
                accountId:this.accountId,
                customerId:this.customerId,
                title:this.title,
                start:this.startDate,
                end:this.endDate,
                remark:this.remark,
                repeat:this.repeatDays,
                remain:this.remainingTime,
                type:parseInt(this.radio),
                instance:this.instanceIdSelected,
                evaluation:this.categoriesSelected,
                planId:this.$route.params.pid
              };
              //console.log("参数",params)
              this.button=true;
              this.$ajax.post(this.port+"/customer/patrol/plan/update",params).then((res)=>{
                //console.log(res)
                if(res.data.status===0){
                  swal(
                    this.$t('m.success'),
                    this.$t('m.saved'),
                    "success"
                  )
                  this.$router.push("/patrol_plan_list")
                }else{
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.saveFailed'),
                    "warning"
                  )
                }
                this.button=false;
              });
            }else{
              //普通保存
              var params={
                accountId:this.accountId,
                customerId:this.customerId,
                title:this.title,
                start:this.startDate,
                end:this.endDate,
                remark:this.remark,
                repeat:this.repeatDays,
                remain:this.remainingTime,
                type:parseInt(this.radio),
                instance:this.instanceIdSelected,
                evaluation:this.categoriesSelected
              };
              //console.log(params)
              this.button=true;
              this.$ajax.post(this.port+"/customer/patrol/plan/create",params).then((res)=>{
                //console.log(res)
                if(res.data.status==0){
                  swal(
                    this.$t('m.success'),
                    this.$t('m.saved'),
                    "success"
                  )
                  this.$router.push("/patrol_plan_list")
                }else{
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.saveFailed'),
                    "warning"
                  )
                }
                this.button=false;
              });
            }
          }
        },
      //  获取组织结构树
        openModal(){
          this.showTree=true;
          this.instanceSelected=[];
          this.instanceIdSelected=[];
          this.treeSelected="";
        },
      //  获取结构树数据
        getTreeData(data){
          this.showTree=false;
          //console.log(data)
          if(data.length<2){
          //  用户点击取消按钮
            this.instanceSelected=[];
            this.instanceIdSelected=[];
            this.treeSelected="";
          }else{
          //  如果用户点击确认却没选择
            if(data.length==0){
              this.instanceSelected=[];
              this.instanceIdSelected=[];
              this.treeSelected="";
            }else
          //  用户点击确认按钮
            if(data[0]=="instance"&&data.length>1){
            //  用户选择实体
              for(var i of data){
                if(i!="instance"){
                  this.instanceIdSelected.push(i.id);
                  this.instanceSelected.push(i.text);
                }
              }
              if(this.instanceSelected.length>3){
                this.instanceSelected=this.instanceSelected.slice(0,3);
                this.treeSelected=this.instanceSelected.join(",")+this.$t('m.etc')
                  +this.instanceIdSelected.length+this.$t('m.instances')
              }else{
                this.treeSelected=this.instanceSelected.join(",");
              }
            }else if(data[0]=="area"&&data.length>2){
            //  用户选择区域
              for(var i of data[2]){
                this.instanceIdSelected.push(i.instanceId);
              }
              this.treeSelected=data[1].name;
            }else{
            //用户选择table
              if(data.length>0){
                for(var i of data){
                  if(i!="table"){
                    this.instanceSelected.push(i.instanceTitle);
                    this.instanceIdSelected.push(i.instanceId);
                  }
                }
                if(this.instanceSelected.length>3){
                  this.instanceSelected=this.instanceSelected.slice(0,3);
                  this.treeSelected=this.instanceSelected.join(",")+this.$t('m.etc')
                    +this.instanceIdSelected.length+this.$t('m.instances')
                }else{
                  this.treeSelected=this.instanceSelected.join(",")
                }
              }
            }
          }
        },
        //判断input是否有特殊字符
        checkInput:function(){
          this.regEmoji(this.title);
          this.regEmoji(this.remark);
          var regEn = /[`~@#$%^&*_+<>{}\/[\]]/im,
            regCn = /[·#￥（——）|《》【】[\]]/im;
          if(regEn.test(this.title) || regCn.test(this.title)||
            regEn.test(this.remark) || regCn.test(this.remark)) {
            swal(
              this.$t('m.warning'),
              this.$t('m.inputWarning'),
              "warning"
            )
            return false;
          }else return true;
        },
      //  考评表下拉列表
        slideDownSelect(){
          if(this.slideDown){
          //  如果是收回
            this.$refs.arrow.style.transform="rotate(0)";
          }else{
          //  如果是下拉
            this.$refs.arrow.style.transform="rotate(180deg)";
          }
          this.slideDown=!this.slideDown;
        },
      //  选中选项
        optionSelect(index){
          this.checkCategories=false;
          this.categoriesSelected=[];
          this.categories[index].selected=!this.categories[index].selected;
          for(var i of this.categories){
            if(i.selected){
              this.checkCategories=true;
              this.categoriesSelected.push(i.id)
            }
          }
          //console.log(this.categoriesSelected)
        },
      //  移除已选
        removeOption(index){
          this.checkCategories=false;
          this.categoriesSelected=[];
          this.categories[index].selected=false;
          for(var i of this.categories){
            if(i.selected){
              this.checkCategories=true;
              this.categoriesSelected.push(i.id)
            }
          }
          //console.log(this.categoriesSelected)
        },
      //  显示考评详情
        showInfo(index){
          this.subCategories=this.categories[index].items;
        },
        //隐藏考评详情
        hideInfo(index){
          this.subCategories=[];
        },
        //点击任意位置收起考评下拉框
        slideUp(){
          this.slideDown=false;
        },
        //过滤emoji表情
        regEmoji(str){
          var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
          if(regStr.test(str)){
            str=str.replace(regStr,"");
          }
        }
      }
    }
</script>

<style scoped>

</style>
