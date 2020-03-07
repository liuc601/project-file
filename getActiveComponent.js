/*
 要实现的功能
    1，可以根据path获取到组件
    2，初始化的时候将所有的路由弄成path=》组件的映射关系
    3，
 */
  var Vue = require('vue');
  var jq = require('jq');
  import home from "_pages/home/home.vue";
  var pathToRegexp=require('path-to-regexp-master');
  function GetActiveComponnent(routeList) {
    if (typeof Map == "undefined") {
      var Map = function () {
        this.keys = new Array();
        this.data = new Object();

        this.set = function (key, value) {
          if (this.data[key] == null) {
            if (this.keys.indexOf(key) == -1) {
              this.keys.push(key);
            }
          }
          this.data[key] = value;
        }

        this.get = function (key) {
          return this.data[key];
        }
      }
    }
    this.currentView = '';
    this.allViews = new Map();
    this.allToken = new Map();
    this.init(routeList);
  }
  GetActiveComponnent.prototype.init = function (routeList) { //在这边添加404页面
    routeList.options.routes[0].children.map(function (item) { //初始遍历
      this.getChildRoutes(this.allViews, "", item);
    }.bind(this));
    this.getChildRoutes(this.allViews, "", routeList.options.routes[1]); //添加登录页面
    this.getChildRoutes(this.allViews, "", routeList.options.routes[2]); //添加404页面
    this.getChildRoutes(this.allViews, "", routeList.options.routes[3]); //添加500页面
    //需要在权限页面将404，500，default，token放入数组中
  }; //获取所有的子路由

  GetActiveComponnent.prototype.getChildRoutes = function (allViews, path, r) { //获取所有的子路由
    r.component.meta=r.meta;//把一些组件信息放在组件这个对象当中
    this.allViews.set(this.getFullPath(path, r.path), r.component);
    //保存所有有token的路由
    if(r.meta.token){
      this.allToken.set( r.meta.token, this.getFullPath(path, r.path));
    }
    if (r.children) {
      r.children.forEach(function (cr) {
        this.getChildRoutes(this.allViews, this.getFullPath(path, r.path), cr);
      }.bind(this));
    }
  };
  GetActiveComponnent.prototype.getFullPath = function (pPath, cPath) {
    if (pPath == "/" && cPath.substr(0, 1) != "/") {
      return pPath + cPath;
    } else if (pPath == "/" && cPath.substr(0, 1) == "/") {
      return cPath;
    } else if (pPath != "/" && cPath.substr(0, 4) == "http") {//特殊处理快速链接的链接
      return cPath;
    } else if (pPath != "/" && cPath.substr(0, 1) != "/") {
      return pPath + "/" + cPath;
    } else if (pPath != "/" && cPath.substr(0, 2) == "//") {//特殊处理监控平台的链接
      return cPath;
    } else {
      return pPath + cPath;
    }
  };
  GetActiveComponnent.prototype.getActive = function (_path) { //获取当前活动的路由
    if (!_path || _path.length == 0) {
      return null; //之后嵌入404
    }
    if (_path.length == 1 && _path[0].name == '首页') { //因为获取到的map中没有'/'的配置，所以直接手动设置一个动态组件
      return home;
    }
    var path = _path[_path.length - 1].path;

    return this.GetActiveComponentInPath(path);
  };
  GetActiveComponnent.prototype.GetActiveComponentInPath = function (path) { //根据直接的路由地址来获取相对应的组件
    var result = this.allViews.get(path);
    // 面包屑会时path变成解析后的？
    if (result == null) { //如果没有获取到组件
      this.allViews.keys.forEach(function (v, k) {
        var re = pathToRegexp(v);
        if (re.test(path)) {
          result = this.allViews.get(v);
          return false;
        }
      }.bind(this));
    }
    return result;
  };
  GetActiveComponnent.prototype.GetActiveComponentLikePath = function (path) { //根据相似的path给出组件
    var result=null;
      this.allViews.keys.forEach(function (v, k) {
        if (v.indexOf(path)!=-1) {
          result = this.allViews.get(v);
          return false;
        }
      }.bind(this));
    return result;
  };
  GetActiveComponnent.prototype.getPathInToken = function (token,name) { //2019.09.09新增方法，根据token来获取路由地址
    if(!token){//，如果没有配置token
      // console.log(name+" :没有配置token。");
      console.info("%c"+name+" :没有配置token。","color:orange");
      return this.allToken.get('defaultcp');
      // throw name+" :没有配置token。";
    }
    if(this.allToken.get(token)){
      return this.allToken.get(token);
    }else{
      //2019.09.24如果没有找到对应的路由地址，就直接指向默认的地址，显示正在建设中
      // console.log(name+'  '+token+":没有找到对应路由。");
      console.info("%c"+name+'  '+token+":没有找到对应路由。","background-color:#FFFBE5");
      return this.allToken.get('defaultcp');
    }
  };
  module.exports=GetActiveComponnent