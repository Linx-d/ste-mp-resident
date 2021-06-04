<template>
  <view>
    <cu-custom
      bgColor="text-bold bg-white text-black"
      :isBack="true"
    >
      <block slot="backText">返回</block>
      <block slot="content">邀请经纪人</block>
    </cu-custom>

    <form v-if="false">
      <view class="cu-form-group margin-top">
        <view class="title">可使用次数次数</view>
        <input
          placeholder="邀请链接使用次数"
          name="input"
          disabled
          v-model="count"
        />
      </view>
      <view class="cu-form-group">
        <view class="title">过期日期</view>
        <picker
          mode="date"
          :value="date"
          :start="dateStart"
          @change="TimeChange('date')"
        >
          <view class="picker">
            {{ date }}
          </view>
        </picker>
      </view>
      <view class="cu-form-group">
        <view class="title">过期时间</view>
        <picker
          mode="time"
          :value="time"
          :start="timeStart"
          @change="TimeChange('time')"
        >
          <view class="picker">
            {{ time }}
          </view>
        </picker>
      </view>
    </form>

    <view class="bg-gray padding-xs hMiddle text-center">
      <view
        class="grid margin-bottom-xs text-center text-lg text-blod text-orange col-1"
      >
        <view>注意</view>
      </view>
      <view
        class="grid margin-bottom-xs text-center text-lg col-1 margin-top-xl"
      >
        <view>链接24小时后过期</view>
      </view>
      <view class="padding text-lg text-center">
        <text>邀请链接只能被使用一次</text>
      </view>

      <button
        class="cu-btn margin-top-lg margin-left-lg margin-right-lg block bg-blue lg"
        open-type="share"
        @share="toShare"
        @click="editShare"
      >
        <text>邀请</text>
      </button>
    </view>
  </view>
</template>

<script>
import Service from "@/apis/service";
import InviteCodeSevice from "@/apis/inviteCode";
export default {
  data() {
    return {
      count: 1,
      date: "",
      dateStart: "",

      time: "",
      timeStart: "",

      inviteId: "",

      URI_OSS: Service.URI_OSS,

      modalName: null,
      inviteVisible: false,

      redirect: null,

      user: {},
    };
  },
  computed: {
    house() {
      console.log(
        uni.getStorageSync("house" + Service.KEY_SUFFIX),
        "---------"
      );
      return uni.getStorageSync("house" + Service.KEY_SUFFIX);
    },
    task() {
      console.log(uni.getStorageSync("task" + Service.KEY_SUFFIX), "---------");
      return uni.getStorageSync("task" + Service.KEY_SUFFIX);
    },
  },
  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内分享按钮
      console.log(res.target);
    }
    return {
      desc: uni.getStorageSync("task" + Service.KEY_SUFFIX).name,
      imageUrl: `${this.URI_OSS}${this.house.cover}`,
      title: `${this.user.wx.nickName}为您精选${this.house.province}${this.task.name}，快来点击报备吧！`,
      path: this.redirect,
    };
  },
  onShow() {
    console.log('show');
    this.toInvite();
  },
  mounted() {
    let nowDate = this.formattingDate(
      `${new Date().getFullYear()}-${parseInt(new Date().getMonth()) +
        1}-${parseInt(new Date().getDate()) + 1}`,
      "YYYY-MM-DD"
    ).replace(/-/g, "/");
    let nowTime = this.formattingDate(new Date(), "hh:mm").replace(/-/g, "/");

    this.date = this.dateStart = nowDate;
    this.time = this.timeStart = nowTime;
  },
  methods: {
    toInvite() {
      let { date, time } = this;
      let str = `${date} ${time}:00`.replace(/\//g, "-");
      console.log(str, "str");
      // let params = {
      //   expireDate: str,
      // };
      let params = {};
      console.log(this.house, "house");
      console.log(`${this.URI_OSS}${this.house.cover}`, "url");

      this.showLoading(() => {
        InviteCodeSevice.generate((res) => {
          this.hideLoading();
          if (res.statusCode === 200) {
            let data = res.data.data;
            this.user = data.invitor;
            this.inviteId = data.code;
            this.inviteVisible = true;
            console.log(data, "data");
            let redirectUrl = encodeURIComponent(
              `/pages/mine/broker/report?userId=${this.user.id}&inviteId=${this.inviteId}&taskId=${this.task.id}`
            );
            this.redirect = `/pages/root/root?auth=false&redirect=${redirectUrl}`;

            // this.navTo(
            //   `/pages/mine/broker/report?userId=${this.user.id}&inviteId=${this.inviteId}&taskId=${this.task.id}`
            // );
          } else {
            this.toast(res.message);
          }
        });
      });
    },
    toShare() {
      console.log("toShare");
    },
    editShare() {
      let params1 = {
        shareTime: this.formattingDate(new Date()),
      };
      InviteCodeSevice.editShare(this.inviteId, params1, (res1) => {
        if (res1.statusCode === 200) {
          console.log(res1, "res1 邀请成功");
        } else {
          this.toast(res1.message);
        }
      });
    },
    TimeChange(val) {
      switch (val) {
        case "date":
          this.date = val;
          break;
        case "time":
          this.time = val;
          break;
      }
    },
    hideModal(e) {
      this.modalName = null;
    },
  },
};
</script>

<style></style>
