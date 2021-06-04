<template>
  <view class="container">
    <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">个人设置</block>
    </cu-custom>
    <view class="cu-list menu">
      <view class="cu-item firstHeight" @click="toChild" :data-doing="true">
        <view class="content">
          <text class="text-black text-sm">头像</text>
        </view>
        <view class="action">
          <view class="cu-avatar-group">
            <view
              class="cu-avatar round lg"
              :style="
                user.wx.avatarUrl
                  ? `background-image:url(${user.wx.avatarUrl})`
                  : `background-image:url(${DEFAULT_COVER})`
              "
            ></view>
          </view>
          <text class="text-gray textSize"></text>
        </view>
      </view>
      <view class="cu-item firstHeight" @click="toChild" :data-doing="true">
        <view class="content">
          <text class="text-black text-sm">昵称</text>
        </view>
        <view class="action">
          <text class="text-gray text-df padding-right-sm">{{ user.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    user() {
      console.log(this.$store.state.user);
      return this.$store.state.user;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
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

<style lang="less">
.container {
  height: 100%;
  .firstHeight {
    height: 60px;
    border-bottom: 1px solid #f2f2f2;
    .action {
      .textSize {
        font-size: 28px;
        vertical-align: middle;
      }
    }
  }
}

</style>
