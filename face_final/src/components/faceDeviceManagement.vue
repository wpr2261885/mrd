<template>
  <div class="body">
    <div class="content-header">
      <h1>{{$t('m.faceDeviceManagement')}}</h1>
    </div>
    <div class="content">
      <div class="box">
        <div class="content-header-title">
          <span>{{$t('m.deviceList')}}</span>
          <span>
            <span @click="openDeviceDialog(0)" class="blue-span">{{$t('m.addDevice')}}</span>
          </span>
        </div>
        <div class="box-item">
          <div style="margin-bottom:50px;">
            <!--选择门店-->
            <span class="box-item-input" @click="openTree">
              <el-input style="width:450px;" :title="treeSelected" :placeholder="$t('m.selectInstance')" v-model="treeSelected" readonly></el-input>
            </span>
          </div>
          <p>{{$t('m.total')}}
            <!--数据总数-->
            <span class="total-task-count">{{exList.length}}</span>
            {{$t('m.data')}}</p>
          <table class="table-responsive table-hover table-bordered">
            <thead>
              <tr>
                <td>{{$t('m.serialNum')}}</td>
                <td>{{$t('m.type')}}</td>
                <td>{{$t('m.alias')}}</td>
                <td>{{$t('m.storeBind')}}</td>
                <td>{{$t('m.importExportBind')}}</td>
                <td>{{$t('m.status')}}</td>
                <td>{{$t('m.bindDate')}}</td>
                <td>{{$t('m.operation')}}</td>
              </tr>
            </thead>
            <tbody v-if="list.length>0">
              <tr v-for="(i,index) in list">
                <td>{{i.deviceImei}}</td>
                <td>{{i.deviceType==0?$t('m.face'):"-"}}</td>
                <td>{{i.deviceAlias}}</td>
                <td>{{i.isBind==1?i.instanceTitle:"-"}}</td>
                <td>{{i.isBind==1?i.passagewayName:"-"}}</td>
                <td>{{i.deviceOnline==1?$t('m.online'):$t('m.offline')}}</td>
                <td>{{i.createTime.split(".")[0]}}</td>
                <td>
                  <span v-if="i.isBind!=1" @click="openDeviceDialog(1,i.deviceImei,i.deviceAlias)" class="table-inner-detail-btn">{{$t('m.bind')}}</span>
                  <span v-if="i.isBind==1" @click="unbindDevice(i.deviceId,i.deviceImei,i.instanceId,i.passagewayId)" class="table-inner-detail-btn">{{$t('m.unbind')}}</span>
                  <span @click="openDetail(index)" class="table-inner-detail-btn">{{$t('m.detail')}}</span>
                  <!--详情弹框-->
                  <el-dialog :title="$t('m.detail')" :visible.sync="dialogDetailVisible">
                    <ul class="face-device-detail">
                      <li>
                        <span>{{$t('m.type')+":"}}</span>
                        <span>{{detail.deviceType==0?$t('m.face'):"-"}}</span>
                      </li>
                      <li>
                        <span>{{$t('m.alias')+":"}}</span>
                        <span>{{detail.deviceAlias}}</span>
                      </li>
                      <li>
                        <span>{{$t('m.serialNum')+":"}}</span>
                        <span>{{detail.deviceImei}}</span>
                      </li>
                      <li>
                        <span>{{$t('m.storeBind')+":"}}</span>
                        <span>{{detail.isBind==1?i.instanceTitle:"-"}}</span>
                      </li>
                      <li>
                        <span>{{$t('m.importExportBind')+":"}}</span>
                        <span>{{detail.isBind==1?i.passagewayName:"-"}}</span>
                      </li>
                      <li>
                        <span>{{$t('m.status')+":"}}</span>
                        <span>{{detail.deviceOnline==1?$t('m.online'):$t('m.offline')}}</span>
                      </li>
                    </ul>
                    <div slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="dialogDetailVisible=false">{{$t('m.confirm')}}</el-button>
                    </div>
                  </el-dialog>
                </td>
              </tr>
            </tbody>
          </table>
          <!--绑定设备弹框-->
          <el-dialog :title="$t('m.bindDevice')" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item>
                <el-input :placeholder="$t('m.serialNum')" v-model="form.serialNum"
                          auto-complete="off" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input :placeholder="$t('m.alias')" v-model="form.alias"
                          auto-complete="off" maxlength="30"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select @change="selectStoreDeviceChange" v-model="storeDeviceSelected" :placeholder="$t('m.selectStore')">
                  <el-option
                    v-for="item in storeDevice"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="portsSelected" @change="selectPortsChange" :placeholder="$t('m.selectPorts')">
                  <el-option
                    v-for="item in ports"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :disabled="button" @click="cancelDeviceDialog">{{$t('m.cancel')}}</el-button>
              <el-button :disabled="button" type="primary" @click="saveBindDevice">{{$t('m.save')}}</el-button>
            </div>
          </el-dialog>
          <!--分页-->
          <div v-if="exList.length>15" class="block" style="margin-top:30px;text-align:right;">
            <el-pagination
              @current-change="handleCurrentChange"
              :page-size="15"
              layout="prev, pager, next"
              :total="exList.length">
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
    import treeComponent from "./treeComponent";

    export default {
      components:{treeComponent},
      data(){
        return{
          customerId:this.getCustomerId,
          accountId:this.getAccountId,
          accountDemo:this.getAccountDemo,
          port:this.getPort,
          button:false,
          showTree:false,
          treeSelected:"",
          //是否是添加设备
          isAddDevice:false,
          //选择门店
          storeSelected:[],
          storeIdSelected:[],
        //  设备绑定选择门店
          storeDevice:[],
          storeDeviceSelected:"",
          storeIdDeviceSelected:"",
        //  绑定表单
          dialogFormVisible: false,
          form: {
            serialNum: '',
            alias: ''
          },
        //  出入口选项
          ports:[],
          portsSelected:"",
          portsIdSelected:"",
        //  设备列表
          exList:[],
          list:[],
        //  详情
          detail:[],
          dialogDetailVisible:false
        }
      },
      beforeMount(){
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
            this.getList();
          }
        })
      },
      methods:{
        //选择门店
        selectStoreChange(value){
          if(value.length!=0){
            //选择了实体
            this.storeIdSelected=[];
            if(value[value.length-1]==0){
              //  如果是全选
              this.storeSelected=[0];
              for(var i of this.store){
                this.storeIdSelected.push(i.id)
              }
            }else{
              //如果是手动选择
              for(var i in value){
                if(value[i]==0){
                  value.splice(i,1);
                }
                for(var j in this.store){
                  if(value[i]==j){
                    this.storeIdSelected.push(this.store[j].id)
                  }
                }
              }
            }
          }else{
            this.storeIdSelected=[];
            this.list=[];
            this.exList=[];
          }
          console.log("已选实体",this.storeIdSelected)
        },
        //设备绑定选择门店
        selectStoreDeviceChange(value){
          this.storeIdDeviceSelected=(this.storeDevice[value].id);
          var params={
            customerId:this.customerId,
            accountId:this.accountId,
            instanceId:this.storeDevice[value].id
          }
          console.log(params)
          this.$ajax.post(this.port+"/web/face/getPassgeway",params).then((res)=>{
            console.log(res.data.data)
            this.ports=[];
            this.portsSelected="";
            if(res.data.data.length!=0){
              console.log(1)
              var value1=0;
              for(var i of res.data.data){
                this.ports.push({
                  label:i.passagewayName,
                  id:i.passagewayId,
                  value:value1++
                })
              }
              this.portsIdSelected=this.ports[0].id;
              this.portsSelected=0;
            }
            console.log("已选实体",this.storeIdDeviceSelected,"默认出入口",this.portsIdSelected)
          })
        },
        //选择出入口
        selectPortsChange(value){
          this.portsIdSelected=this.ports[value].id;
          console.log("已选出入口",this.portsIdSelected)
        },
        //取消对话框
        cancelDeviceDialog(){
          this.dialogFormVisible = false;
        },
        //打开绑定对话框
        openDeviceDialog(i,deviceImei,deviceAlias){
          this.storeDevice=[];
          this.storeIdDeviceSelected=[];
          this.storeDeviceSelected="";
          this.ports=[];
          this.portsIdSelected=[];
          this.portsSelected="";
          this.storeDevice=[];
          this.dialogFormVisible = true;
          //获取设备绑定实体列表
          var params={
            customerId:this.customerId,
            accountId:this.accountId
          };
          this.$ajax.post(this.port+"/web/face/getAllInstances",params).then((res)=>{
            var value=0;
            if(res.data.data&&res.data.data.length!=0){
              for(var i of res.data.data){
                this.storeDevice.push({
                  label:i.instanceName,
                  id:i.instanceId,
                  value:value++
                })
              }
              console.log("绑定实体",this.storeDevice)
            }
          });
          if(i===0){
          //  添加设备
            this.form.serialNum="";
            this.form.alias="";
            this.isAddDevice=true;
          }else{
          //  绑定设备
            this.form.serialNum=deviceImei;
            this.form.alias=deviceAlias;
            this.isAddDevice=false;
          }
        },
        //添加或绑定设备
        saveBindDevice(){
          console.log(this.storeIdDeviceSelected,"||",this.portsIdSelected)
          if(this.form.serialNum==""||this.form.alias==""
            ||this.storeIdDeviceSelected==""||this.portsIdSelected==""){
            swal(
              this.$t('m.warning'),
              this.$t('m.bindDeviceWarning'),
              "warning"
            );
          }else{
            var params={
              accountId:this.accountId,
              customerId:this.customerId,
              IMEI:this.form.serialNum,
              alias:this.form.alias,
              instanceId:this.storeIdDeviceSelected,
              passagewayId:this.portsIdSelected
            }
            console.log(params)
            this.button=true;
            console.log(this.accountDemo)
            if(this.accountDemo){
              swal(
                this.$t('m.warning'),
                this.$t('m.trialAccountWarn'),
                "warning"
              );
              this.button=false;
            }else if(this.isAddDevice){
              //  添加设备
              this.$ajax.post(this.port+"/web/face/addFaceDevice",params).then((res)=>{
                console.log(res)
                if(res.data.status==0){
                  this.dialogFormVisible = false;
                  swal(
                    this.$t('m.success'),
                    this.$t('m.addSuccess'),
                    "success"
                  );
                  this.form.serialNum="";
                  this.form.alias="";
                  this.getList();
                }else if(res.data.status==20010){
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.serialNumRepeatWarn'),
                    "warning"
                  );
                }else if(res.data.status==20011){
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.serialNumRepeatWarn1'),
                    "warning"
                  );
                }else if(res.data.status==20012){
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.serialNumRepeatWarn3'),
                    "warning"
                  );
                }else{
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.serialNumRepeatWarn2'),
                    "warning"
                  );
                }
                this.button=false;
              })
            }else{
              //  绑定设备
              this.$ajax.post(this.port+"/web/face/bindFaceDevice",params).then((res)=>{
                console.log(res)
                if(res.data.status==0){
                  this.dialogFormVisible = false;
                  swal(
                    this.$t('m.success'),
                    this.$t('m.bindSuccess'),
                    "success"
                  );
                  this.form.serialNum="";
                  this.form.alias="";
                  this.getList();
                }else if(res.data.status==20011){
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.serialNumRepeatWarn1'),
                    "warning"
                  );
                }else{
                  swal(
                    this.$t('m.warning'),
                    this.$t('m.serialNumRepeatWarn2'),
                    "warning"
                  );
                }
                this.button=false;
              })
            }
          }
        },
        //解绑设备
        unbindDevice(deviceId,deviceImei,instanceId,passagewayId){
          var params={
            customerId:this.customerId,
            accountId:this.accountId,
            deviceId:deviceId,
            IMEI:deviceImei,
            instanceId:instanceId,
            passagewayId:passagewayId
          };
          console.log(params)
          if(this.accountDemo){
            swal(
              this.$t('m.warning'),
              this.$t('m.trialAccountWarn'),
              "warning"
            );
          }else{
            this.$ajax.post(this.port+"/web/face/unBindFaceDevice",params).then((res)=>{
              console.log(res.data)
              if(res.data.status==0){
                swal(
                  this.$t('m.success'),
                  this.$t('m.unbindSuccess'),
                  "success"
                );
                this.getList();
              }else{
                swal(
                  this.$t('m.warning'),
                  this.$t('m.unbindFailed'),
                  "warning"
                );
              }
            })
          }
        },
        //  总列表分页
        handleCurrentChange(value){
          this.pagination(value,15);
        },
        //获取设备列表
        getList(){
          this.list=[];
          this.exList=[];
          var params={
            customerId:this.customerId,
            accountId:this.accountId,
            instances:this.storeIdSelected
          }
          console.log(params)
          this.$ajax.post(this.port+"/web/face/getFaceDeviceList",params).then((res)=>{
            console.log("列表",res.data.data)
            if(res.data.data.length!=0){
              this.exList=res.data.data;
              this.pagination(1,15);
            }
          })
        },
        //  前端分页
        pagination(pageIndex,pageSize){
          if(this.exList.length>pageSize){
            this.list=[];
            var startPage=(pageIndex-1)*pageSize;
            var endPage=pageIndex*pageSize;
            if(pageIndex>1){
              if(startPage>this.exList.length){
                endPage=this.exList.length;
              }else if(endPage>this.exList.length){
                endPage=this.exList.length;
              }
            };
            for(var i=startPage;i<endPage;i++){
              this.list.push(this.exList[i]);
            };
          }else{
            this.list=this.exList;
          }
        },
      //  查看详情
        openDetail(index){
          this.detail=this.list[index];
          this.dialogDetailVisible=true;
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
            this.getList()
          }
        }
      }
    }
</script>

<style scoped>

</style>
