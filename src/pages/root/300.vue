<template>
  <view class="text-center">
    <view class="reg-title">屋掌柜驻场端</view>
    <view
      class="text-center flex-col adjustify-center align-center padding-page h100"
    >
      <view class="loading">
        <view class="text-white">{{ text }}</view>
      </view>
      <view class="bg-gray padding-xs text-center changeBtn">
        <button
          class="cu-btn margin-top-lg margin-left-lg margin-right-lg block bg-white lg"
          @click="changeBrokerApp"
        >
          <text>切换到经纪人端</text>
        </button>
        <button
          class="cu-btn margin-top-lg margin-left-lg margin-right-lg block bg-white lg"
          @click="relogin"
        >
          <text>重新授权登录</text>
        </button>
        </view
      >
    </view>
  </view>
</template>
<script>
import Service from "@/apis/service";
export default {
  data() {
    return {
      text: "你没有系统使用权限，请联系管理员",
    };
  },
  computed: {
    serial() {
      return this.$store.state.serial;
    },
  },
  onLoad(options) {
    if (options.text) this.text = options.text
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
    relogin() {
      this.navTo('/pages/register/register')
    },
    changeBrokerApp() {
      const { serial } = this;
      const that = this
      let path = "pages/root/root";
      uni.navigateToMiniProgram({
        appId: Service.BROKER_APPID,
        path: path,
        envVersion: serial,
        success(res) {
          // 打开成功
        },
        fail(error) {
          that.toast(error);
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.text-center {
  //页面背景颜色
  background-color: #0081ff;
}
//标题
.reg-title {
  color: white;
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 26px;
  font-weight: 700;
}
.changeBtn {
  width: 100vw;
}
</style>
