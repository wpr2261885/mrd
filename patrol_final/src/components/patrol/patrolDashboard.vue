<template>
  <div class="body">
    <div class="content-header">
      <h1>{{$t('m.patrolDashboard')}}</h1>
    </div>
    <div class="content">
      <div class="box">
        <h3>{{$t('m.globalOverview')}}</h3>
        <!--全局概览-->
        <div class="row">
          <div class="row-item col-xs-12 col-sm-3">
              <div>
                <p>
                  <span class="redPercent">
                    76.4%
                  </span>
                  <span style="color:#A3ADC2;">
                    12/15
                  </span>
                </p>
                <p>
                  本月巡店计划完成率
                </p>
              </div>
          </div>
          <div class="row-item col-xs-12 col-sm-3">
            <div>
              <p>
                  <span class="redPercent">
                    76.4%
                  </span>
                <span style="color:#A3ADC2;">
                    12/15
                  </span>
              </p>
              <p>
                本月巡店门店平均合格率
              </p>
            </div>
          </div>
          <div class="row-item col-xs-12 col-sm-3">
            <div>
              <p>
                  <span class="redPercent">
                    76.4%
                  </span>
                <span style="color:#A3ADC2;">
                    12/15
                  </span>
              </p>
              <p>
                本月检查类目平均合格率
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="charts-bar col-sm-7 col-xs-12">
            <!--第一部分柱形图-->
            <div id="main" style="height:400px;"></div>
          </div>
          <!--第一部分表格-->
          <div class="table-right col-sm-4 col-xs-12">
            <div class="table-select">
              <label class="is-leaf">{{$t('m.unqualifiedCategory')}}</label>
              <el-select v-model="value" :placeholder="$t('m.pickStore')">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <el-table
              :data="tableData2"
              style="width: 100%;"
              :row-class-name="tableRowClassName">
              <el-table-column
                class="table-title-blue"
                prop="category"
                :label="$t('m.category')">
              </el-table-column>
              <el-table-column
                prop="num"
                align="right"
                :label="$t('m.unqualifiedNum')">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data:function(){
      return {
        tableData2: [{
          category: '衣冠不整',
          num: '1'
        }, {
          category: '衣冠不整',
          num: '1'
        }, {
          category: '衣冠不整',
          num: '1'
        }, {
          category: '衣冠不整',
          num: '1'
        }]
      }
    },
    mounted:function(){
      //画柱形图
      this.drawLine()
    },
    methods:{
      //画柱形图
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(document.getElementById('main'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '本月门店合格率'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          //间隔
          grid: {
            left: '0',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          //横轴
          xAxis: {
            type: 'value',
            //值设置
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %'
            }
          },
          //纵轴
          yAxis: {
            type: 'category',
            //类目值
            data: ['门店10','门店9','门店8','门店7','门店6','门店5','门店4','门店3','门店2','门店1']
          },
          color :"green",
          series: [
            {
              type: 'bar',
              //bar条上设置
              itemStyle:{
                normal:{
                  label:{
                    show:true,
                    formatter:'{c} %'
                  }
                }
              },
              //bar值
              data: [2,12,90,77,80, 20, 40, 60, 80,100]
            }
          ]
        });
      },
      //右边表格row class
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%2 !== 0) {
          return 'even-row';
        } else return '';
      }
    }
  }
</script>

<style scoped>

</style>
