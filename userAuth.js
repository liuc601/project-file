define(function (require) {

  var Vue = require('vue');

  function Auth$(AuthData) { //需要传vue对象进来吗
    // if(AuthData.menuList.length>2){
    //   AuthData.menuList[1].childrens.push({
    //     childrens: [
    //       {
    //         code: "YYLB",
    //         id: 500022,
    //         name: "应用列表",
    //         url: "/index",
    //         urlType: 0
    //       },
    //     ],
    //     code: "APMJK",
    //     id: 500021,
    //     name: "APM监控",
    //     url: "/index",
    //     urlType: 0,
    //   })
    // }
    this.LISTOBJ = this.doAuthList(AuthData.functionList); //吧数据处理成索引的对象
    this.TOKENOBJ = this.getAllTokenList(AuthData.menuList); //吧数据处理成索引的对象
    this.MENUOBJ = AuthData.menuList; //吧数据处理成索引的对象
    this.router = null; //留着用来保存路由对象
    this.maxCopy = 10; //最大复制次数
    this.copyNum = 0;
    this.setVueIns();
  }
  Auth$.prototype.setVueIns = function () {
    /*
      设置指令的绑定
    */
    Vue.directive('auth$', {
      bind: function (el, binding) {
        if (!this.LISTOBJ[binding.value]) {
          el.style.display = "none";
        }
      }.bind(this),
      inserted: function (el, binding) {},
      update: function (el, binding) {
        if (!this.LISTOBJ[binding.value]) {
          el.style.display = "none";
        } else {
          el.style.display = "block";
        }
      }.bind(this)
    });
  }
  /*
    根据传进来的权限列表进行路由更新
  */
  Auth$.prototype.filtrationRoute = function (routeList) { //过滤路由对象
    this.forInArr(routeList[0].children,true); //遍历删除权限控制的菜单
    // console.log("初始的路由信息表",routeList);
    return routeList
  };
  Auth$.prototype.filtrationMenuList = function (routeList) { //过滤菜单列表
    this.forInArr(routeList,true); //遍历删除权限控制的菜单
    return routeList
  };
  Auth$.prototype.forInArr = function (list,bool) {
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (!this.LISTOBJ[item.meta.token] && !!item.meta.token) {
        // list.splice(i, 1);//原本的权限控制是使用删除路由的方式，现在采用设置路由meta信息的方式进行控制
        // i -= 1;
        item.meta["show"]=false
      } else {
        item.meta["show"]=true
        // console.log(item.title);
      }
      if(!bool){//如果从父元素传过来的为false的话，直接将设置show为false
        item.meta["show"]=false
      }
      if (item.children) {
        this.forInArr(item.children,item.meta["show"]);
      }
    }
  };
  Auth$.prototype.doAuthList = function (list) {
    /*
      如果没有列表的数据。就直接返回一个空对象
    */
    //  console.log(list);
    var obj = {};
    if (list === undefined || list.length < 0) {
      //设置你默认的列表
      list = ["GJD", "APMJRWD", "YYGL", "DYL", "LSXQTS", "FWDD", "LSHSHS", "MOTGLPT", "SSXQHS",
        "JKDY", "WXYYPT", "SSXQTS", "JKMOCK", "JKCS", "GK", "FWDY", "KSLJ", "KFZWD", "XQFW"
      ];
      // return obj
    }
    list.forEach(function (item) { //把权限列表转换成键值对形式存储
      obj[item] = item;
    });
    return obj
  };
  Auth$.prototype.isAuth = function (token) {
    // console.log(token,this.TOKENOBJ.indexOf(token)!=-1);
    if(token){
      return this.TOKENOBJ.indexOf(token)!=-1;
    }
    return false
  }
  Auth$.prototype.getAllTokenList = function (list) {
    var arr=[];
    this.deepForEach(list,'childrens',(item)=>{
      if(item.code){
        arr.push(item.code);
      }
    })
    arr.push("Login");
    arr.push("500");
    arr.push("404");
    arr.push("defaultcp");
    // console.log("根据后端返回列表获取到的token数据",arr);
    return arr;
  }
  Auth$.prototype.deepForEach = function (arr,attr,fn) {//深度遍历，根据传进来的属性进行遍历
    arr.forEach(item=>{
      fn&&fn(item);
      if(item[attr]&&item[attr].length!=0){
        this.deepForEach(item[attr],attr,fn);
      }
    })
  }

  return Auth$
});
//type: 1 模块 2、 功能、 3 字段