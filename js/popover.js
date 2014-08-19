/**
 * @author liege
 * 2014-8-5 
 */

var popover = {
	layoutWrap:document.getElementById("popover"),
	posTop:0,
	target:null,
	moduleId:null,
};
//隐藏编辑框
popover.hide = function(){
	this.layoutWrap.style.display = "none";
};
//定位
popover.pos = function(){	
	// this.layoutWrap.style.top = this.posTop + "px";
	$(this.layoutWrap).animate({top:this.posTop + "px"},300) ;
	return this;
};
//载入内容
popover.loadContent = function(){
	this.moduleId = this.target.dataset.identity;
	var tmpl = $("#popoverContent").find("."+this.moduleId),
		DEBUG = {"name":"liege"};
	$.template("controlTmpl",tmpl);
	$(".popover-inner").html($.tmpl("controlTmpl",DEBUG));	
};
//富文本编辑器
popover.editor = function(){
	//编辑器
	var _this = this;
	var K=window.KindEditor;
	window.editor = K.create('textarea', {
		
		allowFileManager : true,
		langType : 'zh-CN',
		autoHeightMode : true,
		items:['source','preview','undo','redo','plainpaste','justifyleft','justifycenter',
		'justifyright','justifyfull','insertorderedlist','insertunorderedlist','indent',
		'outdent','subscript','superscript','formatblock','fontname','fontsize',
		'forecolor','hilitecolor','bold','italic','underline','strikethrough',
		'removeformat','hr','link','unlink','fullscreen','lineheight','clearhtml'],
		//初始化回调
		afterCreate:function(){
			this.html(popover.getDataForm());
			_this.str1 = _this.target.dataset.identity;
		},
		//编辑器发生改变后执行
		afterChange:function(){
			var thisEditor = this;
			// @editor.text() 文本内容
			// @setTimeout 初始化编辑器时会先触发此回调，导致内容清空
			_this.tiemr = setTimeout(function(){
				_this.str2 = _this.target.dataset.identity;
				console.log(_this.str1==_this.str2);
				clearTimeout(_this.tiemr);
				//判断被编辑模块 target 是否发生改变
				if(_this.str1==_this.str2){
					popover.setDataForm(thisEditor.html());
				}
				// popover.target.innerHTML = thisEditor.text();
			},100);
		}
	});
	// editor.sync(".txt");
	// K.sync("title")	
		
};
//图片上传
popover.upload = function(){	
	var uploader = new plupload.Uploader({
		runtimes : 'html5,flash,silverlight,html4',
		browse_button : 'pickfiles', // you can pass in id...
		container: document.getElementById('container'), // ... or DOM Element itself
		url : 'upload.php',
		flash_swf_url : '../js/Moxie.swf',
		silverlight_xap_url : '../js/Moxie.xap',
		
		filters : {
			max_file_size : '10mb',
			mime_types: [
				{title : "Image files", extensions : "jpg,gif,png"},
				{title : "Zip files", extensions : "zip"}
			]
		},
	
		init: {
			PostInit: function() {
				document.getElementById('filelist').innerHTML = '';
	
				$(document).on("click","#uploadfiles",function() {
					uploader.start();
					return false;
				});
			},
	
			FilesAdded: function(up, files) {
				plupload.each(files, function(file) {
					document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
				});
			},
	
			UploadProgress: function(up, file) {
				document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
			},
	
			Error: function(up, err) {
				document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
			}
		}
	});
	uploader.init();
};
popover.blank = function(){
	var _this = this;
	//插件代码开始
	var defaults = {
		speed: 400,
		lowerBound: 1,
		upperBound: 10
	};
	var options = $.extend(defaults, options);
	
	$(".slideControl").each(function() {
		
		// set vars
		var o = options;
		var controller = false;
		var position = 0;
		var obj = this;
		$(this).addClass('slideControlInput');
		var parent = $(this).parent();
		var label = $(parent).find('label');
		parent.html("<label>" + $(label).html() + "</label><span class=\"slideControlContainer\"><span class=\"slideControlFill\" style=\"width:" + $(obj).val()*10 + "%\"><span class=\"slideControlHandle\"></span></span></span>" + $(obj).wrap("<span></span>").parent().html());
		var container = parent.find('.slideControlContainer');
		var fill = container.find('.slideControlFill');
		var handle = fill.find('.slideControlHandle');
		var input = parent.find('input');
		var containerWidth = container.outerWidth() + 1;
		var handleWidth = $(handle).outerWidth();
		var offset = $(container).offset();
		var animate = function(value){$(fill).animate({ width: value + "%"}, o.speed);};
		
		$(window).resize(function() {
			offset = $(container).offset();
		});

		
		// when user clicks anywhere on the slider
		$(container).click(function(e) {		
			e.preventDefault();
			position = checkBoundaries(Math.round(((e.pageX - offset.left + handleWidth/2)/containerWidth)*100));
			
			animate(position);
			$(input).val(position/10);
		});
		
		// when user clicks handle
		$(handle).mousedown(function(e) {
			e.preventDefault();
			controller = true;
			$(document).mousemove(function(e) {
				e.preventDefault();
				position = checkBoundaries(Math.round(((e.pageX - offset.left + handleWidth/2)/containerWidth)*100));
				if (controller) {	
					$(fill).width(position + "%");
					$(input).val(position/10);
				}
			});
			$(document).mouseup(function() {
				e.preventDefault();
				controller = false;
			});
		});
		
		// when user changes value in input
		$(input).change(function() {
			var value = checkBoundaries($(this).val()*10);
			if ($(this).val() > o.upperBound)
				$(input).val(o.upperBound);
			else if ($(this).val() < o.lowerBound)
				$(input).val(o.lowerBound);
			animate(value);
		});
		
	});
	
	// checks if value is within boundaries
	function checkBoundaries(value) {
		if (value < options.lowerBound*10)
			return options.lowerBound*10;
		else if (value > options.upperBound*10)
			return options.upperBound*10;
		else
			return value;
	}
	
	//插件代码结束
	//获取初始化高度
	_this.target.style.height = _this.getDataForm()+"px";
	var value = parseInt(_this.getDataForm());
	// console.log(_this.getDataForm())
	$(".slideControlInput").val(value/10);
	$(".slideControlFill").animate({ width: value + "%"}, 400);
	$("#popover").on("mousemove mousedown mouseout",'.slideControlContainer',setHeight);
	function setHeight(){
		//document.title = $('.slideControlInput').val();
		_this.target.style.height = $('.slideControlInput').val()*10 + "px";
		_this.setDataForm($('.slideControlInput').val()*10 + "px");
	}
};
popover.setDataForm = function(option){
	var obj = {};
	obj.id = popover.target.dataset.index;
	switch(this.target.dataset.identity){
		case "fullText":
		obj.content = option;
		popover.target.innerHTML = option;
		break;
		case "img":
		obj.src = option;
		break;
		case "blankSpace":
		obj.height = option;
		break;
	}
	popover.target.dataset.form = JSON.stringify(obj);
};
popover.getDataForm = function(){
	switch(this.target.dataset.identity){
		case "fullText":
		return $(popover.target).html();
		case "img":
		return $(popover.target).attr("src");
		case "blankSpace":
		return $(popover.target).height();
		break;
	}	
	
	// return JSON.parse(popover.target.dataset.form);
};
