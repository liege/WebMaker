//切换验证框皮肤
$(".popover-inner").on("click","input[name='skin']",function(e){
	var index = e.currentTarget.value;
	switch(index){
		case "0":
		$(popover.target).removeClass("red");
		break;
		case "1":
		$(popover.target).addClass("red");
		break;
	}
});
var pagelist = [
{
	show:[
		{
			id:2,src:'images/default.jpg'
		},
		{
			id:13,height:'30px'
		},		
		{
			id:1,content:'这里添加文本'
		}
		],
	editBtns:[1,2,3,4,5,6,7,8,9,10,11,12,13]
	},

{
	show:[
		{
			id:3,theme:'default'
		}],
	editBtns:[1]
	},

{
	show:[
		{id:4,itmes:['北京','上海','广州','天津','大连']},
	],
	editBtns:[]
},

{
	show:[
		{id:1,content:'恭喜您领取成功!'},
		{id:2,src:'images/default.jpg'}
	],
	editBtns:[1]
}];
//模拟数据结束
//默认模块数据
var default_config = ['',
	{id:1,content:'这里添加文本'},
	{id:2,src:'images/default.jpg'},
	{id:3,theme:'images/default.jpg'},
	{id:4,itmes:['北京','上海','广州','天津','大连']}
	];
default_config[13] = {id:13,height:'30px'};
//组件列表
var components = ['','fullText','img','msgVerify','locationInfo','imgAd','title','textNav','imgNav','listLink','goodSearch','showcase','subline','blankSpace'];
//按钮列表
var btnText = ['','富文本','图片区域','短信验证','地址信息','图片广告','标题','文本导航','图片导航','列表链接','商品搜索','橱窗','辅助线','辅助空白'];

$(document).ready(function(){
	//@$('#editor_body') 内容模块容器
	var $editor = $('#editor_body'),
		page = 0;
	//设置模块容器标识
	$(".tmpl_container>div>li").addClass("moduleWrap");
	//子元素拖拽交换位置
	$editor.sortable({
		stop:function(){
			//拖动时重新定位编辑框
			if(popover.target){
				popover.posTop = popover.target.offsetTop;
				popover.pos();
			}
		}		
	});
	//加载组件
	loadDefaultComponent(pagelist[0].show);
	//加载按钮
	loadDefaultBtn(pagelist[0].editBtns);
	//翻页
	function pageTurns(){
		$editor.html("");
		$("#btn_container").html("");
		loadDefaultComponent(pagelist[page].show);
		loadDefaultBtn(pagelist[page].editBtns);	
		//上传数据接口
		//所有data-form值 [{},{},{}]
		var uploadModuleConfig = getAllData($("#editor_body .module"));
		//流程标识active切换
		$(".dash_bar li:even").eq(page).addClass("active")
		.siblings().removeClass("active");
		//当有popover显示时隐藏它
		popover.hide();
	}	
	$("#prev").click(function(){
		if(page==0){
			return;
		}
		page--;
		pageTurns();	
	});
	$("#next").click(function(){
		if(page==pagelist.length-1){
			return;
		}
		page++;
		pageTurns();
	});
	//视图模块绑定事件，调用编辑框
	$editor.on('click','.module',function(e){
		var $this = $(this);
		$this.addClass('current').parent().siblings().find(".module").removeClass('current');
		//显示编辑框
		$("#popover").show();
		popover.target = $this[0];
		popover.posTop = $this.parent().position().top;//popover.target.offsetTop;	
		popover.pos().loadContent();	
		if(popover.target.dataset.identity == "fullText"){
			popover.editor();
		}
		if(popover.target.dataset.identity == "img"){
			popover.upload();
		}
		if(popover.target.dataset.identity == "blankSpace"){
			popover.blank();
		}
		return false;		
	});
	//按钮绑定事件，添加视图模块
	$('#btn_container').on('click','li a',function(e){
		var $this = $(this);
		var relatedComponentId = $this[0].dataset.relateid;
		var com = default_config[relatedComponentId];
		addComponentToView(com);
		$editor.find("li:last").find("div.module").addClass("current").parent().siblings().find(".module").removeClass('current');
		$editor.find("li:last").find("div").trigger("click");
	});
});


