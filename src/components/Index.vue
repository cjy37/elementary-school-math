<script>
    export default {
        data() {
            //var abc = window.screen;
            //this.GLOBAL.abc = abc;
            return this.GLOBAL;
        },
        methods: {
            onDashang(){
                var $scope = this;
                window.trackEvent('赞赏', '首页进入');
                window.pageView('/Dashang');
                $scope.$router.push('/Dashang');
            },
            onStep1Click() {
                var $scope = this;
                // 重新设置题号
                $scope.model.topicIndex = 0;
                $scope.lines = [];
                $scope.answers = [];
                $scope.resulut = [];

                // 准备好题目
                formatTopics($scope.model.topicNum, window[$scope.model.level], $scope.lines, $scope.answers);
                        
                // ============= 下面初始化界面：

                // 显示第二步，开始答题
                $scope.model.step = 'step2';

                // 显示倒计时
                Ticts.createTicts("times", moment().add($scope.model.times, 'm'));

                // 开始答题，记录开始时间
                $scope.model.startTime = moment();
                window.trackEvent('开始挑战', $scope.model.level+'|'+$scope.model.times+'|'+$scope.model.topicNum);
                window.pageView('/Battle');
                $scope.$router.push('/Battle');
                
            }
        },
        created: function () {
            setTimeout(function () {
                window.pageView('/');
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
                        <option value="topic10">10以内</option>
                        <option value="topic1000">100以内</option>
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
            <a href="javascript:" class="weui-footer__link" @click="onDashang()">V3.0.8 我要赞赏</a>
        </p>
        <p class="weui-footer__text">Copyright © 2018 圈圈，最后更新：2018-07-29</p>
    </div>
</div>

</template>