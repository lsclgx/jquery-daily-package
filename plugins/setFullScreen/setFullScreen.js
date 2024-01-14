/*!
 * jQuery lightweight plugin setFullScreen
 * Original author: @lsc
 */

;(function ( $, window, document, undefined ) {

  var pluginName = "setFullScreen"
  var defaults = {
    targetEl: ""
  }

  function Plugin( element, options ) {
    this.element = element

    this.options = $.extend( {}, defaults, options)

    this._defaults = defaults
    this._name = pluginName

    this.checkFull = () => {
      var isFull =
          document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement
      //to fix : false || undefined == undefined
      if (isFull === undefined) isFull = false
      return isFull
    }

    this.init()
  }

  Plugin.prototype.init = function () {
    const _this = this
    const $el = $(this.element)
    const dom = _this.options.targetEl ? (document.querySelector(_this.options.targetEl) ? document.querySelector(_this.options.targetEl) : document.documentElement) : document.documentElement
    $el.click(function() {
      if (!_this.checkFull()) {
        if (dom.RequestFullScreen) {
          dom.RequestFullScreen()
        }
        //兼容火狐
        if (dom.mozRequestFullScreen) {
          dom.mozRequestFullScreen()
        }
        //兼容谷歌等可以webkitRequestFullScreen也可以webkitRequestFullscreen
        if (dom.webkitRequestFullScreen) {
          dom.webkitRequestFullScreen()
        }
        //兼容IE,只能写msRequestFullscreen
        if (dom.msRequestFullscreen) {
          dom.msRequestFullscreen()
        }
        if(_this.options.fulledFn) _this.options.fulledFn()
      } else {
        if (document.exitFullScreen) {
          document.exitFullscreen()
        }
        //兼容火狐
        if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        }
        //兼容谷歌等
        if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
        //兼容IE
        if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        if(_this.options.exitedFn) _this.options.exitedFn()
      }
    })

    // TODO:
    // 通过esc退出全屏也触发一次exitedFn，不生效，监听不到
    // window.addEventListener('keyup', function(event) {
    //   var key = event.key;
    //   var code = event.code
    //   console.log("按下了" + key, event);
    //   if(code === 'Escape') {
    //     if(_this.options.exitedFn) _this.options.exitedFn()
    //   }
    // });
    // onresize可能会被页面中的方法覆盖
    // window.onresize = function() {
    //   console.log(111);
    //   if(!_this.checkFull()) {
    //     _this.options.exitedFn()
    //   }
    // }
  }

  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if ( !$.data(this, "plugin_" + pluginName )) {
        $.data( this, "plugin_" + pluginName,
        new Plugin( this, options ))
      }
    })
  }

})( jQuery, window, document )