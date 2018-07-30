<script>
import moment from 'moment';
import 'moment/locale/zh-cn';  // without this line it didn't work
moment.locale('zh-cn');

import __ from '../../assets/js/common';
import topic10 from '../../assets/js/topics10';
import topic1000 from '../../assets/js/topics1000';
import topic99 from '../../assets/js/topics99';

const topics = {topic10, topic1000, topic99}

    export default {
        data() {
            return this.GLOBAL;
        },
        methods: {
            onDashang(){
                __.trackEvent('赞赏', '首页进入');
                __.pageView('/dashang');
                this.$router.push('/dashang');
            },
            onStep1Click() {
                // 重新设置题号
                this.model.topicIndex = 0;
                this.lines = [];
                this.answers = [];
                this.resulut = [];

                // 准备好题目
                __.formatTopics(this.model.topicNum, topics[this.model.level], this.lines, this.answers);
                        
                // ============= 下面初始化界面：

                // 显示第二步，开始答题
                this.model.step = 'step2';

                // 显示倒计时
                __.Ticts.createTicts("times", moment().add(this.model.times, 'm'));

                // 开始答题，记录开始时间
                this.model.startTime = moment();
                __.trackEvent('开始挑战', this.model.level+'|'+this.model.times+'|'+this.model.topicNum);
                __.pageView('/battle');
                this.$router.push('/battle');
                
            }
        },
        created: function () {
            setTimeout(function () {
                __.pageView('/index');
            },300);
        }
	}
</script>
<template>
<div class="page home">
    <!-- <div class="page__hd" style="background-color: transparent;">
        <h1 class="page__title">挑战数学题</h1>
    </div> -->

    <div class="page__bd">
        <div class="weui-cells__title">请选择要挑战的难度</div>
        <div class="weui-cells">

            <div class="weui-cell weui-cell_select weui-cell_select-after">
                <div class="weui-cell__hd">
                    <label for="" class="weui-label">选择难度</label>
                </div>
                <div class="weui-cell__bd">
                    <select class="weui-select" v-model="model.level">
                        <option value="topic10">10以内加减</option>
                        <option value="topic1000">100以内加减</option>
                        <option value="topic99">九九乘法</option>
                    </select>
                </div>
            </div>

            <div class="weui-cell weui-cell_select weui-cell_select-after">
                <div class="weui-cell__hd">
                    <label for="" class="weui-label">做多少题</label>
                </div>
                <div class="weui-cell__bd">
                    <select class="weui-select" v-model="model.topicNum">
                        <option value="10">10题</option>
                        <option value="20">20题</option>
                        <option value="30">30题</option>
                        <option value="50">50题</option>
                        <option value="100">100题</option>
                    </select>
                </div>
            </div>

            <div class="weui-cell weui-cell_select weui-cell_select-after">
                <div class="weui-cell__hd">
                    <label for="" class="weui-label">答题时间</label>
                </div>
                <div class="weui-cell__bd">
                    <select class="weui-select" v-model="model.times">
                        <option value="1">1分钟</option>
                        <option value="2">2分钟</option>
                        <option value="3">3分钟</option>
                        <option value="5">5分钟</option>
                        <option value="10">10分钟</option>
                        <option value="15">15分钟</option>
                        <option value="20">20分钟</option>
                    </select>
                </div>
            </div>

            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">时间用完结束答题</div>
                <div class="weui-cell__ft">
                    <label for="switchCP" class="weui-switch-cp">
                        <input id="switchCP" class="weui-switch-cp__input" type="checkbox" checked="checked" v-model="model.timeout2Stop">
                        <div class="weui-switch-cp__box"></div>
                    </label>
                </div>
            </div>

        </div>

        <div class="weui-btn-area">
            <a class="weui-btn weui-btn_primary" href="javascript:" @click="onStep1Click()">开始挑战</a>
        </div>

        <div class="weui-cells__title">说明：
            <br>上手步骤：选择难度 -> 答题 -> 查看结果
            <br>现有功能：(根据难度、题数)
            <br>　1) 自动选择题库
            <br>　2) 随机出题
            <br>　3) 按时间终止答题
            <br>　4) 自动算成绩
            <br>　5) 成绩分析
        </div>
    </div>

    <div class="weui-footer weui-footer_fixed-bottom">
        <p class="weui-footer__links">
            <a href="javascript:" class="weui-footer__link" @click="onDashang()">{{version}} 我要赞赏</a>
        </p>
        <p class="weui-footer__text">Copyright © 2018 圈圈，最后更新：{{updateDate}}</p>
    </div>
</div>

</template>