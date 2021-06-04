<template>
  <view
    class="text-center flex-col adjustify-center align-center padding-page h100"
  >
    <view>
      <view class="text-gray">{{ text || "系统出错" }}</view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      code: 0,
      text: "对不起，服务器报错了。",
    };
  },
  onLoad() {},
  computed: {

  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
    },
  },
};
</script>
