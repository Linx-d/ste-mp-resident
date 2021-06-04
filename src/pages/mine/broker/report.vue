<template>
  <view>
    <cu-custom
      bgColor="text-bold bg-white text-black"
      :is-back="!isHome"
      :is-home="isHome"
      ><block slot="backText">返回</block>
      <block slot="content">报备</block>
    </cu-custom>

    <view v-if="expired">
      <view class="bg-white">
        <app-loading-content v-if="userLoading"></app-loading-content>
        <view v-else class="bg-white padding-xs shadow">
          <view
            class="cu-item arrow text-center shadow margin-top margin-bottom"
          >
            <view class="cu-avatar round lg margin-right text-center">
              <image
                class="round"
                :src="user.avatar"
                style="height: 100rpx; width: 100rpx;"
              />
            </view>
            <text class="text-lg">{{
              user.nickName ? user.nickName : user.name
            }}</text>
          </view>
          <view
            class="grid margin-bottom-xs text-center text-lg text-blod text-black col-1"
          >
            <view>邀请你使用屋掌柜</view>
          </view>
          <view
            class="grid margin-bottom-xs text-center text-sm text-gray col-1"
          >
            <view>重庆市80%经纪人都在用的在线报备、结佣工具</view>
          </view>
        </view>
      </view>

      <view class="cu-card article bg-white work-header shadow margin">
        <view class="cu-item shadow">
          <app-loading-content v-if="taskLoading"></app-loading-content>
          <view v-else>
            <view class="text-center">
              <image
                :src="
                  task.houseCover
                    ? `${URI_OSS}${task.houseCover}`
                    : DEFAULT_COVER
                "
                style="height: 350rpx;"
                mode="aspectFill"
              ></image
            ></view>
            <view>
              <view class="flex-treble margin-xs">
                <view class="grid col-1">
                  <view class="text-gray">
                    {{ task.name || "-" }}
                    <view class="margin-left padding-sm cu-tag bg-black">
                      {{
                        task.housePropertyType === "别墅"
                          ? task.housePropertyType
                          : task.houseType === 0
                          ? "住宅"
                          : "商业"
                      }}
                    </view>
                  </view>
                  <view class="padding-tb-sm grid col-2">
                    <view class="text-gray">
                      套内 {{ ` ${task.roomAreaAll}` || "-" }}m²</view
                    >
                    <view class="text-gray">
                      均价
                      {{
                        task.salePrice
                          ? `${this.formatPrice(task.salePrice)}`
                          : "-"
                      }}元/m²
                    </view>
                  </view>
                  <view class="text-gray grid col-2">
                    <view class="text-gray">
                      {{ task.province + task.city + task.district || "-" }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="bg-white padding margin-top">
        <view class="text-lg">
          <text class="cuIcon-titles text-orange lg margin-right"></text>
          <text class="text-black text-blod">佣金方案</text>
        </view>
        <view class="flex  p-xs mb-sm">
          <view class="flex-sub padding-sm radius text-gray">方案详情</view>
          <view class="flex-twice  padding-sm radius">
            <app-rich-text :text="task.ruleCommission"
          /></view>
        </view>
      </view>
      <!-- @click="toBrokerApp" -->
      <!-- <button class="cu-btn margin-lg block bg-blue lg" @click="toBrokerApp">
        <text>去报备</text>
      </button> -->
      <view class="padding text-center" v-if="!inviteLoading">
        <view class="bg-blue radius padding-sm" @click="toBrokerApp('report')"
          >去报备</view
        >
        <view class="margin-top text-orange text-sm">
          <text>跳转到屋掌柜经纪人端进行报备</text>
        </view>
      </view>
    </view>

    <view v-else>
      <view class="bg-gray padding-xs hMiddle text-center">
        <view class="padding-xs shadow">
          <view
            class="cu-item arrow text-center shadow margin-top margin-bottom"
          >
            <view class="cu-avatar round lg margin-right text-center">
              <image
                class="round"
                :src="user.avatar"
                style="height: 100rpx; width: 100rpx;"
              />
            </view>
            <text class="text-lg">{{
              user.nickname ? user.nickname : user.name
            }}</text>
          </view>
        </view>
        <view
          class="grid margin-bottom-xs text-center text-lg text-blod text-orange col-1"
        >
          <view>注意</view>
        </view>
        <view
          class="grid margin-bottom-xs text-center text-lg col-1 margin-top-xl"
        >
          <view v-if="!expired">{{
            invite.message == "验证码已使用"
              ? "邀请链接已使用"
              : "邀请链接已过期"
          }}</view>
        </view>
        <view class="padding text-lg text-center">
          <text>请联系掌柜获取新的邀请链接</text>
        </view>
        <view class="padding text-center">
          <view class="bg-blue radius padding-sm" @click="toBrokerApp"
            >切换到经纪人端</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Service from "@/apis/service";
import AnonymousService from "@/apis/anonymous";
import InviteCodeService from "@/apis/inviteCode";
export default {
  // components: { button },
  data() {
    return {
      userId: "",
      user: {},
      userLoading: false,

      inviteId: "",
      invite: {},
      inviteLoading: false,

      taskId: "",
      task: {},
      taskLoading: false,

      expired: true,

      URI_OSS: Service.URI_OSS,
    };
  },
  onLoad(options) {
    console.log(options, " options");
    this.userId = options.userId;
    this.inviteId = options.inviteId;
    this.taskId = options.taskId;
  },
  computed: {
    isHome() {
      let pages = getCurrentPages();

      return pages.length === 1;
    },
    serial() {
      return this.$store.state.serial;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let { taskId, userId, inviteId } = this;

      this.validateCode(inviteId);

      this.userLoading = true;
      this.inviteLoading = true;
      this.taskLoading = true;
      this.getTaskInfo(taskId);
      this.getuserInfo(userId);
    },
    toBrokerApp(val = "root") {
      const { taskId, inviteId, serial } = this;
      let that = this;
      let redirect = "";
      switch (val) {
        case "report":
          redirect = encodeURIComponent(
            `/pages/report/report?taskId=${taskId}&inviteCode=${inviteId}`
          );
          break;
        default:
          redirect = encodeURIComponent(
            `/pages/root/root`
          );
          break;
      }
      let path = "pages/root/root?redirect=" + redirect;
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
    validateCode(code) {
      InviteCodeService.check(code, (res) => {
        this.inviteLoading = false;
        console.log(res, "res check");
        if (res.statusCode === 200 || res.statusCode === 400) {
          let data = res.data;
          let success = data.success;
          console.log(data.message);
          console.log(success);
          this.expired = success;
          this.invite = data;
          console.log(this.expired, "this.expired");
        } else {
          this.toast(res.message);
        }
      });
    },
    getTaskInfo(id) {
      AnonymousService.byTaskId(id, (res) => {
        this.taskLoading = false;
        if (res.statusCode === 200) {
          let data = res.data.data;
          let arr = (data.roomAreaAll ? data.roomAreaAll.split(",") : []).map(
            (item) => {
              return parseInt(item);
            }
          );
          data.roomAreaAll = `${Math.min(...arr)}-${Math.max(...arr)}`;
          this.task = data;
        }
      });
    },
    getuserInfo(id) {
      console.log(id, "res id");
      AnonymousService.byUserId(id, (res) => {
        console.log(res, "user res ");
        this.userLoading = false;
        if (res.statusCode === 200) {
          this.user = res.data.data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
