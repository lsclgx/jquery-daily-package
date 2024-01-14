/*!
 * jQuery lightweight plugin uploadFiles
 * Original author: @lsc
 * 2022-12-11
 */

;(function ( $, window, document, undefined ) {

  var pluginName = "uploadFiles"
  var defaults = {
    uploadType: 'img', // img/file
    accept: '.png,.jpg,.jpeg', // .xls,.xlsx,.csv,.png,.jpg,.jpeg
    multiple: false,
    fileList: [], // {id, name, url} 文件name必填，图片name不必填
    upload: null, // 选择文件后就上传到存储服务器的方法
    beforeUpload: (file) =>{
      return true
    }, // 校验
    preview: (idx, list) => {
    }, // 预览
  }
  var customCss = {
    myFileList: 'display:flex;justify-content:flex-start;align-items:center;flex-wrap:wrap;',

    myFileCellImg: 'display:inline-block;margin: 10px 10px 0 0;',
    myFileCellBox: 'display:inline-block;position:relative;',
    myFileCellImgBox: 'display:inline-block;width:62px;height:62px;border:1px solid #dcdcdc;border-radius:6px;padding:3px;box-sizing:border-box;background:#fff;',
    myFileCellImgImg: 'display:inline-block;width:54px;height:54px;border-radius:6px;object-fit:cover;',
    myFileRemoveImg: 'display:inline-block;width:16px;height:16px;cursor: pointer;position:absolute;top:-8px;right:-8px;background:#666;border-radius:50%;',
    myFileRemoveImg1: 'display:inline-block;width:10px;height:2px;transform:rotateZ(45deg);background:#fff;position:absolute;top:50%;left:50%;margin-top:-1px;margin-left:-4px;',
    myFileRemoveImg2: 'display:inline-block;width:10px;height:2px;transform:rotateZ(-45deg);background:#fff;position:absolute;top:50%;left:50%;margin-top:-1px;margin-left:-4px;',

    myFileCellFile: 'display:inline-block;width:100%;flex-shrink:0;margin-top:5px;',
    myFileCellFileA: 'text-decoration:none;color:#333;',
    myFileRemoveFile: 'display:inline-block;margin-left:10px;color: #6E98FC;cursor: pointer;'
  }

  function Plugin( element, options ) {

    const that = this
    this.element = element
    this.options = $.extend( {}, defaults, customCss, options)

    const random0 = parseInt(Math.random() * 1000000)
    this.options.fileList.forEach((item, index) => {
      item.sign = random0 + '_' + index
    })
    this.oldFileList = JSON.parse(JSON.stringify(this.options.fileList))

    this._defaults = defaults
    this._name = pluginName

    this.createCell = function(cellId, cellUrl, cellName) {
      const opt = this.options
      let str = ''
      if(this.options.uploadType === 'img') {
        str = '<div class="my-file-cell my-file-cell_img" style="'+opt.myFileCellImg+'" id="id_' + cellId + '" data-id="' + cellId + '">' +
        '<span class="my-file-cell_box" style="'+opt.myFileCellBox+'">' + 
        ' <span class="my-file-cell_img_box" style="'+opt.myFileCellImgBox+'"><img class="my-file-cell_img_img" style="'+opt.myFileCellImgImg+'" src="' + cellUrl + '"></span>' + 
        ' <span class="my-file-remove my-file-remove_img" style="'+opt.myFileRemoveImg+'">' +
        '   <span style="'+opt.myFileRemoveImg1+'"></span><span style="'+opt.myFileRemoveImg2+'"></span>' +
        ' </span>' +
        '</span>' + 
        '</div>'
      }else {
        str = '<span class="my-file-cell my-file-cell_file" id="id_' + cellId + '" data-id="' + cellId + '" style="' + opt.myFileCellFile + '"><a target="_blank" style="'+opt.myFileCellFileA+'" href="'+ cellUrl +'">' + cellName + 
        '</a><span class="my-file-remove my-file-remove_file" style="' + opt.myFileRemoveFile + '">删除</span></span>'
      }
      return str
    }

    this.removeCell = function(dom) {
      if(this.options.uploadType === 'img') {
        const sign = $(dom).parent().parent().attr('data-id')
        $(dom).parent().parent().remove()
        that.options.fileList = that.options.fileList.filter(item => item.sign != sign)
      }else {
        const sign = $(dom).parent().attr('data-id')
        $(dom).parent().remove()
        that.options.fileList = that.options.fileList.filter(item => item.sign != sign)
      }
    }
    this.init()
  }

  Plugin.prototype.init = function () {
    const _this = this
    const $bd = $('body')
    const $el = $(this.element)
    const id = $el.attr('id')
    $el.css('cursor', 'pointer')
    // 列表展示
    let backDisplay = ''
    this.options.fileList.forEach(item => {
      backDisplay += this.createCell(item.sign, item.url, item.name)
    })
    $el.parent().append('<div class="my-file-list_' + id + '" style="' + this.options.myFileList + '">' + backDisplay + '</div>')
    $('.my-file-list_' + id).find('.my-file-remove').each((index, item) => {
      $(item).click(function() {
        _this.removeCell(this)
      })
    })
    $('.my-file-list_' + id).find('.my-file-cell_img_box').each((index, item) => {
      $(item).click(function() {
        if(_this.options.preview && typeof _this.options.preview === 'function') {
          _this.options.preview(index, _this.options.fileList)
        }
      })
    })
    $el.click(function() {
      // 添加input-file并主动触发点击事件
      const random = parseInt(Math.random() * 1000000)
      if ($bd.find('.my-file-btn_20221211')) $bd.find('.my-file-btn_20221211').remove()
      $bd.append("<input type='file' name='my-file' " + (_this.options.multiple ? 'multiple' : '') + " class='my-file-btn_20221211' accept='" + _this.options.accept + "' id='my-file-btn_" + random + "' style='display:none;'/>")
      const $fileBtn = $('#my-file-btn_' + random)
      $fileBtn.trigger('click')
      // 选择文件后
      $fileBtn.change(function () {
        const fileList = this.files
        // 校验 提示框在插件外开发人员自己写
        if(_this.options.beforeUpload && typeof _this.options.beforeUpload === 'function') {
          const validList = []
          for(const file of fileList) {
            const validRes = _this.options.beforeUpload(file)
            validList.push(validRes)
            if(!validRes) break
          }
          if(validList.some(item => !item)) return
        }
        // 校验成功 暂存文件
        for(const file of fileList) {
          if(_this.options.upload) {
            const promise = new Promise((resolve, reject) => {
              _this.options.upload(file, resolve, reject)
            })
            promise.then(res => {
              // res: {id, name, url}
              const fl = _this.options.fileList.map(item => item.sign.split('_')[1])
              const sign = fl.length ? random+'_'+(Math.max(...fl)+1) : random+'_0'
              const fileObj = {
                add: true,
                sign: sign,
                name: res.name || file.name,
                url: res.url || '',
                file: file,
                id: res.id || '',
              }
              _this.options.fileList.push(fileObj)
              const str = _this.createCell(sign, fileObj.url, fileObj.name)
              $('.my-file-list_' + id).append(str)
              $('.my-file-list_' + id).find('#id_' + sign).find('.my-file-remove').click(function() {
                _this.removeCell(this)
              })
              $('.my-file-list_' + id).find('#id_' + sign).find('.my-file-cell_img_box').click(function() {
                if(_this.options.preview && typeof _this.options.preview === 'function') {
                  const idx = _this.options.fileList.findIndex(item => item.sign === sign)
                  _this.options.preview(idx, _this.options.fileList)
                }
              })
            })
          }else {
            let reader = new FileReader()
            reader.onload = function (e) {
              const fl = _this.options.fileList.map(item => item.sign.split('_')[1])
              const sign = fl.length ? random+'_'+(Math.max(...fl)+1) : random+'_0'
              _this.options.fileList.push({
                add: true,
                sign: sign,
                name: file.name,
                file: file,
                url: '',
                id: ''
              })
              const str = _this.createCell(sign, reader.result, file.name)
              $('.my-file-list_' + id).append(str)
              $('.my-file-list_' + id).find('#id_' + sign).find('.my-file-remove').click(function() {
                _this.removeCell(this)
              })
              $('.my-file-list_' + id).find('#id_' + sign).find('.my-file-cell_img_box').click(function() {
                if(_this.options.preview && typeof _this.options.preview === 'function') {
                  const idx = _this.options.fileList.findIndex(item => item.sign === sign)
                  _this.options.preview(idx, _this.options.fileList)
                }
              })
            }
            reader.readAsDataURL(file)
          }
        }
      })
    })
  }

  Plugin.prototype.getValue = function () {
    return this.options.fileList
  }

  Plugin.prototype.getAdded = function () {
    return this.options.fileList.filter(item => item.add)
  }

  Plugin.prototype.getRemoved = function () {
    const newList = this.options.fileList.filter(item => !item.add).map(item => item.sign)
    const removedList = this.oldFileList.filter(item => !newList.includes(item.sign))
    return removedList
  }

  $.fn[pluginName] = function ( options ) {
    if (typeof options === 'string') {
      var method = options
      var method_arguments = Array.prototype.slice.call(arguments, 1)
      if (/^(getValue|getAdded|getRemoved)$/.test(method)) {
        var api = this.first().data("plugin_" + pluginName)
        if (api && typeof api[method] === 'function') {
            return api[method].apply(api, method_arguments)
        }
      }else {
        return false
      }
    }else {
      return this.each(function () {
        if ( !$.data(this, "plugin_" + pluginName )) {
          $.data( this, "plugin_" + pluginName,
          new Plugin( this, options ))
        }
      })
    }
  }

})( jQuery, window, document )