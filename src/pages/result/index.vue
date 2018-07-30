<script>
import Vue from 'vue';
import __ from '../../assets/js/common';

export default {
    data() {
        return this.GLOBAL;
    },
    methods: {
        restart() {
            var newScope = {
                lines: [],
                answers: [],
                resulut: [],
                model: {
                    topicNum: 20,
                    times: 2,
                    timeout2Stop: true,
                    level: 'topic1000',
                    startTime: null,
                    useTime: null,
                    tenTopicTime: null,
                    analysisResult: '',
                    step: 'step1',
                    topicIndex: 0,
                    isError: false
                }
            };
            var historyModel = { 
                model: {
                    topicNum: this.model.topicNum,
                    times: this.model.times,
                    timeout2Stop: this.model.timeout2Stop,
                    level: this.model.level
                }
            };
            _.extend(this, newScope, historyModel);

            __.trackEvent('再次挑战', '-');
            this.$router.push('/index');
        }

    }
}
</script>

<template>

<div class="page home">
    <div class="page__hd">
        <h1 class="page__title">挑战结果</h1>
        <div class="page__desc">本次答题用掉{{model.useTime}}，做10题要{{model.tenTopicTime}}。
            <div class="result-box" v-html="model.analysisResult"></div>
            <a class="weui-btn weui-btn_primary" style="margin-top: 20px" href="javascript:" @click="restart()">再挑战一次</a>
        </div>
    </div>

    <div class="page__bd">
        <div class="weui-cells__title">详细结果</div>
        <div class="weui-cells">

            <div class="weui-cell weui-cell_access"  v-for="(topic, i) in lines" :key="i">
                <div class="weui-cell__bd">
                    <span class="weui-badge" style="margin-right: 2px;" :class="{'label-success': (resulut[i]==answers[i]+''), 'label-danger': (resulut[i]!=answers[i]+'') }">{{i+1}}</span>
                    <span style="vertical-align: middle">{{topic}}</span>
                    
                </div>
                <div class="weui-cell__ft" v-if="(resulut[i]!=answers[i]+'')">正确答案：{{answers[i]}}<i class="weui-icon-warn"></i></div>
                <div class="weui-cell__ft" v-if="(resulut[i]==answers[i]+'')"><i class="weui-icon-success-no-circle"></i></div>
            </div>
            
        </div>

        <div class="weui-form-preview" style="margin:20px 0;height:auto">
            <div class="weui-form-preview__hd">
                <div class="weui-form-preview__item">
                    <label class="weui-form-preview__label">额外说明</label>
                </div>
            </div>
            <div class="weui-form-preview__bd">
                <div class="weui-form-preview__item">
                    <label class="weui-form-preview__label">1. 觉得这小程序不错，请赞赏告诉我 : )
                        <br>2. 有好的想法告诉我，请赞赏留言 : )
                        <br>3. 后续功能：
                        <br>　1) 存储每一次的成绩
                        <br>　2) 统计进步曲线
                        <br>　3) 记录做的慢的题
                        <br>　4) 记录易错题
                    </label>
                </div>
                <div class="weui-form-preview__item">
                    <label class="weui-form-preview__label">4. 长按二维码识别赞赏</label>
                </div>
                <div class="weui-form-preview__item">
                    <label class="weui-form-preview__label">
                        <img src="../../assets/logo.jpg" style="width: 60%;margin: 10px auto;display: block;">
                    </label>
                </div>
            </div>
            <div class="weui-form-preview__ft">
                <span class="weui-form-preview__btn weui-form-preview__btn_primary" href="javascript:">= 已经到底了 =</span>
            </div>
        </div>

    </div>
</div>

</template>
