<template>
  <view class="padding text-center mask">
    <view class="my-align">
    <image :src="loading" style="height:118px;"/>
    <view class="text-gray">{{text||'...加载中...'}}</view>
    </view>
  </view>
</template>

<script>
import loading from "@/assets/images/loading.svg";
export default {
    props:['text'],
  data() {
    return {
      loading,
    };
  },
};
</script>