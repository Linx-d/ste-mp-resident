<template>
  <view>
    <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">到访确认</block>
    </cu-custom>

    <form>
      <view class="cu-form-group margin-top">
        <view class="title">楼盘</view>
        <input
          placeholder="请输入楼盘名称"
          name="input"
          v-model="info.project"
          disabled
        />
      </view>
      <view class="cu-form-group">
        <view class="title">客户</view>
        <input
          placeholder="请输入客户名称"
          name="input"
          v-model="info.client"
          disabled
        />
      </view>
      <view class="cu-form-group">
        <view class="title">客户手机</view>
        <input
          placeholder="请输入客户手机"
          name="input"
          v-model="info.phone"
          disabled
        />
      </view>
      <view class="cu-form-group">
        <view class="title">经纪人</view>
        <input
          placeholder="请输入经纪人"
          name="input"
          v-model="info.broker"
          disabled
        />
      </view>
      <view class="cu-form-group">
        <view class="title">到访日期</view>
        <picker
          mode="date"
          :value="date"
          start="2020-11-01"
          @change="DateChange"
        >
          <view class="picker">
            {{ date }}
          </view>
        </picker>
      </view>
      <view class="cu-form-group">
        <view class="title">到访时间</view>
        <picker
          mode="time"
          :value="time"
          start="00:00"
          end="24:00"
          @change="TimeChange"
        >
          <view class="picker">
            {{ time }}
          </view>
        </picker>
      </view>
      <view class="cu-form-group" @click="toConsultant">
        <!-- <view class="title">置业顾问</view>
             <view class="cu-form-group margin-top"> -->
        <view class="title">置业顾问</view>
        <!-- <input
          name="input"
          v-model="selectItem.name"
          disabled
        /> -->
        <view class="flex align-center">
          <view class="margin-right-xs">{{selectItem.name ? selectItem.name : '请选择' }}</view>
           <view class="cuIcon-right:before"></view>
        </view>
      <!-- </view> -->
        <!-- <picker @change="PickerChange" :value="index" :range="consultantList">
          <view class="picker">
            {{ index > -1 ? consultantList[index] : "请选择" }}
          </view>
        </picker> -->
      </view>

      <view class="flex justify-center margin-top">
        <view class="padding flex flex-direction">
          <button class="cu-btn bg-blue lg" @click="putIn">提交</button>
        </view>
      </view>
    </form>
  </view>
</template>

<script>
import Service from "@/apis/service.js";
import ReportService from "@/apis/report.js";
import consultantService from "@/apis/consultant.js";
export default {
  data() {
    return {
      requestId: "",
      info: {},
      date: `${new Date().getFullYear()}-${new Date().getMonth() +
        1}-${new Date().getDate()}`,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      consultantList: [],
      idList: [],
      index: -1,
      taskHouseId: "",
      selectItem: {}
    };
  },
  computed: {
    userId() {
      console.log(this.$store.state);
      return this.$store.state.user.id;
    },
    houseId() {
      return uni.getStorageSync("house" + Service.KEY_SUFFIX).id;
    },
  },
  onLoad(options) {
    this.requestId = options.requestId;
    uni.showLoading({
      title: "加载中...",
      mask: true,
    });
  },
  mounted() {
    this.init();

  },
  onShow() {
    this.selectItem = uni.getStorageSync('selectItem');
    uni.removeStorageSync('selectItem')
    console.log(this.selectItem)
  },
  methods: {
    init() {
      // 获取报备单信息
      let { requestId, info, houseId } = this;
      let taskHouseId = "";
      ReportService.byIdAll(requestId, (res) => {
        if (res.statusCode === 200) {
          console.log(res);
          let { info } = this;
          let { data } = res;
          let { client, task, broker } = data;
          info = {
            project: task.houseName,
            client: client.name,
            phone: client.phone,
            broker: broker.name,
            appointment: data.appointment,
            consultant: "",
            acceptTime: this.format(new Date()),
          };
          taskHouseId = task.houseId;
          this.taskHouseId = task.houseId;
          console.log(info, "info");
          this.info = info;
            uni.hideLoading();

          // 获取顾客列表
          // consultantService.inHouse(taskHouseId, (res) => {
          //   console.log(res, "gugugugu");
          //   let { consultants } = res.data._embedded;
          //   this.consultantList = consultants.map((val) => val.name);
          //   this.idList = consultants.map((val) => val.id);
          //   if (this.consultantList.length === 0) {
          //     this.toast("请先添加置业顾问");
          //   }
          //   uni.hideLoading();
          // });
        } else {
          this.toast("获取失败");
          uni.hideLoading();
        }
      });
    },
    // PickerChange(e) {
    //   this.index = e.detail.value;
    // },

    putIn() {
      let { idList, index, userId, requestId } = this;
        if (!this.selectItem.name) {
        this.toast("请先选择置业顾问");
        return
      }
      let params = {
        consultantId: this.selectItem.id,
        acceptUserId: userId,
        id: requestId,
        acceptTime: this.date + " " + this.time + ":00",
        scanTime: this.format(new Date()),
      };
      this.confirm("确认到访吗？", (ok) => {
        if (ok) {
          this.showLoading(() => {
            ReportService.accept(params, (res) => {
              if (res.statusCode === 202) {
                this.prevPage().$vm.current = "scan";
                this.toast("确认到访");
                setTimeout(() => {
                  uni.navigateBack();
                }, 800);
              } else {
                this.toast("请重试");
              }
            });
          });
        }
      });
    },
    DateChange(e) {
      this.date = e.detail.value;
    },
    TimeChange(e) {
      this.time = e.detail.value;
    },
    toConsultant() {
      this.navTo(`./selectConsultant?houseId=${this.taskHouseId}&status=0`)
    }
  },
};
</script>
<style>
.cu-form-group .title {
  min-width: calc(4em + 15px);
}
</style>
