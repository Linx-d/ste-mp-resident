<template>
  <view class="h100 root-bg">
    <image src="@/static/yuanlogo.svg" mode=""></image>
  </view>
</template>
<script>
import Service from "@/apis/service";
import UserService from "@/apis/user";
import houseService from "@/apis/house";
import DictService from "@/apis/dict";

export default {
  data() {
    return {
      redirect: null,
      auth: false,
    };
  },
  onLoad(options) {
    console.log(options, "optionsroot");
    if (options && options.invite === "true") {
      let { residentId, taskId, inviteId } = options;
      let url = "/pages/mine/broker/report";
      url +=
        "?" +
        Object.keys(options)
          .map((k) => `${k}=${options[k]}`)
          .join("&");
      this.redirectTo(url);
    }
    if (options.auth) {
      switch (options.auth) {
        case "false":
          this.auth = false;
          break;
        default:
          this.auth = true;
          break;
      }
    }
    if (options.redirect) {
      let redirect = decodeURIComponent(options.redirect);
      this.redirect = redirect;
      this.$store.commit("setRedirect", redirect);
    }
  },
  mounted() {
    this.preLoad()
    this.init()
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    getUnionid() {
      let userInfo = uni.getStorageSync("user" + Service.KEY_SUFFIX);
      console.log(userInfo, "userInfouserInfouserInfo");
      if (userInfo.wx && userInfo.wx.unionId) {
        this.showHome();
      } else {
        this.showWelcome();
      }
    },
    preLoad() {
      DictService.getAll((res) => {
        this.hideLoading();
        if (res.statusCode === 200) {
          this.$store.commit("setDicts", res.data._embedded.dicts);
        }
      });
    },
    init() {
      if (this.redirect) {
        if (!this.auth) {
          this.redirectTo(this.redirect);
          return;
        }
      }
      this.showLoading(() => {
        if (this.user) {
          this.weixinLogin(() => {
            this.getUnionid();
          });
        } else {
          console.log("1111");
          this.weixinLogin((res) => {
            if (res) {
              this.getUnionid();
            } else {
              this.showWelcome();
            }
          });
        }
      });
    },
    showWelcome() {
      this.hideLoading();
      this.redirectTo("/pages/register/register");
    },
    showHome() {
      this.hideLoading();
      // this.redirectTo("/pages/index/index");
      let id = this.$store.state.user.id;
      let _this = this;
      let params = {
        userId: id,
      };
      houseService.houseQuery(params, (res2) => {
        console.log(res2, '111111111');
        if (res2.data.success) {
          console.log(res2, "houses");
          let houses = res2.data.data.content;
          if (houses.length === 0) {
            this.redirectTo("/pages/root/300");
          } else {
            uni.setStorageSync("houses" + Service.KEY_SUFFIX, houses);
            this.related(houses, _this.redirect);
          }
        } else {
          this.to300({ text: res2.data.message })
        }
      });
    },
  },
};
</script>
<style lang="less" scope>
.root-bg {
  background-color: #fff;
  display: flex;
  justify-content: center;
  image {
    width: 148rpx;
    height: 148rpx;
    margin-top: 500rpx;
  }
}
</style>
