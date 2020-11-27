/**
 * Created by Administrator on 2017/9/4.
 */
 //打印
$(".yd-web-print").click(function(){  
    $("#yd-report-content").printArea();  
});  

var fontSize = 0;
$('.yd-font-change').click(function(){
    if($(this).hasClass('yd-font-add')){
        if(fontSize > 5){
            return false;
        }
        fontSize = fontSize + 1
        var kzise = 1;
    }else if($(this).hasClass('yd-font-calc')){
        if(fontSize < 1){
            return false;
        }
        fontSize = fontSize - 1
        var kzise = -1;
    }

    $('.yd-report-con>*').each(function(pi){
        var tsize = $(this).css('fontSize')
        var theight = $(this).css('lineHeight')
        console.log(tsize+'---'+theight)
        tsize = parseInt(tsize) + kzise
        if( theight != 'normal'){
            theight = parseInt(theight) + kzise
        }
        $(this).css({'fontSize':tsize+'px','lineHeight':theight+'px'}); 
    })
})

$('.yd-select-lan').mouseover(function(){
    $('.yd-select-lan .yd-select-con').show()
}).mouseout(function(){
    $('.yd-select-lan .yd-select-con').hide()
})

$('.yd-sec-nav').hide()
$('.yd-head-nav>ul>li').hover(function () {
    if($(this).find('i img').hasClass('yd-isShow')){
        $(this).find("i img").removeClass('yd-isShow');
        $(this).find('.yd-sec-nav').hide()
    }else{
        $('.yd-head-nav ul li i img').removeClass('yd-isShow')
        $(this).find("i img").addClass('yd-isShow');
        $(this).find('.yd-sec-nav').show()
        $('.yd-sec-nav li').addClass('active')
    }
})

/**
 * 播放统计 +1
 */
$('video').each(function(i){
    var myVideo = $(this)[0];
    var id = $(this).attr('data-id')
    if(id < 1){
        return false;
    }
    myVideo.addEventListener("play", function(){
       UploadIncred(id,'video_num')
      }
    );
})
/**
 * 统计下载次数 +1
 */
function UploadIncred(id,field,table){
    table = table || ''; 
    field = field || ''; 

	$.post('/uplodeincred',{id:id,table:table,field:field},function(res){})
}
/**
 * 收藏
 */
function Collect(id,field){
	$.post('/collect',{id:id,field:field},function(res){
		var icon = res.icon ? res.icon : '';
		layer.msg(res.message,{time:1200,icon:icon},function(){
			if(res.status != 0){
				window.location.reload()
			}
		})
	})
}
function AdvCrement(id){
    $.post('/advcrement',{id:id},function(res){
        // var icon = res.icon ? res.icon : '';
        // layer.msg(res.message,{time:1200,icon:icon},function(){
        //     if(res.status != 0){
        //         window.location.reload()
        //     }
        // })
    })
}


/**
 * 获取地区下级分类
 */
function getAreachild(obj){
    var code = $(obj).val();
    var html = '<option value="0">'+city+'</option>';
    if(code < 1){
        $('select[name="city"]').html(html)
        return false;
    }
    var layIndex = layer.load(1,{shade: 0.2});
    $.post('/getAreaChild',{code:code},function(res){
        layer.close(layIndex);
        if(res.status == 200){
            var data = res.data;
            
            for(var i in data){
                html += '<option value="'+data[i].code+'">'+data[i].name+'</option>';
            }
            $('select[name="city"]').html(html)
        }else{
            layer.msg(res.message,{time:1200,icon:5})
        }
    })
}

//导航栏跟随鼠标
for(var i =0;i<$('.yd-sec-nav').length;i++){
    var left =  $($('.yd-sec-nav')[i]).parent().offset().left - $('.yd-head-nav ul').offset().left
    var len =  $($('.yd-sec-nav')[i]).children().children().width()*$($('.yd-sec-nav')[i]).children().children().length
    if(left + len <1200){
        $($('.yd-sec-nav')[i]).children().css('padding-left',left);
    }else{
        $($('.yd-sec-nav')[i]).children().css('justify-content','flex-end');
    }
}

// 设置为主页
    function SetHome(obj,vrl){
        try{
            obj.style.behavior='url(#default#homepage)';obj.设为首页(vrl);
        }catch(e){
            if(window.netscape) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                }catch (e) {
                    alert("此操作被浏览器拒绝！请在浏览器地址栏输入“about:config”并回车然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
                }
                var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                prefs.setCharPref('browser.startup.homepage',vrl);
            }else{
                alert("您的浏览器不支持，请按照下面步骤操作：\n1.打开浏览器设置。\n2.点击设置网页。\n3.输入：http://"+document.domain+"点击确定。");
            }
        }
    }
    // 加入收藏 兼容360和IE6
    function shoucang(sTitle,sURL){
        try{
            window.external.addFavorite(sURL, sTitle);
        }catch (e){
            try{
                window.sidebar.addPanel(sTitle, sURL, "");
            }catch (e){
                alert("加入收藏失败，请使用Ctrl+D进行添加");
            }
        }
    }

    /*返回顶部*/

$('.go-top').click(function(){
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;  
    $('html').animate({'scrollTop':'0px'},800)
})
$('.go-top').click(function(){
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;  
    $('body').animate({'scrollTop':'0px'},800)
})