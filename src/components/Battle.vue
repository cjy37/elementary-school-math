<script>
    import Vue from 'vue';

    export default {
	  data() {
		return this.GLOBAL;
	  },
	  methods: {
		nextTopic() {
            var $scope = this;
            var currAnswer = $scope.resulut[$scope.model.topicIndex];
            if (_.isUndefined(currAnswer) || _.isNull(currAnswer) || currAnswer == '') {
                $scope.model.isError = true;
                return;
            } else {
                $scope.model.isError = false;
            }

            if ($scope.model.topicIndex + 1 == $scope.lines.length) {
                $scope.done();
            } else {
                $scope.prvNextStep(1);
            }

        },
        prvNextStep(idx) {
            var $scope = this;
            if (idx == -1 && $scope.model.topicIndex == 0)
                return;
            if (idx == 1 && $scope.model.topicIndex + 1 == $scope.lines.length)
                return;
            // 未完成答题，显示下一题（只需要改变题号）
            $scope.model.topicIndex = $scope.model.topicIndex + idx;
            Vue.set($scope.resulut, $scope.model.topicIndex, '');
        },
        showTopicAndAnswer() {
			var $scope = this;
            var topic = $scope.lines[$scope.model.topicIndex];
			var answer = $scope.resulut[$scope.model.topicIndex];
			if (!answer)
				return topic;
			var tmpAns = '<font color="red">' + answer + '</font>';
			if (topic.indexOf('( )') > -1)
				return topic.replace('( )', tmpAns);
			else 
				return topic + tmpAns;
		},
        touchAdd(chart) {
            var $scope = this;
            var old = _.isUndefined($scope.resulut[$scope.model.topicIndex]) 
                ? '' 
                : $scope.resulut[$scope.model.topicIndex];
            var newValue = old + chart;
            if (newValue.length > 1 && newValue.charAt(0) == '0')
                newValue = newValue.substr(1);
            if (newValue.length > 1 && newValue.charAt(0) == '0')
                newValue = newValue.substr(1);
            Vue.set($scope.resulut, $scope.model.topicIndex, newValue);
        },
        touchSub() {
            var $scope = this;
            var old = _.isUndefined($scope.resulut[$scope.model.topicIndex]) 
                ? '' 
                : $scope.resulut[$scope.model.topicIndex];
            Vue.set($scope.resulut, $scope.model.topicIndex, old.substr(0, old.length-1));
        },
        touchClear() {
            var $scope = this;
            Vue.set($scope.resulut, $scope.model.topicIndex, '');
        },
        done() {
            var $scope = this;

            Ticts.deleteTicts('times');

            // 完成答题，显示答案：
            $scope.model.step = 'step3';

            // ==== 以下为统计结果 ====

            // 计算用时
            var tmpUseTimes = moment().diff($scope.model.startTime);
            var scopeTxt = '答对{rightNum}题，答错{errorNum}题，漏答{unAnswerNum}题，<p>得分: <span>{score}</span></p>';
            var rightNum = 0;
            var errorNum = 0;
            var unAnswerNum = 0;
            var score = 0;

            // 计算对题量与未答题量
            $scope.answers.forEach(function(answer, index) {

                // 用户输入的答案
                var userAnswer = $scope.resulut[index];
                var currTopic = $scope.lines[index];
                // 未答
                if (_.isUndefined(userAnswer) || userAnswer == '') {
                    unAnswerNum++;
                    return;
                }

                if (currTopic.indexOf('(') > -1){
                    Vue.set($scope.lines, index, currTopic.replace('( )', '('+userAnswer+')'));
                } else {
                    Vue.set($scope.lines, index, currTopic+userAnswer);
                }

                //做对
                if (parseInt(userAnswer) == parseInt(answer)) {
                    rightNum++;
                } else {
                    console.log("错题", parseInt(userAnswer), parseInt(answer), index);
                    errorNum++;
                }
            });

            // 得分
            score = Math.round(rightNum * 100 / $scope.model.topicNum);

            //格式化分析文本： 做对多少，做错多少，未答多少
            $scope.model.analysisResult = scopeTxt.replace('{rightNum}', rightNum)
                .replace('{errorNum}', errorNum)
                .replace('{unAnswerNum}', unAnswerNum)
                .replace('{score}', score);

            // 友好化提示
            if (score >= 90) {
                $scope.model.analysisResult += '干得漂亮，继续保持哦！';
            } else {
                $scope.model.analysisResult += '有待提升，再接再厉吧！';
            }

            // 计算用时
            $scope.model.useTime = moment(tmpUseTimes).utc().format('H小时m分s秒');
            if ($scope.model.topicNum > unAnswerNum)
                $scope.model.tenTopicTime = moment(Math.floor(tmpUseTimes / ($scope.model.topicNum -
                unAnswerNum) * 10)).utc().format('m分s秒');
            else
                $scope.model.tenTopicTime = '100年';

            window.trackEvent('挑战结束', '-');
            window.pageView('/Result');
            $scope.$router.push('/Result');
            
        },
        onTimeout(e) {
            stopEvent(e);
            var $scope = this;
            if ($scope.model.timeout2Stop) {
                console.log('超时了。。。')
                $scope.done();
            }
            document.removeEventListener('topictimeout', $scope.onTimeout, false);
        }
      },
      created: function () {
        var $scope = this;
        if (!$scope.lines || $scope.lines.length == 0){
            $scope.$router.push('/');
            return;
        }
        document.addEventListener('topictimeout', $scope.onTimeout, false);
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
            <a href="javascript:;" class="weui-grid"  @click="touchAdd(0)">
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

