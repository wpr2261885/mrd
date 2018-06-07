<template>
  <div class="form">
    <h1 style="float:left;margin-right:10px;">{{$t('m.createTask')}}</h1>
    <button @click="jumpBack" class="btn btn-info">{{$t('m.backToList')}}</button>
    <ul class="task_list">
      <!--任务标题-->
      <li>
        <label class="input-title" for="task-title">{{$t('m.taskTitle')}}</label>
        <input class="form-input" @blur="checkInput" v-model="data.title" :placeholder="$t('m.placeholderTitle')" maxlength="30" id="task-title" type="text">
      </li>
      <!--任务说明-->
      <li>
        <label class="input-title">{{$t('m.taskDesc')}}</label>
        <el-input
          @blur="checkInput"
          id="task-desc"
          maxlength="500"
          type="textarea"
          :rows="5"
          :placeholder="$t('m.placeholderDesc')"
          v-model="data.description">
        </el-input>
      </li>
      <!--添加图片-->
      <li>
        <label class="input-title">{{$t('m.addPic')}}</label>
        <ul class="pic-preview">
          <li v-if="picUrl.length!=0" v-for="(url,index) in picUrl">
            <img :src="url">
            <i class="menu-icon fa  fa-close (alias)" @click="deletePic(index)"></i>
          </li>
          <li  v-if="this.picUrl.length<9" class="upload-pic">
            <span class="upload-placeholder">{{$t('m.dragToUpload')}}</span>
            <input accept=".gif,.jpg,.jpeg,.png,.GIF,.JPG,.PNG" id="file" multiple="multiple" class="file" name="file" type="file" @change="update"/>
          </li>
        </ul>
      </li>
      <!--设置任务时间-->
      <li>
        <label style="margin-bottom:30px;" class="input-title">{{$t('m.setTaskTime')}}</label>
        <div>
          <div class="block" style="margin-bottom:20px;">
            <el-date-picker
              :editable="editable"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="getStartDate"
              v-model="date.startDate"
              type="date"
              :placeholder="$t('m.select')+$t('m.startDate')">
            </el-date-picker>
            --
            <el-date-picker
              :editable="editable"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="getEndDate"
              v-model="date.endDate"
              type="date"
              :placeholder="$t('m.select')+$t('m.endDate')">
            </el-date-picker>
          </div>
        </div>
      </li>
      <!--选择执行店铺-->
      <li>
        <label class="input-title">{{$t('m.selectStore')}}</label>
        <input @click="getTree" :placeholder="$t('m.selectTreePla')" class="form-input" readonly v-model="treeSelected" style="width:35%;cursor:pointer;" type="text">
        <!--<el-select @change="changeValue" multiple v-model="value" :placeholder="$t('m.select')">-->
          <!--<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <!--<span class="all-select">-->
          <!--<el-checkbox-group @change="selectAll(0)" v-model="checkAll1">-->
          <!--<el-checkbox :label="$t('m.selectAll')"></el-checkbox>-->
        <!--</el-checkbox-group>-->
        <!--</span>-->
      </li>
      <!--选择执行人-->
      <li>
        <label class="input-title">{{$t('m.selectExecutor')}}</label>
        <el-select @change="changeValue1" multiple v-model="value1" :placeholder="$t('m.select')">
          <el-option v-for="item in executors" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span class="all-select">
          <el-checkbox-group @change="selectAll(1)" v-model="checkAll2">
          <el-checkbox :label="$t('m.selectAll')"></el-checkbox>
        </el-checkbox-group>
        </span>
      </li>
      <!--需要审核-->
      <li>
        <label class="input-title">{{$t('m.needAudit')}}</label>
        <el-radio v-model="radio" label="1">{{$t('m.yes')}}</el-radio>
        <el-radio v-model="radio" label="0">{{$t('m.no')}}</el-radio>
      </li>
      <!--通知方式-->
      <li>
        <label class="input-title">{{$t('m.notification')}}</label>
        <el-checkbox-group @change="changeCheck" v-model="checkList">
          <el-checkbox :label="$t('m.innerMsg')"></el-checkbox>
          <el-checkbox :label="$t('m.email')"></el-checkbox>
        </el-checkbox-group>
      </li>
      <!--添加附件-->
      <!--<li>-->
        <!--<label class="input-title">{{$t('m.addAdjunct')}}</label>-->
        <!--&lt;!&ndash; elementUI 上传附件&ndash;&gt;-->
        <!--<el-upload-->
          <!--class="upload-demo"-->
          <!--ref="upload"-->
          <!--:limit="2"-->
          <!--:action="port+'/register/uploadFile'"-->
          <!--:on-preview="handlePreview"-->
          <!--:before-remove="beforeRemove"-->
          <!--:on-remove="handleRemove"-->
          <!--:on-exceed="handleExceed"-->
          <!--:on-success="handleSuccess"-->
          <!--:on-error="handleErr"-->
          <!--:on-change="handleChange"-->
          <!--:before-upload="beforeAvatarUpload"-->
          <!--:file-list="fileList"-->
          <!--:show-file-list="true"-->
          <!--:auto-upload="true">-->
          <!--<el-button slot="trigger" size="small" type="primary" @click="submitUpload">{{$t('m.selectFile')}}</el-button>-->
          <!--<div slot="tip" class="el-upload__tip">-->
            <!--{{$t('m.uploadLimitTip')}}<br>-->
          <!--</div>-->
        <!--</el-upload>-->
      <!--</li>-->
      <li class="btn-group">
        <button @click="jumpBack" class="btn btn-info">{{$t('m.back')}}</button>
        <button :disabled="button" class="btn btn-success" @click="submit">{{$t('m.publish')}}</button>
        <button v-if="isDetail" :disabled="button" @click="toPreview" class="btn btn-info">{{$t('m.preview')}}</button>
        <button v-if="isDetail" :disabled="button" @click="saveDraft" class="btn btn-default">{{$t('m.save')}}</button>
      </li>
    </ul>
    <!--发布中-->
    <el-button class="loading" v-if="loading" type="warning" :loading="true">{{$t('m.publishing')}}</el-button>
    <div v-if="showTree" class="modal-tree">
      <treeComponent @treeEvent="getTreeData" ref="tree"></treeComponent>
    </div>
  </div>
</template>

<script>
  import treeComponent from "./treeComponent";

  export default {
    components:{
      treeComponent
    },
      data(){
        return {
          treeSelected:"",
          //详情不显示预览按钮
          isDetail:true,
          //显示组织结构
          showTree:false,
          button:false,
          loading:false,
          instancesFault:"",
          checkAll1:[],
          checkAll2:[],
          editable:false,
          port:this.getPort,
          accountId:this.getAccountId,
          customerId:this.getCustomerId,
          taskId:this.$route.params.tid,
          //elmentUI 上传附件
          fileList: [],
          checkList: [this.$t('m.innerMsg')],
          checkCode:[0],
          hideUpload:true,
          //输入信息
          data:{
            title:"",
            description:"",
            descriptionBr:[]
          },
          radio:"1",
          //店铺选择
          nameIds:[],
          options: [],
          value:[],
          executors:[],
          value1:[],
          executorSelected:[],
          storeSelected:[],
          instanceIdSelected:[],
          roleIdSelected:[],
          //开始结束日期
          date:{
            startDate:"",
            endDate:""
          },
          picUrl:[],
          adjunct:[],
          adjunctName:[],
          nowDate:""
        }
      },
      //阻止拖拽默认事件
      beforeCreate:function(){
        $(document).on({
          dragenter:function(e){e.preventDefault()},
          dragover:function(e){e.preventDefault()},
          dragleave:function(e){e.preventDefault()},
          drop:function(e){e.preventDefault()}
        });
      },
      beforeMount:function(){
        if(this.$route.params.tid){
          this.isDetail=false;
          var params={
            "customerId":this.customerId,
            "accountId":this.accountId,
            'taskId': this.taskId==undefined?null:this.taskId
          };
          //详情接口
          this.$ajax.post(this.port+"/"+this.getPath+"/display/releaseTaskDetail", params).then((res)=>{
            //拿到的详情接口实体，与options比对，把对应value值push进this.value
            console.log("详情",res)
            var areaList=res.data.data.areaList;
            if(areaList==null){
              areaList=[];
            }
            for(var i of areaList){
              for(var j of this.options){
                if(i.instanceId==j.id){
                  this.value.push(j.value)
                }
              }
            }
            //给已选择实体push实体名字
            //给已选择实体id push实体id
            this.storeSelected=[];
            this.instanceIdSelected=[];
            // for(var i of this.value){
            //   this.storeSelected.push(this.options[i].label);
            //   this.instanceIdSelected.push(this.options[i].id);
            // }
            //拿到的详情接口角色，与executors比对，把对应value值push进this.value1
            var selectRoleList=res.data.data.selectRoleList;
            for(var i of selectRoleList){
              for(var j of this.executors){
                if(i.roleId==j.id){
                  this.value1.push(j.value)
                }
              }
            }
            //给已选择角色push实体名字
            //给已选择角色id push实体id
            this.executorSelected=[];
            this.roleIdSelected=[];
            for(var i of this.value1){
              this.executorSelected.push(this.executors[i].label);
              this.roleIdSelected.push(this.executors[i].id);
            }
            //console.log(this.value1)
            var detail=res.data.data;
            this.date.endDate=detail.taskEndTime.split(" ")[0];
            this.date.startDate=detail.taskStartTime.split(" ")[0];
            this.data.title=detail.taskName;
            this.data.description=detail.taskRemark;
            var imgList=detail.imgList;
            var picUrl=[];
            for(var i of imgList){
              picUrl.push(i.imgUrl);
            }
            this.picUrl=picUrl;
            //  取回组织结构
            for(var i of detail.nameIdsList){
              ////console.log(i)
              this.nameIds.push(i);
              if(i.ids.indexOf(",")==-1){
                this.instanceIdSelected.push(i.ids);
              }else{
                for(var j of i.ids.split(",")){
                  this.instanceIdSelected.push(j.trim());
                }
              }
              this.storeSelected.push(i.name)
            }
            //如果是选择区域
            //console.log(this.storeSelected,this.nameIds,this.instanceIdSelected,this.roleIdSelected)
            if(this.storeSelected.length==1){
              this.treeSelected=this.nameIds[0].name;
            }else{
            //  如果是选择实体
              var str=[];
              var length=this.storeSelected.length<3?this.storeSelected.length:3;
              for(var i=0;i<length;i++){
                str.push(this.storeSelected[i]);
              }
              str.join(",")
              this.treeSelected=str+this.$t("m.etc")+this.storeSelected.length+this.$t("m.instance");
            }
            console.log("nameIds",this.nameIds,"实体id",this.instanceIdSelected,"实体名",this.storeSelected,this.treeSelected)
          });
        }

        //新建任务打开页面
        var params1={
          "customerId":this.customerId,
          "accountId":this.accountId
        }
        //拿到执行实体列表
        // this.$ajax.post(this.port+"/"+this.getPath+"/display/getAllInstances",params1).then((res)=>{
        //   var value=-1;
        //   var arr=res.data.data;
        //   for(var i=0;i<arr.length;i++){
        //     value++;
        //     this.options.push({
        //       value:value.toString(),
        //       label:arr[i].instanceName,
        //       id:arr[i].instanceId
        //     });
        //   }
        //   //判断全选
        //   if(this.value.length==this.options.length){
        //     this.checkAll1=["全选"];
        //   }else{
        //     this.checkAll1=[];
        //   }
        // })
        //拿到执行人列表
        this.$ajax.post(this.port+"/"+this.getPath+"/display/getAllRoles",params1).then((res)=>{
          var value=-1;
          var arr=res.data.data;
          if(arr&&arr.length!=0){
            for(var i=0;i<arr.length;i++){
              value++;
              this.executors.push({
                value:value.toString(),
                label:arr[i].roleName,
                id:arr[i].roleId
              });
            }
          }
          //判断全选
          if(this.value1.length==this.executors.length){
            this.checkAll2=["全选"];
          }else{
            this.checkAll2=[];
          }
        });
        this.getStorage();
        //如果是选择区域
        if(window.sessionStorage.nameIds){
          if(this.nameIds.length==1){
            this.treeSelected=this.nameIds[0].name.split("-")[0];
            //console.log(1)
          }else{
            //console.log(2)
            //  如果是选择实体
            var str=[];
            var length=this.nameIds.length<3?this.nameIds.length:3;
            for(var i=0;i<length;i++){
              str.push(this.nameIds[i].name);
            }
            str.join(",")
            this.treeSelected=str+this.$t("m.etc")+this.nameIds.length+this.$t("m.instance");
          }
          //console.log("nameIds",this.nameIds,"实体id",this.instanceIdSelected,"实体名",this.storeSelected,this.treeSelected)
        }
      },
      //拖拽上传事件
      mounted:function(){
        var dropArea=document.querySelector(".file");
        dropArea.ondrop=(e)=>{
          e.preventDefault();
          var file=[];
          file.push(e.dataTransfer.files[0]);
          var type=file[0].type.split("/")[1];
          var url
          if (window.createObjectURL!=undefined)
          { // basic
            url = window.createObjectURL(file[0]) ;
          }
          else if (window.URL!=undefined)
          {
            // mozilla(firefox)
            url = window.URL.createObjectURL(file[0]) ;
          }
          else if (window.webkitURL!=undefined) {
            // webkit or chrome
            url = window.webkitURL.createObjectURL(file[0]) ;
          }
          if (!/^(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(type)) {
            swal(
              this.$t('m.warning'),
              this.$t('m.notPic'),
              "warning"
            );
          }else if(this.picUrl.length>9){
            swal(
              this.$t('m.warning'),
              this.$t('m.uploadPicLimit'),
              "warning"
            );
          }else{
            //上传
            var fd=new FormData();
            fd.append("file",file[0]);
            var config = {
              headers:{'Content-Type':'multipart/form-data'}
            }
            //ajax发送post请求
            this.$ajax.post(this.port+'/register/uploadFile',fd,config)
              .then(response=>{
                this.picUrl.push(response.data.viewPath);
              })
          }
        }
    },
      methods:{
        //判断input是否有特殊字符
        checkInput:function(){
          var regEn = /[`~@#$%^&*_+<>{}\/[\]]/im,
            regCn = /[·#￥（——）|《》【】[\]]/im;
          if(regEn.test(this.data.title) || regCn.test(this.data.title)
            ||regEn.test(this.data.description) || regCn.test(this.data.description)) {
            swal(
              this.$t('m.warning'),
              this.$t('m.inputWarning'),
              "warning"
            )
            return false;
          }else return true;
        },
        //全选按钮
        selectAll:function(value){
          //全选实体
          if(value==0){
            this.value=[];
            if(this.checkAll1.length!=0){
              for(var i of this.options){
                this.value.push(i.value);
              }
            }
            this.storeSelected=[];
            this.instanceIdSelected=[];
            for(var i of this.value){
              this.storeSelected.push(this.options[i].label);
              this.instanceIdSelected.push(this.options[i].id);
            }
          }else{
            this.value1=[];
            if(this.checkAll2.length!=0){
              for(var i of this.executors){
                this.value1.push(i.value);
              }
            }
            this.executorSelected=[];
            this.roleIdSelected=[];
            for(var i of this.value1){
              this.executorSelected.push(this.executors[i].label);
              this.roleIdSelected.push(this.executors[i].id);
            }
          }
        //
        },
        //删除上传图片
        deletePic:function(index){
          this.picUrl.splice(index,1);
        },
        //检查标题和说明
        checkTitleAndDesc:function(){
          this.regEmoji(this.data.title);
          this.regEmoji(this.data.description);
          if(this.data.title==undefined||this.data.title==""||
            this.data.description==undefined||this.data.description==""){
            return false;
          }else return true;
        },
        //保存草稿
        saveDraft:function(){
          if(!this.checkInput()){
            this.checkInput();
          }else{
            var checkDate=this.checkDateRange();
            var checkTitle=this.checkTitleAndDesc()
            if(this.picUrl.length>9){
              swal(
                this.$t('m.warning'),
                this.$t('m.uploadPicLimit'),
                "warning"
              );
            }else if(!checkTitle){
              swal(
                this.$t('m.warning'),
                this.$t('m.checkTitle'),
                "warning"
              );
            }else if(checkDate){
              var dixUrls=[];
              if(this.adjunct!=undefined&&this.adjunct.length!=0){
                for(var i of this.adjunct){
                  dixUrls.push(i.url);
                }
              }
              var params={
                customerId:this.customerId,
                accountId:this.accountId,
                imgUrls:this.picUrl,
                dixUrls:dixUrls,
                instances:this.instanceIdSelected,
                roles:this.roleIdSelected,
                nameIds:this.nameIds,
                taskId:this.taskId==undefined?null:this.taskId,
                taskName:this.data.title,
                taskRemark:this.data.description,
                taskStartDate:this.date.startDate+" 00:00:00",
                taskEndDate:this.date.endDate+" 00:00:00",
                taskAudit:parseInt(this.radio)
              }
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
                  roles:this.roleIdSelected,
                }
                this.button=true;
                this.$ajax.post(this.port+"/"+this.getPath+"/display/checkInstancesAndRoles",params1).then((res)=> {
                  this.instancesFault =res.data.data==null?[]:res.data.data;
                  if(this.instancesFault.length==this.instanceIdSelected.length){
                    swal(
                      this.$t('m.warning'),
                      this.$t('m.noneInstances'),
                      "warning"
                    );
                    this.button=false;
                  }else{
                    this.button=true;
                    this.$ajax.post(this.port+"/"+this.getPath+"/display/saveTaskWeb",params).then((res)=>{
                      if(res.data.status==0){
                        swal(
                          this.$t('m.warning'),
                          this.$t('m.draftSaved'),
                          "success"
                        );
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
                });
              }
            }else{
              swal(
                this.$t('m.warning'),
                this.$t('m.timeWarning'),
                "warning"
              );
            }
          }
        },
        //点击上传图片
        update:function(e){
          for(var i of e.target.files) {
            if(this.picUrl.length > 8){
              swal(
                this.$t('m.warning'),
                this.$t('m.uploadPicLimit'),
                "warning"
              );
            }else{
              var file = i;
              var type=file.name.split(".")[1];
              if (!/^(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(type)) {
                swal(
                  this.$t('m.warning'),
                  this.$t('m.notPic'),
                  "warning"
                );
              } else {
                var param = new FormData(); //创建form对象
                param.append('file', file, file.name);//通过append向form对象添加数据
                param.append('chunk', '0');//添加form表单中其他数据
                var config = {
                  headers: {'Content-Type': 'multipart/form-data'}
                }  //添加请求头
                //发送http请求
                this.$ajax.post(this.port + '/register/uploadFile', param, config)
                  .then((res) => {
                    this.picUrl.push(res.data.viewPath);
                  })
              }
            }
          }
        },
        submit:function(){
          var checkDate=this.checkDateRange();
          var checkTitle=this.checkTitleAndDesc()
          if(this.picUrl.length>9){
            swal(
              this.$t('m.warning'),
              this.$t('m.uploadPicLimit'),
              "warning"
            );
          }else if(!checkTitle){
            swal(
              this.$t('m.warning'),
              this.$t('m.checkTitle'),
              "warning"
            );
          }else if(checkDate){
            //如果日期正确
            var dixUrls=[];
            if(this.adjunct!=undefined&&this.adjunct.length!=0){
              for(var i of this.adjunct){
                dixUrls.push(i.url);
              }
            }
            var params={
              nameIds:[],
              customerId:this.customerId,
              accountId:this.accountId,
              imgUrls:this.picUrl,
              dixUrls:dixUrls,
              instances:this.instanceIdSelected,
              roles:this.roleIdSelected,
              nameIds:this.nameIds,
              taskId:this.taskId==undefined?null:this.taskId,
              taskName:this.data.title,
              taskRemark:this.data.description,
              taskStartDate:this.date.startDate+" 00:00:00",
              taskEndDate:this.date.endDate+" 23:59:59",
              taskAudit:parseInt(this.radio),
              ways:this.checkCode
            };
            //console.log(params)
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
              this.button=true;
              var params1={
                customerId:this.customerId,
                accountId:this.accountId,
                instances:this.instanceIdSelected,
                roles:this.roleIdSelected
              }
              this.$ajax.post(this.port+"/"+this.getPath+"/display/checkInstancesAndRoles",params1).then((res)=>{
                this.instancesFault=""
                if(res.data.data!=null&&res.data.data.length!=0){
                  for(var i of res.data.data){
                    this.instancesFault+=i.instanceName+=",";
                  }
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
                            this.$emit('watchInput',0);
                            this.reset();
                            this.$router.push('/task_list');
                          }else{
                            swal(
                              this.$t('m.warning'),
                              this.$t('m.publishFailed'),
                              "warning"
                            );
                          }
                          this.button=false;
                        })
                      }
                    });
                }else{
                  //发布
                  this.$ajax.post(this.port+"/"+this.getPath+"/display/releaseTaskWeb",params).then((res)=>{
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
                    }
                    this.button=false;
                  })
                }
              });
            }
          }else{
            swal(
              this.$t('m.warning'),
              this.$t('m.timeWarning'),
              "warning"
            );
          }
        },
        //重置按钮
        reset:function(){
          this.checkAll1=[],
          this.checkAll2=[],
          this.data.title="";
          this.data.description="";
          this.picUrl=[];
          this.date.startDate="";
          this.date.startDate="";
          this.date.endDate="";
          this.checkCode=[0];
          this.checkList=[this.$t('m.innerMsg')];
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
          // this.$refs.upload.clearFiles();
        },
        //新建任务返回
        jumpBack:function(){
            if( this.data.title==""&&this.data.description==""){
              this.reset()
              this.$router.push("/task_list");
            }else{
              if(this.$route.params.tid){
                this.reset()
                this.$router.push('/task_list');
              }else{
                swal({
                  title:this.$t('m.warning'),
                  text: this.$t('m.needSave'),
                  icon: "warning",
                  closeOnClickOutside: false,
                  buttons: [this.$t('m.no'),this.$t('m.yes')],
                  dangerMode: true,
                })
                //根据选择执行回调
                  .then((save) => {
                    if (save) {
                      //ajax 保存草稿
                      this.saveDraft();
                    } else {
                      this.reset()
                      swal(this.$t('m.noSave'),{
                        icon:"warning"
                      });
                      this.$router.push('/task_list');
                    }
                  })
              }
          }
        },
        //下拉框获取label值
        changeValue:function(value){
          this.storeSelected=[];
          this.instanceIdSelected=[];
          for(var i of value){
            this.storeSelected.push(this.options[i].label);
            this.instanceIdSelected.push(this.options[i].id);
          }
        },
        changeValue1:function(value){
          this.executorSelected=[];
          this.roleIdSelected=[];
          for(var i of value){
            this.executorSelected.push(this.executors[i].label);
            this.roleIdSelected.push(this.executors[i].id);
          }
        //  检查未成功匹配的实体
        },
        //通知方式change
        changeCheck:function(value){
          if(value.length==0){
            swal(
              this.$t('m.warning'),
              this.$t('m.errNoti'),
              "warning"
            );
            value=[this.$t('m.innerMsg')];
          }
          var arr=[];
          for(var i of value){
            if(i==this.$t('m.innerMsg')){
              arr.push(0);
            }else{
              arr.push(2);
            }
          }
          //es6 set数组去重
          this.checkCode = Array.from(new Set(arr));
        },
        toPreview:function() {
          this.nowDate=this.formatDate(new Date());
          this.setStorage()
          var checkDate=this.checkDateRange();
          var checkTitle=this.checkTitleAndDesc()
          if(this.picUrl.length>9){
            swal(
              this.$t('m.warning'),
              this.$t('m.uploadPicLimit'),
              "warning"
            );
          }else if(!checkTitle){
            swal(
              this.$t('m.warning'),
              this.$t('m.checkTitle'),
              "warning"
            );
          }else if(checkDate){
            this.$router.push("/task_preview");
          }else{
            swal(
              this.$t('m.warning'),
              this.$t('m.timeWarning'),
              "warning"
            );
          }
        },
        //检查日期范围
        checkDateRange:function(){
          if(this.date.startDate!=""&&this.date.startDate!=undefined&&
            this.date.endDate!=""&&this.date.endDate!=undefined) {
            var startDate=parseInt(this.date.startDate.replace(/[-]/g,""));
            var endDate=parseInt(this.date.endDate.replace(/[-]/g,""));
            var nowDate=this.formatDate(new Date());
            nowDate=nowDate.split(" ")[0]
            nowDate=parseInt(nowDate.replace(/[-]/g,""));
            if(startDate<=endDate&&(startDate>=nowDate&&endDate>=nowDate)){
              return true;
            }else return false;
          }else return false;
        },
        //拿sessionStorage数据
        getStorage:function(){
          var storage=window.sessionStorage
          ////console.log(storage.nameIds)
          if(storage.title!=undefined&&storage.title!="undefined"){
            this.data.title=storage.title;
          }
          this.nowDate=storage.nowDate
          if(storage.description!=undefined&&storage.description!="undefined"){
            this.data.description=storage.description;
          }
          if(storage.value!=undefined&&storage.value!="undefined"){
            this.value=storage.value.split(",");
          }
          if(storage.value1!=undefined&&storage.value1!="undefined"){
            this.value1=storage.value1.split(",");
          }
          if(storage.roleIdSelected!=undefined&&storage.roleIdSelected.length!=0){
            this.roleIdSelected=storage.roleIdSelected.split(",");
          }
          if(storage.instanceIdSelected!=undefined&&storage.instanceIdSelected.length!=0){
            this.instanceIdSelected=storage.instanceIdSelected.split(",");
          }
          if(storage.nameIds!=undefined&&storage.nameIds.length!=0){
            this.nameIds=JSON.parse(storage.nameIds);
          }
          if(storage.adjunctName!=undefined&&storage.adjunctName!="undefined"){
            this.adjunctName=storage.adjunctName;
          }
          if(storage.radio!=undefined&&storage.radio!=""){
            this.radio=storage.radio;
          }
          this.date.startDate=storage.startDate;
          this.date.endDate=storage.endDate;
          if(storage.checkCode!=undefined&&storage.checkCode.length>1){
            this.checkCode=storage.checkCode.split(",");
          }
          this.executorSelected=storage.executorSelected;
          this.storeSelected=storage.storeSelected;
          if(storage.picUrl!=undefined&&storage.picUrl!="undefined") {
            this.picUrl = storage.picUrl.split(",");
          }
        },
        //设置sessionStorage数据
        setStorage:function(){
          var storage=window.sessionStorage;
          storage["nowDate"]=this.nowDate;
          storage["title"]=this.data.title;
          storage["description"]=this.data.description;
          storage["radio"]=this.radio;
          storage["checkCode"]=this.checkCode;
          if(this.picUrl!=[]&&this.picUrl.length!=0){
            storage["picUrl"]=this.picUrl;
          }
          ////console.log("nameIds",this.nameIds)
          if(this.nameIds!=[]&&this.nameIds.length!=0){
            storage["nameIds"]=JSON.stringify(this.nameIds);
          }
          storage["instanceIdSelected"]=this.instanceIdSelected;
          storage["roleIdSelected"]=this.roleIdSelected;
          storage["startDate"]=this.date.startDate
          storage["endDate"]=this.date.endDate;
          storage["executorSelected"]=this.executorSelected
          if(this.value!=[]&&this.value.length!=0){
            storage["value"]=this.value;
          }
          if(this.value1!=[]&&this.value1.length!=0){
            storage["value1"]=this.value1;
          }
          if(this.adjunct!=[]&&this.adjunct.length!=0){
            var dixUrls=[];
            for(var i of this.adjunct){
              dixUrls.push(i.url);
            }
            storage["adjunct"]=dixUrls;
            var adjunct=[];
            for(var i of this.adjunct){
              adjunct.push(i.name);
            }
            storage["adjunctName"]=adjunct;
          }
          storage["executorSelected"] = this.executorSelected;
          storage["storeSelected"] = this.storeSelected;
        },
        // //以下是elementUI的上传事件
        // submitUpload() {
        //   this.$refs.upload.submit();
        // },
        // beforeRemove:function(file,fileList){
        //   return this.$confirm(`${this.$t('m.confirmDel')} ${ file.name }？`);
        // },
        // handleRemove(file, fileList) {
        //   for(var i in this.adjunct) {
        //     if (this.adjunct[i].uid == file.uid) {
        //       this.adjunct.splice(i, 1);
        //     }
        //   }
        // },
        //上传文件超过50MB提示删除
        // beforeAvatarUpload(file) {
        //   var isLt2M = file.size / 1024 / 1024 < 50
        //   if(!isLt2M) {
        //     this.$message.warning(this.$t('m.sizeLimit'));
        //     return false;
        //   }
        // },
        // handlePreview(file) {
        //
        // },
        // handleExceed(files, fileList) {
        //   this.$message.warning(`${this.$t('m.uploadLimit1')} ${files.length} ${this.$t('m.uploadLimit2')} ${files.length + fileList.length} ${this.$t('m.uploadLimit3')}`);
        // },
        // handleSuccess:function(res,file,fileList){
        //   this.adjunct.push({
        //     uid:file.uid,
        //     url:res.viewPath,
        //     name:file.name
        //   });
        //   this.$message.success(this.$t('m.uploadSucc'));
        // },
        // handleErr:function(err,file,fileList){
        // },
        // //文件改变触发
        // handleChange(file,fileList){
        //   this.hideUpload=true;
        // },
        getStartDate:function(date){
          this.date.startDate=date;
        },
        getEndDate:function(date){
          this.date.endDate=date;
        },
        clearAdjunct:function(){
          this.adjunct=[];
          this.adjunctName=[];
          this.hideUpload=false;
        },
      //  组织结构
        getTree(){
          this.showTree=true;
          this.instanceIdSelected=[];
          this.nameIds=[];
          this.storeSelected=[];
        },
        //从组织结构树获取实体列表
        getTreeData(data){
          ////console.log("拿到数据",data);
          this.storeSelected=[];
          this.instanceIdSelected=[];
          if(data.length!=0){
            if(data[0]=="instance"){
              for(var i of data){
                //如果是实体选取
                if(i!="instance"){
                  this.storeSelected.push(i.text);
                  this.nameIds.push({
                    name:i.text,
                    ids:i.id
                  });
                  this.instanceIdSelected.push(i.id);
                }
              }
              if(this.storeSelected==null||this.storeSelected==undefined||this.storeSelected.length==0){
                this.treeSelected="";
              }else{
                var str=[];
                var length=this.storeSelected.length<3?this.storeSelected.length:3;
                for(var i=0;i<length;i++){
                  str.push(this.storeSelected[i]);
                }
                str.join(",")
                this.treeSelected=str+this.$t("m.etc")+this.storeSelected.length+this.$t("m.instance");
                // console.log("实体名",this.storeSelected,"实体id",this.instanceIdSelected,"nameIds",this.nameIds,this.treeSelected)
              }
            }
            //如果是区域选取
            else if(data[0]=="area"){
              this.nameIds.push(data[1]);
              for(var i of data[2]){
                this.storeSelected.push(i.instanceTitle);
                this.instanceIdSelected.push(i.instanceId);
              }
              if(this.storeSelected==null||this.storeSelected==undefined||this.storeSelected.length==0){
                this.treeSelected="";
              }else{
                this.treeSelected=data[1].name;
              }
            }else{
            //  如果是table选取
              for(var i of data){
                //如果是实体选取
                if(i!="table"){
                  this.storeSelected.push(i.instanceTitle);
                  this.nameIds.push({
                    name:i.instanceTitle,
                    ids:i.instanceId
                  });
                  this.instanceIdSelected.push(i.instanceId);
                }
              }
              if(this.storeSelected==null||this.storeSelected==undefined||this.storeSelected.length==0){
                this.treeSelected="";
              }else{
                var str=[];
                var length=this.storeSelected.length<3?this.storeSelected.length:3;
                for(var i=0;i<length;i++){
                  str.push(this.storeSelected[i]);
                }
                str.join(",")
                this.treeSelected=str+this.$t("m.etc")+this.storeSelected.length+this.$t("m.instance");
              }
            }
          }else{
            this.treeSelected="";
          }
          console.log("实体名",this.storeSelected,"实体id",this.instanceIdSelected,"nameIds",this.nameIds,this.treeSelected)
          this.showTree=false;
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
