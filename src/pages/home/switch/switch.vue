<template>
  <view>
    <cu-custom
     bgColor="text-bold bg-white text-black"
      :isBack="true"
    >
      <block slot="backText">返回</block>
      <block slot="content">项目切换</block>
    </cu-custom>
    <view class="cu-bar bg-white solid-bottom">
      <view class="action">
        <text class="cuIcon-titles text-blue"></text>
        <text class="text-lg" style="color:#999999">当前项目</text>
      </view>
    </view>
    <app-loading-content v-if="currentLoaing"></app-loading-content>
    <view class="cu-list menu sm-border">
      <view class="cu-item solid-bottom">
        <view class="content">
          <!-- <image src="/static/logo.png" class="png" mode="aspectFit"></image> -->
          <text class="text-black">{{ myTask.name }}</text>
        </view>
      </view>
    </view>

    <view class="cu-bar bg-white solid-bottom margin-top">
      <view class="action">
        <text class="cuIcon-titles text-blue"></text>
        <text class="text-lg" style="color:#999999">切换项目</text>
      </view>
    </view>
    <app-loading-content v-if="switchLoaing"></app-loading-content>
    <view class="cu-list menu sm-border" v-else>
      <view
        class="cu-item"
        v-for="task in myTasks"
        :key="task.id"
        @click="checkHouse(task)"
      >
        <view class="content">
          <!-- <image src="/static/logo.png" class="png" mode="aspectFit"></image> -->
          <text class="text-black text-bold">{{
            task.name
          }}</text>
          <!-- <text class="text-black text-bold">{{
            task.name + `(${task.createTime})`
          }}</text> -->
        </view>
        <view class="action">
          <text class="text-black text-sm">{{ task.house.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import houseService from "@/apis/house";
import Service from "@/apis/service";
import TaskService from "@/apis/task";
export default {
  data() {
    return {
      currentLoaing: false,
      switchLoaing: false,
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.id;
    },
    myTask() {
      return uni.getStorageSync("task" + Service.KEY_SUFFIX);
    },
    myTasks() {
      console.log(uni.getStorageSync("tasks" + Service.KEY_SUFFIX), "tasks");
      return uni.getStorageSync("tasks" + Service.KEY_SUFFIX);
    },
    myHouses() {
      console.log(uni.getStorageSync("houses" + Service.KEY_SUFFIX));
      return uni.getStorageSync("houses" + Service.KEY_SUFFIX);
    },
  },
  mounted() {
    console.log(this.myTasks, "myTasks");
    this.init();
  },
  methods: {
    init() {
      this.load();
    },
    load() {
      this.switchLoaing = true;
      let params = {
        userId: this.userId
      };
      houseService.houseQuery(params, (res2) => {
        if (res2.data.success) {
          let  houses  = res2.data.data.content;
          console.log(res2, "house res");
          uni.setStorageSync("houses" + Service.KEY_SUFFIX, houses);
          this.getHouses(houses, false);
        } else {
          this.redirectTo("/pages/root/root");
          this.toast("获取楼盘信息失败，请重新登录");
        }
      });
    },
    checkHouse(task) {
      console.log(task, 'choose task');
      this.confirm("您确定要切换项目吗？", (ok) => {
        if (ok) {
          this.showLoading(() => {
            console.log(task, 'choose task show');
            uni.setStorageSync("task" + Service.KEY_SUFFIX, task);
            uni.setStorageSync("house" + Service.KEY_SUFFIX, task.house);
            this.navTo("/pages/index/index");
            // this.prevPage().$vm.current = ''
            // this.toast("切换成功");
          });
        }
      });
    },
    /* 获取任务 楼盘 信息 */
    getHouses(houses, enter = true) {
      let myTasks = [];
      houses.forEach((h) => {
        let params = {
          page: 0,
          size: 100,
          current: true,
          houseId: h.id,
          status: 1
        };
        TaskService.query(params, (res) => {
          let { statusCode } = res;
          if (statusCode === 200) {
            let { data } = res.data;
            data.content.forEach((m, i) => {
              myTasks.push(m);
              console.log(i, "i----------------");
              if (i === data.content.length - 1) {
                this.switchLoaing = false;
                uni.setStorageSync("tasks" + Service.KEY_SUFFIX, myTasks);
                if (
                  uni.getStorageSync("task" + Service.KEY_SUFFIX) ===
                    undefined ||
                  uni.getStorageSync("task" + Service.KEY_SUFFIX) === null ||
                  uni.getStorageSync("task" + Service.KEY_SUFFIX) === ''
                ) {
                  if (myTasks.length !== 0) {
                    uni.setStorageSync("task" + Service.KEY_SUFFIX, myTasks[0]);
                  }
                } else {
                  if (myTasks.length !== 0) {
                    let taskIds = myTasks.map((m) => {
                      return m.id;
                    });
                    let nowIdArr = [
                      uni.getStorageSync("task" + Service.KEY_SUFFIX).id,
                    ];
                    taskIds.filter((v) => {
                      if (nowIdArr.includes(v)) {
                        console.log('任务列表有此任务');
                        // uni.setStorageSync(
                        //   "task" + Service.KEY_SUFFIX,
                        //   myTasks[0]
                        // );
                      }
                    });
                  }
                }
                if (
                  uni.getStorageSync("house" + Service.KEY_SUFFIX) ===
                    undefined ||
                  uni.getStorageSync("house" + Service.KEY_SUFFIX) === null || uni.getStorageSync("house" + Service.KEY_SUFFIX) === ''
                ) {
                  if (houses.length !== 0) {
                    console.log('house 11111111111 switch');
                    uni.setStorageSync("house" + Service.KEY_SUFFIX, houses[0]);
                  }
                }

                if (enter) {
                  console.log(this.$store, "index------------------");
                  this.redirectTo("/pages/index/index");
                } else {
                  console.log("switch project");
                }
              }
            });
          } else {
            this.toast("获取任务列表失败");
          }
        });
      });
    },
  },
};
</script>

<style></style>
