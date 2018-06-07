<template>
  <div class="canvas-body">
    <div class="drawDiv">
      <canvas
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseout="handleMouseOut"
        ref="draw"
        id="canvas"
        :width="width"
        :height="height">
      </canvas>
      <div>
        <button @click="handleCancel" class="btn btn-danger">{{$t('m.cancel')}}</button>
        <button @click="redraw" class="btn btn-info">{{$t('m.redraw')}}</button>
        <button @click="savePic" class="btn btn-success">{{$t('m.save')}}</button>
      </div>
    </div>
  </div>
</template>

<script>

    export default {
      data() {
        return {
          port:this.getPort,
          canvas:null,
          ctx:null,
          last:null,
          width:600,
          height:400
        }
      },
      props:{
        url:""
      },
      mounted() {
        //console.log("编辑器",this.url)
        this.canvas=this.$refs.draw;
        this.ctx=this.canvas.getContext('2d');
        this.ctx.strokeStyle="red";
        this.ctx.fillStyle="red";
        this.getBase64(this.url)
      },
      methods:{
        // 鼠标按下
        handleMouseDown(){
          // 在鼠标按下后触发鼠标移动事件
          this.canvas.onmousemove = this.move;
        },
        // 鼠标移动函数
        move(e){
          // //console.log(e.offsetX);
          if(this.last != null){
            this.ctx.beginPath();
            this.ctx.moveTo(this.last[0],this.last[1]);
            this.ctx.lineTo(e.offsetX,e.offsetY);
            this.ctx.stroke();
          }
          // 第一次触发这个函数，只做一件事，把当前 鼠标的 x , y 的位置记录下来
          // 做下一次 线段的 起始点。
          this.last = [e.offsetX,e.offsetY];
        },
        // 鼠标抬起取消鼠标移动的事件
        handleMouseUp(){
          this.canvas.onmousemove = null;
          this.last = null;
        },
        // 鼠标移出画布时 移动事件也要取消。
        handleMouseOut(){
          this.canvas.onmousemove = null;
          this.last = null;
        },
        redraw(){
          this.ctx.clearRect(0,0,canvas.width,canvas.height);
          this.getBase64(this.url)
        },
        savePic(){
          var saveImage = this.canvas.toDataURL('image/png');
          $.ajax({
            type : 'post',
            url : this.port+'/register/uploadBaseFile',
            data : {
              file:saveImage
            },
            success :(res)=>{
              //console.log(res)
              this.$emit('picEditorEvent',res);
            }
          });
        },
      //  取消
        handleCancel(){
          this.$emit('picEditorEvent',false);
        },
        getBase64(img){
          var canvas=this.canvas;
          function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
            var ctx = canvas.getContext("2d");
            ctx.strokeStyle="red";
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL();
            return dataURL;
          }
          var image = new Image();
          image.crossOrigin = '';
          image.src = img;
          var deferred=$.Deferred();
          if(img){
            image.onload =function (){
              deferred.resolve(getBase64Image(image));//将base64传给done上传处理
            }
            return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
          }
        }
      }
    }
</script>

<style scoped>
  .canvas-body{
    position:relative;
    cursor:crosshair;
  }
  canvas{
    border:1px solid gray;
  }
  .drawDiv{
    width:600px;
    height:400px;
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin:auto;
  }
</style>
