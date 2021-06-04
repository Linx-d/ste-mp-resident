<template>
  <view>
    <cu-custom>
      <block slot="content" class="text-bold">
        我的
      </block>
    </cu-custom>
    <view class="bgUrl nav" v-if="user">
      <image src="../../static/my/bg.png" class="bgImg"></image>
      <view class="flex padding align-center bghead" @click="getBrokerInfo">
        <app-user-avatar :user="user" />
        <view class="margin-left flex-col flex-1">
          <view class="flex align-center">
            <text class="text-lg text-bold margin-right-sm">{{
              user.name
            }}</text>
            <image
              v-if="user.sex == 0"
              src="@/static/common/man.png"
              style="width: 36rpx;height: 36rpx;"
            ></image>
            <image
              v-else-if="user.sex == 1"
              src="@/static/common/woman.png"
              style="width: 36rpx;height: 36rpx;"
            ></image>
          </view>
          <view class="text-gray text-sm margin-top-sm">
            {{ user.username.substring() }}
          </view>
        </view>
        <text class="cuIcon-right"></text>
      </view>
    </view>
    <!-- <view class="cu-item arrow shadow" @click="getBrokerInfo">
        <view class="cu-avatar round lg margin-right">
          <image
            class="round"
            :src="user.wx.avatarUrl"
            style="height: 100rpx; width: 100rpx;"
          />
        </view>
        <view class="content padding-tb-sm">
          <view> <text class="text-blue"></text>{{ user.name }}</view>
          <view class="text-gray text-sm">
            <text class="margin-right">{{ user.username }}</text>
          </view>
        </view>
      </view> -->
    <!-- <view @click="aa">
        aa
      </view> -->
    <!-- <view class="cu-item arrow margin-top" @click="toChild" data-url="../mine/broker/broker">
				<view class="content">
					<image src="/static/logo.png" class="png" mode="aspectFit"></image>
					<text class="text-grey">我的经纪人</text>
				</view>
			</view> -->
    <!-- <view
        class="cu-item arrow"
        :class="nav.margin ? 'margin-top' : ''"
        v-for="nav in navList"
        :key="nav.id"
        :data-doing="nav.doing"
        @click="toChild"
        :data-url="nav.url"
      >
        <view class="content">
          <text class="text-grey">{{ nav.title }}</text>
        </view>
      </view> -->

    <!-- <view class="cu-item margin-top" @click="clearCache">
        <view class="content">
          <text class="text-grey">清除缓存(V0.1.12 202101201510)</text>
        </view>
      </view> -->

    <view class="cu-list menu margin-lr radius" style="margin-top:300upx;">
      <view class="cu-item arrow" @click="toChild">
        <view class="content">
          <image
            src="@/static/my/comput.png"
            style="width: 36rpx;height: 36rpx;"
          ></image>
          <text class="my-text-color-black margin-left-sm">房贷计算器</text>
        </view>
      </view>
      <view class="cu-item arrow" @click="clearCache">
        <view class="content">
          <image
            src="@/static/my/clear.png"
            style="width: 36rpx;height: 36rpx;"
          ></image>
          <text class="my-text-color-black margin-left-sm"
            >清除缓存(V0.1.14 202102051615)</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        {
          title: "房贷计算器",
          margin: true,
          png: "/static/logo.png",
          doing: true,
          url: "",
        },
        // {
        //   title: "意见反馈",
        //   margin: false,
        //   png: "/static/logo.png",
        //   doing: true,
        //   url: "",
        // },
        // {
        //   title: "邀请经纪人",
        //   margin: true,
        //   png: "/static/logo.png",
        //   doing: false,
        //   url: "/pages/mine/broker/inviteBroker",
        // },
      ],
    };
  },
  computed: {
    user() {
      console.log(this.$store.state.user, "this.$store.state.user");
      return this.$store.state.user;
    },
  },
  onLoad() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.load();
    },
    load() {},
    reload() {
      console.log("my mine");
    },
    toChild() {
      this.navTo("/pages/mine/calculators/index");
    },
    getBrokerInfo() {
      this.navTo(`/pages/mine/personal/personal?id=${this.user.id}`);
    },
    clearCache() {
      this.confirm("确定清除缓存, 并重新启动小程序吗", (ok) => {
        if (ok) {
          uni.clearStorage();
          uni.reLaunch({
            url: "/pages/root/root",
          });
        }
      });
    },
    // aa(){
    //   this.navTo("/pages/root/root?auth=true&redirect=" + encodeURIComponent("/pages/index/index?tab=work"))
    // }
  },
};
</script>

<style lang="less">
.bgUrl {
  width: 100%;
  height: 416rpx;
  top: 0rpx;
  position: fixed;
  z-index: 1024;

  /* background-image:url(@/static/img/myHeadBg.svg); */
  background-size: 100% 100%;
  .bgImg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0rpx;
    top: 0rpx;
  }
  .bghead {
    width: 100%;
    position: absolute;
    margin-top: 200upx;
  }
}
</style>
