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
    },
    type: function (obj) {
      //获取对象的类型
      //如果是null，直接返回null， 如果是undefined，返回undefined
      if (obj == null) {
        return obj + "";
      }

      var temp = Object.prototype.toString.call(obj);
      temp = temp.split(" ")[1].slice(0, -1);
      return typeof obj === "object" ?
      temp || "object" :
        typeof obj;
    },
    getStyle: function (ele, styleName) {
      //获取元素计算后的样式
      if ("getComputedStyle" in window) {
        return window.getComputedStyle(ele, null)[styleName];
      } else {
        return ele.currentStyle[styleName];
      }
    }
  });

  //样式与属性模块
  jQuery.fn.extend({
    //操作标签的属性节点
    attr: function (name, value) {
      var arg = arguments;
      var argLength = arg.length;
      if (argLength == 1) {

        if ($.type(arg[0]) === "string") {
          //获取
          return this.get(0).getAttribute(arg[0]);
        }

        if ($.type(arg[0]) === "Object") {
          //设置
          this.each(function () {
            //遍历对象
            for (var k in arg[0]) {
              this.setAttribute(k, arg[0][k]);
            }
          })
        }

      }
      if (argLength == 2) {
        //设置
        var name = arg[0];
        var value = arg[1];
        this.each(function () {
          this.setAttribute(name, value);
        })
      }

      return this;

    },
    //操作对象的属性
    prop: function (name, value) {
      var arg = arguments;
      var argLength = arg.length;
      if (argLength == 1) {

        if ($.type(arg[0]) === "string") {
          //获取
          return this.get(0)[arg[0]];
        }

        if ($.type(arg[0]) === "Object") {
          //设置
          this.each(function () {
            //遍历对象
            for (var k in arg[0]) {
              this[k] = arg[0][k];
            }
          })
        }

      }
      if (argLength == 2) {
        //设置
        var name = arg[0];
        var value = arg[1];
        this.each(function () {
          this[name] = value;
        })
      }

      return this;
    },
    //操作value属性
    val: function (val) {
      var arg = arguments;
      //不传参数是获取
      if (arg.length === 0) {
        return this.prop("value");
      }

      //传一个参数是设置
      if (arg.length === 1) {
        return this.prop("value", val);
      }
    },
    //操作style属性
    css: function (name, value) {
      var arg = arguments, length = arg.length;
      if (length === 1) {

        //获取
        if (jQuery.type(name) === "string") {
          return $.getStyle(this.get(0), name);
        }

        //设置
        if (jQuery.type(name) === "Object") {
          this.each(function () {
            for (var k in name) {
              this.style[k] = name[k];
            }
          });
        }
      }
      //两个参数，表示设置
      if (length == 2) {
        this.each(function () {
          this.style[name] = value;
        })
      }
      return this;
    },
    //判断class
    hasClass: function (name) {
      //思路：只要有其中一个对象有对应的class，就返回true
      name = " " + name.trim() + " ";
      //假设不存在
      var flag = false;

      this.each(function () {

        //给className前后都拼接上空格
        var className = " " + this.className + " ";

        if (className.indexOf(name) > -1) {
          //只要找到了，就返回true
          flag = true;

          //如果是true，直接退出
          return false;
        }
      });
      return flag;
    },
    //添加class
    addClass: function (name) {
      var names = name.split(" ");
      this.each(function () {
        var tempStr = this.className;
        for (var i = 0; i < names.length; i++) {
          //如果没有，就添加
          if (!$(this).hasClass(names[i])) {
            tempStr += " " + names[i];
          }
        }
        this.className = tempStr.trim();
      });
      return this;
    },
    //移除class
    removeClass: function (name) {
      var names = name.split(" ");
      this.each(function () {
        for (var i = 0; i < names.length; i++) {
          //如果没有，就添加
          if ($(this).hasClass(names[i])) {
            this.className = " " + this.className + " ";
            this.className = this.className.replace(" " + names[i] + " ", " ").trim();
          }
        }
      });
      return this;

    },
    //切换类
    toggleClass: function (name) {
      var names = name.split(" ");
      this.each(function () {
        for (var i = 0; i < names.length; i++) {
          //如果没有，就添加
          if ($(this).hasClass(names[i])) {
            $(this).removeClass(names[i]);
          } else {
            $(this).addClass(names[i]);
          }
        }

      });
      return this;
    }
  });
  //节点操作模块
  jQuery.fn.extend({
    /**
     * 操作标签内容（innerHTML）
     1. 如果不传参数，获取第一个元素对应的内容
     2. 如果传参数表示设置，设置所有的元素
     2.1 如果参数是null，清空原来的内容
     2.2 如果参数是字符串，清空原来的内容并覆盖
     * @param val
     * @returns {*}
     */
    html: function (val) {
      //获取
      if (arguments.length === 0) {
        return this.get(0).innerHTML;
      }
      //设置
      if (arguments.length === 1) {
        if (val === null) {
          val = "";
        }
        if (typeof val === "string") {
          this.each(function () {
            this.innerHTML = val;
          });
        }
      }
      return this;
    },
    /*
     操作标签内容（innerText）
     1. 如果不传参数，将所有元素的文本拼接成一个字符串
     2. 如果传参数表示设置，设置所有的元素
     2.1 如果参数是null，清空原来的内容
     2.2 如果参数是字符串，清空原来的内容并覆盖
     */
    text: function (val) {
      //获取
      if (arguments.length === 0) {
        var tempStr = "";
        this.each(function () {
          tempStr += this.innerText + "\n";
        });
        return tempStr;
      }
      //设置
      if (arguments.length === 1) {
        if (val === null) {
          val = "";
        }
        if (typeof val === "string") {
          this.each(function () {
            this.innerText = val;
          });
        }
      }
      return this;
    },

    /**
     * 清空当前元素的所有内容
     * @returns {jQuery}
     */
    empty: function () {
      this.html(null);
      return this;
    },
    /**
     * 自杀
     * @returns {jQuery}
     */
    remove: function () {
      this.each(function () {
        this.parentNode.removeChild(this);
      });
      return this;
    },

    /**
     * 将当前jQuery对象添加到指定元素的最后面
     * @param selector 选择器、DOM对象、Jquery对象
     * @returns {jQuery}
     */
    appendTo: function (selector) {
      //无论传什么参数，都转换成jq对象
      var target = $(selector);
      var that = this;//将this存储到that中，方便使用

      //使用数组将所有对象储存起来
      var tempArr = [];
      //需要将that添加到每一个target DOM元素中
      target.each(function (i) {

        var _target = this;
        that.each(function () {
          //将遍历出来的DOM对象添加到目标对象中,如果第二次以上添加，需要克隆当前对象
          var temp = i === 0 ? this : this.cloneNode(true);
          _target.appendChild(temp);
          tempArr.push(temp)
        })
      });

      return this.pushStack(tempArr);
    },

    /**
     * 给自己添加子元素
     * @param value jq对象 dom对象 内容（会创建）
     * @returns {jQuery} 当前对象，
     */
    append: function (value) {
      /*
       实现思路：
       1. 如果参数类型是字符串，直接使用innerHTML进行追加即可
       2. 如果参数是DOM对象，或者JQ对象，统一使用jQuery方法进行包装
       3. 借助append方法进行实现
       */
      if (typeof value === "string") {
        this.each(function () {
          this.innerHTML += value;
        });
      } else {
        jQuery(value).appendTo(this);
      }
      return this;
    },
    /**
     * 添加到最前面
     * @param selector
     * @returns {*}
     */
    prependTo: function (selector) {
      //无论传什么参数，都转换成jq对象
      var target = $(selector);
      var that = this;//将this存储到that中，方便使用

      //使用数组将所有对象储存起来
      var tempArr = [];
      //需要将that添加到每一个target DOM元素中
      target.each(function (i) {
        var _target = this;
        //为了保证顺序，需要逆向遍历
        for (var j = that.length - 1; j >= 0; j--) {
          //将遍历出来的DOM对象添加到目标对象中,如果第二次以上添加，需要克隆当前对象
          var temp = i === 0 ? that[j] : that[j].cloneNode(true);
          _target.insertBefore(temp, _target.firstChild);
          tempArr.push(temp)
        }

      });

      return this.pushStack(tempArr);
    },
    prepend: function (value) {
      if (typeof value === "string") {
        this.each(function () {
          this.innerHTML = vlaue + this.innerHTML;
        });
      } else {
        jQuery(value).prependTo(this);
      }
      return this;
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
