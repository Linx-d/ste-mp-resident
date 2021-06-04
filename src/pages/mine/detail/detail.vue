<template>
  <view>
    <view class="container">
      <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
        <block slot="content">个人信息</block>
      </cu-custom>
      <view class="messageBox">
        <app-user-form :userData="userInfo" />
      </view>
      <view class="flex"> </view>
    </view>
    <view class="padding-xl" @click="save">
      <button class="cu-btn block bg-blue margin-tb-sm lg">
        <text class="">保存</text>
      </button>
    </view>
  </view>
</template>

<script>
import UserService from "@/apis/user";

export default {
  components: {},
  data() {
    return {
      userInfo: "",
    };
  },
  methods: {
    save() {
      /* if (!number || number.length === 0) {
					this.toast("请填写身份证号！");
					return;
				}
				if (!native) {
					this.toast("请先选择籍贯");
					return;
				}
				if (!nation) {
					this.toast("请先选择民族");
					return;
				}
				if (!education) {
					this.toast("请先选择学历");
					return;
				} */

      this.confirm("您确定要保存个人信息吗？", (ok) => {
        if (ok) {
          let data = this.userInfo;
          UserService.saveBroker(data, (res) => {
            console.log("res :>> ", res);
            if (res.statusCode === 200) {
              uni.redirectTo({
                url: `/pages/mine/home`,
              });
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="less">
.container {
  background-color: #ffffff;
  height: 100%;
  .messageBox {
    margin: 2% 5%;
  }
  .btn {
    margin-bottom: 10px;
    .save {
      width: 100px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      margin-top: 10px;
      background-color: #169bd5;
      color: #ffffff;
    }
  }
}
</style>
