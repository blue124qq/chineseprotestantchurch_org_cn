/**
 * Created by Administrator on 2017/9/4.
 */

new function (){
    var _self = this;
    _self.width = 640;//设置默认最大宽度
    _self.fontSize = 100;//默认字体大小
    _self.widthProportion = function(){ var p = (document.body&&document.body.clientWidth||document.getElementsByTagName("html")[0].offsetWidth)/_self.width;return p>1?1:p<0.5?0.5:p;};
    _self.changePage = function(){
        document.getElementsByTagName("html")[0].setAttribute("style","font-size:"+_self.widthProportion()*_self.fontSize+"px !important");
        console.log(   document.getElementsByTagName("html")[0].style.fontSize)
    }
    _self.changePage();
    window.addEventListener("resize",function(){_self.changePage();},false);
};

/**
 *  ajax提交函数
 */
function ajaxFun(url,data,callback,method)
{
    method = method || 'get';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type : method,
        dataType : "JSON",
        url : url,
        data : data,
        success : function(res){
            if(typeof callback == "function"){
                callback(res);
            }
        }
    });
}

