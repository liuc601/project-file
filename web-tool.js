/*
 当前项目的一些小工具
 * @Author: 刘沙
 * @Date: 2018-06-15
 */
define(function (require) {
  return {
    install: function (Vue) {
      for (var i in this) {
        if (i != 'install' && this[i] !== undefined) {
          Vue.prototype[i] = this[i];
        }
      }
      this.init();
    },
    init: function () {
      this.getArrayElement();
      this.arrayOnly();
      this.addStringFn();
      this.addDateFn();
    },
    cookieSet: function (c_name, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays * 1000000)
      document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
    },
    cookieGet: function (name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    },
    TimeLimit:function(fn,times){//函数节流；
      var timer=null,t=times||500;
      this.run = function(val){
          clearTimeout(timer);
          this.tims=setTimeout(fn.bind(null,val),t);
      }
    },
    addEvent: function (ele, xEvent, fn) { //事件绑定函数，用来绑定滚动事件用
      if (ele.attachEvent) {
        ele.attachEvent('on' + xEvent, fn);
      } else {
        ele.addEventListener(xEvent, fn, false);
      }
    },
    datetoMs: function (type, value) {
      var ms;
      switch (type) {
        case 's':
          ms = 1000 * value;
          break;
        case 'min':
          ms = 60 * 1000 * value;
          break;
        case 'h':
          ms = 60 * 60 * 1000 * value;
          break;
        case 'd':
          ms = 24 * 60 * 60 * 1000 * value;
          break;
      }
      return ms
    },
    getDateTime: function (dateObj,str) {
      var date = dateObj || new Date(),
        obj = {};
      obj.date = date;
      obj.y = date.getFullYear();
      obj.m = date.getMonth() + 1;
      obj.d = date.getDate();
      obj.h = date.getHours();
      obj.min = date.getMinutes();
      obj.s = date.getSeconds();
      //此时做时间位数处理
      var mm = parseInt(obj.m / 10) < 1 ? "0" + obj.m : obj.m;
      var dd = parseInt(obj.d / 10) < 1 ? "0" + obj.d : obj.d;
      var hh = parseInt(obj.h / 10) < 1 ? "0" + obj.h : obj.h;
      var minmin = parseInt(obj.min / 10) < 1 ? "0" + obj.min : obj.min;
      var ss = parseInt(obj.s / 10) < 1 ? "0" + obj.s : obj.s;
      var str=str?str:'/';
      obj.dateStr = obj.y + str + mm + str + dd;
      obj.timeStr = hh + ":" + minmin + ":" + ss;
      obj.fullStr = obj.dateStr + " " + obj.timeStr;
      return obj
    },
    isOverflowTime: function (dateFrom, dateTo, obj) { //比较两个时间是否有超过限制时间
      if (!obj || obj == {} || !obj['dateType'] || !obj['value'] || obj['value'] == 0) {
        throw '请输入正确的时间限制格式'
      }
      return dateTo.getTime() - dateFrom.getTime() > this.datetoMs(obj.dateType, obj.value);
    },
    basePromise: function (res) { //基础的promise写法，之后可以直接层层引用
      return new Promise(function (resolve, reject) {
        resolve(res);
      });
    },
    copyData: function (txt, fn) {
      var text = document.createElement("textarea");
      text.style.width = "1px";
      text.style.height = "1px";
      text.style.padding = "0px";
      text.style.position = "absolute";
      text.style.left = "0";
      text.style.bottom = "0";
      document.getElementsByTagName("body")[0].appendChild(text);
      text.value = txt;
      text.select(); // 选择对象
      if (document.execCommand("Copy")) {
        fn && fn();
        document.getElementsByTagName("body")[0].removeChild(text);
      }
    },
    getArrayElement: function () { //随机获取数组里面的数据
      Array.prototype.getArrayElement = function (num) {
        if (this.length == 0) {
          return []
        }
        var n = num || 1; //至少获取一个元素
        var a = [],
          len = this.length;
        for (var i = 0; i < num; i++) { //根据需要的个数，随机获取元素
          var item;
          do {
            item = this[parseInt(Math.random() * (len))] //生成下标,并且找到元素
          }
          while (!!~a.indexOf(item)); //生成的元素有没有重复，如果有重复就继续找一遍
          a.push(item);
        }
        return a;
      }
    },
    arrayOnly: function () { //随机获取数组里面的数据
      Array.prototype.arrayOnly = function () {
        var arr = [];
        this.forEach(function (item) {
          if (!~arr.indexOf(item)) {
            arr.push(item);
          }
        })
        return arr
      }
      //用来删除对象数组中，特定属性名的对象
      Array.prototype.deleteObjItem = function (attrname, value, bool) {
        var arr = [],
          index;
        this.forEach(function (item, is) {
          if (item[attrname] != value) {
            arr.push(item);
          } else {
            index = is;
          }
        })
        if (bool) {
          return this.splice(index, 1);
        } else {
          return arr
        }
      }
      //搜索数组中的项，符合的输出，此时数组中的内容只能是字符串
      Array.prototype.searchInArray = function (str) {
        var arr = [];
        var RegExps = new RegExp(str);
        this.forEach(function (item) {
          if (RegExps.test(item)) {
            arr.push(item);
          }
        });
        return arr
      }
    },
    addStringFn: function () { //随机获取数组里面的数据
      String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "")
      };
      String.prototype.lTrim = function () {
        return this.replace(/(^\s*)/g, "")
      };
      String.prototype.rTrim = function () {
        return this.replace(/(\s*$)/g, "")
      };
      String.prototype.startWith = function (val) {
        var strReg = new RegExp("^" + val);
        return strReg.test(this)
      };
      String.prototype.endWith = function (val) {
        var strReg = new RegExp(val + "$");
        return strReg.test(this)
      };
    },
    addDateFn() {
      Date.prototype.format = function (fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "D+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/([yY]+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
    },
    addNumberFn() {
      Number.prototype.format = function (fmt) {
        return new Date(this).format(fmt)
      }
    },
    clientWidthAndHeight() {
      if (window.innerHeight !== undefined) {
        return {
          "width": window.innerWidth,
          "height": window.innerHeight
        }
      } else if (document.compatMode === "CSS1Compat") {
        return {
          "width": document.documentElement.clientWidth,
          "height": document.documentElement.clientHeight
        }
      } else {
        return {
          "width": document.body.clientWidth,
          "height": document.body.clientHeight
        }
      }
    },
    colorValueProcess(color, number) {
      /* 处理颜色色值，整数加深，负数变浅 */
      // console.log(color);
      let _color = color.replace('#', '').split('');
      let str = '';
      let r, g, b;
      if (_color.length == 3) {
        _color.forEach(item => {
          str += item + item;
        })
        _color = str.split('');
      }
      r = parseInt(_color[0] + _color[1], 16);
      r = parseInt(r + r * number);
      g = parseInt(_color[2] + _color[3], 16);
      g = parseInt(g + g * number);
      b = parseInt(_color[4] + _color[5], 16);
      b = parseInt(b + b * number);
      return '#' + r.toString(16) + g.toString(16) + b.toString(16);
    },
    //vue的表单检查器，vue专有
    vueFormCheckBlank: function (str) {
      return function (rules, val, callback) {
        if (val === "" || val === undefined) {
          callback(new Error(str));
          return
        }
        if (val.match(/\s/ig)) {
          callback(new Error('不允许输入空格'));
          return
        }
        callback();
      }
    },
    getQueryString(name) {//用字符串拼接
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    }
  }
});
//type: 1 模块 2、 功能、 3 字段