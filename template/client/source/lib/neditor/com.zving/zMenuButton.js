UE.registerUI('zmedia', function(editor, uiName) {

  var btn = new UE.ui.MenuButton({
    name: uiName,
    title: '插入多媒体',
    editor: editor,
    className: 'edui-for-zimage',
    items: [{
      label: '图片',
      value: 'zimage',
      onclick: function() {
        editor.execCommand('zimage');
      }
    }, {
      label: '视频',
      value: 'zvideo',
      onclick: function() {
        editor.execCommand('zvideo');
      }
    }, {
      label: '音频',
      value: 'zaudio',
      onclick: function() {
        editor.execCommand('zaudio');
      }
    }, {
      label: '文件',
      value: 'zfile',
      onclick: function() {
        editor.execCommand('zfile');
      }
    }],
    onbuttonclick: function() {
      // 默认
      editor.execCommand('zimage');
    }
  });


  return btn;
})


UE.registerUI('zcomponent', function(editor, uiName) {
  var btn = new UE.ui.MenuButton({
    name: uiName,
    title: '插入组件',
    editor: editor,
    className: 'edui-for-zvote',
    items: [{
      label: '投票',
      value: 'zvote',
      onclick: function() {
        editor.execCommand('zvote');
      }
    }, {
      label: '广告',
      value: 'zatverdise',
      onclick: function() {
        editor.execCommand('zatverdise');
      }
    }, {
      label: '组图',
      value: 'zimagegroup',
      onclick: function() {
        editor.execCommand('zimagegroup');
      }
    }],
    onbuttonclick: function() {
      // 默认
      editor.execCommand('zvote');
    }
  });


  return btn;
})

UE.registerUI('zlink', function(editor, uiName) {
  var btn = new UE.ui.MenuButton({
    name: uiName,
    title: '插入链接',
    editor: editor,
    className: 'edui-for-zcontent',
    items: [{
      label: '内容',
      value: 'zcontent',
      onclick: function() {
        editor.execCommand('zcontent');
      }
    }, {
      label: '栏目',
      value: 'zcatalog',
      onclick: function() {
        editor.execCommand('zcatalog');
      }
    }],
    onbuttonclick: function() {
      // 默认
      editor.execCommand('zcontent');
    }
  });


  return btn;
})

UE.registerUI('ztable', function(editor, uiName) {
  var btn = new UE.ui.MenuButton({
    name: uiName,
    title: '删除表格',
    editor: editor,
    className: 'edui-for-deletetable',
    items: [{
      label: '删除表格',
      value: 'deletetable',
      status: -1,
      queryCommandState: -1,
      onclick: function() {
        editor.execCommand('deletetable');
      },
      renderLabelHtml:function () {
        return '<div class="edui-deletetable edui-box edui-icon edui-notadd"></div><div class="edui-box edui-label edui-menuitem-label edui-notadd">' + (this.label || '') + '</div>';
      }
    }, {
      label: '前插入行',
      value: 'insertrow',
      onclick: function() {
        editor.execCommand('insertrow');
      },
      renderLabelHtml:function () {
        return '<div class="edui-insertrow edui-box edui-icon edui-notadd"></div><div class="edui-box edui-label edui-menuitem-label edui-notadd">' + (this.label || '') + '</div>';
      }
    }, {
      label: '删除行',
      value: 'deleterow',
      onclick: function() {
        editor.execCommand('deleterow');
      },
      renderLabelHtml:function () {
        return '<div class="edui-deleterow edui-box edui-icon edui-notadd"></div><div class="edui-box edui-label edui-menuitem-label edui-notadd">' + (this.label || '') + '</div>';
      }
    }, {
      label: '前插入列',
      value: 'insertcol',
      onclick: function() {
        editor.execCommand('insertcol');
      },
      renderLabelHtml:function () {
        return '<div class="edui-insertcol edui-box edui-icon edui-notadd"></div><div class="edui-box edui-label edui-menuitem-label edui-notadd">' + (this.label || '') + '</div>';
      }
    }, {
      label: '删除列',
      value: 'deletecol',
      onclick: function() {
        editor.execCommand('deletecol');
      },
      renderLabelHtml:function () {
        return '<div class="edui-deletecol edui-box edui-icon edui-notadd"></div><div class="edui-box edui-label edui-menuitem-label edui-notadd">' + (this.label || '') + '</div>';
      }
    }],
    onbuttonclick: function() {
      // 默认
      editor.execCommand('deletetable');
    }
  });
  //当点到编辑内容上时，按钮要做的状态反射
  editor.addListener('selectionchange', function() {
      var state = editor.queryCommandState('deletetable');
      if (state == -1) {
          btn.setDisabled(true);
          btn.setChecked(false);
      } else {
          btn.setDisabled(false);
          btn.setChecked(state);
      }
  });

  return btn;
})


UE.registerUI('zround', function(editor, uiName) {
  //排版，图片排版，文字方向
  var btn = new UE.ui.MenuButton({
    name: uiName,
    title: '默认',
    editor: editor,
    className: 'edui-for-imagenone',
    items: [{
      label: '默认',
      value: 'imagenone',
      className: 'edui-for-imagenone',
      onclick: function() {
        editor.execCommand('imagefloat','none');
      },
      renderLabelHtml:function () {
        return '<div class="edui-imagenone edui-box edui-icon edui-notadd"></div><div class="edui-box edui-label edui-menuitem-label edui-notadd">' + (this.label || '') + '</div>';
      }
    }, {
      label: '左浮动',
      value: 'imageleft',
      onclick: function() {
        editor.execCommand('imagefloat','left');
      },
      renderLabelHtml:function () {
        return '<div class="edui-imageleft edui-box edui-icon edui-notadd"></div><div class="edui-box edui-label edui-menuitem-label edui-notadd">' + (this.label || '') + '</div>';
      }
    }, {
      label: '右浮动',
      value: 'imageright',
      onclick: function() {
        editor.execCommand('imagefloat','right');
      },
      renderLabelHtml:function () {
        return '<div class="edui-imageright edui-box edui-icon edui-notadd"></div><div class="edui-box edui-label edui-menuitem-label edui-notadd">' + (this.label || '') + '</div>';
      }
    }, {
      label: '居中',
      value: 'imagecenter',
      onclick: function() {
        editor.execCommand('imagefloat','center');
      },
      renderLabelHtml:function () {
        return '<div class="edui-imagecenter edui-box edui-icon edui-notadd"></div><div class="edui-box edui-label edui-menuitem-label edui-notadd">' + (this.label || '') + '</div>';
      }
    }],
    onbuttonclick: function() {
      // 默认
      editor.execCommand('imagefloat','none');
    }
  });

  editor.addListener("selectionchange", function(
    type,
    causeByUi,
    uiReady
  ) {
    btn.setDisabled(editor.queryCommandState('imagefloat') === -1);
  });

  return btn;
})
