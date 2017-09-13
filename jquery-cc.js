//jQuery整体就是一个匿名函数自调用，防止全局变量污染
//第一个参数：global, 在浏览器中运行时，传递的是window
//第二个参数：factory，这个函数返回一个jQuery工厂函数
//在jQuery1.7版本之前，jQuery不支持模块化，只需要一个global参数即可，第二个参数是为了支持模块化而设计的。
(function(global, factory){

  factory(global);

})(window, function(window){
  //缓存变量,下次使用效率更高，并且可以进行压缩。
  var arr = [];
  var document = window.document;
  var slice = arr.slice;
  var concat = arr.concat;
  var push = arr.push;

  
  //创建jQuery函数
  var jQuery = function (selector) {
    //使用工厂函数创建jQuery函数
    return new jQuery.fn.init(selector);
  };
  
  //替换jQuery原型属性,起一个别名jQuery.fn,方便使用
  jQuery.fn = jQuery.prototype = {
    constructor:"jQuery",//修改构造器
    ready: function (fn) {
      //如果DOM已经构建完毕了，就没必要注册事件了，直接调用即可。
      if (document.readyState === "complete") {
        fn();
        return this;
      }
      //现代浏览器
      if ("addEventListener" in document) {
        document.addEventListener("DOMContentLoaded", fn);
      } else {
        //IE8浏览器
        document.attachEvent("onreadystatechange", function () {
          if (document.readyState === "complete") {
            fn();
          }
        });
      }
      return this;
    }
  };

  //jquery内部隐藏的构造函数（入口函数）
  var init = jQuery.fn.init = function (selector) {

    //处理假值的情况。$() $('') $(false) $(null) $(undefined) $(NaN) $(0)
    if (!selector) {
      return this;
    }

    //处理参数是字符串的情况 $("<div></div>") $(".box")
    if (typeof selector === "string") {
      //如果是标签
      if (selector[0] === "<"
        && selector[selector.length - 1] === ">"
        && selector.length >= 3) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = selector;
        push.apply(this, tempDiv.children);
      } else {
        //如果不是标签，当成选择器使用
        var tempResult = document.querySelectorAll(selector);
        push.apply(this, tempResult);
      }
      return this;
    }


    //处理参数：如果是数组或者类数组
    if (jQuery.isArrayLike(selector)) {
      push.apply(this, selector);
      return this;
    }

    //参数是函数
    if (typeof selector === "function") {
      this.ready(selector);
    }

    //如果是其他
    this[0] = selector;
    this.length = 1;
    return this;

  };

  //给jQuery添加的静态方法，判断对象是否是一个类数组
  jQuery.isArrayLike = function (obj) {
    //如果obj是假值，或者obj没有length属性，length为false,否则length为obj.length
    var length = !!obj && "length" in obj && obj.length;
    //如果obj是函数类型 或者window类型，直接返回false
    //因为函数和window都是object类型，并且他们都有length属性。
    if (typeof obj === "function" || obj === window) {
      return false;
    }

    //如果是数组，返回true
    if (obj instanceof Array) {
      return true;
    }

    //如果有长度，且长度为0，返回true
    if (length === 0) {
      return true;
    }

    //如果有长度，且长度>0,那么 length-1对应的下标必须存在。
    if (typeof length === "number" && length >= 0 && (length - 1) in obj) {
      return true;
    }
    return false;
  };
  //构造函数的原型与工厂函数的原型一致。
  init.prototype = jQuery.fn;

  //对外暴露了两个变量。
  window.$ = window.jQuery = jQuery;
  return jQuery;
});
