<template>
  <view class="padding text-center app-loading">    
    <view class="text-gray">
      <text class="dot"></text>
      <text class="dot"></text>
      <text class="dot"></text>
    </view>
  </view>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {

    };
  },
  computed: {
  },
};
</script>
<style lang="less" scoped>

.app-loading{
  .dot{
    height: 20rpx;
    width: 20rpx;
    background-color: #e54d42; //e54d42 0081ff
    margin: 5px;
    animation-name: dot-scale;
    animation-iteration-count: infinite;
    animation-duration: 0.6s;
    display: inline-block;
    border-radius: 100rpx;

    &:nth-child(1){
      animation-delay: 0.2s;
    }
    &:nth-child(2){
      animation-delay: 0.4s;
    }
    &:nth-child(3){
      animation-delay: 0.6s;
    }
  }
}


</style>