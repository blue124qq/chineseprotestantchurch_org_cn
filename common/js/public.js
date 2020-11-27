var formStatus = false;

/**
 * 表单元素加密
 */
function elementEncry(obj)
{
	var val = $(obj).val();
	var valEncry = val ? $.md5(val) : val;
	$(obj).val(valEncry);
}

//触发打开文件选择框
function openfile(obj)
{
	$(obj).next('input[type="file"]').click();
}

/**
 * 全选/全不选
 */
$(document).on('click','[name="checkboxAll"]',function () {
	var statusall = $(this).prop('checked');
    if( statusall == true){
        $('[name=checkboxList]').each(function(k,obj){
            $(obj).prop('checked','checked');
        });
        $(this).prop('checked','checked');
    }else{
        //未勾选的增加勾选
        $('[name=checkboxList]').each(function(k,obj){
            $(obj).removeAttr('checked');
        });
        $(this).removeAttr('checked');
    }
})

/**
 * 若无全选，则全选不勾选
 */
$(document).on('click','[name="checkboxList"]',function () {
	var arr = new Array();
	$('[name=checkboxList]').each(function(k,obj){
		arr.push($(obj).prop('checked'));
	});
	var statusall = arr.indexOf(false);
	if(statusall > -1){
        $('[name="checkboxAll"]').removeAttr('checked');
	}else{
        $('[name="checkboxAll"]').prop('checked','checked');
	}
})

/**
 * layer-open
 * 使用layer打开链接页面
 */
function layOpenView(url, height, width, title)
{

	// var refresh = '<i id="fa-refresh" class="glyphicon fa fa-refresh" style="position: absolute;right: 35px;display: inline-block;line-height: 40px;padding: 0px 15px;cursor: pointer;"></i>';
	layer.open({
		type: 2,
		move: false,
		title: title,
		shadeClose: true,
		shade: 0.8,
		area: [width, height],
		content: url
	}); 
}

/**
 * layer-close
 * 关闭 layer 弹框
 */
function layClose()
{
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}

/**
 *  ajax提交函数
 */
function ajaxFun(url,data,method,callback)
{

	$.ajax({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		type : method,
		dataType : "JSON",
		url : url,
		data : data,
		//上传 出现进度条/这是关键  获取原生的xhr对象  做以前做的所有事情  
		// xhr: function(){
  //           var xhr = jQuery.ajaxSettings.xhr();  
  //           xhr.upload.onload = function (){  
  //           	$('.progress-bar').text('等待数据处理中 95%')
  //           }  
  //           xhr.upload.onprogress = function (ev) {  
  //               if(ev.lengthComputable) {  
  //                   var percent = parseInt(100 * ev.loaded/ev.total);  
  //                   percent = percent > 95 ? 95 : percent
  //                   if($('.progress').length < 1){
  //                   	$('input[name="video_path"]').after('<div class="progress progress-striped"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div></div>')
  //                   }
  //                   $('.progress-bar').css('width',percent+'%')
  //               }  
  //           }  
  //           return xhr;  
  //       },  
		success : function(res){
			if(typeof callback == "function"){
				callback(res);
				
			}
			// layer.msg('成功!', { icon: 1});
			// window.location.reload();
		}
	});
}

/**
 *  ajax回调函数信息处理（信息提示后操作）
 *  res.status == 0 : 没有任何处理
 *  res.status == 1 : 跳转路由，无定义则为刷新
 *  res.status == 2 : 弹框页面，关闭自身且父页面刷新，【父页面若是BootstrapTable表格，则执行表格刷新方式】
 *  res.status == 3 : 刷新BootstrapTable表格
 */
var success = function (res)
{
	layer.closeAll();
	switch (parseInt(res.status)){
		case 0 :
			var actfun = function(){ formStatus = false;};
			break;
		case 1 :
			var actfun = function(){ (typeof(res.jumpurl) == "undefined" || res.jumpurl=='') ? location.reload() : location.href = res.jumpurl;};
			break;
		case 2 :
			var actfun = function(){ (parent.$('#tableEvents').length) ? parent.$('#tableEvents').bootstrapTable('refresh') : parent.location.reload(); layClose();};
			break;
		case 3 :
			var actfun = function () {($('#tableEvents').length) ? $('#tableEvents').bootstrapTable('refresh') : location.reload();}
			break;
		default:
			var actfun = function(){};
	}
	var icon = res.icon ? res.icon : '';
	layer.msg(res.message,{time:1500,icon:icon},actfun);
}

/**
 *  layer-prompt
 *  layer 弹框输入
 *  type: 0 input 框 1 密码框 2 textarea 框
 */
function layPrompt(type,word, url,id,val)
{
	layer.prompt({title: word, formType: type, value:val},function(text){
		var data = { id : id, content : text};
		ajaxFun(url,data,'post',success);
	});
}

/**
 * 使用layer确认
 * type : 1 需要理由  0 不需要
 */
function layConfirm(type,word,url,id)
{
	layer.confirm('确定 '+ word +' 吗？',function(){
		if(type){
			layer.prompt({title: word + '理由', formType: 2}, function(text){
				var data = {id : id,content : text};
				ajaxFun(url,data,'post',success);
			});
		}else{
			var data = {id : id};
			ajaxFun(url,data,'post',success);
		}
	});
}


/**
 * layer-form
 * 使用layer提交表单
 */
function layAjaxForm(parameter, url, method)
{
	layer.load(3);//无隐藏式加载层
	ajaxFun(url,parameter,method,success);
}

/**
 * layer-delete
 * 使用layer删除列表中的元素
 */
function layListDel(obj, url, id, delelement)
{
	layer.confirm('确认要删除吗？',function(){
		$('#delid').val(id);
		var data = $('#delForm').serialize();
		var success = function (res) {
			if(res.status > 0){
				// var actfun = (delelement == 'reload') ? location.reload() : $(obj).parents(delelement).animate({opacity:'0'},1200,function(){
					// $(obj).parents(delelement).remove();
				// }) ;
                var actfun = $('#tableEvents').bootstrapTable('refresh');
			}else if(res.status == 0){
				var actfun = function () {};
			}
			layer.msg(res.message,{time:1500},actfun);
		}
		ajaxFun(url,data,'post',success);
	});
}

/**
 * layer-multi-delete
 * 使用 layer 批量删除列表中的元素
 */
function layListMultiDel(url)
{
	var id = '';
	$('[name=checkboxList]').each(function(k,obj){
		if( $(obj).prop('checked') == true){
			//去除空值（由全选/全不选框产生）
			if(this.value){
				id  += this.value + ',';
			}
		}
	});
	if(id == ''){
		layer.msg('未选中删除项',{time:1200});
		return;
	}
	layer.confirm('确认要批量删除吗？',function(){
		id = id.substring(0,id.length-1);
		$('#delid').val(id);
		var data = $('#delForm').serialize();
		ajaxFun(url,data,'post',success);
	});
}

/**
 * 下载 Excel
 */
function uploadExcel(url,formName) {
    var load_index = layer.msg('数据处理中，请稍后...', {icon:16,shade: 0.01,time:300*1000});
    var formName = formName || 'searchForm';
    var dataform = $('#'+formName).serializeArray();
    var success = function (res) {
        layer.close(load_index);
        if(res.status > 0){
            location.href = res.url;
        }else if(res.status == 0){
            layer.msg(res.msg,{time:1500});
        }
    }
    ajaxFun(url,{search:dataform},'post',success);
}

/**
 * Bootstrap-table 列表封装函数
 */
function bootstrapList(url,searchform,pageSize)
{
	$('#tableEvents').bootstrapTable({
		search        : false,
		showRefresh   : true,
		showToggle    : false,
		showColumns   : true,
		pagination    : true,
		pageSize      : (pageSize==undefined) ? 25 : pageSize,
		pageList      : [10,25,50,75],
		iconSize      : 'outline',
		toolbar       : '#tableEventsToolbar',
		icons         : {
			refresh: 'fa fa-refresh',
			toggle : 'fa fa-list-alt',
			columns: 'fa fa-list'
		},
		sidePagination: 'server',
		method        : 'get',
		dataType	  : "json",
		url           : url,
		queryParams   : function(params) {
			return {
				pagenum: params.offset,
				limitnum: params.limit,
				sort: params.sort,
				order: params.order,
				search:searchform,
			};
		},
		responseHandler: function(res){
			return {
				"rows" : res.data,
				"total" : res.total
			}
		},
	});
}


function filechange(input, url){
	var load_index = layer.load(1);
	var all_file = input.files;
	var file;
	for (var i = 0; i < all_file.length; i++) {
		file = all_file[i];
		htmlup(file,url,load_index);
	};
}

//js数组得到最大最小值
function getMaximin(arr,maximin)
{
	if(maximin=="max")
	{
		return Math.max.apply(Math,arr);
	}
	else if(maximin=="min")
	{
		return Math.min.apply(Math, arr);
	}
}

/** 上传操作 **/
function htmlup(file,url){
	var form_data=new FormData();
	form_data.append("filedata",file);
	$.ajax({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		url: url,
		type: 'POST',
		dataType: 'json',
		processData: false,
		contentType: false,
		data: form_data
	})
	.done(function(data) {
		layer.msg(data.msg,{time:1500},function(){
			location.reload();
		});
	})
}

//编辑框图片上传
function sendFile(file, editor, welEditable) {
    data = new FormData();
    data.append("file", file);
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: data,
        type: "POST",
        url: "/editor-uploads",
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            if(data.status>0){
                editor.insertImage(welEditable, data.url);
            }
        }
    });
}

function openPhotoGallery(str){
    layOpenView('/admin/photogallery/'+str,'90%','90%','系统图片库')
}

$('input[name="job"]').click(function(e){
	var l = $('.alert-job li').length;
	if(l > 1){
		$('.alert-job').show();
	}
})

$('.alert-job li').click(function(){
	var text = $(this).text()
	var csrf = $('meta[name="csrf-token"]').attr('content');
	if($(this).hasClass('clear')){
		$.post('/admin/clearJobHistory',{"_token":csrf},function(res){
			if(res.status == 0){
				layer.msg('系统繁忙，请稍后尝试')
			}else{
				$('.alert-job').remove()
			}
		})
	}else{
		$('input[name="job"]').val(text)
	}
	$('.alert-job').hide()
})
$("body").bind("click",function(e){ 
	var a = $(e.target).is(".alert-job");
	var b = $(e.target).is('input[name="job"]');
	if(!a && !b){ 
		$('.alert-job').hide(); 
	} 
}); 