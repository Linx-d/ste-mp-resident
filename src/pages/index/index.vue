<template>
  <view>
    <!-- system -->
    <basics v-if="tab == 'basics'"></basics>
    <components v-if="tab == 'component'"></components>
    <plugin v-if="tab == 'plugin'"></plugin>

    <!-- mine -->
    <home v-if="tab == 'home'" @currentTab="toReport" ref="home"></home>
    <work v-if="tab == 'work'" ref="work"></work>
    <finish v-if="tab == 'finish'" ref="finish"></finish>
    <client v-if="tab == 'client'" ref="client"></client>
    <mine v-if="tab == 'mine'" ref="mine"></mine>
    <view class="cu-bar tabbar bg-white shadow foot">
      <view class="action text-green" @click="NavChange" data-cur="home">
        <view class="cuIcon-cu-image">
          <image
            :src="
              '/static/tab/home' + [tab == 'home' ? '_cur' : ''] + '.png'
            "
          ></image>
        </view>
        <view :style="tab == 'home' ? 'color:#0464E0' : 'color:#999999'">
          <view class="cu-tag badge" v-if="indexBadge === 1"></view>
          <view
            class="cu-tag badge"
            v-if="indexBadge !== 1 && indexBadge !== 0"
            >{{ indexBadge }}</view
          >
          首页
        </view>
      </view>
      <view class="action text-gray" @click="NavChange" data-cur="work">
        <view class="cuIcon-cu-image">
          <image
            :src="
              '/static/tab/work' + [tab == 'work' ? '_cur' : ''] + '.png'
            "
          ></image>
        </view>
        <view :style="tab == 'work' ? 'color:#0464E0' : 'color:#999999'">
          <view class="cu-tag badge" v-if="workBadge === 1"></view>
          <view
            class="cu-tag badge"
            v-if="workBadge !== 1 && workBadge !== 0"
            >{{ workBadge }}</view
          >
          报备
        </view>
      </view>
      <view class="action text-gray add-action">
        <button
          class="cu-btn cuIcon-scan bg-blue shadow"
          @click="scan"
        ></button>
        <view style="color:#0464E0;padding-top:6upx">
          扫一扫
        </view>
      </view>
      <view class="action text-gray" @click="NavChange" data-cur="finish">
        <view class="cuIcon-cu-image">
          <image
            :src="
              '/static/tab/finish' + [tab == 'finish' ? '_cur' : ''] + '.png'
            "
          ></image>
        </view>
        <view :style="tab == 'finish' ? 'color:#0464E0' : 'color:#999999'">
          <view class="cu-tag badge" v-if="finishBadge === 1"></view>
          <view
            class="cu-tag badge"
            v-if="finishBadge !== 1 && finishBadge !== 0"
            >{{ finishBadge }}</view
          >
          签约
        </view>
      </view>
      <view class="action text-gray" @click="NavChange" data-cur="mine">
        <view class="cuIcon-cu-image">
          <image
            :src="
              '/static/tab/me' + [tab == 'mine' ? '_cur' : ''] + '.png'
            "
          ></image>
        </view>
        <view :style="tab == 'mine' ? 'color:#0464E0' : 'color:#999999'">
          <view class="cu-tag badge" v-if="mineBadge === 1"></view>
          <view
            class="cu-tag badge"
            v-if="mineBadge !== 1 && mineBadge !== 0"
            >{{ mineBadge }}</view
          >
          我的
        </view>
      </view>
      <!-- <view class="action text-gray" @click="NavChange" data-cur="plugin">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/plugin' + [tab == 'plugin'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="tab=='plugin'?'text-green':'text-gray'">列表</view>
			</view> -->
      <!-- <view class="action text-gray" @click="NavChange" data-cur="component">
        <view class="cuIcon-cu-image">
          <image
            :src="
              '/static/tabbar/component' +
                [tab == 'component' ? '_cur' : ''] +
                '.png'
            "
          ></image>
        </view>
        <view :class="tab == 'component' ? 'text-green' : 'text-gray'"
          >组件</view
        >
      </view>
      <view class="action text-gray" @click="NavChange" data-cur="basics">
        <view class="cuIcon-cu-image">
          <image
            :src="
              '/static/tabbar/basics' +
                [tab == 'basics' ? '_cur' : ''] +
                '.png'
            "
          ></image>
        </view>
        <view :class="tab == 'basics' ? 'text-green' : 'text-gray'"
          >基础</view
        >
      </view> -->
    </view>
  </view>
</template>

<script>
import Service from "@/apis/service.js";
import ReportService from "@/apis/report.js";
import OrderService from "@/apis/order.js";
import TaskService from "@/apis/task.js";
import ConsultantService from "@/apis/consultant.js";
export default {
  data() {
    return {
      tab: "",
      current: "",
      indexBadge: 0,
      workBadge: 0,
      finishBadge: 0,
      mineBadge: 0,
      consultants: [],
    };
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
    taskId() {
      return uni.getStorageSync("task" + Service.KEY_SUFFIX).id;
    },
    houses() {
      return uni.getStorageSync("houses" + Service.KEY_SUFFIX);
    },
    myHouse() {
      return uni.getStorageSync("house" + Service.KEY_SUFFIX);
    },
    myTask() {
      return uni.getStorageSync("task" + Service.KEY_SUFFIX);
    },
	userId() {
	  return this.$store.state.user.id;
	}
  },
  onLoad(options) {
    console.log(options, 'options')
    if(options.taskId) {
      this.getTaskAndHouse(options.taskId)
    }
    if(options.tab) {
      this.tab = options.tab
    } else {
      this.tab = "home"
      console.log(this.tab)
    }
  },
  onShow(e) {
    this.load();
    let crt = this.$refs[this.tab];
    if (crt && crt.pullDownRefresh) {
      crt.pullDownRefresh();
    } else {
      uni.stopPullDownRefresh();
    }

  },
  onPullDownRefresh() {
    this.load();
    let crt = this.$refs[this.tab];
    if (crt && crt.pullDownRefresh) {
      crt.pullDownRefresh();
    } else {
      uni.stopPullDownRefresh();
    }
  },
  onReachBottom() {
    let crt = this.$refs[this.tab];
    if (crt.reachBottom) {
      crt.reachBottom();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.showLoading(() => {
        if (this.token) {
          this.hideLoading();
          this.load();
        } else {
          this.getTokenByOpenId(this.openid, (token) => {
            this.hideLoading();
            if (token) {
              this.load();
            } else {
              this.toast("授权失败，请重新启动小程序");
            }
          });
        }
      });
      this.$nextTick(() => {
        this.checkUpdate();
        // this.checkSubscribe();
      });
    },
    load() {
      // report
      let { taskId, myHouse } = this;
      let houseId = myHouse.id

      let params = {
        ...this.maxPagination,
        taskId: taskId,
        status: 0,
        userId:this.userId
      };
      OrderService.queryOrder(params, (res) => {
        let { data } = res.data;
        if (res.statusCode === 200) {
          this.finishBadge = data.totalElements;
        } else {
          this.toast(res.message);
        }
      });

      ReportService.queryReport(params, (res) => {
        let { data } = res.data;
        if (res.statusCode === 200) {
          this.workBadge = data.totalElements;;
        } else {
          this.toast(res.message);
        }
      });
      this.getConsultants(houseId);
    },
      // 服务号跳转更换任务
    getTaskAndHouse(taskId) {
      let params = {
        page: 0,
				size: 10,
				taskId: taskId,
      }
      TaskService.query(params, (res) => {
        let { statusCode } = res;
        if(statusCode === 200) {
          let { data } = res.data;
          if(data.content.length) {
            uni.setStorageSync("task" + Service.KEY_SUFFIX, data.content[0]);
            uni.setStorageSync("house" + Service.KEY_SUFFIX, data.content[0].house);
          }else{
            this.toast("获取楼盘任务数据失败");
          }
        }else{
            this.toast("获取楼盘任务数据失败");
        }
      })   
    },
    NavChange: function(e) {
      this.tab = e.currentTarget.dataset.cur;
    },
    isuse: function(e) {
      uni.navigateTo({
        url: e.currentTarget.dataset.url,
      });
    },
    toReport(data) {
      this.tab = data;  
    },
    // 楼盘下的置业顾问
    getConsultants(houseId) {
      let params = {
        ...this.maxPagination,
        houseId: houseId,
      };

      ConsultantService.query(params, (res) => {
        if (res.data.data && res.data) {
          let data = res.data.data.content;
          let arr = data || [];

          this.consultants = arr;
        } else {
          this.toast("获取置业顾问数据失败");
        }
      });
    },
    scan(e) {
      if (this.consultants.length === 0) {
        this.toast("请先添加置业顾问");
        return
      }
      let that = this;
      // 允许从相机和相册扫码
      uni.scanCode({
        success: function(res) {
          console.log("条码类型：" + res.scanType);
          console.log("条码内容：" + res.result);
          console.log(res,'条形码内容')
          let { result } = res;
          let str = result.slice(0, result.indexOf("/") - 1);
          if (str === "report" || result.indexOf("//") > -1) {
            let requestId = result.slice(result.indexOf("/") + 2);
            let dateParam = { residentId: that.userId, reportId: requestId }
            ReportService.checkReportAuth(dateParam, (res) => {
                let data = res.data
                if(!data.success) {
                  that.toast("已关联其他代理商");
                  return
                }
                if(data.data == 'false' || !data.data) {
                  that.toast("已关联其他代理商");
                  return
                }

              // 获取报备单信息
              ReportService.byIdAll(requestId, (res) => {
                if (res.statusCode === 200) {
                  let { id } = res.data.task;
                  // if (id !== that.myTask.id) {
                  // 	console.log(that.myHouse, 'myHouse');
                  // 	that.toast(`只能接受到访${that.myHouse.name}下的报备单`)
                  // 	return
                  // }
                  switch (res.data.status) {
                    case 1:
                      uni.navigateTo({
                        url: `../index/visit?requestId=${requestId}`,
                      });
                      break;
                    case 0:
                      that.toast("请先审核报备单");
                      break;
                    case 9:
                      that.toast("已到访");
                      break;
                    case -1:
                      that.toast("已否决");
                      break;
                    case -2:
                      that.toast("已过期");
                      break;
                  }
                } else {
                  that.toast(res.message);
                }
              });
            })

          } else {
            that.toast("错误二维码");
          }
        },
        fail(res) {
          that.toast("取消扫描");
        },
      });
    },
  },
};
</script>

<style>
.cu-tag.badge:not([class*="bg-"]) {
  z-index: 1;
  right: 20rpx;
}
</style>
