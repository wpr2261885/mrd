<template>
  <div>
    <!--<div class="video" id="CuPlayer">-->
      <!--<b>-->
        <!--<img src="static/cuPlayerV4/player/images/loading.gif"  /> 网页视频播放器加载中，请稍后...-->
        <!--<a href="http://www.cuplayer.com/cuplayer" target="_blank">点此升级&gt;&gt;</a>-->
      <!--</b>-->
    <!--</div>-->
    <div>
      <video class="video" id="myPlayer" controls playsInline webkit-playsinline autoplay>
        <source :src="url" />
      </video>
    </div>
  </div>
</template>

<script>

  // import "../../assets/plugins/cuPlayerV4/player/js/swfobject"

    export default {
      data(){
        return {

        }
      },
      props:{
        url:""
      },
      mounted(){
        // this.player();
        this.player1();
      },
      methods:{
//        酷播播放器
//         player(){
//           function getLight(pars){if(pars=="open"){close_light(this)}else{close_light(this)}};function thisMovie(movieName){if(navigator.appName.indexOf("Microsoft")!=-1){return window[movieName]}else{return document[movieName]}}
//
//           /**
//            * SWFObject v1.4.4: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
//            *
//            * SWFObject is (c) 2006 Geoff Stearns and is released under the MIT License:
//            * http://www.opensource.org/licenses/mit-license.php
//            *
//            * **SWFObject is the SWF embed script formerly known as FlashObject. The name was changed for
//            *   legal reasons.
//            */
//           if(typeof deconcept=="undefined"){var deconcept=new Object();}
//           if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}
//           if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}
//           deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a,_b){if(!document.getElementById){return;}
//             this.DETECT_KEY=_b?_b:"detectflash";
//             this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);
//             this.params=new Object();
//             this.variables=new Object();
//             this.attributes=new Array();
//             if(_1){this.setAttribute("swf",_1);}
//             if(id){this.setAttribute("id",id);}
//             if(w){this.setAttribute("width",w);}
//             if(h){this.setAttribute("height",h);}
//             if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}
//             this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();
//             if(c){this.addParam("bgcolor",c);}
//             var q=_8?_8:"high";
//             this.addParam("quality",q);
//             this.setAttribute("useExpressInstall",_7);
//             this.setAttribute("doExpressInstall",false);
//             var _d=(_9)?_9:window.location;
//             this.setAttribute("xiRedirectUrl",_d);
//             this.setAttribute("redirectUrl","");
//             if(_a){this.setAttribute("redirectUrl",_a);}};
//           deconcept.SWFObject.prototype={setAttribute:function(_e,_f){
//               this.attributes[_e]=_f;
//             },getAttribute:function(_10){
//               return this.attributes[_10];
//             },addParam:function(_11,_12){
//               this.params[_11]=_12;
//             },getParams:function(){
//               return this.params;
//             },addVariable:function(_13,_14){
//               this.variables[_13]=_14;
//             },getVariable:function(_15){
//               return this.variables[_15];
//             },getVariables:function(){
//               return this.variables;
//             },getVariablePairs:function(){
//               var _16=new Array();
//               var key;
//               var _18=this.getVariables();
//               for(key in _18){_16.push(key+"="+_18[key]);}
//               return _16;},getSWFHTML:function(){var _19="";
//               if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){
//                 if(this.getAttribute("doExpressInstall")){
//                   this.addVariable("MMplayerType","PlugIn");}
//                 _19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\"";
//                 _19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";
//                 var _1a=this.getParams();
//                 for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}
//                 var _1c=this.getVariablePairs().join("&");
//                 if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";
//               }else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");}
//                 _19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\">";
//                 _19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";
//                 var _1d=this.getParams();
//                 for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}
//                 var _1f=this.getVariablePairs().join("&");
//                 if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}
//               return _19;
//             },write:function(_20){
//               if(this.getAttribute("useExpressInstall")){
//                 var _21=new deconcept.PlayerVersion([6,0,65]);
//                 if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){
//                   this.setAttribute("doExpressInstall",true);
//                   this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));
//                   document.title=document.title.slice(0,47)+" - Flash Player Installation";
//                   this.addVariable("MMdoctitle",document.title);}}
//               if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){
//                 var n=(typeof _20=="string")?document.getElementById(_20):_20;
//                 n.innerHTML=this.getSWFHTML();return true;
//               }else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}
//               return false;}};
//           deconcept.SWFObjectUtil.getPlayerVersion=function(){
//             var _23=new deconcept.PlayerVersion([0,0,0]);
//             if(navigator.plugins&&navigator.mimeTypes.length){
//               var x=navigator.plugins["Shockwave Flash"];
//               if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}
//             }else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}
//             catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
//               _23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}
//             catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}
//             catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}}
//             return _23;};
//           deconcept.PlayerVersion=function(_27){
//             this.major=_27[0]!=null?parseInt(_27[0]):0;
//             this.minor=_27[1]!=null?parseInt(_27[1]):0;
//             this.rev=_27[2]!=null?parseInt(_27[2]):0;
//           };
//           deconcept.PlayerVersion.prototype.versionIsValid=function(fv){
//             if(this.major<fv.major){return false;}
//             if(this.major>fv.major){return true;}
//             if(this.minor<fv.minor){return false;}
//             if(this.minor>fv.minor){return true;}
//             if(this.rev<fv.rev){
//               return false;
//             }return true;};
//           deconcept.util={getRequestParameter:function(_29){
//               var q=document.location.search||document.location.hash;
//               if(q){var _2b=q.substring(1).split("&");
//                 for(var i=0;i<_2b.length;i++){
//                   if(_2b[i].substring(0,_2b[i].indexOf("="))==_29){
//                     return _2b[i].substring((_2b[i].indexOf("=")+1));}}}
//               return "";}};
//           deconcept.SWFObjectUtil.cleanupSWFs=function(){if(window.opera||!document.all){return;}
//             var _2d=document.getElementsByTagName("OBJECT");
//             for(var i=0;i<_2d.length;i++){_2d[i].style.display="none";for(var x in _2d[i]){
//               if(typeof _2d[i][x]=="function"){_2d[i][x]=function(){};}}}};
//           deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};
//             __flash_savedUnloadHandler=function(){};
//             if(typeof window.onunload=="function"){
//               var _30=window.onunload;
//               window.onunload=function(){
//                 deconcept.SWFObjectUtil.cleanupSWFs();_30();};
//             }else{window.onunload=deconcept.SWFObjectUtil.cleanupSWFs;}};
//           if(typeof window.onbeforeunload=="function"){
//             var oldBeforeUnload=window.onbeforeunload;
//             window.onbeforeunload=function(){
//               deconcept.SWFObjectUtil.prepUnload();
//               oldBeforeUnload();};
//           }else{window.onbeforeunload=deconcept.SWFObjectUtil.prepUnload;}
//           if(Array.prototype.push==null){
//             Array.prototype.push=function(_31){
//               this[this.length]=_31;
//               return this.length;};}
//           var getQueryParamValue=deconcept.util.getRequestParameter;
//           var FlashObject=deconcept.SWFObject;
//           var SWFObject=deconcept.SWFObject;
//
//           var so = new SWFObject("static/cuPlayerV4/player/player.swf","myCuPlayer","700","420","9","#000000");
//           so.addParam("allowfullscreen","true");
//           so.addParam("allowscriptaccess","always");
//           so.addParam("wmode","opaque");
//           so.addParam("quality","high");
//           so.addParam("salign","lt");
// //播放器配置文件-----------------------------
//           so.addVariable("JcScpFile","static/cuPlayerV4/player/CuSunV4set.xml"); //配置文件地址
// //视频文件及略缩图--------------------------
//           so.addVariable("JcScpServer","rtmp://rtmp.open.ys7.com/openlive"); //您的rtmp流媒体服务器地址
//           so.addVariable("JcScpVideoPath","44b8f51c20d449248fa48f0c6fb461b4.hd"); //流名称
//           so.addVariable("JcScpImg","https://www.meirenji.cn/web_file/images/logo.png"); //视频缩略图
// //so.addVariable("JcScpVideoPathHD","http://demo.cuplayer.com/file/test.mp4"); //高清视频地址
// //so.addVariable("JcScpImg","images/startpic.jpg"); //视频图片
//           so.addVariable("JcScpAutoPlay","yes"); //是否自动播放
//           so.addVariable("JcScpStarTime","0"); //起始时间点(暂未启用)
//           so.addVariable("JcScpEndTime","0"); //结束时间点
//           so.addVariable("JcScpCuePointInfo",""); //提示点信息
//           so.addVariable("JcScpCuePointTime",""); //提示点秒数值
// //-前置Flash广告-----------------------------
//           so.addVariable("ShowJcScpAFront","no"); //是否显示前置广告
//           so.addVariable("JcScpCountDownsPosition","top-left"); //倒计时位置
//           so.addVariable("JcScpCountDowns","5"); //广告倒计时位置
//           so.addVariable("JcScpAFrontW","700"); //前置广告宽度
//           so.addVariable("JcScpAFrontH","420"); //前置广告宽度
//           so.addVariable("JcScpAFrontPath","other/a730x454_01.jpg|other/a730x454_02.jpg"); //前置广告地址
//           so.addVariable("JcScpAFrontLink","http://www.cuplayer.com/CuPlayer/link/L011.html|http://www.cuplayer.com/CuPlayer/link/L012.html"); //前置广告链接
// //-视频广告参数-----------------------------
//           so.addVariable("ShowJcScpAVideo","no"); //是否显示前置视频广告
// //so.addVariable("JcScpAVideoServer","rtmp://www.yoursite.com/vod"); //前置视频广告服务器
//           so.addVariable("JcScpAVideoPath","http://promotion.geely.com/xindihao/media/video1.mp4|http://promotion.geely.com/xindihao/media/video2.mp4"); //前置视频广告地址
//           so.addVariable("JcScpAVideoLink","http://www.cuplayer.com/CuPlayer/link/L021.html|http://www.cuplayer.com/CuPlayer/link/L022.html"); //前置视频广告链接
// //-暂停广告参数-----------------------------
//           so.addVariable("ShowJcScpAPause","no"); //是否显示暂停广告
//           so.addVariable("JcScpAPauseW","300"); //暂停广告地址
//           so.addVariable("JcScpAPauseH","250"); //暂停广告高度
//           so.addVariable("JcScpAPausePath","other/a300x250_01.jpg|other/a300x250_02.jpg"); //暂停广告地址
//           so.addVariable("JcScpAPauseLink","http://www.cuplayer.com/CuPlayer/link/L031.html|http://www.cuplayer.com/CuPlayer/link/L032.html"); //暂停广告链接
// //-角标广告参数-----------------------------
//           so.addVariable("ShowJcScpACorner","no"); //是否显示角标广告
//           so.addVariable("JcScpACornerW","85"); //角标广告宽度
//           so.addVariable("JcScpACornerH","50"); //角标广告高度
//           so.addVariable("JcScpACornerPath","other/a90x50_01.swf|other/a90x50_01.swf"); //角标广告地址
//           so.addVariable("JcScpACornerPosition","bottom-right"); //角标广告位置
//           so.addVariable("JcScpACornerLink","http://www.cuplayer.com/CuPlayer/link/L041.html|http://www.cuplayer.com/CuPlayer/link/L042.html"); //角标广告链接
// //-后置广告参数-----------------------------
//           so.addVariable("ShowJcScpAEnd","no"); //是否显示后置广告
//           so.addVariable("JcScpAEndW","400"); //后置广告宽度
//           so.addVariable("JcScpAEndH","300"); //后置广告高度
//           so.addVariable("JcScpAEndPath","other/a400x300_01.swf|other/a400x300_01.swf"); //后置广告地址
//           so.addVariable("JcScpAEndLink","http://www.cuplayer.com/CuPlayer/link/L051.html|http://www.cuplayer.com/CuPlayer/link/L051.html"); //后置广告链接
// //-滚动文字广告参数-----------------------------
//           so.addVariable("ShowJcScpAMoveText","yes"); //是否滚动文字广告
// //-----------------------------------------
//           so.addVariable("JcScpSharetitle","标题信息"); //视频标题信息
//           so.write("CuPlayer");
//         },
//        萤石播放器
        player1(){
          /**
           * ezui 1.3
           */
          ( function( global, factory ) {

            "use strict";

            if ( typeof module === "object" && typeof module.exports === "object" ) {
              module.exports = global.document ?
                factory( global, true ) :
                function( w ) {
                  if ( !w.document ) {
                    throw new Error( "EZUIPlayer requires a window with a document" );
                  }
                  return factory( w );
                };
            } else {
              factory( global );
            }

// Pass this if window is not defined yet
          } )( typeof window !== "undefined" ? window : this, function( window, noGlobal ){

            /**
             * @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
             */
            !function(a,b){function c(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function d(){var a=t.elements;return"string"==typeof a?a.split(" "):a}function e(a,b){var c=t.elements;"string"!=typeof c&&(c=c.join(" ")),"string"!=typeof a&&(a=a.join(" ")),t.elements=c+" "+a,j(b)}function f(a){var b=s[a[q]];return b||(b={},r++,a[q]=r,s[r]=b),b}function g(a,c,d){if(c||(c=b),l)return c.createElement(a);d||(d=f(c));var e;return e=d.cache[a]?d.cache[a].cloneNode():p.test(a)?(d.cache[a]=d.createElem(a)).cloneNode():d.createElem(a),!e.canHaveChildren||o.test(a)||e.tagUrn?e:d.frag.appendChild(e)}function h(a,c){if(a||(a=b),l)return a.createDocumentFragment();c=c||f(a);for(var e=c.frag.cloneNode(),g=0,h=d(),i=h.length;i>g;g++)e.createElement(h[g]);return e}function i(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return t.shivMethods?g(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+d().join().replace(/[\w\-:]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(t,b.frag)}function j(a){a||(a=b);var d=f(a);return!t.shivCSS||k||d.hasCSS||(d.hasCSS=!!c(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),l||i(a,d),a}var k,l,m="3.7.3",n=a.html5||{},o=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,p=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,q="_html5shiv",r=0,s={};!function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",k="hidden"in a,l=1==a.childNodes.length||function(){b.createElement("a");var a=b.createDocumentFragment();return"undefined"==typeof a.cloneNode||"undefined"==typeof a.createDocumentFragment||"undefined"==typeof a.createElement}()}catch(c){k=!0,l=!0}}();var t={elements:n.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:m,shivCSS:n.shivCSS!==!1,supportsUnknownElements:l,shivMethods:n.shivMethods!==!1,type:"default",shivDocument:j,createElement:g,createDocumentFragment:h,addElements:e};a.html5=t,j(b),"object"==typeof module&&module.exports&&(module.exports=t)}("undefined"!=typeof window?window:this,document);

            /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */
            if("document" in self){if(!("classList" in document.createElement("_"))){(function(j){"use strict";if(!("Element" in j)){return}var a="classList",f="prototype",m=j.Element[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.getAttribute("class")||""),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.setAttribute("class",this.toString())}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(){var s=arguments,r=0,p=s.length,q,o=false;do{q=s[r]+"";if(g(this,q)===-1){this.push(q);o=true}}while(++r<p);if(o){this._updateClassName()}};e.remove=function(){var t=arguments,s=0,p=t.length,r,o=false,q;do{r=t[s]+"";q=g(this,r);while(q!==-1){this.splice(q,1);o=true;q=g(this,r)}}while(++s<p);if(o){this._updateClassName()}};e.toggle=function(p,q){p+="";var o=this.contains(p),r=o?q!==true&&"remove":q!==false&&"add";if(r){this[r](p)}if(q===true||q===false){return q}else{return !o}};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))}else{(function(){var b=document.createElement("_");b.classList.add("c1","c2");if(!b.classList.contains("c2")){var c=function(e){var d=DOMTokenList.prototype[e];DOMTokenList.prototype[e]=function(h){var g,f=arguments.length;for(g=0;g<f;g++){h=arguments[g];d.call(this,h)}}};c("add");c("remove")}b.classList.toggle("c3",false);if(b.classList.contains("c3")){var a=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(d,e){if(1 in arguments&&!this.contains(d)===!e){return e}else{return a.call(this,d)}}}b=null}())}};


            Date.prototype.Format = function (fmt) { //author: meizz
              var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
              };
              if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
              for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
              return fmt;
            };


            var Domain = 'https://open.ys7.com';
            var logDomain = 'https://log.ys7.com/statistics.do';

            var ckplayerJS = Domain + '/sdk/js/1.3/ckplayer/ckplayer.js';
            var ckplayerSWF = Domain + '/sdk/js/1.3/ckplayer/ckplayer.swf';
            var m3u8SWF = Domain + '/sdk/js/1.3/ckplayer/m3u8.swf';
            var hlsJS = Domain + '/sdk/js/1.3/hls.min.js';


            // 当前页面是否是https协议
            var isHttps = location.protocol === 'https:' ? true : false;
            // 是否为移动端
            var isMobile = !!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios|SymbianOS)/i);
            var testVideo = document.createElement('video');
            // 是否支持video标签和addEventListener方法（主要为了区别ie8）
            var isModernBrowser = !!testVideo.canPlayType && !!window.addEventListener;
            // 是否能使用video原生播放hls
            var isNativeSupportHls = isModernBrowser && testVideo.canPlayType('application/vnd.apple.mpegURL');
            // 是否能使用hls.js播放
            var isSupportHls = false;
            // 是否使用flash
            var useFlash = false;

            // 本地信息上报
            var LOCALINFO = 'open_netstream_localinfo';
            // 预览主表上报
            var PLAY_MAIN = 'open_netstream_play_main';

            function dclog(obj){
              var logObj = {
                Ver: 'v.1.3.0',
                PlatAddr: 'open.ys7.com',
                ExterVer: 'Ez.1.3.0',
                CltType: 102,
                StartTime: (new Date()).Format('yyyy-MM-dd hh:mm:ss.S'),  // 每个日志包含当前的时间
                OS: navigator.platform
              }
              for(var i in obj){
                logObj[i] = obj[i];
              }

              var tempArray = [];
              for(var j in logObj){
                tempArray.push(j + '=' + logObj[j]);
              }
              var params = '?' + tempArray.join('&');
              // 上报一次本地统计信息
              var img = new Image();
              img.src = logDomain + params;
            }

            // 上报一次本地信息
            dclog({
              systemName: LOCALINFO
            });

            var RTMP_REG = /^rtmp/;
            var HLS_REG = /\.m3u8/;

            // 获取元素样式
            function getStyle(el){
              return window.getComputedStyle
                ? window.getComputedStyle(el, null)
                : el.currentStyle;
            }

            // 加载js
            function addJs(filename, callback){
              var oJs = document.createElement("script");
              oJs.setAttribute("src", filename);
              oJs.onload = callback;
              document.getElementsByTagName("head")[0].appendChild(oJs);
            }


            var EZUIPlayer = function(videoId){
              if(!isModernBrowser){
                throw new Error('不支持ie8等低版本浏览器');
                return;
              }
              if(typeof videoId !== 'string'){
                throw new Error('EZUIPlayer requires parameter videoId');
              }
              this.videoId = videoId;
              this.video = document.getElementById(videoId);
              if(!this.video){
                throw new Error('EZUIPlayer requires parameter videoId');
              }
              this.opt = {};
              this.opt.sources = [];
              var sources = this.video.getElementsByTagName('source');
              // 转为数组对象，不受removeChild影响
              sources = Array.prototype.slice.call(sources, 0);

              if(this.video.src){
                // 移动端删除rtmp地址
                if(isMobile && RTMP_REG.test(this.video.src)){
                  this.video.removeAttribute('src');
                  this.video.load();
                }else{
                  this.opt.sources.push(this.video.src);
                }
              }

              var l = sources.length;
              if(l > 0){
                for(var i = 0; i < l; i++){
                  // 移动端删除rtmp地址
                  if(isMobile && RTMP_REG.test(sources[i].src)){
                    this.video.removeChild(sources[i]);
                  }else{
                    this.opt.sources.push(sources[i].src);
                  }
                }
              }
              if(this.opt.sources.length < 1){
                throw new Error('no source found in video tag.');
              }
              this.opt.cur = 0;


              // 事件存储
              this.handlers = {};

              this.opt.poster = this.video.poster;
              var videoStyle = getStyle(this.video);
              var width = this.video.width;
              var height = this.video.height;
              if(width){
                this.opt.width = width;
                if(height){
                  this.opt.height = height;
                }else{
                  this.opt.height = 'auto';
                }
                this.log('video width:' + this.opt.width + ' height:' + this.opt.height);
              }else{
                this.opt.width = videoStyle.width;
                this.opt.height = videoStyle.height;
                this.log('videoStyle.width:' + videoStyle.width + ' wideoStyle.height:' + videoStyle.height);
              }
              this.opt.parentId = videoId;
              this.opt.autoplay = this.video.autoplay ? true : false;
              this.log('autoplay:' + this.video.autoplay);

              this.tryPlay();
              this.initTime = (new Date()).getTime();

              this.on('play', function(){
                // 上报播放成功信息
                dclog({
                  systemName: PLAY_MAIN,
                  playurl: this.opt.currentSource,
                  Time: (new Date()).Format('yyyy-MM-dd hh:mm:ss.S'),
                  Enc: 0,  // 0 不加密 1 加密
                  PlTp: 1,  // 1 直播 2 回放
                  Via: 2,  // 2 服务端取流
                  ErrCd: 0,
                  Cost: (new Date()).getTime() - this.initTime  // 毫秒数
                });
              });
              this.retry = 2;
              this.on('error', function(){
                dclog({
                  systemName: PLAY_MAIN,
                  playurl: this.opt.currentSource,
                  cost: -1,
                  ErrCd: -1
                });
              });

            };

            // 事件监听
            EZUIPlayer.prototype.on = function(eventName, callback){
              if(typeof eventName !== 'string' || typeof callback !== 'function'){
                return;
              }
              if(typeof this.handlers[eventName] === 'undefined'){
                this.handlers[eventName] = [];
              }
              this.handlers[eventName].push(callback);
            };

            // 事件触发
            EZUIPlayer.prototype.emit = function(){
              if(this.handlers[arguments[0]] instanceof Array){
                var handlers = this.handlers[arguments[0]];
                var l = handlers.length;
                for(var i = 0; i < l; i++){
                  handlers[i].apply(this, Array.prototype.slice.call(arguments, 1));
                }
              }
            };

            // 尝试播放
            EZUIPlayer.prototype.tryPlay = function(){
              this.opt.currentSource = this.opt.sources[this.opt.cur];
              if(!this.opt.currentSource){
                this.log('未找到合适的播放URL');
                return;
              }
              var me = this;
              // 如果是HLS地址
              if(/\.m3u8/.test(this.opt.currentSource)){
                // 如果是手机浏览器环境,或者原生支持HLS播放的,直接使用video标签播放
                // 否则尝试使用hls.js播放，
                // 最后使用flash
                if(isMobile || isNativeSupportHls){
                  this.log('使用原生video');
                  this.video.style.heght = this.opt.height = Number(this.opt.width.replace(/px$/g, '')) * 9 / 16 + 'px';
                  this.initVideoEvent();
                }else{
                  if(isHttps){
                    addJs(ckplayerJS, function(){
                      me.initCKPlayer();
                    });
                  }else{
                    addJs(hlsJS, function(){
                      isSupportHls = Hls.isSupported();
                      if(isSupportHls){
                        me.log('使用hls.js');
                        me.initHLS();
                      }else{
                        useFlash = true;
                        me.log('2 使用flash');
                        addJs(ckplayerJS, function(){
                          me.initCKPlayer();
                        });
                      }
                    });
                  }
                }
              }else if(/^rtmp:/.test(this.opt.currentSource)){
                if(isMobile){
                  this.opt.cur++;
                  this.tryPlay();
                  return;
                }else{
                  addJs(ckplayerJS, function(){
                    me.initCKPlayer();
                  });
                }
              }
            };

            // 初始化hls.js
            EZUIPlayer.prototype.initHLS = function(){
              var me = this;
              var hls = new Hls({defaultAudioCodec: 'mp4a.40.2'}); // 萤石设备默认使用 AAC LC 音频编码
              hls.loadSource(this.opt.currentSource);
              hls.attachMedia(this.video);
              hls.on(Hls.Events.MANIFEST_PARSED, function(){
                if(me.opt.autoplay){
                  me.video.play();
                }
                me.initVideoEvent();
              });
              hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                  switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                      // try to recover network error
                      //console.log("fatal network error encountered, try to recover");
                      hls.startLoad();
                      break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                      //console.log("fatal media error encountered, try to recover");
                      hls.recoverMediaError();
                      break;
                    default:
                      // cannot recover
                      hls.destroy();
                      break;
                  }
                }
              });

              this.hls = hls;
            };

            // 日志
            EZUIPlayer.prototype.log = function(msg){
              this.emit('log', msg);
            };

            // 初始化ckplayer
            EZUIPlayer.prototype.initCKPlayer = function(){
              this.log('ckplayer初始化');
              var me = this;
              var events = {
                'play': function(){me.emit('play')},
                'pause': function(){me.emit('pause')},
                'error': function(){me.emit('error')}
              };
              window.ckplayer_status = function(){
                me.log(arguments);
                events[arguments[0]] && events[arguments[0]]();
              };

              // 新增相同id的div标签，然后删除video标签
              this.videoFlash = document.createElement('DIV');
              this.video.parentNode.replaceChild(this.videoFlash, this.video);
              this.video = this.videoFlash;
              this.videoFlash.id = this.opt.parentId;
              var flashvars = null;
              // 如果rtmp服务器环境设置了视频暂停则断开链接
              // 需要修改ckplayer.js  setup参数第30个值
              // 在播放暂停后点击播放是否采用重新链接的方式
              if(/^rtmp/.test(this.opt.currentSource)){
                flashvars = {
                  f: this.opt.currentSource,
                  c: 0,
                  p: this.opt.autoplay ? 1 : 0,
                  i: this.opt.poster,
                  lv: 1,
                  loaded: 'loadHandler'
                };
              }else if(/\.m3u8/.test(this.opt.currentSource)){
                flashvars = {
                  s:4,  // 4-使用swf视频流插件播放
                  f:m3u8SWF,
                  a: this.opt.currentSource,
                  c: 0,  // 0-使用ckplayer.js的配置 1-使用ckplayer.xml的配置
                  lv:1, // 1-直播 0-普通方式
                  p: this.opt.autoplay ? 1 : 0,   // 1-默认播放 0-默认暂停
                  i: this.opt.poster,
                  loaded: 'loadHandler'
                };
              }else{
                flashvars = {
                  f: this.opt.currentSource,
                  c: 0,
                  p: 1,
                  loaded: 'loadHandler'
                };
              }
              var params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always',wmode:'transparent'};
              this.flashId = this.opt.parentId + 'flashId';
              CKobject.embedSWF(ckplayerSWF,this.opt.parentId,this.flashId,this.opt.width,this.opt.height,flashvars,params);
            };

            EZUIPlayer.prototype.initVideoEvent = function(){
              var me = this;
              var EVENT = {
                'loadstart': function(e){
                  me.log('loadstart...当浏览器开始查找音频/视频时...');
                  me.emit('loadstart', e);
                },
                'durationchange': function(e){
                  me.log('durationchange...当音频/视频的时长已更改时...');
                  me.emit('durationchange', e);
                },
                'loadedmetadata': function(e){
                  me.log('loadedmetadata...当浏览器已加载音频/视频的元数据时...');
                  me.emit('loadedmetadata', e);
                },
                'loadeddata': function(e){
                  me.log('loadeddata...当浏览器已加载音频/视频的当前帧时...');
                  me.emit('loadeddata', e);
                },
                'progress': function(e){
                  me.log('progress...当浏览器正在下载音频/视频时...');
                  me.emit('progress', e);
                },
                'canplay': function(e){
                  me.log('canplay...当浏览器可以播放音频/视频时...');
                  me.emit('canplay', e);
                },
                'canplaythrough': function(e){
                  me.log('canplaythrough...当浏览器可在不因缓冲而停顿的情况下进行播放时...');
                  me.emit('canplaythrough', e);
                },
                'abort': function(e){
                  me.log('abort...当音频/视频的加载已放弃时...');
                  me.emit('abort', e);
                },
                'emptied': function(e){
                  me.log('emptied...当目前的播放列表为空时...');
                  me.emit('emptied', e);
                },
                'ended': function(e){
                  me.log('ended...当目前的播放列表已结束时...');
                  me.emit('ended', e);
                },
                'pause': function(e){
                  me.log('pause...当音频/视频已暂停时...');
                  me.emit('pause', e);
                },
                'play': function(e){
                  me.log('play...当音频/视频已开始或不再暂停时...');
                  me.emit('play', e);
                },
                'playing': function(e){
                  me.log('playing...当音频/视频在已因缓冲而暂停或停止后已就绪时...');
                  me.emit('playing', e);
                },
                'ratechange': function(e){
                  me.log('ratechange...当音频/视频的播放速度已更改时...');
                  me.emit('ratechange', e);
                },
                'seeked': function(e){
                  me.log('seeked...当用户已移动/跳跃到音频/视频中的新位置时...');
                  me.emit('seeked', e);
                },
                'seeking': function(e){
                  me.log('seeking...当用户开始移动/跳跃到音频/视频中的新位置时...');
                  me.emit('seeking', e);
                },
                'stalled': function(e){
                  me.log('stalled...当浏览器尝试获取媒体数据，但数据不可用时...');
                  me.emit('stalled', e);
                },
                'suspend': function(e){
                  me.log('suspend...当浏览器刻意不获取媒体数据时...');
                  me.emit('suspend', e);
                  if(me.opt.autoplay){
                    me.video.play();
                  }
                },
                'timeupdate': function(e){
                  //me.log('timeupdate...当目前的播放位置已更改时...');
                  me.emit('timeupdate', e);
                },
                'volumechange': function(e){
                  me.log('volumechange...当音量已更改时...');
                  me.emit('volumechange', e);
                },
                'waiting': function(e){
                  me.log('waiting...当视频由于需要缓冲下一帧而停止...');
                  me.emit('waiting', e);
                },
                'error': function(e){
                  me.log('error...当在音频/视频加载期间发生错误时...');
                  me.emit('error', e);
                }

              };
              for(var i in EVENT){
                this.video.addEventListener( i, EVENT[i], false);
              }

              ios11Hack(this.video);

            };


            EZUIPlayer.prototype.play = function(){
              this.opt.autoplay = true;
              if(!!window['CKobject']){
                CKobject.getObjectById(this.flashId).videoPlay();
              }else if(!!this.video){
                this.video.play();
              }

            };

            EZUIPlayer.prototype.pause = function(){
              this.opt.autoplay = false;
              if(!!window['CKobject']){
                CKobject.getObjectById(this.flashId).videoPause();
              }else if(!!this.video){
                this.video.pause();
              }
            };

            EZUIPlayer.prototype.load = function(){
              if(!!window['CKobject']){
                // flash load
              }else if(!!this.video){
                this.video.load();
              }
            };
            //
            // EZUIPlayer.prototype.remove = function(){
            //
            // };
            //
            // EZUIPlayer.prototype.clear = function(){
            //
            // };
            //
            // // 修改播放地址
            // EZUIPlayer.prototype.changeSource = function(source){
            //
            // };

            // iOS11手机HLS直播在m3u8响应时间过长后不继续请求的hack
            function ios11Hack(video){
              var isloadeddata = false;
              var isPlaying = false;
              var stalledCount = 0;
              video.addEventListener('loadeddata', function(){
                isloadeddata = true;
              }, false);
              video.addEventListener('stalled', function(){
                stalledCount++;
                if(!isPlaying){
                  if(stalledCount >= 2 && !isloadeddata){
                    video.load();
                    video.play();
                    isloadeddata = false;
                    isPlaying = false;
                    stalledCount = 0;
                  }
                }
              }, false);
              video.addEventListener('playing', function(){
                isPlaying = true;
              });
            }


            if ( !noGlobal ) {
              window.EZUIPlayer = EZUIPlayer;
            }
            return EZUIPlayer;
          });

          var player = new EZUIPlayer('myPlayer');
          //直播出错
          player.on('error', function(){
            //console.log('error');
          });
          //直播播放
          player.on('play', function(){
            //console.log('play');
          });
          //直播暂停
          player.on('pause', function(){
            //console.log('pause');
          });
        }
      }
    }
</script>

<style scoped>
  .video { OVERFLOW: hidden; WIDTH: 100%; POSITION: relative}
  .close_light_bg {DISPLAY: none; BACKGROUND: #000; FILTER: alpha(opacity = 95); LEFT: 0px; WIDTH: 100%; POSITION: absolute; TOP: 0px; HEIGHT: 100%; opacity: .95}

  body { padding:10px;}
  div.help { line-height:32px; font-size:14px;}
</style>
