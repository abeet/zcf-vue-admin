
/* pluginName：自定义插件：'插入视频'
 * codeDate：2013.11.08
 * author：zhangshaoliu
*/

UE.plugins['zvideo'] = function () {
  var me = this, editor = this, videoPopup;

  // 代码视图和设计视图切换时进行相应元素节点的替换
  var switchImgAndCode = function (root, img2Code) {
    if (!root) return;
    var nodes = root.getNodesByTagName(img2Code ? 'img' : 'video')
    UE.utils.each(nodes, function (node) {

      var html = ''

      if (img2Code) {
        if (node.getAttr('ztype') !== 'video') return

        var src = node.getAttr('_url'),
          poster = node.getAttr('_poster'),
          display = node.getAttr('_display'),
          width = node.getAttr('width'),
          height = node.getAttr('height');

        html = `<video controls="controls" width="${width}" height="${height}" loop="loop" preload="auto" src="${src}" poster="${poster}" display="${display}"></video>`
      } else {
        var _url = node.getAttr('src'),
          _poster = node.getAttr('poster'),
          _width = node.getAttr('width'),
          _height = node.getAttr('height'),
          _display = node.getAttr('display');

        html = `<img ztype="video" src="${UEditorPath}images/spacer.gif" _url="${_url}" _poster="${_poster}" _display="${_display}" width="${_width}" height="${_height}" style="width: ${_width}px;height: ${_height}px;"/>`
      }

      var parentNode = node.parentNode;
      parentNode.replaceChild(UE.uNode.createElement(html), node)
    })

  }

  // 设计视图转为源码视图的规则
  me.addOutputRule(function (root) {
    switchImgAndCode(root, true)
  })

  // 源码视图转为设计视图的规则
  me.addInputRule(function (root) {
    switchImgAndCode(root)
  })

  me.commands['zvideo'] = {
    execCommand: function (cmd, name) {
      // console.log(cmd, name)

      var url =  './editorDialog.html?dataType=' + me.options.dataType + '&dataID=' + me.options.ID + '&catalogID=' + me.options.catalogID + '&resourceType=video'
      url += '&imageWidth=480&imageHeight=360'

      if (name === 'edit') {
        url += '&edit=yes'
      }

      var Dialog = baidu.editor.ui.Dialog
      var dialog = new Dialog({
        editor: editor,
        iframeUrl: url,
        width: 800,
        height: 540,
        title: '插入视频',
        buttons: [
          {
            className: 'edui-cancelbutton',
            label: editor.getLang('cancel'),
            editor: editor,
            onclick: function () {
              dialog.close(false)
            }
          },
          {
            className: 'edui-okbutton',
            label: editor.getLang('ok'),
            editor: editor,
            onclick: function(){
              dialog.onok()
            }
          }
        ]
      })

      dialog.open()
    },
    queryCommandState: function () {
      var img = me.selection.getRange().getClosedNode(),
        flag = img && img.getAttribute('ztype') === 'video'
      return flag ? 1 : 0
    },
  }

  me.ready(function() {
    if (!videoPopup) {
      var _id = parseInt(Math.random() * 100000);
      var _html = '<div id="video-popup-' + _id + '" class="edui-popup edui-bubble edui-default edui-anchor-topleft" style="display: none;">' +
        '<div class="edui-popup-body edui-default">' +
        '<div class="edui-shadow edui-default"></div> ' +
        '<div class="edui-popup-content edui-default">' +
        '<nobr>属性: ' +
        '<span class="edui-clickable image-none">默认</span>&nbsp;&nbsp;' +
        '<span class="edui-clickable image-left">左对齐</span>&nbsp;&nbsp;' +
        '<span class="edui-clickable image-right">右对齐</span>&nbsp;&nbsp;' +
        '<span class="edui-clickable image-center">居中</span>&nbsp;&nbsp;' +
        '<span class="edui-clickable edit">修改</span>' +
        '</nobr>' +
        '</div>' +
        '</div>' +
        '</div>';

      $('#edui_fixedlayer').append(_html);

      videoPopup = $('#edui_fixedlayer').children('#video-popup-' + _id);

      videoPopup.on('click mousedown', function(e){
        e.stopPropagation();
        e.preventDefault();
      })
      videoPopup.find('.edui-clickable.image-none').on('click', function(){
        me.execCommand('imagefloat', 'none');
      })
      videoPopup.find('.edui-clickable.image-left').on('click', function(){
        me.execCommand('imagefloat', 'left');
      })
      videoPopup.find('.edui-clickable.image-right').on('click', function(){
        me.execCommand('imagefloat', 'right');
      })
      videoPopup.find('.edui-clickable.image-center').on('click', function(){
        me.execCommand('imagefloat', 'center');
      })
      videoPopup.find('.edui-clickable.edit').on('click', function(){
        me.execCommand('zvideo', 'edit');
      })

    }
  })

  me.addListener('afterscaleshow', function(type, e) {
    videoPopup.css({display: 'none'});


      var range = me.selection.getRange(),
        img = range.getClosedNode();

      if (me.body.contentEditable !== 'false' && img && img.tagName === 'IMG' && img.getAttribute('ztype') === 'video') {
        var _imgOffset = $(img).offset(),
          _iframeOffset = $(me.iframe).offset(),
          _imgWidth = $(img).width(),
          _imgHeight = $(img).height();

        // console.log(_imgOffset, _iframeOffset, _imgWidth);

        videoPopup.css({
          top: _imgOffset.top + _iframeOffset.top + _imgHeight - 50,
          left: _imgOffset.left + _iframeOffset.left + (_imgWidth - 355) / 2,
          display: 'block'
        })



      }

  });

  me.addListener('afterscalehide', function(e) {
    videoPopup.css({display: 'none'});
  })
}
