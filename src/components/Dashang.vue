<script>
    export default {
        methods: {
            onBack(){
                var $scope = this;
                window.trackEvent('赞赏返回', '-');
                window.pageView('/');
                $scope.$router.push('/');
            }
        }
	}
</script>
<template>
<div class="page home">
    <div class="page__bd">

        <div class="weui-form-preview">
            <div class="weui-form-preview__hd">
                <div class="weui-form-preview__item">
                    <label class="weui-form-preview__label">感谢使用挑战数学题</label>
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
                        <img src="../assets/logo.jpg" style="width: 60%;margin: 10px auto;display: block;">
                    </label>
                </div>
            </div>
            <div class="weui-form-preview__ft">
                <a class="weui-form-preview__btn weui-form-preview__btn_primary" href="javascript:" @click="onBack()">返回</a>
            </div>
        </div>

        <!-- <div class="weui-btn-area">
            <a class="weui-btn weui-btn_primary" href="javascript:" @click="onBack()">返回</a>
        </div> -->
        
    </div>

    <!-- <div class="weui-footer weui-footer_fixed-bottom">
        <p class="weui-footer__text">Copyright © 2018 圈圈</p>
    </div> -->
</div>

</template>
