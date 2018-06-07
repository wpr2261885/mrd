<template>
  <div class="body">
    <div class="content">
      <div class="box">
        <div class="content-header-title">
          <span>{{$route.params.fid?$t('m.editForm'):$t('m.newPatrolForm')}}</span>
          <span></span>
        </div>
        <div class="patrol-form">
          <div class="create-form">
            <ul>
              <!--表单名称-->
              <li>
                <label class="form-label" for="title">{{$t('m.formTitle')}}</label>
                <input :class="{'red-border':repeatTitle}" @blur="checkInput" class="form-input"
                       id="title" v-model="title" :placeholder="$t('m.placeholderFormTitle')">
              </li>
              <!--添加类别-->
              <li>
                <label class="form-label" for="type">{{$t('m.addType')}}</label>
                <div class="add-type-form">
                  <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
                    <el-form-item
                      v-for="(domain, index) in dynamicValidateForm.domains"
                      :key="domain.key"
                      :prop="'domains.' + index + '.value'">
                      <input @blur="checkInput(index)" maxlength="30"
                             :placeholder="$t('m.setTypeDesc')" id="type"
                             style="width:55%" class="form-input" v-model="domain.itemTitle"
                             :class="{'red-border':!domain.titleRepeat}">
                      <input @blur="handleBlur(index)" type="number" :placeholder="$t('m.setScore')" style="width:35%;margin-bottom:10px;" class="form-input" v-model="domain.itemEvaluateScore">
                      <el-button style="width:40px;" type="danger" icon="el-icon-delete" circle @click.prevent="removeDomain(domain)"></el-button>
                    </el-form-item>
                    <el-form-item>
                      <i class="add-btn el-icon-circle-plus" @click="addDomain"></i>
                    </el-form-item>
                  </el-form>
                </div>
              </li>
              <!--总分-->
              <li>
                <label class="form-label">{{$t('m.totalScore')}}</label>
                <span :class="{'red-text':totalScore==0}">{{totalScore}}</span>
              </li>
              <!--是否启用-->
              <li>
                <label class="form-label">{{$t('m.ifEnable')}}</label>
                <el-radio v-model="radio" label="0">{{$t('m.yes')}}</el-radio>
                <el-radio v-model="radio" label="1">{{$t('m.no')}}</el-radio>
              </li>
              <li>
                <label class="form-label">{{$t('m.defaultQualified')}}</label>
                <el-radio v-model="isForce" label="0">{{$t('m.yes')}}</el-radio>
                <el-radio v-model="isForce" label="1">{{$t('m.no')}}</el-radio>
              </li>
              <!--备注-->
              <li>
                <label class="form-label">{{$t('m.remark')}}</label>
                <el-input
                  @blur="checkInput"
                  maxlength="100"
                  :rows="4"
                  type="textarea"
                  :placeholder="$t('m.inputRemark')"
                  v-model="remark">
                </el-input>
              </li>
              <li style="text-align:right;margin-top:100px;">
                <button :disabled="button" @click="jumpToList" class="btn btn-default">{{$t('m.cancel')}}</button>
                <button :disabled="button" @click="handleSave" class="btn btn-info">{{$t('m.save')}}</button>
              </li>
            </ul>
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
          port:this.getPort,
          customerId:this.getCustomerId,
          accountId:this.getAccountId,
          accountDemo:this.getAccountDemo,
          //类别描述验证结果
          valueChecked:true,
          //类别名重复
          repeatTitle:"",
          //表单id
          evaluateId:"",
          //总分
          totalScore:0,
          //分值错误
          scoreError:true,
          //按钮
          button:false,
          //是否启用
          radio:"0",
          //是否强制检查
          isForce:"0",
          //备注
          remark:"",
          //表单标题
          title:"",
        //  添加类别
          dynamicValidateForm: {
            domains: [{
              itemTitle:"",
              itemEvaluateScore: '',
              titleRepeat:true
            }]
          }
        }
      },
      beforeMount(){
        //console.log("挂载",this.accountDemo)
        //dom挂载前判断表单id 拿取详情
        if(this.$route.params.fid){
          var params={
            accountId:this.accountId,
            customerId:this.customerId,
            evaluateId:this.$route.params.fid
          };
          this.$ajax.post(this.port+"/customer/patrol/evaluate/detail",params).then((res)=>{
            var detail=res.data;
            //console.log(res)
            this.title=detail.evaluateTitle;
            this.totalScore=detail.evaluateTotalScore;
            this.remark=detail.evaluateRemark;
            this.radio=detail.evaluateState?"0":"1";
            this.isForce=detail.evaluateIsForce?"1":"0";
            this.evaluateId=detail.evaluateId
            this.dynamicValidateForm.domains=[];
            for(var i in detail.items){
              this.dynamicValidateForm.domains[i]={
                itemEvaluateScore:detail.items[i].itemEvaluateScore,
                itemTitle:detail.items[i].itemTitle,
                titleRepeat:true,
                itemId:detail.items[i].itemId
              };
            }
          });
        }
      },
      methods:{
        //检查分值是否为数字却计算总分值
        handleBlur(index){
          if(this.dynamicValidateForm.domains[index].itemEvaluateScore<1){
            this.dynamicValidateForm.domains[index].itemEvaluateScore=1
          }
          this.dynamicValidateForm.domains[index].itemEvaluateScore=Math.ceil(this.dynamicValidateForm.domains[index].itemEvaluateScore)
          if(this.dynamicValidateForm.domains[index].itemEvaluateScore.toString().length>4){
            swal(
              this.$t('m.warning'),
              this.$t('m.scoreLengthWarn'),
              "warning"
            );
          }
          //console.log(this.dynamicValidateForm.domains[index].itemEvaluateScore.length)
          this.countTotalScore();
          if(this.totalScore==0){
            swal(
              this.$t('m.warning'),
              this.$t('m.notNumber'),
              "warning"
            );
          }
        },
        //计算总分值
        countTotalScore(){
          this.totalScore=0;
            for(var i of this.dynamicValidateForm.domains){
              this.totalScore+=Math.ceil(i.itemEvaluateScore)
            }
          if(isNaN(this.totalScore)){
            this.totalScore=0;
          }
        },
        //判断input是否有特殊字符
        checkInput:function(index=-1){
          var params={
            customerId:this.customerId,
            accountId:this.accountId,
            title:this.title,
            evaluateId:this.$route.params.fid
          };
          this.$ajax.post(this.port+"/customer/patrol/evaluate/verify/evaluate",params).then((res)=>{
            if(res.data.status==20004){
              this.repeatTitle=true;
              swal(
                this.$t('m.warning'),
                this.$t('m.typeRepeatWarn'),
                "warning"
              );
            }else{
              this.repeatTitle=false;
            }
          })
          this.regEmoji(this.title);
          this.regEmoji(this.remark);
          var regEn = /[`~@#$%^&*_+<>"{}\/;'[\]]/im,
            regCn = /[·#￥（——）|《》【】[\]]/im;
          if(regEn.test(this.title) || regCn.test(this.title)
            ||regEn.test(this.remark) || regCn.test(this.remark)) {
            swal(
              this.$t('m.warning'),
              this.$t('m.inputWarning'),
              "warning"
            );
            return false;
          }else if(index!=-1&&this.dynamicValidateForm.domains[index]){
            var i=this.dynamicValidateForm.domains[index].itemTitle
            if((regEn.test(i)||regCn.test(i))){
              swal(
                this.$t('m.warning'),
                this.$t('m.inputWarning'),
                "warning"
              );
              return false;
            }else{
              for(var i in this.dynamicValidateForm.domains){
                this.regEmoji(this.dynamicValidateForm.domains[index].itemTitle);
                if(index!=i&&this.dynamicValidateForm.domains[index].itemTitle==this.dynamicValidateForm.domains[i].itemTitle){
                //  如果重名
                  this.dynamicValidateForm.domains[index].titleRepeat=false;
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.nameRepeat'),
                    "warning"
                  );
                  return false;
                }
              }
              var params={
                customerId:this.customerId,
                accountId:this.accountId,
                title:this.dynamicValidateForm.domains[index].itemTitle,
                itemId:this.dynamicValidateForm.domains[index].itemId
              };
              //console.log(params)
              this.$ajax.post(this.port+"/customer/patrol/evaluate/verify/item",params).then((res)=>{
                //console.log(res)
                if(res.data.data){
                //  如果名字不重复
                  this.dynamicValidateForm.domains[index].titleRepeat=true;
                  this.dynamicValidateForm.domains.push();
                }else{
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.nameRepeat'),
                    "warning"
                  );
                  this.dynamicValidateForm.domains[index].titleRepeat=false;
                  this.dynamicValidateForm.domains.push();
                  return false;
                }
              })
            }
          }else{
            for(var i of this.dynamicValidateForm.domains){
              if((regEn.test(i.itemTitle)||regCn.test(i.itemTitle))){
                swal(
                  this.$t('m.warning'),
                  this.$t('m.inputWarning'),
                  "warning"
                );
                return false;
              }
            }
            return true;
          }
        },
        //检查分值和类别描述
        checkValue(){
          //循环类别对象
          //console.log("全部",this.dynamicValidateForm.domains)
          for(var i of this.dynamicValidateForm.domains){
            //判断类别描述是否为空
            //console.log(i)
            if(i.itemTitle==undefined||i.itemTitle==""){
              swal(
                this.$t('m.warning'),
                this.$t('m.typeDescWarn'),
                "warning"
              );
              //console.log(1)
              this.valueChecked=false;
            }else if(!i.titleRepeat){
              //判断名称是否重复
              swal(
                this.$t('m.warning'),
                this.$t('m.nameRepeat'),
                "warning"
              );
              return false;
            }else if(i.itemEvaluateScore.toString().length>4){
              swal(
                this.$t('m.warning'),
                this.$t('m.scoreLengthWarn'),
                "warning"
              );
              return false
            }
          }
          return true;
        },
        //保存
        handleSave(){
          if(this.title==undefined||this.title==""){
            swal(
              this.$t('m.warning'),
              this.$t('m.checkPatrolTitle'),
              "warning"
            );
          }else if(this.dynamicValidateForm.domains.length==0||
            this.dynamicValidateForm.domains[0].itemTitle==undefined||
            this.dynamicValidateForm.domains[0].itemTitle=="" ||
            this.dynamicValidateForm.domains[0].itemEvaluateScore==undefined||
            this.dynamicValidateForm.domains[0].itemEvaluateScore==""){
            swal(
              this.$t('m.warning'),
              this.$t('m.checkType'),
              "warning"
            );
          }else if(!this.checkValue()){
              return;
            }else if(!this.checkInput()){
              return;
            }else if(this.countTotalScore()&&this.totalScore===0){
              swal(
                this.$t('m.warning'),
                this.$t('m.notNumber'),
                "warning"
              )
            }else if(this.repeatTitle){
              swal(
                this.$t('m.warning'),
                this.$t('m.typeRepeatWarn'),
                "warning"
              );
            }else if(!this.accountDemo){
              //console.log("进了请求")
              // title  标题 String
              // remark 备注 String
              // totalScorce 总分 int
              // state 启用/禁用 boolean
              // items  考评项   json
              // items说明：[{"itemTitle":"XX项","itemEvaluateScore":"100"},……]
              var params={
                evaluateId:this.evaluateId==""?null:this.evaluateId,
                customerId:this.customerId,
                accountId:this.accountId,
                title:this.title,
                remark:this.remark,
                totalScore:this.totalScore,
                state:this.radio=="0"?true:false,
                items:JSON.stringify(this.dynamicValidateForm.domains),
                isForce:this.isForce=="1"?true:false
              };
              //console.log(params)
              this.button=true;
              this.$ajax.post(this.port+"/customer/patrol/evaluate/save",params).then((res)=>{
                console.log(res)
                if(res.data.status==0){
                  swal(
                    this.$t('m.success'),
                    this.$t('m.saved'),
                    "success"
                  );
                  this.$router.push("/patrol_form_list")
                }else if(res.data.status==30002){
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.typeRepeatWarn'),
                    "warning"
                  );
                }else{
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.saveFailed'),
                    "warning"
                  );
                }
                this.button=false;
              });
            }else{
              swal(
                this.$t('m.warning'),
                this.$t('m.trialAccountWarn'),
                "warning"
              );
            }
        },
        //跳转到list页面
        jumpToList(){
          if(this.title!=""||this.dynamicValidateForm.domains[0].itemEvaluateScore!=""||
            this.dynamicValidateForm.domains[0].itemTitle!=""||this.totalScore!=""||this.remark!=""){
            swal({
              title:this.$t('m.warning'),
              text: this.$t('m.leavePage'),
              icon: "warning",
              buttons: [this.$t('m.no'),this.$t('m.yes')],
              dangerMode: true,
            })
            //根据选择执行回调
              .then((go) => {
                if (go) {
                  //ajax 保存草稿
                  this.$router.push('/patrol_form_list');
                } else {
                  return;
                }
              })
          }else{
            this.$router.push('/patrol_form_list');
          }
        },
        //判断：如果只有一条选项 不能删除
        removeDomain(item) {
          //console.log(item)
          if(this.dynamicValidateForm.domains.length==1){
            swal(
              this.$t('m.warning'),
              this.$t('m.checkType'),
              "warning"
            );
          }else{
            if(item.itemId){
              if(!this.accountDemo){
                //  如果对已有的考评项进行删除
                swal({
                  title:this.$t('m.warning'),
                  text: this.$t('m.delConfirm'),
                  icon: "warning",
                  buttons: [this.$t('m.no'),this.$t('m.yes')],
                  dangerMode: true,
                })
                //根据选择执行回调
                  .then((del) => {
                    if (del) {
                      var params={
                        customerId:this.customerId,
                        accountId:this.accountId,
                        itemId:item.itemId
                      }
                      this.$ajax.post(this.port+"/customer/patrol/evaluate/item/delete",params).then((res)=>{
                        if(res.data.data){
                          var index = this.dynamicValidateForm.domains.indexOf(item);
                          if (index !== -1) {
                            this.dynamicValidateForm.domains.splice(index, 1)
                          }
                          this.countTotalScore();
                        }else{
                          swal(
                            this.$t('m.warning'),
                            this.$t('m.delFailed'),
                            "warning"
                          )
                        }
                      });
                    } else {
                      return;
                    }
                  })
              }else{
                swal(
                  this.$t('m.warning'),
                  this.$t('m.trialAccountWarn'),
                  "warning"
                );
              }
            }else{
            //   如果是新建删除
              var index = this.dynamicValidateForm.domains.indexOf(item);
              if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1)
              }
              this.countTotalScore();
            }
          }
        },
        addDomain() {
          this.dynamicValidateForm.domains.push({
            itemTitle:"",
            itemEvaluateScore:"",
            titleRepeat:true
          });
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
