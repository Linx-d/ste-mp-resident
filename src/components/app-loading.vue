<template>
  <view
    class="text-center flex-col adjustify-center align-center padding-page my-loading"
  >
    <view class="loading">
      <image :src="loading" style="height:118px" />
      <view class="text-gray">{{ text || "...加载中..." }}</view>
    </view>
  </view>
</template>

<script>
import loading from "@/assets/images/loading.svg";
export default {
  props: ["text"],
  data() {
    return {
      loading,
    };
  },
};
</script>

<style lang="less" scoped>
.my-loading {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
}
</style>
