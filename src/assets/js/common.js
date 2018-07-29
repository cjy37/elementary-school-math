//定义一个立即执行的函数
(function(w) {

    /*
     * 替换字符串
     * */
    String.prototype.replaceAll = function(pattern, replaceValue) {
      replaceValue = replaceValue || '';
      if (this.replace) {
        return this.replace(new RegExp(pattern, "gm"), replaceValue);
      } else
        return "";
    };
  
    /*
     * 删除前后空格
     * */
    String.prototype.Trim = function() {
      if (this.match) {
        var m = this.match(/^\s*(\S+(\s+\S+)*)\s*$/);
        return (m == null) ? "" : m[1];
      } else
        return "";
    };
  
    //加法
    Number.prototype.add = function(arg) {
      var r1, r2, m;
      try {
        r1 = this.toString().split(".")[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg.toString().split(".")[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      return (this * m + arg * m) / m
    };
  
    //减法
    Number.prototype.sub = function(arg) {
      return this.add(-arg);
    };
  
    w.pageView = function (pageURL) {
      if (!w._hmt)
        return;
      console.log('统计访问：', pageURL);
      _hmt.push(['_trackPageview', pageURL]);
    };

    w.trackEvent = function (eventName, info) {
      if (!w._hmt)
        return;
      _hmt.push(['_trackEvent', '按钮事件', eventName, 'click', info]);
    }
      // 格式化题目和答案
      w.formatTopics = function(topicNum, inputText, topics, answers) {
  
          // 格式化文本
          var txt = inputText.replaceAll('\t', '')
              //.replaceAll('\r\n', '')
              //.replaceAll('\n', '')
              //.replaceAll('\r', '')
              .replaceAll(' ', '')
              .replaceAll('＋', '+')
              .replaceAll('－', '-')
              .replaceAll('＝', '=')
              .replaceAll('　', '');
  
          // 文本转为数组. topicNum
          var tmpTopics = txt.split(/\n/);
  
          var len = tmpTopics.length;
          for (var i = 0; i < topicNum; i++) {
              var tmpItem = tmpTopics[Math.floor(Math.random() * len)];
              if (topics.indexOf(tmpItem) > -1) {
                  // 重复，重算
                  console.log('重复，重算');
                  tmpItem = tmpTopics[Math.floor(Math.random() * len)];
              }
              topics.push(tmpItem.replace('()', '( )'));
          }
          // 计算答案
          topics.forEach(function(item, index) {
              var value = execExpression(item);// 计算答案
              console.log('计算结果：', (index + 1), item, '=', value);
              answers.push(value);
          });
      }
  
      w.execExpression = function (expression) {
          if (expression.indexOf('=') == expression.length-1){
              // 普通加减
              return eval(expression.replace('=',''));
          } else {
              // 形如: a + b - (x) = c, 计算x
              var ab = expression.split('=');
              var a = 0;
              var b = 0;
              if (ab[0].indexOf('( )')>-1){
                  a = eval(ab[1]);
                  b = eval(ab[0].replace('( )','0'));
              } else {
                  a = eval(ab[0]);
                  b = eval(ab[1].replace('( )','0'));
              }
              return Math.abs(a - b);
          }
      }

    w.fireDocumentEvent = function(eventName, data) {
      var event;
  
      if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true);
      } else {
        event = document.createEventObject();
        event.eventType = eventName;
      }
  
      event.eventName = eventName;
      event.data = data;
  
      if (document.createEvent) {
        document.dispatchEvent(event);
      } else {
        document.fireEvent("on" + event.eventType, event);
      }
    };
  
    w.scopeApply = function($scope) {
      if ($scope.$root && $scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$apply();
      }
    };
  
    var Ticts = function Ticts() {
      this.ticts = {};
    };
  
    Ticts.prototype.createTicts = function(id, dealline) {
      var ticts = this;
      var time = moment(dealline).diff(moment());
      var old = this.ticts[id];
      if (old){
        clearInterval(old.interval);
      }
      var _ticts = this.ticts[id] = {
        dealine: dealline,
        id: id,
        time: time,
        interval: setInterval(function() {
          var t = null;
          var d = null;
          var h = null;
          var m = null;
          var s = null;
  
          //js默认时间戳为毫秒,需要转化成秒
          t = _ticts.time / 1000;
          d = Math.floor(t / (24 * 3600));
          h = Math.floor((t - 24 * 3600 * d) / 3600);
          m = Math.floor((t - 24 * 3600 * d - h * 3600) / 60);
          s = Math.floor((t - 24 * 3600 * d - h * 3600 - m * 60));
  
          //这里可以做一个格式化的处理,甚至做毫秒级的页面渲染,基于DOM操作,太多个倒计时一起会导致页面性能下降
          var dom = document.getElementById(id);
          if (dom == null)
            return;
          dom.innerHTML = (d > 0 ? d + '天' : '') + (h > 0 ? h + '小时' : '') + (m > 0 ? m + '分钟' : '') + s + '秒';
  
          _ticts.time -= 1000;
          if (_ticts.time < 0) {
            ticts.deleteTicts(id); //判断是否到期,到期后自动删除定时器
            fireDocumentEvent('topictimeout', '超时到期');
          }
        }, 1000)
      }
    };
    Ticts.prototype.deleteTicts = function(id) {
      var timer = this.ticts[id];
      if (timer) {
        //清楚定时器的方法,需要定时器的指针作为参数传入clearInterval
        clearInterval(this.ticts[id].interval);
  
        //通过delete的方法删除对象中的属性
        delete this.ticts[id];
      }
    };
  
    //新建一个ticts对象,放到window全局函数中,那么在html页面是(或者其他js文件)可以访问该对象
    w.Ticts = new Ticts();
  })(window);
  