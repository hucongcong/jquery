//jQuery整体就是一个匿名函数自调用，防止全局变量污染
//第一个参数：global, 在浏览器中运行时，传递的是window
//第二个参数：factory，这个函数返回一个jQuery工厂函数
//在jQuery1.7版本之前，jQuery不支持模块化，只需要一个global参数即可，第二个参数是为了支持模块化而设计的。
(function(global, factory){

  factory(global);

})(window, function(window){
  //jQuery主体代码
  
  //创建jQuery函数
  var jQuery = function(){
    //使用工厂函数创建jQuery函数
    return new jQuery.fn.init();
  };
  
  //替换jQuery原型属性,起一个别名jQuery.fn,方便使用
  jQuery.fn = jQuery.prototype = {
    constructor:"jQuery",//修改构造器
  };

  //jquery内部隐藏的构造函数（入口函数）
  var init = jQuery.fn.init = function(){

  };
  //构造函数的原型与工厂函数的原型一致。
  init.prototype = jQuery.fn;

  //对外暴露了两个变量。
  window.$ = window.jQuery = jQuery;
  return jQuery;
});
