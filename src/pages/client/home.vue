<template name="components">
  <view>
    <scroll-view scroll-y class="page">
      <cu-custom
        bgImage="https://image.weilanwl.com/color2.0/plugin/cjkz2329.jpg"
      >
        <block slot="content">
          扫一扫
        </block>
      </cu-custom>
      <view class="cu-card">
        <view
          class="cu-item bg-img shadow-blur"
          :style="[{ backgroundImage: 'url(' + item.img + ')' }]"
          @click="toChild"
          :data-url="item.url"
          v-for="(item, index) in list"
          :key="index"
        >
          <view class="cardTitle">
            {{ item.title }}
          </view>
        </view>
      </view>
      <view class="cu-tabbar-height"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: "components",
  data() {
    return {
      StatusBar: this.StatusBar,
      CustomBar: this.CustomBar,
      list: [
        {
          title: "客户列表",
          img: "https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg",
          url: "../client/indexes",
        },
        {
          title: "微信获客表",
          img: "https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg",
          url: "../client/weixin",
        },
      ],
    };
  },
  methods: {
    toChild(e) {
      let { doing, url } = e.currentTarget.dataset;
      if (doing) {
        this.toast("功能暂未开放，敬请期待");
      } else if (url) {
        this.navTo(url);
      }
    },
  },
};
</script>

<style>
.page {
  height: 100vh;
}

.cardTitle {
  color: #fff;
  padding: 90upx 60upx;
  font-size: 40upx;
  font-weight: 300;
  transform: skew(-10deg, 0deg);
  position: relative;
  text-shadow: 0px 0px 6upx rgba(0, 0, 0, 0.3);
}

.cardTitle::before {
  content: "";
  position: absolute;
  width: 60upx;
  height: 6upx;
  border-radius: 20upx;
  background-color: #fff;
  display: block;
  top: 60upx;
  left: 50upx;
  transform: skew(10deg, 0deg);
}

.cardTitle::after {
  content: "";
  position: absolute;
  width: 140upx;
  border-radius: 6upx;
  height: 24upx;
  background-color: #fff;
  display: block;
  bottom: 76upx;
  left: 90upx;
  transform: skew(10deg, 0deg);
  opacity: 0.1;
}
</style>
