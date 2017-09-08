//jquery整体就是一个匿名函数自调用，防止全局变量污染
//第一个参数：global, 在浏览器中运行时，传递的是window
//第二个参数：factory，这个函数返回一个jQuery工厂函数
//在jquery1.7版本之前，jquery不支持模块化，只需要一个global参数即可，第二个参数是为了支持模块化而设计的。
(function(global, factory){

  factory(global);

})(window, function(window){
  //jquery的主体代码
  console.log("呵呵");
});
