(function() {
	var z = Zving;

	var mobileContentTemplatePath = Zving.UEditorPath+'mobilecontenteditor/snippets/';
var snippetsUrl=[
	{
		url:mobileContentTemplatePath+'filter-1.zhtml',
		icon:'icon-bookmark-empty',
		name:'标题'
	},{
		url:mobileContentTemplatePath+'filter-2.zhtml',
		icon:'icon-align-left',
		name:'正文'
	},{
		url:mobileContentTemplatePath+'filter-3.zhtml',
		icon:'icon-picture',
		name:'图片'
	},{
		url:mobileContentTemplatePath+'filter-4.zhtml',
		icon:'icon-list-alt',
		name:'模板'
	},{
		url:mobileContentTemplatePath+'filter-5.zhtml',
		icon:'icon-facetime-video',
		name:'视频'
	},{
		url:mobileContentTemplatePath+'filter-6.zhtml',
		icon:'icon-star-empty',
		name:'上关注'
	},{
		url:mobileContentTemplatePath+'filter-7.zhtml',
		icon:'icon-eye-open',
		name:'下阅读'
	},{
		url:mobileContentTemplatePath+'filter-8.zhtml',
		icon:'icon-minus',
		name:'分割线'
	},{
		url:mobileContentTemplatePath+'filter-9.zhtml',
		icon:'icon-camera',
		name:'表情'
	},{
		url:mobileContentTemplatePath+'filter-10.zhtml',
		icon:'icon-heart-empty',
		name:'点赞分享'
	}
];
var mce=function (opts) {
	mce.snippetsUrl = snippetsUrl;
	$.extend(mce,opts);
	opts.ueditor.ready(function() {
	    mce.init(opts);
	});
};
mce.util={
		heredoc: function (fn) {
			return fn.toString()
			        .replace(/^[^\/]+\/\*!?\s?/, '')
			        .replace(/\*\/[^\/]+$/, '')
		},
		generateId: function(){
			//12位长唯一字符串
			return (+new Date()).toString(36) + Math.round(Math.random() * 1632959 + 46656).toString(36);
		}
};
//mce.toolsPanelWidth=parseInt(430 - $G("_Table1").offsetLeft);
mce.toolsPanelWidth = 430;
var showErrorMsg = function(msg){
	alert(msg);
}
mce.template = '<div class="tool-panel-left" style="width:'+mce.toolsPanelWidth+'px;left:-'+mce.toolsPanelWidth+'px"><a class="panel-open-btn-left" href="###"><i class="glyphicon menu-left">»</i></a></div>'

mce.init=function (opts) {//
	Zving.loadCss(Zving.UEditorPath+"mobilecontenteditor/mobileContentEditor.css");
	var $toolsPanel = mce.$toolsPanel = $(mce.template);
	opts.editModel=="articleQuickEditor"?$toolsPanel.appendTo($("#editorWrap")):$toolsPanel.appendTo(document.body);
	$toolsPanel.off("click").on('click','a.panel-open-btn-left',mce.taggleToolsPanel);
	mce.$toolsPanelBtn=$toolsPanel.find('a.panel-open-btn-left')
	mce.$toolsPanelBtnIcon=mce.$toolsPanelBtn.find('i.glyphicon')
	var ct=mce.getEditorFlowCt(mce.ueditor);
	mce.ueditorDomId=editor.container.id;
	if(ct.tagName=='BODY' && !mce.ueditor.autoHeightEnabled){
		var iframeOffset=$(mce.ueditor.iframe.parentNode).offset()
		$toolsPanel.css('position','absolute')
			.css('top', 120)
			.css('height',mce.ueditor.iframe.parentNode.clientHeight)
	}else{
		var iframeOffset=$(mce.ueditor.iframe.parentNode).offset()
		mce.toolsPanelInitTop=mce.editModel=="articleQuickEditor"?$('.edui-editor-toolbarbox').height():120;
		mce.ueditorIframeInitWidth=parseInt($(mce.ueditor.iframe.parentNode).width(), 10);
		mce.toolPanelTopOffset=mce.ueditor.container.clientHeight-mce.ueditor.iframe.clientHeight
		var $bottombar=$('#'+mce.ueditorDomId+'_bottombar');
		if($bottombar.length){
			mce.toolPanelTopOffset = mce.toolPanelTopOffset - $bottombar.height();
		}
		$toolsPanel.css('position','absolute')
			.css('top', mce.toolsPanelInitTop)
			.css('height',opts.editModel=="articleQuickEditor"?$("#overflowPannel").height()-mce.toolsPanelInitTop:$(window).height()-125);
		if(ct.tagName=='BODY'){
			$(window).on('scroll',mce.updateFloating);
		}
	}
	//插件
	mce.clickPop = new baidu.editor.ui.Popup({
		content : "",
		editor : mce.ueditor,
		_remove : function() {
			$(mce.clickPop.anchorEl).remove();
			mce.clickPop.hide();
		},
		_blank : function() {
			$('<p><br/></p>').insertAfter(mce.clickPop.anchorEl);
			mce.activeSnippetInEditor.removeAttr("style");
			mce.clickPop.hide();
		},
		_preblank : function() {
			$('<p><br/></p>').insertBefore(mce.clickPop.anchorEl);
			mce.activeSnippetInEditor.removeAttr("style");
			mce.clickPop.hide();
		},
		pBg : function() {
			console.log("pbg");
			pBgDialog.render();
			pBgDialog.open();
			pBgDialog.anchorEl = mce.clickPop.anchorEl;
		},
		_P_clearStyle : function() {
			mce.activeSnippetInEditor.html(mce.activeSnippetInEditor.find('.pBrush')
					.get(0).innerText);
		},
		_pItem : null,
		className : 'edui-bubble'
	});

	mce.ueditor.addListener('click', mce.clickOnEditor);

	setTimeout(function () {
		mce.taggleToolsPanel()
	},500)
};
//更新左侧浮动面板的位置
mce.updateFloating=function () {
	var st = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
	if(st>mce.toolsPanelInitTop-mce.toolPanelTopOffset){
		if(mce.$toolsPanel.get(0).style.position !== "fixed"){
			mce.$toolsPanel.css('position','fixed').css('top', mce.toolPanelTopOffset)
			mce.$toolsPanel.css('height',$(window).height()-mce.toolPanelTopOffset)
		}
	}else{
		if(mce.$toolsPanel.get(0).style.position == "fixed"){
			mce.$toolsPanel.css('position','absolute').css('top', mce.toolsPanelInitTop)
			mce.$toolsPanel.css('height',$(window).height()-mce.toolsPanelInitTop)
		}
	}
}
mce.snippetsLoaded=false;//是否已经载入过snippets
mce.taggleToolsPanel=function (evt) {
	if(evt && evt.preventDefault){
		evt.preventDefault();
	}
	var editorMargin = mce.toolsPanelWidth;
	if($G("_Table1")){
		editorMargin=parseInt(mce.toolsPanelWidth - $G("_Table1").offsetLeft);
	}

	if(mce.$toolsPanelBtnIcon.hasClass('menu-left')){
		mce.$toolsPanel.css('left',-3-mce.toolsPanelWidth);//收起
		mce.$toolsPanelBtnIcon.removeClass('menu-left').addClass('menu-right')
		mce.$toolsPanelBtnIcon.css({"font-style":"normal","font-family":"Verdana, Geneva, Arial, Helvetica, sans-serif"}).html("&raquo;")
		//mce.ueditor.container.style.width=parseInt(mce.ueditor.iframe.parentNode.style.width)+mce.toolsPanelWidth+'px'
		mce.ueditor.iframe.parentNode.style.marginLeft=0
		mce.ueditor.iframe.parentNode.style.width=mce.ueditorIframeInitWidth+'px'
	}else{
		mce.$toolsPanel.css('left',0);//展开
		mce.$toolsPanelBtnIcon.removeClass('menu-right').addClass('menu-left')
		mce.$toolsPanelBtnIcon.css({"font-style":"normal","font-family":"Verdana, Geneva, Arial, Helvetica, sans-serif"}).html("&laquo;")
		if(editorMargin>0){
			mce.ueditor.iframe.parentNode.style.marginLeft=editorMargin+'px'
			mce.ueditor.iframe.parentNode.style.width=mce.ueditorIframeInitWidth-editorMargin+'px'
		}

		//mce.ueditor.container.style.width=parseInt(mce.ueditor.iframe.parentNode.style.width)-mce.toolsPanelWidth+'px'
		if(!mce.snippetsLoaded){
			mce.snippetsListInit();
		}
	}
}
//载入关初始化snippets

mce.snippetsListInit = function () {
	var ajaxList=[]
	var categoriesHtml=[];
	var snippetsHtml=[];
	var toolbarHtml='<div class="z-toolbar-anchor z-toolbar-flat"><div class="z-toolbar" style="text-align:right;"><div class="z-toolbar-ct"><div class="z-toolbar-overflow" style="width: auto;"><div class="z-toolbar-nowrap">'
	+'<span style="color:#FF691F;float:left">在PC端IE9及以下浏览器部分效果可能无法正常展现</span>'
     	+'  <a href="javascript:void(0);" ztype="button" id="colorCircleBtn" class="z-btn z-btn-split z-btn-flat" onselectstart="return false"><img src="'+UEditorPath+'mobilecontenteditor/images/theme.gif" style="vertical-align:middle;"/> <b>主题色<i class="dropdown-toggle"></i></b></a>'
    	+'</div></div></div></div></div>'
	categoriesHtml.push('<ul class="side-navigation" style="width:95px; float:left;">');
	for (var i = 0; i < mce.snippetsUrl.length; i++) {
		ajaxList.push($.ajax({
			url:mce.snippetsUrl[i].url,
			dataType:'text'
		}))
		categoriesHtml.push('<li class="side-nav-item'+(i==0?' current':'')+'"><i class="'+mce.snippetsUrl[i].icon+'"></i><b>'+mce.snippetsUrl[i].name+'</b></li>');
	};
	categoriesHtml.push('</ul>');

	$.when.apply($, ajaxList).done(function () {
		snippetsHtml.push('<div id="tmpl" style="float:left;height: 94%;">');
		snippetsHtml.push('<div class="tmpl-box" style=" background:#fff; width:335px; float:left;height: 100%; overflow: auto;">');
		for (var j = 0; j < arguments.length; j++) {
			snippetsHtml.push('<ul style="width:318px; padding-left:5px;overflow: hidden; float:left;'+(j==0?'':'display:none;')+'">');
			snippetsHtml.push(arguments[j][0]);
			snippetsHtml.push('</ul>');
		};
		snippetsHtml.push('</div>');
		snippetsHtml.push('</div>');
		$(toolbarHtml+categoriesHtml.join('')+snippetsHtml.join('')).appendTo(mce.$toolsPanel);
		mce.$toolsPanel.off('click','li.side-nav-item', mce.categorieClick).on('click','li.side-nav-item', mce.categorieClick);
		$('#tmpl').off('click','section.pEditor', mce.tmplClick).on('click','section.pEditor', mce.tmplClick);
		$('#colorCircleBtn').off("click").on('click',mce.colorCircleToggle);
		mce.snippetsLoaded = true;
	})
}
//列表项点击时
mce.categorieClick = function (evt) {
	var $items=mce.$toolsPanel.find('li.side-nav-item');
	var index=$items.index(this);
	$(this).addClass('current').siblings('li').removeClass('current');
	$('div.tmpl-box>ul').hide().eq(index).show();
	$('div.tmpl-box').animate({scrollTop:0}, 0);
}
//snippet点击时
mce.tmplClick = function (evt) {
	var pEditor = $(evt.currentTarget)
	var ue=mce.ueditor;
	function getSelectionHtml() {
		var range = ue.selection.getRange();
		range.select();
		var selectionObj = ue.selection.getNative();
		var rangeObj = selectionObj.getRangeAt(0);
		var docFragment = rangeObj.cloneContents();
		var testDiv = document.createElement("div");
		testDiv.appendChild(docFragment);
		var selectHtml = testDiv.innerHTML;
		return selectHtml;
	}
	// 获取原始的模板id
	var id = pEditor.parent().data('id');

	pEditor.find('.autonum')
			.html(parseInt(pEditor.find('.autonum').html()));
	// 如果有选中的文字,就用当前模板格式化该文字内容
	var timestr = mce.util.generateId();
	// 给模板添加id标识
	$('body').append(
			"<div class='" + timestr + " fly-tmpl'>"
					+ pEditor.get(0).outerHTML + "</div>");
	var $flyTmpl = $('.fly-tmpl.' + timestr)
	if (getSelectionHtml()) {
		if ($flyTmpl.find('.pBrush').size()) {
			var brush = $flyTmpl.find('.pBrush');
			brush.eq(0).html(getSelectionHtml());
		} else {
			showErrorMsg("此盖模板不支持该操作\n请先添加模板再修改内容");
			return false;
		}
	}
	;
	$flyTmpl.children('.pEditor').attr('data-id', id);
	var value = $flyTmpl.html();

	// 获取当前模板坐标x,y
	var pagex = pEditor.offset().left;
	var pagey = pEditor.offset().top;
	var w1 = pEditor.parent().get(0).offsetWidth;
	var pagex2 = $(mce.ueditor.iframe).offset().left;

	var pagey2 = $(ue.selection.getStart()).offset().top
			- $(ue.body).scrollTop()
			+ $('.edui-editor-toolbarbox').height();
	var w2 = ue.selection.getStart().offsetWidth + 15;
	setTimeout(function() {
		var selectObj = $(ue.selection.getStart()).closest(".pEditor");
		if (selectObj.size() > 0) {
			if (selectObj.selector) {
				var html = selectObj.find(".pBrush").map(function() {
					return this.innerText.replace(/\n+/g, "");
				}).get().join();
				$flyTmpl.find('.pBrush').eq(0)
						.html(html);
				value = $flyTmpl.html();
			}
			$(ue.selection.getStart()).closest(".pEditor").replaceWith(
					value);
		} else {
			ue.execCommand("insertHtml", value);
		}
		ue.undoManger.save();
		mce.content.save(ue.getContent());
		ue.undoManger.save();
	}, 300);

	ue.undoManger.save();
	mce.content.save(ue.getContent() + "");
	ue.undoManger.save();

	$flyTmpl.css({
		left : pagex,
		top : pagey,
		width : w1
	}).show(10).delay(10).animate({
		left : pagex2,
		top : pagey2,
		width : w2,
	}, 300, function() {
		$flyTmpl.remove();
	});
	if($("#_DivContainer")[0]){
		$("#_DivContainer")[0].scrollTop=50000
	}
	pEditor.find('.autonum').html(
			parseInt(pEditor.find('.autonum').html()) + 1);

}
//查到编辑器的溢出滚动的父元素
mce.getEditorFlowCt=function (editor) {
	editor=editor||mce.ueditor;
	var pNode=editor.container.parentNode;
	while(pNode){
		if(pNode.style.overflow=='auto' || pNode.style.overflow=='scroll' || pNode.tagName=='BODY'){
			break;
		}
		pNode=pNode.parentNode;
	}
	return pNode;
};


mce.activeSnippetInEditor=null;
mce.clickOnEditor = function (t, evt) {
	evt = evt || window.event;
	var el = evt.target || evt.srcElement;
	var $el;
	if (el.tagName == "IMG") {
		$(el).css({
			'max-width' : '100%',
			'max-weight' : '100%'
		});
		return;
	} else if (($el=$(el).closest('.pEditor')).size() > 0) {
		el = $el.get(0);
		if (mce.activeSnippetInEditor) {
			mce.activeSnippetInEditor.removeAttr('style');
		}

		mce.activeSnippetInEditor = $el;
		mce.activeSnippetInEditor.css({
			'outline' : '1px dotted #0faeff'
		});
		mce.clickPop.render();
		var html = mce.clickPop
			.formatHtml('<nobr class="otf-poptools">'
				 + '<span onclick="$$._remove()" stateful>'
				 + '删除模板</span>'
				 + '<span onclick="$$._P_clearStyle()" stateful>'
				 + '清除该模板样式</span>'
				 //+ '<span class="pBg hidden" onclick="$$.pBg()" stateful>'
				 //+ '背景图</span>'
				 + '<span onclick="$$._preblank()" stateful>'
				 + '前面插入空行</span><span onclick="$$._blank()" stateful>'
				 + '后面插入空行</span>' + '</nobr>');
		var content = mce.clickPop.getDom('content');
		content.innerHTML = html;
		// $(el).find('.select').tooltip({
		// 	'title' : '选中后，可以秒刷更换为别的样式'
		// });
		if ($(el).find('.pBg').size()) {
			$(content).find('.pBg').removeClass(
				'hidden');
		}
		if ($(el).find('.video_iframe').size()) {
			$(content).find('._P_video').removeClass(
				'hidden');
		}
		var bdbg_flag = false;
		$(el).find('*').each(function () {
			if (this.style.background
				 || this.style.border
				 || this.style.borderBottom
				 || this.style.borderTop
				 || this.style.borderLeft
				 || this.style.borderRight) {
				bdbg_flag = true;
			}
		});
		if (bdbg_flag && navigator.userAgent.match(/WebKit/)) {
			$(content).find('._P_bdbg').removeClass('hidden');
		}
		mce.clickPop.anchorEl = el;
		mce.clickPop.showAnchor(mce.clickPop.anchorEl);
	} else {
		if (mce.activeSnippetInEditor) {
			mce.activeSnippetInEditor.removeAttr('style');
			mce.activeSnippetInEditor = null;
		}
	}
}
// mce.snippetPicker=function (argument) {
// 	// body...
// };
// mce.editorPlugin=function (argument) {
// 	// body...
// };

mce.content = {
	save : function(val) {
		mce.localStorage.save('pEditorContent', val);
	},
	get : function() {
		return mce.localStorage.get('pEditorContent');
	},
	del : function() {
		mce.localStorage.del('pEditorContent');
	}
};
mce.localStorage = {
	init : function() {
		if (!window.localStorage) {
			alert('你的浏览器版本较低,将无法临时保存你编辑的内容,请及时自行保存');
			return false;
		}
	},
	save : function(key, val) {
		this.init();
		localStorage[key] = val;
	},
	get : function(key) {
		this.init();
		return localStorage[key];
	},
	del : function(key) {
		this.init();
		localStorage[key] = '';
	}
}
//切换主题色面板
mce.colorCircleInited=false;
mce.colorCircleDefaultData=["rgb(225, 37, 30)", "rgb(225, 98, 30)", "rgb(225, 137, 30)", "rgb(225, 172, 30)", "rgb(225, 215, 30)", "rgb(209, 225, 30)", "rgb(181, 225, 30)", "rgb(142, 225, 30)", "rgb(85, 225, 30)", "rgb(30, 225, 104)", "rgb(23, 171, 87)", "rgb(30, 225, 164)", "rgb(30, 225, 218)", "rgb(30, 207, 225)", "rgb(30, 178, 225)", "rgb(30, 154, 225)", "rgb(30, 136, 225)", "rgb(30, 104, 225)", "rgb(30, 79, 225)", "rgb(30, 47, 225)", "rgb(67, 30, 225)", "rgb(95, 30, 225)", "rgb(127, 30, 225)", "rgb(159, 30, 225)", "rgb(202, 30, 225)", "rgb(225, 30, 198)", "rgb(225, 30, 166)", "rgb(225, 30, 108)", "rgb(225, 30, 76)", "rgb(187, 14, 14)"];
mce.colorCircleToggle=function (evt) {
	if(!mce.colorCircleInited){
		mce.colorCircleInit()
	}
	if(!$(".selectColorBox-dropdown").attr("aria-expanded") || $(".selectColorBox-dropdown").attr("aria-expanded")=='false'){
		$(".selectColorBox-dropdown").show().attr("aria-expanded",'true')
	}else{
		$(".selectColorBox-dropdown").hide().attr("aria-expanded",'false')
	}
}
mce.colorCircleInit=function (argument) {
	var html='<ul class="selectColorBox-dropdown">\
		<li class="defaultColor"></li>\
		<li class="divider"></li>\
		<li>\
			<button class="btn btn-link pull-left btn-sm oldColor" style="margin-right:10px;">还原调色板</button>\
			<button class="btn btn-link pull-left btn-sm oldStyleList">还原模板样式</button>\
			<button class="btn btn-default pull-right btn-sm closeColorBord" style="float:right;">关闭</button>\
			<div class="clearfix"></div>\
		</li>\
	</ul>';
	if($(".selectColorBox-dropdown").size()==0){
		$(html).appendTo(document.body);
	}

	if(mce.localStorage.get("userSetColor")===undefined){
		mce.localStorage.save("userSetColor","");
	}
	$(".selectColorBox-dropdown .closeColorBord").off("click").on("click",function(){
		$(this).closest(".selectColorBox-dropdown").hide().attr("aria-expanded",'false');
	});
	$(".selectColorBox-dropdown .oldColor").off("click").on("click",function(){
		mce.localStorage.del("userSetColor");
		mce.rangeColorBox(false);
	});
	$(".selectColorBox-dropdown .oldStyleList").off("click").on("click",function(){
		mce.localStorage.del("userSetColor");
		mce.rangeColorBox(false);
		mce.resetStyle();
	});
	mce.rangeColorBox(true);
	colorCircleInited = true;
}
/**
 *重置风格颜色
 **/
mce.resetStyle = function(){
	var $cur = $('#tmpl .tmpl-box > :visible');
	var curIdx = $('#tmpl .tmpl-box > ul').index($cur);
	$.ajax({
			url:mce.snippetsUrl[curIdx].url,
			dataType:'text',
			success:function(rv){
				$cur.children().remove();
				$cur.html(rv);
				$('#tmpl').off('click','section.pEditor', mce.tmplClick).on('click','section.pEditor', mce.tmplClick);
				$(".selectColorBox-dropdown .closeColorBord").trigger("click");
				 $('.dropdown-toggle').css({
			        borderColor:"transparent",
			        background : "transparent"
			    });
			}
	})
}
mce.rangeColorBox=function (notClick) {
	var event = event||window.event;
	var html=[]
	for (var i = 0; i < mce.colorCircleDefaultData.length; i++) {
		var c=mce.colorCircleDefaultData[i];
		html.push('<span class="colorCircleBtn" style="border-color:'+c+';"><i style="background-color: '+c+';" data-color="#ffe"></i></span>')
	};
	if(notClick){
		//从本地获取颜色
		if(mce.localStorage.get("userSetColor")){
			var arr = mce.localStorage.get("userSetColor").split("||");
			$.each(arr,function(k,v){
				if(v!=""){
					html.push('<span class="colorCircleBtn newStyle" style="border-color:'+v+';"><i style="background-color: '+v+';" data-color="#ffe"></i></span>');
				}
			});
		}
	}
	html.push('<input type="text" id="flatClearable" value="#f4f4f4"/>');
	$(".selectColorBox-dropdown .defaultColor").html(html.join('\n'));

	//拖拽色块
    //$('.selectColorBox-dropdown .colorCircleBtn').draggable(mce.colorBoxDrag(event));

    //切换颜色
    $('.selectColorBox-dropdown .colorCircleBtn i').click(function(event){
        mce.colorBoxClick(event);
    });
    $("#flatClearable").spectrum(mce.spectrumFn());

}

/*

 ///设置调色板
mce.colorCircleBtnX=0;
mce.colorCircleBtnY=0;
mce.pColor=[0,0,0];
//拖拽色块

mce.colorBoxDrag = function(event){
    return {
        start:function(event){
            var event = event||window.event;
            mce.colorCircleBtnX=event.clientX;
            mce.colorCircleBtnY=event.clientY;
        },
        stop:function(event){
            var event = event||window.event;
            var x_Dvalue=Math.abs(event.clientX-mce.colorCircleBtnX);
            var y_Dvalue=Math.abs(event.clientY-mce.colorCircleBtnY);

            var r=Math.sqrt(x_Dvalue*x_Dvalue+y_Dvalue*y_Dvalue);

            if (r>100) {
                var rgba=$(this).css("borderColor");
                $(this).remove();
            }else{
                $(this).css({
                    top:color_top,
                    left:color_left
                })
            }
        }
    };
}
*/
mce.spectrumFn = function(){
	return {
	    showInput: true,
	    preferredFormat:'rgb',//hex,rgb,hex3,hsl
	    showAlpha: true,
	    change:function(c){
	    	mce.pColor={
	            r:parseInt(c['_r']),
	            g:parseInt(c['_g']),
	            b:parseInt(c['_b'])
	        };
	        //添加一个色块
	        mce.addColorBox(c,$(this));

		    var rgb='rgb('+mce.pColor.r+','+mce.pColor.g+','+mce.pColor.b+')';
		    //保存用户颜色
	    	mce.localStorage.save("userSetColor",mce.localStorage.get("userSetColor")+"||"+rgb);
	        //设置模板颜色
		    mce.parseObject($('#mixitup-box .pEditor'),rgb,'rgb(255,255,255)');

	    },
	    show:function(){
	        $(".sp-picker-container").width(400);
	        $(this).spectrum("reflow");
	    }
	};
}
mce.addColorBox = function (c,tag){
	var event=event||window.event;
    var pColor=[
        parseInt(c['_r']),
        parseInt(c['_g']),
        parseInt(c['_b'])
    ];
    var bg_color='rgb('+pColor[0]+','+pColor[1]+','+pColor[2]+')';
    tag.siblings().removeClass('active');
    var dom='<span class="colorCircleBtn newStyle active" style="border-color:'+bg_color+';"><i style="background-color:'+bg_color+';" data-click="true" data-color="rgba(255,255,255)"></i></span>';
    tag.before(dom);
    $('.dropdown-toggle.colorCircleBtn').css({
        borderColor:bg_color
    }).children().css({
        backgroundColor:bg_color
    });

    tag.prev().find("i").off("click").on("click",function(event){
        mce.colorBoxClick(event)
    }).trigger("click");

    //重置添加按钮颜色
    tag.siblings('.sp-replacer').find('.sp-preview-inner').css({
        backgroundColor:'rgb(244, 244, 244)'
    })
    //拖动删除色块
    //tag.prev().draggable(mce.colorBoxDrag(event));
}
mce.parseObject = function (obj, bgcolor, color) {
    if (isGreyColor(bgcolor)) {
        return false;
    }
    obj.find("*").each(function() {
        if (this.nodeName == "HR" || this.nodeName == "hr") {
            $(this).css('border-color', bgcolor);
            return;
        }
        if (this.nodeName == "") {
            return;
        }
        if ($(this).data('ct') == 'fix') {
            return;
        }
        var bgimg = $(this).css('backgroundImage');
        if (bgimg.substring(0, 24) == '-webkit-linear-gradient(') {
            var colors;
            var type;
            if (bgimg.substring(0, 30) == '-webkit-linear-gradient(left, ') {
                type = 'left';
                colors = bgimg.substring(30, (bgimg.length - 1));
            } else if (bgimg.substring(0, 29) == '-webkit-linear-gradient(top, ') {
                type = 'top';
                colors = bgimg.substring(29, (bgimg.length - 1));
            } else if (bgimg.substring(0, 31) == '-webkit-linear-gradient(right, ') {
                type = 'right';
                colors = bgimg.substring(31, (bgimg.length - 1));
            } else if (bgimg.substring(0, 32) == '-webkit-linear-gradient(bottom, ') {
                type = 'bottom';
                colors = bgimg.substring(32, (bgimg.length - 1));
            }
            if (colors) {
                var color_arr = colors.split('),');
                var txt_color, gradient_color, main_color;
                if (isLightenColor(bgcolor)) {
                    txt_color = getColor(rgb2hex(bgcolor), 'darken', '50%');
                    txt_color = getColor(rgb2hex(txt_color), 'saturate', '30%');
                    gradient_color = getColor(rgb2hex(bgcolor), 'darken', '10%');
                    main_color = getColor(rgb2hex(bgcolor), 'saturate', '20%');
                } else {
                    txt_color = '#FFFFFF';
                    getColor(rgb2hex(bgcolor), 'lighten', '50%');
                    gradient_color = getColor(rgb2hex(bgcolor), 'lighten', '10%');
                    main_color = getColor(rgb2hex(bgcolor), 'lighten', '5%');
                    main_color = getColor(rgb2hex(main_color), 'desaturate', '10%');
                    main_color = getColor(rgb2hex(main_color), 'fadein', '20%');
                }
                if (color_arr.length == 3) {
                    $(this).css('backgroundImage', '-webkit-linear-gradient(' + type + ', ' + main_color + ', ' + gradient_color + ', ' + main_color + ')');
                    $(this).css('color', txt_color);
                } else if (color_arr.length == 2) {
                    $(this).css('backgroundImage', '-webkit-linear-gradient(' + type + ', ' + main_color + ', ' + gradient_color + ')');
                    $(this).css('color', txt_color);
                }
            }
        }
        var persent = $(this).data('clessp') ? $(this).data('clessp') : '50%';
        var hasSetBgColor = false;
        var bgC = $(this).get(0).style.backgroundColor;
        if (!bgC || bgC === 'initial' || bgC === 'transparent' || bgC === "") {
            var fc = $(this).get(0).style.color;
            if (fc && fc != "" && fc != 'inherit' && !isGreyColor(fc)) {
                var txt_color;
                if (isLightenColor(bgcolor)) {
                    txt_color = getColor(rgb2hex(bgcolor), 'darken', persent);
                    $(this).css('color', txt_color);
                } else {
                    $(this).css('color', bgcolor);
                }
            }
        } else {
            if ($(this).data('bgless')) {
                var bgpersent = $(this).data('bglessp') ? $(this).data('bglessp') : '30%';
                var bg_color;
                if ($(this).data('bgless') == "true" || $(this).data('bgless') == true) {
                    if (isLightenColor(bgcolor)) {
                        bg_color = getColor(rgb2hex(bgcolor), 'darken', bgpersent);
                        bg_color = getColor(rgb2hex(bg_color), 'saturate', '20%');
                    } else {
                        bg_color = getColor(rgb2hex(bgcolor), 'lighten', bgpersent);
                    }
                } else {
                    bg_color = getColor(rgb2hex(bgcolor), $(this).data('bgless'), bgpersent);
                }
                if (isLightenColor(bg_color)) {
                    txt_color = getColor(rgb2hex(bg_color), 'darken', persent)
                } else {
                    txt_color = color;
                }
                hasSetBgColor = true;
                $(this).css('backgroundColor', bg_color);
                $(this).css('color', txt_color);
            } else if (!isGreyColor(bgC)) {
                hasSetBgColor = true;
                $(this).css('backgroundColor', bgcolor);
                var txt_color;
                if (isLightenColor(bgcolor)) {
                    txt_color = getColor(rgb2hex(bgcolor), 'darken', persent)
                } else {
                    txt_color = color;
                }
                $(this).css('color', txt_color);
            } else {
                var fc = $(this).get(0).style.color;
                if (fc && fc != "" && fc != 'inherit' && !isGreyColor(fc)) {
                    $(this).css('color', bgcolor);
                }
            }
        }
        if ($(this).data('bcless') || hasSetBgColor) {
            var bc_color;
            if (isLightenColor(bgcolor) || $(this).data('bcless') == 'darken') {
                var persent = $(this).data('bclessp') ? $(this).data('bclessp') : '5%';
                bc_color = getColor(rgb2hex(bgcolor), 'darken', persent);
                bc_color = getColor(rgb2hex(bc_color), 'saturate', '30%');
            } else {
                var persent = $(this).data('bclessp') ? $(this).data('bclessp') : '20%';
                bc_color = getColor(rgb2hex(bgcolor), 'lighten', persent);
                bc_color = getColor(rgb2hex(bc_color), 'desaturate', '20%');
                bc_color = getColor(rgb2hex(bc_color), 'fadein', '20%');
            }
            if (this.style.borderBottomColor || this.style.borderTopColor || this.style.borderLeftColor || this.style.borderRightColor) {
                this.style.borderBottomColor = bc_color;
                this.style.borderTopColor = bc_color;
                this.style.borderLeftColor = bc_color;
                this.style.borderRightColor = bc_color;
            } else {
                this.style.borderColor = bc_color;
            }
        } else {
            if (this.style.borderBottomColor || this.style.borderTopColor || this.style.borderLeftColor || this.style.borderRightColor) {
                setColor(this, 'borderBottomColor', bgcolor);
                setColor(this, 'borderTopColor', bgcolor);
                setColor(this, 'borderLeftColor', bgcolor);
                setColor(this, 'borderRightColor', bgcolor);
            } else {
                setColor(this, 'borderColor', bgcolor);
            }
        }
        /*var fc = $(this).css('color');
        $(this).find('*').each(function() {
            var nfc = $(this).css('color');
            if (nfc == fc) {
                $(this).css('color', 'inherit')
            }
        });*/
    });
    obj.find("*").each(function() {
        var fc = $(this).css('color');
        $(this).find('*').each(function() {
            var nfc = $(this).css('color');
            if (nfc == fc) {
                $(this).css('color', 'inherit')
            }
        });
    });
    return obj;
}
//切换颜色
mce.colorBoxClick= function (event){
    var event=event||window.event;
    var _this=$(event.target);

    _this.parent().addClass('active').siblings().removeClass('active');
    var color = _this.data('color'); //data-color为前景色，bgcolor为背景色，或者无背景文字的前景色
    var bg_color = _this.css('backgroundColor');

    $('.dropdown-toggle').css({
        borderColor:bg_color,
        background : bg_color
    })

   mce.parseObject($('#tmpl .tmpl-box > :visible > .tmpl-list'),bg_color,color);
}

var less_parser = new less.Parser;
function getColor(color, type, num) {
    var str = '';
    less_parser.parse('*{color:' + type + '(' + color + ',' + num + ')}',
    function(err, tree) {
        str = tree.toCSS();
        str = str.replace(/\n/g, '').replace(/ /g, '').replace('*{color:', '').replace(';}', '');
    });
    return str;
}
function setColor(obj, colorType, color) {
    var c = $(obj).css(colorType);
    if (c === 'transparent') {
        return;
    } else {
        if (!isGreyColor(c)) {
            $(obj).css(colorType, color);
        }
    }
}
function rgb2hex(color) {
    rgb = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice( - 2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice( - 2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice( - 2) : color;
}
function isLightenColor(color) {
    var c = rgb2hex(color);
    var r = ("" + c.substring(1, 3));
    var g = ("" + c.substring(3, 5));
    var b = ("" + c.substring(5, 7));
    if (r > 'C0' && g > 'C0' && b > 'C0') {
        return true;
    } else {
        return false;
    }
}
function isGreyColor(color) {
    var c = rgb2hex(color);
    var r = "" + c.substring(1, 3);
    var g = "" + c.substring(3, 5);
    var b = "" + c.substring(5, 7);
    if (r == g && g == b) {
        return true;
    } else {
        return false;
    }
}
z.mce = mce;

/**
 * 为图片添加右键更换图片功能
 */
UE.plugins['replaceimg'] = function(){
	var me = this,editor = this;
    me.commands['replaceimg'] = {
      execCommand : function() {
        replaceImg(editor,1);
      }
    };
};
addStyle('.edui-default  div.edui-for-replaceimg .edui-icon{background:url("'+UEditorPath+'mobilecontenteditor/images/image-replace.png") center no-repeat;}');



/**
 * 为图片添加右键更换图片功能
 */
UE.plugins['replacebgimg'] = function(){
	var me=this,editor = this;
    me.commands['replacebgimg'] = {
        execCommand : function() {
			replaceImg(editor,2);
		},
        queryCommandState : function(){
        	var node = editor.selection.getStart();
        	console.log("1234:"+node.style.backgroundImage);
        	//debugger;
            return !this.highlight && node && node.style.backgroundImage!=""?0:-1;
        }
    };
};
addStyle('.edui-default  div.edui-for-replaceimg .edui-icon{background:url("'+UEditorPath+'mobilecontenteditor/images/image-replace.png") center no-repeat;}.edui-default  div.edui-for-replacebgimg .edui-icon{background:url("'+UEditorPath+'mobilecontenteditor/images/image-replaceBg.png") center no-repeat;}');

/**
 *修改图片
 @Params
 	editor:编辑器对象
 	model:1为更换图片,2为更换背景图片
 **/
var replaceImg = function(editor,model){
  var node = editor.selection.getStart();
  var url = '/editorDialog.html' +
      '?resourceType=image&imageWidth=' +
      (me.options.resourceProps.imageWidth || 500) + '&imageHeight=' +
      (me.options.resourceProps.imageHeight || 500) + '&dataType=' + me.options.dataType
      url += '&catalogID=' + me.options.catalogID
      url += '&multiUpload=N'
      url += '&contentType='+me.options.dataType
      var Dialog = baidu.editor.ui.Dialog
			var dialog = new Dialog({
        editor: editor,
        iframeUrl: url,
        width: 800,
        height: 450,
        title: model==1?"更换图片":"更换背景图片",
        buttons: [
          {
            className: "edui-cancelbutton",
            label: editor.getLang("cancel"),
            editor: editor,
            onclick: function() {
              dialog.close(false);
            }
          },
          {
            className: "edui-okbutton",
            label: editor.getLang("ok"),
            editor: editor,
            onclick: function(){
              dialog.onok()
            }
          },
        ]
      });
			dialog.open();
}


})();
