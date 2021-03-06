/**********************************************
 * 初始化方法： chooseInit()
 **********************************************/

/**********************************************
 * $('#choose').modal('show'); 模态框显示
 *
 * choose_title : 区域名称
 *
 * choose_instanceIds : 已选择的实体id
 *
 * choose_type : 选择模式  (0:实体选择    1:标签选择)
 **********************************************/


$('input:radio[name="chooseType"]').change(function(element){
  choose_type = parseInt(element.target.value);
  showInstance();
});
var choose_instance_typeId = null;
var tagIds = [];
var choose_instanceIds = [];
var choose_type = 0;//默认为0:实体选择。   1:标签选择
var choose_title = "";
var choose_cancel = true;

function setCancel(){
  choose_cancel = true;
}

function chooseInit() {
  choose_getOrganizationTree();
}
var organization_id = "";
function choose_selectData(){
  choose_cancel = false;
  //初始化参数
  choose_instanceIds = [];
  choose_title = "";
  if(choose_type==0){//实体选择
    //获取选择的标签个数
    var tagNum = tagIds.length;
    if(choose_instance_typeId!=null){
      tagNum += 1;
    }
    var v = $('#choose_search').val();
    if(v != ""){
      tagNum += 1;
    }
    if(tagNum==0){//1、无标签的情况下从树结构获取
      choose_instanceIds = $('#choose_instanceTree').jstree(true).get_checked();
      for(var i=0,size=choose_instanceIds.length;i<size;i++){
        var node =  $('#choose_instanceTree').jstree(true).get_node(choose_instanceIds[i]);
        if(i==0){
          choose_title = node.text;
        }
        if(i==1){
          choose_title += "、";
          choose_title += node.text;
        }
        if(i==2){
          choose_title += " " +"<spring:message code='label.choose.etc' />"+" " + size +" "+ "<spring:message code='label.choose.etcTip' />";
        }
      }
    }else{//2、有标签的情况下从表格获取
      var selected = $('#choose_instanceTable').bootstrapTable('getSelections');
      for(var i=0,size=selected.length;i<size;i++){
        choose_instanceIds.push(selected[i].instanceId);
        if(i==0){
          choose_title = selected[i].instanceTitle;
        }
        if(i==1){
          choose_title += "、";
          choose_title += selected[i].instanceTitle;
        }
        if(i==2){
          choose_title += " " +"<spring:message code='label.choose.etc' />"+" " + size +" "+ "<spring:message code='label.choose.etcTip' />";
        }
      }
    }
  }else{//区域选择

    //1、获取组织节点的名字 + 获取所选标签的名字
    var id = $('#choose_organizationTree').jstree(true).get_selected();
    var node = $('#choose_organizationTree').jstree(true).get_node(id[0]);
    choose_title = node.text;
    $('#tags_append .type.btn-primary').each(function(index, item) {
      choose_title += "-";
      choose_title += $(item).text();
    });
    $('#tags_append .tag.btn-primary').each(function(index, item) {
      choose_title += "-";
      choose_title += $(item).text();
    });
    //2、从表格中获取数据实体的ID
    var selected = $('#choose_instanceTable').bootstrapTable('getData');
    for(var i=0,size=selected.length;i<size;i++){
      choose_instanceIds.push(selected[i].instanceId);
    }
  }
  if(choose_instanceIds.length==0){
    return false;
  }
  $('#choose_instanceTree').jstree(true).uncheck_all();
  $('#choose_instanceTable').bootstrapTable('uncheckAll');
  $('#objectTitle').val(choose_title);
  $('#choose').modal('hide');
}

function changeChooseType(type, thisObject){
  $('#chooseTypeBtns button').each(function(index, element) {
    element.className = "btn btn-default";
  });
  thisObject.className = "btn btn-primary";
  choose_type = type;
  showInstance();
}

$('#choose_instanceTree').slimScroll({
  height : '450px',
  alwaysVisible : true, //是否 始终显示组件
  disableFadeOut : false, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
  railVisible : true, //是否 显示轨道
  railDraggable : true, //是否 滚动条可拖动
  allowPageScroll : true, //是否 使用滚轮到达顶端/底端时，滚动窗口
});
$('#choose_organizationTree').slimScroll({
  height : '300px',
  alwaysVisible : true, //是否 始终显示组件
  disableFadeOut : false, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
  railVisible : true, //是否 显示轨道
  railDraggable : true, //是否 滚动条可拖动
  allowPageScroll : true, //是否 使用滚轮到达顶端/底端时，滚动窗口
});

//初始化组织结构
$('#choose_organizationTree').jstree({
  core : {
    'check_callback' : true,
    'themes' : {
      'variant' : 'large'
    },
    'data' : null,
  },
  plugins : [ "wholerow", "state", "sort" ],
}).bind('select_node.jstree', function(e, data) {
  organization_id = data.node.id;
  showInstance();
}).bind('refresh.jstree', function(e, data) {
  var inst = data.instance;
  var obj = inst.get_node(e.target.firstChild.firstChild);
  inst.select_node(obj);
});
function choose_getOrganizationTree() {
  $.ajax({
    type : 'post',
    url : 'http://192.168.0.121//core/organization/getCustomerTree',
    data : {
      isInclude : false
    },
    datatype : 'json',
    success : function(result) {
      var data = eval(result);
      if (data.length > 0) {
        organization_id = data[0].id;
      }
      $('#choose_organizationTree').jstree(true).settings.core.data = data;
      $('#choose_organizationTree').jstree(true).refresh();
      choose_getAllCustomerTags();
    }
  });
}

//初始化标签
function choose_getAllCustomerTags() {
  $.ajax({
    type : "POST",
    url : '${ctx}/customer/core/tag/getInstanceTypes',
    dataType : "json",
    cache : false,
    success : function(success) {
      var data = success;
      var html = "";
      html += "<div class='form-group'>";
      html += "<label for='"
        + ("x")
        + "' class='control-label col-sm-3'><spring:message code='label.choose.instanceType' /></label>";
      html += "<div class='col-sm-8'>";
      for ( var i = 0, size = data.length; i < size; i++) {
        html += "<button class='btn btn-default btn-xs type' value='" + data[i].typeId + "'>"
          + data[i].typeName + "</button>";
      }
      html += "</div>";
      html += "</div>";
      $('#tags_append').append(html);
      $('#tags_append .type').off('click');
      $('#tags_append .type').on('click', function(a, b, c) {
        if ($(this).hasClass("btn-primary")) {
          $(this).removeClass("btn-primary");
          $(this).addClass("btn-default");
          choose_instance_typeId = null;
        } else {
          var btns = $(this).siblings();
          for ( var i = 0; i < btns.length; i++) {
            $(btns[i]).removeClass("btn-primary");
            $(btns[i]).addClass("btn-default");
          }
          $(this).removeClass("btn-default");
          $(this).addClass("btn-primary");
          choose_instance_typeId = $(this).val();
        }
        showInstance();
      });
    }
  });
  $.ajax({
    type : "POST",
    url : '${ctx}/customer/core/tag/getAllTags',
    dataType : "json",
    cache : false,
    success : function(success) {
      var data = success.data;
      var html = "";
      for ( var i = 0; i < data.length; i++) {
        html += "<div class='form-group'>";
        html += "<label for='"
          + ("classify" + i)
          + "' class='control-label col-sm-3'><spring:message code='" + data[i].classify.classifyName + "' /></label>";
        html += "<div class='col-sm-8'>";
        for ( var j = 0; j < data[i].tags.length; j++) {
          html += "<button class='btn btn-default btn-xs tag' value='" + data[i].tags[j].tagId + "'>"
            + data[i].tags[j].tagName + "</button>";
        }
        html += "</div>";
        html += "</div>";
      }
      $('#tags_append').append(html);
      $('#tags_append .tag').off('click');
      $('#tags_append .tag').on('click', function(a, b, c) {
        if ($(this).hasClass("btn-primary")) {
          $(this).removeClass("btn-primary");
          $(this).addClass("btn-default");
          tagIds.remove($(this).val());
        } else {
          var btns = $(this).siblings();
          for ( var i = 0; i < btns.length; i++) {
            $(btns[i]).removeClass("btn-primary");
            $(btns[i]).addClass("btn-default");
            tagIds.remove($(btns[i]).val());
          }
          $(this).removeClass("btn-default");
          $(this).addClass("btn-primary");
          tagIds.push($(this).val());
        }
        showInstance();
      });
    }
  });
  //choose_initInstanceListOrView();
}

function getChooseInstanceTree(){
  $('#choose_instanceTree').jstree('destroy');
  $('#choose_instanceTree').jstree({
    core : {
      'themes' : {
        'variant' : 'large'
      },
      'data' : {
        "dataType": 'json',
        "url": '${ctx}/customer/core/instance/treeByOrganization',
        "data":function(node){
          return {
            "id" : node.id,
            "organizationId":organization_id
          };
        }
      }
    },
    'plugins' : ["wholerow", "checkbox", "sort" ],
    'checkbox' : {
      'keep_selected_style' : false,//是否默认选中
      'three_state' : false,//父子级别级联选择
      'tie_selection' : false
    },
  }).bind('select_node.jstree',function(e, data){
    //var node = data.node;
  });
}

function getChooseInstanceTable(optional){
  var hasChildren = true;
  var tagNum = tagIds.length;
  if(choose_instance_typeId!=null){
    tagNum += 1;
  }
  if(choose_type==1 && tagNum == 0){
    hasChildren = false;
  }
  var html = "<table id='choose_instanceTable' data-click-to-select='true' data-show-header='false'>";
  html += "<thead><tr>";
  if(optional){
    html += '<th data-checkbox="true" class=""><spring:message code="label.traffic.instanceName" /></th>';
  }
  var params = {
    organizationId : organization_id,
    typeId : choose_instance_typeId,
    tagIds : tagIds.join(),
    hasChildren : true,
  };
  var url = '${ctx}/customer/core/tag/screenInstance';
  html += '<th data-field="instanceTitle" class=""><spring:message code="label.traffic.instanceName" /></th>';
  html += '<th data-field="instanceCode" class=""><spring:message code="label.traffic.instanceCode" /></th>';
  html += "</tr></thead>";
  html += "</table>";
  $('#choose_instanceView').html(html);
  $('#choose_instanceTable').bootstrapTable('destroy', null);
  $('#choose_instanceTable').bootstrapTable({
    url : url,
    queryParams : params,
    silent : true,
    /* url: '${ctx}/customer/core/tag/screenInstance',         //请求后台的URL（*）
          method: 'POST',
          queryParamsType : "json",
          queryParams:params, */
    search : optional,//是否显示右上角的搜索框
    pagination: true,
    showColumns : false, //显示隐藏列
    showExport : false, //是否显示导出
    smartDisplay : false,
    height : 500,
    //icons:"glyphicon-export icon-share",
    stickyHeader : true,//滚动锁住表头
    pageNumber : 1, //初始化加载第一页，默认第一页
    pageSize : 10, //每页的记录行数（*）
    pageList : [ 10 ], //可供选择的每页的行数（*）
  });
  $('#choose_instanceTable').bootstrapTable('hideColumn', 'instanceCode');
  $('#choose_instanceView .search').hide();
  $('#choose_search').hide();
  if(optional){
    $('#choose_search').show();
    var v = $('#choose_search').val();
    if(v==null||v==''){
      if(tagIds.length==0 && choose_instance_typeId== null){
        $('#choose_treeView').show();
        $('#choose_instanceView').hide();
      }else{
        $('#choose_treeView').hide();
        $('#choose_instanceView').show();
      }
    }
    $('#choose_instanceTable').bootstrapTable('resetSearch', v);
  }
  /* $.ajax({
          type : 'post',
          url : '${ctx}/customer/core/tag/screenInstance',
          data : {
              organizationId : organization_id,
              typeId : choose_instance_typeId,
              tagIds : tagIds.join(),
              hasChildren : hasChildren
          },
          datatype : 'json',
          success : function(result) {
              table_size = result.length;
              var data = result;
              var tag_size = tagIds.length;

          }
      }); */
}

//初始化实体列表
function showInstance() {
  var tagNum = tagIds.length;
  if(choose_instance_typeId!=null){
    tagNum += 1;
  }
  if(tagNum>0){//有选择标签的情况下
    if(choose_type==0){//选择方式为实体
      getChooseInstanceTable(true);
    }else{//选择方式为区域
      getChooseInstanceTable(false);
    }
    $('#choose_treeView').hide();
    $('#choose_instanceView').show();
  }else{//未选择标签的情况下
    if(choose_type==0){//选择方式为实体
      getChooseInstanceTree();
      getChooseInstanceTable(true);
      $('#choose_treeView').show();
      $('#choose_instanceView').hide();
    }else{//选择方式为区域
      getChooseInstanceTable(false);
      $('#choose_treeView').hide();
      $('#choose_instanceView').show();
    }
  }
}

$('#choose_search').bind('input propertychange', function(e) {
  var v = $('#choose_search').val();
  if(v==null || v==''){
    if(tagIds.length==0 && choose_instance_typeId== null){
      $('#choose_treeView').show();
      $('#choose_instanceView').hide();
    }else{
      $('#choose_treeView').hide();
      $('#choose_instanceView').show();
    }
  }else{
    $('#choose_treeView').hide();
    $('#choose_instanceView').show();
    $('#choose_instanceTable').bootstrapTable('resetSearch', v);
  }
});
/*
   *  方法:Array.remove(dx)
   *  功能:根据元素值删除数组元素.
   *  参数:元素值
   *  返回:在原数组上修改数组
   */
Array.prototype.indexOf = function(val) {
  for ( var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      return i;
    }
  }
  return -1;
};

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
