<script type="text/javascript">
    const lines = [];
    const answers = [];
    const resulut = [];
    const topicNum = 20;
    const times = 2;
    const timeout2Stop = true;
    const startTime = null;
    const useTime = null;
    const tenTopicTime = null;
    const analysisResult = '';
    const step = 'step1';
    const topicIndex = 0;
    const isError = false;
    const level = 'topic1000';

    export default {
        // 解析后的题库
        lines,
        // 解析后的正解
        answers,
        // 用户答题结果
        resulut,
        // 基本数据
        model: {
            // 做题数量
            topicNum,
            // 默认答题时间
            times,
            // 是否超时终止答题
            timeout2Stop,
            // 开始答题时间
            startTime,
            // 用时
            useTime,
            // 做10题需要的时间
            tenTopicTime,
            // 结果分析
            analysisResult,
            // 初始化显示的步骤
            step,
            // 初始化题库的题号
            topicIndex,
            // 是否出错
            isError,
            // 难度：topic10幼儿园，topic1000一年级, 。。。。
            level
        }
    }
</script>