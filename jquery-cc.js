//jQuery整体就是一个匿名函数自调用，防止全局变量污染
//第一个参数：global, 在浏览器中运行时，传递的是window
//第二个参数：factory，这个函数返回一个jQuery工厂函数
//在jQuery1.7版本之前，jQuery不支持模块化，只需要一个global参数即可，第二个参数是为了支持模块化而设计的。
(function (global, factory) {

  factory(global);

})(window, function (window) {
  //缓存变量,下次使用效率更高，并且可以进行压缩。
  var version = "1.0.0";
  var arr = [];
  var document = window.document;
  var slice = arr.slice;
  var push = arr.push;

  
  //创建jQuery函数
  var jQuery = function (selector) {
    //使用工厂函数创建jQuery函数
    return new jQuery.fn.init(selector);
  };
  
  //替换jQuery原型属性,起一个别名jQuery.fn,方便使用
  jQuery.fn = jQuery.prototype = {
    constructor: "jQuery",//修改构造器
    jquery: version,//jquery版本
    length: 0,//默认长度
    toArray: function () {
      //将jQuery对象转换成数组
      return slice.call(this);
    },
    get: function (index) {
      //如果num传了空，返回所有的数据
      if (index == null) {
        return this.toArray();
      }
      //如果是负数，倒过来取，否则顺序取
      return index < 0 ? this[index + this.length] : this[index];
    },
    slice: function (start, end) {
      //对jQuery对象进行截取，返回jQuery对象
      var tempArr = slice.call(this, start, end);
      return this.pushStack(tempArr);
    },
    eq: function (index) {
      return this.pushStack(this.get(index));
    },
    first: function () {
      return this.eq(0);
    },
    last: function () {
      return this.eq(this.length - 1);
    },
    push: push,
    sort: arr.sort,
    splice: arr.splice,
    ready: function (fn) {
      //如果DOM已经构建完毕了，就没必要注册事件了，直接调用即可。
      if (document.readyState === "complete") {
        fn();
      } else {
        document.addEventListener("DOMContentLoaded", fn);
      }
      return this;
    },
    each: function (callback) {
      jQuery.each(this, callback);
      return this;
    },
    map: function (callback) {
      return this.pushStack(jQuery.map(this, callback));
    },
    pushStack: function (eles) {
      //创建一个新的实例
      var newObj = jQuery(eles);
      newObj.prevObject = this;
      return newObj;
    },
    end: function () {
      return this.prevObject || jQuery();
    }
  };

  //jQuery对象的扩展方法
  jQuery.extend = jQuery.fn.extend = function () {
    var arg = arguments;
    var length = arg.length;
    var target = arg[0];
    var i = 1;
    //如果只传了一个参数，将对象添加到this身上即可。
    if (length === 1) {
      target = this;
      i = 0;
    }

    //从i开始，把所有的对象的值都添加到第一个参数中
    for (; i < length; i++) {
      for (var k in arg[i]) {
        if (arg[i].hasOwnProperty(k)) {
          target[k] = arg[i][k];
        }
      }
    }

  };

  //给jQuery添加的静态方法，判断对象是否是一个类数组
  jQuery.extend({
    isArrayLike: function (obj) {
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
    },
    each: function (obj, callback) {

      if ("length" in obj) {
        for (var i = 0; i < obj.length; i++) {
          var result = callback.call(obj[i], i, obj[i]);
          if (result === false) {
            break;
          }
        }
      } else {
        for (var i in obj) {
          var result = callback.call(obj[i], i, obj[i]);
          if (result === false) {
            break;
          }
        }
      }

      return obj;

    },
    map: function (obj, callback) {
      var arr = [];
      if ("length" in obj) {
        for (var i = 0; i < obj.length; i++) {
          var result = callback.call(obj[i], i, obj[i]);
          if (result != null) {
            arr.push(obj[i]);
          }
        }
      } else {
        for (var i in obj) {
          var result = callback.call(obj[i], i, obj[i]);
          if (result != null) {
            arr.push(obj[i]);
          }
        }
      }

      return arr;
    }
  });


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

  //构造函数的原型与工厂函数的原型一致。
  init.prototype = jQuery.fn;


  //对外暴露了两个变量。
  window.$ = window.jQuery = jQuery;
  return jQuery;
});
