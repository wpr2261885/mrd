<template>
  <div class="modal" id="choose" data-backdrop="static"
       data-keyboard="false">
    <div class="modal-dialog" style="width:1100px;min-height: 400px;">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="choose_myModalLabel">
            {{$t("m.select")}}
          </h4>
        </div>
        <div class="modal-body">
          <div class="box-body">
            <div class="col-sm-6 form-horizontal" id="tags_append">
              <div class="form-group">
                <label for="radioView" class="col-sm-3 control-label">{{$t("m.selectMode")}}</label>
                <div id="radioView">
                  <div class="radio-inline">
                    <label>
                      <input type="radio" @change="handleRadioChange(0)" name="chooseType" value="0" checked>
                      {{$t("m.selectInstance")}}
                    </label>
                  </div>
                  <div class="radio-inline">
                    <label>
                      <input type="radio" @change="handleRadioChange(1)" name="chooseType" id="" value="1">
                      {{$t("m.selectArea")}}
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <!--组织结构树-->
                <label style="display:inline-block;" for="choose_organization" class="col-sm-3 control-label">组织结构</label>
                <div class="col-sm-8 tree-body" id="choose_organization" style="display:inline-block;">
                  <el-tree
                    ref="tree1"
                    node-key="id"
                    :expand-on-click-node="clickArrow"
                    default-expand-all
                    :data="tree"
                    :props="defaultProps"
                    @node-click="handleNodeClick">
                  </el-tree>
                </div>
              </div>
              <!--实体类型标签-->
              <div v-if="typeTags.length!=0&&typeTags!=null" class="form-group">
                <label style="display:inline-block;margin-top:40px;" class="col-sm-3 control-label">{{$t("m.instanceType")}}</label>
                <div class="tag col-sm-8" style="display:inline-block;margin-top:40px;">
                  <button @click="selectTag(index)" v-for="(i,index) in typeTags" :class="{'btn-tag-clicked':typeClicked==index}" class="btn btn-default btn-tag">{{i.typeName}}</button>
                </div>
              </div>
              <!--用户自定义标签-->
              <div v-if="customTags.length!=0&&customTags!=null" v-for="(i,index1) in customTags" class="form-group">
                <label style="display:inline-block;" class="col-sm-3 control-label">{{i.classify.classifyName}}</label>
                <div class="tag col-sm-8" style="display:inline-block;">
                  <button @click="selectTag(index,index1)" v-for="(j,index) in i.tags" :class="{'btn-tag-clicked':j.clicked}" class="btn btn-default btn-tag">{{j.tagName}}</button>
                </div>
              </div>
            </div>

            <div class="col-md-6 col-sm-12">
              <div>
                实体列表
              </div>
              <div v-if="!selectInstance" style="width: 100%;margin-top: 10px">
                <input v-model="search" type="text" id="choose_search" class="form-control"
                       @keyup.stop="handleKeyup" :placeholder="$t('m.fastSearch')" />
              </div>
              <div v-if="!selectInstance&&!selectTable" id="choose_treeView">
                <div id="choose_instanceTree">
                  <!--实体树-->
                  <el-tree
                    :check-strictly="check"
                    @check-change="handleCheckChange"
                    :data="tree1"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    ref="tree"
                    highlight-current
                    @node-click="handleNodeClick1"
                    :props="defaultProps1">
                  </el-tree>
                </div>
              </div>
              <!--选择区域后实体列表-->
              <ul class="area-list" v-if="selectInstance">
                <li v-if="table.length!=0" v-for="i in table">
                  {{i.instanceTitle}}
                </li>
                <div class="pagination">
                  <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="10"
                    layout="prev, pager, next"
                    :total="data.length">
                  </el-pagination>
                </div>
              </ul>
              <!--多选表格-->
              <div class="area-list" v-if="selectTable">
                <el-table
                  ref="multipleTable"
                  :data="table"
                  max-height="474"
                  size="mini"
                  :show-header="showHeader"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
                  <el-table-column
                    type="selection"
                    width="150">
                  </el-table-column>
                  <el-table-column
                    width="352">
                    <template slot-scope="scope">{{ scope.row.instanceTitle }}</template>
                  </el-table-column>
                </el-table>
                <div class="pagination">
                  <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="10"
                    layout="prev, pager, next"
                    :total="data.length">
                  </el-pagination>
                </div>
              </div>
              <!--分页-->
              <div v-if="selectInstance||selectTable" class="block">
                <p>
                  {{$t("m.showNo")}}
                  <span style="margin:0 5px 0 5px;">{{startPage}}</span>
                  {{$t("m.toNo")}}
                  <span style="margin:0 5px 0 5px;">{{endPage}}</span>
                  {{$t("m.dataTotal")}}
                  <span style="margin:0 5px 0 5px;">{{totalSize}}</span>
                  {{$t("m.dataPerPageShow")}}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="col-sm-offset-4 col-sm-4" style="margin-top:15px">
            <div class="modal-footer-btn col-lg-12 col-md-8 col-sm-8 col-xs-5">
              <button type="button" class="btn btn-default"
                      data-dismiss="modal" @click="handleCancel">
                {{$t("m.cancel")}}
              </button>
              <button type="button" class="btn btn-primary"
                      @click="handleConfirm">
                {{$t("m.confirm")}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        port:this.getPort,
        accountId:this.getAccountId,
        customerId:this.getCustomerId,
        //按钮选中
        typeClicked:-1,
        customClicked:-1,
        customClicked1:-1,
        //父子勾选不关联
        clickArrow:false,
        check:true,
        //被选中实体名称
        instanceSelected:[],
        //是否有标签选中
        tagOn:false,
        //自定义标签
        customTags:[],
        tagIds:null,
        //实体类型标签
        typeTags:[],
        typeIds:null,
        //组织id
        orgId:"",
        //选择实体或区域开关
        selectInstance:false,
        //实体树和多选table开关
        selectTable:false,
        //关键词搜索
        search:"",
        //组织树
        tree: [],
        defaultProps: {
          children: 'children',
          label: 'text',
          id:'id'
        },
        //实体树
        tree1: [],
        defaultProps1: {
          children: 'children',
          label: 'text',
          id:'id'
        },
        //  区域全选列表
        table:[],
        data:[],
        totalSize:"",
        startPage:"",
        endPage:"",
        //  多选表格
        multipleSelection: [],
        showHeader:false
      };
    },
    beforeMount(){
      //  获取左边组织结构树
      var params={
        accountId:this.accountId,
        customerId:this.customerId,
        isInclude:false,
        isChoose:true,
        noInstanceChoose:true
      }
      this.$ajax.post(this.port+this.dev.getTree,params).then((res)=>{
        if(res.data.length!=0){
          this.tree=res.data;
          //console.log("组织结构树:",this.tree);
          //console.log("1",res)
          var defaultKey=res.data[0].id;
          this.orgId=defaultKey;
          this.$refs.tree1.setCurrentKey(defaultKey);
          //console.log("key:",this.$refs.tree1.getCurrentKey())
          //  用默认选中获取table数据
          this.getInstanceTable(defaultKey);
          //用默认选中获取实体树数据
          this.handleNodeClick(this.tree[0]);
        }
      })
      //  获取实体类型标签
      this.$ajax.post(this.port+this.dev.getTypes).then((res)=>{
        //添加按钮选项  调试是res.data.data,部署res.data
        if(res.data!=undefined&&res.data!=null&&res.data.length!=0){
          for(var i of res.data){
            i.clicked=false;
          }
          this.typeTags=res.data;
        }
        // console.log("实体类型标签",this.typeTags)

        //  获取用户自定义标签
        var params1={
          accountId:this.accountId,
          customerId:this.customerId
        };
        this.$ajax.post(this.port+this.dev.getTags,params1).then((res)=>{
          //添加按钮选项
          if(res.data.data!=undefined&&res.data.data.length>0&&res.data.data!=null){
            for(var i of res.data.data){
              for(var j of i.tags){
                j.clicked=false;
              }
            }
            this.customTags=res.data.data;
          }
          //console.log("自定义标签",this.customTags)
        })
      })
    },
    methods: {
      //选择标签
      selectTag(index,index1=-1){
        this.search="";
        //自定义标签
        if(index1!=-1){
          //取消标签
          this.tagIds=[];
          if(this.customTags[index1].tags[index].clicked){
            this.tagOn=false;
            this.customTags[index1].tags[index].clicked=false;
            //  将已选择的标签id放进tagIds
            for(var i of this.customTags){
              for(var j of i.tags){
                if(j.clicked){
                  this.tagIds.push(j.tagId)
                }
              }
            }
            //如果没有选择任何自定义标签
            this.tagIds=this.tagIds.length==0?null:this.tagIds.join(",");
            this.getInstanceTable(this.orgId,null,this.tagIds);
            //console.log(this.tagIds)
          }
          //否则选择标签
          else{
            this.tagOn=true;
            //如果同一行已有选择标签
            for(var i of this.customTags[index1].tags){
              if(i.clicked){
                //原有选择取消
                i.clicked=false;
                //现在选择
                this.customTags[index1].tags[index].clicked=true;
              }
              //同一行没有已选择的标签
              else{
                this.customTags[index1].tags[index].clicked=true;
              }
            }
            //  将已选择的标签id放进tagIds
            for(var i of this.customTags){
              for(var j of i.tags){
                if(j.clicked){
                  this.tagIds.push(j.tagId)
                }
              }
            }
            //如果没有选择任何自定义标签
            this.tagIds=this.tagIds.length==0?null:this.tagIds.join(",");
            this.getInstanceTable(this.orgId,null,this.tagIds);
            //console.log(this.tagIds);
          }
        }
        //系统标签
        else{
          //如果相等就是取消标签,关闭多选表格
          if(this.typeClicked==index){
            this.tagOn=false;
            this.typeClicked=-1;
            this.getInstanceTable(this.orgId,null,this.tagIds);
            this.typeTags[index].clicked=false;
          }
          //否则是选择标签,打开多选表格
          else{
            this.tagOn=true;
            this.typeClicked=index;
            var typeId=this.typeTags[index].typeId
            this.getInstanceTable(this.orgId,typeId,this.tagIds);
            this.typeTags[index].clicked=true;
            //清除其他系统标签的已点击状态
            for(var i in this.typeTags){
              if(i!=index){
                console.log(i,index)
                this.typeTags[i].clicked=false;
              }
            }
          }
          console.log(this.typeTags)
        }
        this.selectTable=!this.selectInstance;
      },
      //选择实体或区域切换
      handleRadioChange(value){
        if(value>0){
          //切换到选择区域
          this.selectInstance=true;
          this.selectTable=false;
        }else{
          //切换到选择实体
          this.selectInstance=false;
          if(this.tagOn){
            this.selectTable=true;
          }
        }
      },
      //搜索
      handleKeyup(){
        if(this.search==""){
          this.selectTable=false;
        }else {
          this.table=[];
          this.selectTable=true;
          for (var i of this.data) {
            //匹配名字或编码
            //console.log(i.instanceTitle)
            if (i.instanceTitle.indexOf(this.search)!=-1||i.instanceCode.indexOf(this.search)!=-1) {
              this.table.push(i)
            }
          }
          //console.log(this.table)
        }
      },
      //取消
      handleCancel() {
        this.instanceSelected=[];
        this.$emit('treeEvent',this.instanceSelected);
      },
      //确认
      handleConfirm() {
        //如果是选择区域
        if(this.selectInstance){
          //没选择到区域
          if(this.instanceSelected.length==0){
            var arr=[];
            //从总数组this.data里拿,this.table为当前页数组
            for(var i of this.data){
              arr.push(i.instanceId);
            }
            this.instanceSelected.push({
              name:this.tree[0].text,
              ids:arr.join(",")
            })
          }
          this.instanceSelected.push(this.data);
          this.instanceSelected.unshift("area")
          //console.log("区域版数据结构",this.instanceSelected)
          //把已选择标签拼在name后
          //如果是用table选择且是区域选择
          console.log(this.typeTags)
          for(var i of this.typeTags){
            if(i.clicked){
              this.instanceSelected[1].name+="-"+i.typeName;
            }
          }
          for(var i of this.customTags){
            for(var j of i.tags){
              if(j.clicked){
                this.instanceSelected[1].name+="-"+j.tagName;
              }
            }
          }
        }
        //否则是选择实体
        //  如果有选择
        else{
          //如果是用实体树选择的
          if(!this.selectTable){
            this.instanceSelected.unshift("instance");
          }
          //如果是用table选择的
          //  如果没有选择
          else if(this.multipleSelection.length!=0){
            this.instanceSelected=this.multipleSelection;
            this.instanceSelected.unshift("table");
          }
        }
        console.log(this.instanceSelected)
        this.$emit('treeEvent',this.instanceSelected);
      },
      //勾选实体树节点
      handleCheckChange(data,self,son){
        //当前勾选的id值
        this.instanceIdSelected=this.$refs.tree.getCheckedKeys();
        this.instanceSelected=this.$refs.tree.getCheckedNodes();
        //console.log("已选实体",this.instanceSelected);
      },
      //点击组织结构树节点
      handleNodeClick(data) {
        //console.log("节点信息",data);
        //console.log("id:",this.$refs.tree1.getCurrentKey())
        this.orgId=data.id
        //根据点击结构树获取实体列表table
        this.getInstanceTable(data.id,this.typeId,this.tagIds);
        //根据点击结构树获取实体树
        var params = {
          "accountId": this.accountId,
          "customerId": this.customerId,
          "id": "#",
          "organizationId": data.id
        };
        this.$ajax.post(this.port+this.dev.treeByOrg,params).then((res)=>{
          //console.log("最上层实体结构树:",res);
          this.tree1=res.data;
          //如果是选择区域
          this.instanceSelected=[];
          if(this.selectInstance){
            var ids=[];
            for(var i of this.tree1){
              ids.push(i.id)
            }
            this.instanceSelected.push({
              name:data.data.object.organizationName,
              ids:ids.join(",")
            })
            //console.log("已选择的实体",this.instanceSelected)
          }
        })
      },
      //  点击实体树节点
      handleNodeClick1(data){
        //console.log("节点信息",data);
        //如果有子集,懒加载子节点
        if(data.children){
          var params = {
            "accountId": this.accountId,
            "customerId": this.customerId,
            "id": data.id,
            "organizationId": this.orgId
          };
          this.$ajax.post(this.port+this.dev.treeByOrg,params).then((res)=>{
            if(res.data.length!=0&&res.data!=null){
              //console.log("非最上层实体结构树:",res.data);
              data.children=[];
              for(var i of res.data){
                data.children.push(i);
              }
            }
          })
        }else{
          return;
        }
      },
      //  获取实体列表table
      getInstanceTable(orgId,typeId=null,tagIds=null){
        //  去重
        if(tagIds){
          tagIds=Array.from(new Set(tagIds.split(",")))
          tagIds=tagIds.join(",")
        }
        var params1={
          organizationId : orgId,
          typeId : typeId,
          tagIds : tagIds,
          hasChildren : true,
          accountId:this.accountId,
          customerId:this.customerId
        };
        this.$ajax.post(this.port+this.dev.screenInstance,params1).then((res)=>{
          //console.log("table：",res.data)
          if(res.data.length==0||res.data==null){
            this.data=[];
          }else{
            this.data=res.data;
          }
          this.pagination();
        });
      },
      //  实体树
      getCheckedNodes() {
        //console.log(this.$refs.tree.getCheckedNodes());
      },
      getCheckedKeys() {
        //console.log(this.$refs.tree.getCheckedKeys());
      },
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3]);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      //分页
      pagination:function(pageNo=1){
        var pageSize=10;
        if(this.data.length>pageSize){
          this.table=[];
          var startPage=(pageNo-1)*pageSize;
          var endPage=pageNo*pageSize;
          if(pageNo>1){
            if(startPage>this.data.length||endPage>this.data.length){
              endPage=this.data.length;
            }
          };
          for(var i=startPage;i<endPage;i++){
            this.table.push(this.data[i]);
          };
        }else{
          this.table=this.data;
        }
        //显示分页数据
        this.startPage=this.data.length==0?0:startPage==undefined?1:startPage+1;
        this.endPage=endPage==undefined?this.data.length:endPage;
        this.totalSize=this.data.length;
        //console.log(pageNo,this.startPage,this.endPage,this.data,this.table);
      },
      handleCurrentChange(val) {
        //console.log(val);
        this.pagination(val);
      },
      //  多选表格
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      //表格被勾选
      handleSelectionChange(val) {
        this.multipleSelection = val;
        //console.log(this.multipleSelection)
      }
    }
  }
</script>

<style scoped>

</style>
