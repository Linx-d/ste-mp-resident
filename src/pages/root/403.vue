<template>
  <view
    class="text-center flex-col adjustify-center align-center padding-page h100"
  >
    <view class="loading">
      <view class="text-gray">{{ text || "系统出错" }}</view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      code: 0,
      text: null,
    };
  },
  onLoad(options) {
    console.log(options, 'options');
    this.code = options.code;
  },
  computed: {

  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let title = "";
      console.log(this.code, 'code');
      switch (this.code) {
        case 300:
          title = "对不起，请联系管理员，你没有系统使用权限，请联系管理员。";
          break;
        case 301:
          title = "对不起，请联系管理员，将您添加为楼盘下的驻场人员。";
          break;
        case 403:
          title = "对不起，您无法进入本页面。";
          break;
        case 404:
          title = "对不起，您访问的页面不存在。";
          break;
        case 500:
          title = "对不起，服务器报错了。";
          break;
      }
      this.text = title;
    },
  },
};
</script>
