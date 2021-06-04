<template>
  <view>
    <cu-custom
      bgColor="text-bold bg-white text-black"
      :isBack="true"
    >
      <block slot="backText">返回</block>
      <block slot="content"><text>修改置业顾问信息</text></block>
    </cu-custom>

    <form>
      <view class="cu-form-group margin-top">
        <text  style="color: #FA5151;font-size: 32rpx;">*</text>
        <view class="title">姓名</view>
        <input placeholder="请填写姓名" name="input" v-model="info.name" />
      </view>
      <view class="cu-form-group">
        <text  style="color: #FA5151;font-size: 32rpx;">*</text>
        <view class="title">手机号码</view>
        <input
          placeholder="请输入手机号"
          name="input"
          maxlength="11"
          v-model="info.phone"
        />
      </view>
      <view class="cu-form-group">
        <view class="title">身份证</view>
        <input placeholder="请输入身份证" name="input" v-model="info.isCard" />
      </view>
    <view class="padding flex flex-direction">
			<button class="cu-btn bg-blue lg" @click="toCommit">提交</button>
		</view>
    </form>
  </view>
</template>

<script>
import Service from "@/apis/service.js";
import ConsultantService from "@/apis/consultant.js";
export default {
  data() {
    return {
      info: {
        name: "",
        phone: "",
        idnumber: "",
      },
      oldPhone: "",
      modalName: null,

      consultants: [],
    };
  },
  onLoad(options) {
    this.id = options.id;
  },
  computed: {
    houseId() {
      return uni.getStorageSync("house" + Service.KEY_SUFFIX).id;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getConsultants();
      this.getConsultant(this.id);
    },
    toCommit() {
      let { info, houseId, consultants, oldPhone, id } = this;
      info.id = id
      if (!info.name || info.name.length === 0) {
        this.toast("请填写姓名");
        return;
      }
      // TODO: 完善
      console.log(info.phone, info.phone.length, "!info.phone");
      console.log(info.idnumber);
      console.log(info.idnumber, info.idnumber.length , "info.idnumber.length ");
      if (info.phone.length !== 0) {
        var myreg = /^[1][0-9][0-9]{9}$/;
        if (!myreg.test(info.phone)) {
          this.toast("请填写正确手机号");
          return;
        }

        if (oldPhone !== info.phone) {
          let consultantPhones = consultants.map((m) => {
            return m.phone;
          });
          let phoneArr = [info.phone];
          let arr = consultantPhones.filter((m) => {
            if (phoneArr.includes(m)) {
              return m;
            }
          });
          console.log(arr, 'arr');
          if (arr.length >= 1) {
            this.toast("手机号已存在");
            return;
          }
        }
      }
      if (info.idnumber.length !== 0) {
        var myreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!myreg.test(info.idnumber)) {
          this.toast("请填写正确身份证号");
          return;
        }
      }

      this.confirm("您确定要编辑置业顾问信息吗？", (ok) => {
        if (ok) {
          this.showLoading(() => {
            ConsultantService.edit(info, (res) => {
              console.log(res, "baocun");
              if (res.statusCode === 200) {
                this.hideLoading();
                uni.navigateBack({
                  delta: 1,
                });
                this.toast("编辑成功", "success");
              } else {
                this.hideLoading();
                this.toast("编辑失败");
              }
            });
          });
        }
      });
    },
    getConsultants() {
      //获取数据
      let params = {
        page: 0,
        size: 1000,
        sort: "updateTime,desc",
        houseId: this.houseId,
      };

      ConsultantService.query(params, (res) => {
        if (res.data.data && res.data) {
          let data = res.data.data.content;
          let arr = data || [];

          this.consultants = arr;
        } else {
          this.toast("获取置业顾问列表数据失败");
        }
      });
    },
    getConsultant(id) {
      ConsultantService.byId(id, (res) => {
        if (res.statusCode === 200) {
          this.info.name = res.data.name || '';
          this.info.phone = this.oldPhone = res.data.phone || '';
          this.info.idnumber = res.data.idnumber || '';
        } else {
          this.toast("获取置业顾问失败");
        }
      });
    },
  },
};
</script>
<style>
.cu-form-group .title {
  min-width: calc(4em + 15px);
}
</style>
