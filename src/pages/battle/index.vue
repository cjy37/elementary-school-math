<script>
import Vue from "vue"
import _ from 'lodash';
import __ from '../../assets/js/common';
import moment from 'moment';
import 'moment/locale/zh-cn';  // without this line it didn't work
moment.locale('zh-cn');

export default {
  data() {
    return this.GLOBAL
  },
  methods: {
    nextTopic() {
      var currAnswer = this.resulut[this.model.topicIndex]
      if (_.isUndefined(currAnswer) || _.isNull(currAnswer) || currAnswer == "") {
        this.model.isError = true
        return
      } else {
        this.model.isError = false
      }

      if (this.model.topicIndex + 1 == this.lines.length) {
        this.done()
      } else {
        this.prvNextStep(1)
      }
    },
    prvNextStep(idx) {
      if (idx == -1 && this.model.topicIndex == 0) 
        return;
      if (idx == 1 && this.model.topicIndex + 1 == this.lines.length)
        return;

      // 未完成答题，显示下一题（只需要改变题号）
      this.model.topicIndex = this.model.topicIndex + idx
      Vue.set(this.resulut, this.model.topicIndex, "")
    },
    showTopicAndAnswer() {
      var topic = this.lines[this.model.topicIndex]
      var answer = this.resulut[this.model.topicIndex]
      if (!answer) 
        return topic;
      var tmpAns = '<font color="red">' + answer + "</font>"
      if (topic.indexOf("( )") > -1) 
        return topic.replace("( )", tmpAns);
      else 
        return topic + tmpAns;
    },
    touchAdd(chart) {
      var old = _.isUndefined(this.resulut[this.model.topicIndex])
        ? ""
        : this.resulut[this.model.topicIndex]
      var newValue = old + chart
      if (newValue.length > 1 && newValue.charAt(0) == "0")
        newValue = newValue.substr(1)
      if (newValue.length > 1 && newValue.charAt(0) == "0")
        newValue = newValue.substr(1)
      Vue.set(this.resulut, this.model.topicIndex, newValue)
    },
    touchSub() {
      var old = _.isUndefined(this.resulut[this.model.topicIndex])
        ? ""
        : this.resulut[this.model.topicIndex];

      Vue.set(
        this.resulut,
        this.model.topicIndex,
        old.substr(0, old.length - 1)
      )
    },
    touchClear() {
      Vue.set(this.resulut, this.model.topicIndex, "")
    },
    done() {
      __.Ticts.deleteTicts("times")

      // 完成答题，显示答案：
      this.model.step = "step3"

      // ==== 以下为统计结果 ====

      // 计算用时
      var tmpUseTimes = moment().diff(this.model.startTime)
      var scopeTxt = "答对{rightNum}题，答错{errorNum}题，漏答{unAnswerNum}题，<p>得分: <span>{score}</span></p>"
      var rightNum = 0
      var errorNum = 0
      var unAnswerNum = 0
      var score = 0
      var _this = this;
      // 计算对题量与未答题量
      this.answers.forEach(function(answer, index) {
        // 用户输入的答案
        var userAnswer = _this.resulut[index]
        var currTopic = _this.lines[index]
        // 未答
        if (_.isUndefined(userAnswer) || userAnswer == "") {
          unAnswerNum++
          return
        }

        if (currTopic.indexOf("(") > -1) {
          Vue.set(
            _this.lines,
            index,
            currTopic.replace("( )", "(" + userAnswer + ")")
          )
        } else {
          Vue.set(_this.lines, index, currTopic + userAnswer)
        }

        //做对
        if (parseInt(userAnswer) == parseInt(answer)) {
          rightNum++
        } else {
          console.log("错题", parseInt(userAnswer), parseInt(answer), index)
          errorNum++
        }
      })

      // 得分
      score = Math.round(rightNum * 100 / this.model.topicNum)

      //格式化分析文本： 做对多少，做错多少，未答多少
      this.model.analysisResult = scopeTxt
        .replace("{rightNum}", rightNum)
        .replace("{errorNum}", errorNum)
        .replace("{unAnswerNum}", unAnswerNum)
        .replace("{score}", score)

      // 友好化提示
      if (score >= 90) {
        this.model.analysisResult += "干得漂亮，继续保持哦！"
      } else {
        this.model.analysisResult += "有待提升，再接再厉吧！"
      }

      // 计算用时
      this.model.useTime = moment(tmpUseTimes).utc().format("H小时m分s秒")
      if (this.model.topicNum > unAnswerNum){
        this.model.tenTopicTime = moment( Math.floor(tmpUseTimes / (this.model.topicNum - unAnswerNum) * 10) )
          .utc().format("m分s秒")
      } else {
        this.model.tenTopicTime = "100年"
      }
      __.trackEvent("挑战结束", "-")
      __.pageView("/result")
      this.$router.push("/result")
    },
    onTimeout(e) {
      __.stopEvent(e);
      if (this.model.timeout2Stop) {
        console.log("超时了。。。");
        this.done();
      }
      document.removeEventListener("topictimeout", this.onTimeout, false);
    }
  },
  created: function() {
    if (!this.lines || this.lines.length == 0) {
      this.$router.push("/index")
      return
    }
    document.addEventListener("topictimeout", this.onTimeout, false)
  }
}
</script>

<template>
    <div class="page battle">
    <div class="weui-form-preview">
        <div class="weui-form-preview__hd">
            <div class="weui-form-preview__item">
                <label class="weui-form-preview__label">
                    第{{(model.topicIndex+1)}}/{{lines.length}}题
                </label>
                <span style="position: absolute; right: 10px;">总共还有：
                    <span id="times" style="color: red;font-weight: bold;"></span>
                </span>
            </div>
        </div>
        <div class="weui-form-preview__bd">
            <div class="weui-form-preview__item">
                <h1 class="page__title" v-html="showTopicAndAnswer()"></h1>
            </div>
        </div>
    </div>
    <div class="weui-footer weui-footer_fixed-bottom">
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell weui-cell_vcode">
                <div class="weui-cell__bd answer-input" :class="{'has-error has-feedback': model.isError}">
                    <input class="weui-input" type="number" placeholder="写答案" v-model="resulut[model.topicIndex]" readonly>
                </div>
                <div class="weui-cell__ft">
                    <button class="weui-vcode-btn" @click="touchSub()">⌫</button>
                </div>
            </div>
        </div>
        <div class="weui-grids" style="heigth:50vh">
            <a href="javascript:;" class="weui-grid" @click="touchClear()">
                <p class="weui-grid__label">✖</p>
            </a>
            <a href="javascript:;" class="weui-grid" @click="touchAdd(0)">
                <p class="weui-grid__label">0</p>
            </a>
            <a href="javascript:;" class="weui-grid" @click="nextTopic()">
                <p class="weui-grid__label">✔</p>
            </a>
            <a href="javascript:;" class="weui-grid" @click="touchAdd(1)">
                <p class="weui-grid__label">1</p>
            </a>
            <a href="javascript:;" class="weui-grid" @click="touchAdd(2)">
                <p class="weui-grid__label">2</p>
            </a>
            <a href="javascript:;" class="weui-grid" @click="touchAdd(3)">
                <p class="weui-grid__label">3</p>
            </a>
            <a href="javascript:;" class="weui-grid" @click="touchAdd(4)">
                <p class="weui-grid__label">4</p>
            </a>
            <a href="javascript:;" class="weui-grid" @click="touchAdd(5)">
                <p class="weui-grid__label">5</p>
            </a>
            <a href="javascript:;" class="weui-grid" @click="touchAdd(6)">
                <p class="weui-grid__label">6</p>
            </a>
            <a href="javascript:;" class="weui-grid" @click="touchAdd(7)">
                <p class="weui-grid__label">7</p>
            </a>
            <a href="javascript:;" class="weui-grid" @click="touchAdd(8)">
                <p class="weui-grid__label">8</p>
            </a>
            <a href="javascript:;" class="weui-grid" @click="touchAdd(9)">
                <p class="weui-grid__label">9</p>
            </a>
        </div>
    </div>
</div>
</template>
