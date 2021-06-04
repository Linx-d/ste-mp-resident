<template name="components">
  <view>
    <cu-custom bgColor="text-bold bg-white">
      <block slot="content" style="color:#000000">
        首页
      </block>
    </cu-custom>
    <view class="text-center bg-gray mask" v-if="myTasks.length === 0">
      <view class="my-align">
        <view class="cuIcon-warnfill text-gray lg flex justify-center" style="font-size: 200rpx;">
        </view>
        <view class="text text-gray text-lg">
          未找到已关联的任务请联系管理员
        </view>
      </view>
    </view>
    <view class="bg-white" v-else>
      <view class="home-header">
        <view class="header-left">
          <view class="home-header-task">
            {{ myTask.name }}
          </view>
          <app-loading-content v-if="brokerLoading"></app-loading-content>
          <view v-else class="home-header-broker">
            楼盘任务经纪人数量:{{ taskCords }} 人
          </view>
        </view>

        <view class="cu-btn round lines-gray" @click="navTo('/pages/home/switch/switch')"
          data-url="../home/switch/switch">
          切换<text class="cuIcon-order text-gray"></text>
        </view>
      </view>
      <!-- <app-loading /> -->
      <!-- <view class="cu-modal solid-top" :class="modalName == 'gridModal' ? 'show' : ''" @tap="hideModal">
        <view class="cu-dialog" @tap.stop>
          <radio-group class="block" @change="Gridchange">
            <view class="cu-list menu text-left">
              <view class="cu-item" v-for="(item, index) in 3" :key="index">
                <label class="flex justify-between align-center flex-sub">
                  <view class="flex-sub">{{ index + 3 }} 列</view>
                  <radio class="round" :value="index + 3 + ''" :class="gridCol == index + 3 ? 'checked' : ''"
                    :checked="gridCol == index + 3"></radio>
                </label>
              </view>
            </view>
          </radio-group>
        </view>
      </view> -->
      <view class="dynamic flex  p-xs margin-bottom-sm mb-sm dynamic">
        <view class="dynamic-top">
           <!-- :style="{ background: `#EDEFF2 url(${item.url}) no-repeat bottom right`, backgroundSize: `75upx 75upx`}" -->
           <template v-for="(item, index) in cuIconList">
             <view class="dynamic-list flex-twice bg-grey padding-sm margin-xs radius" v-if="item.visible" :key="index" @click="more(item.key)">
              <view class="text-lg text-bold">{{ item.name}}</view>
              <view style="color:#999999;line-height:60upx" class="text-sm">{{ item.explain }}</view>
              <img class="dynamic-img" :src="item.url" alt="">
            </view>
           </template>
        </view>
        <img @click="toast('功能暂未开放，敬请期待')" class="banner" src="../../static/home/ranking.png" alt="">
        <view>
        </view>
      </view>
      <view class="space"></view>
      <view class="statistics">
        <view class="statistics-title">
          <view class="statistics-title-item"
            :class="[totalPeriod == row.date ? 'active': 'text-black',index === records.length -1 ? 'statistics-title-item-last' : '']"
            v-for="(row,index) in records" :key="row.id" @click="toChild" :data-doing="!row.current"
            :data-date="row.date">
            {{ row.title }}
          </view>
        </view>
        <view class="statistics-work" @click="toTab('work')">
          <view class="statistics-second-title">
            <view class="statistics-second-title-left">
              <img class="left-img" src="../../static/home/report.png" alt="">
              <view>报备管理</view>
            </view>
            <img class="right-img" src="../../static/home/right-icon.png" alt="">
          </view>
          <view class="statistics-work-content">
            <app-loading-content v-if="reportLoading"></app-loading-content>
            <view v-else class="grid col-4">
              <view class="text-center content-number" v-for="report in reportList" :key="report.id">
                {{ report.number }}
                <view class="content-name">{{
                    report.name
                  }}</view>
              </view>
            </view>
          </view>
        </view>
        <view class="statistics-sign" @click="toTab('finish')">
          <view class="statistics-second-title">
            <view class="statistics-second-title-left">
              <img class="left-img" src="../../static/home/order.png" alt="">
              <view>签约管理</view>
            </view>
            <img class="right-img" src="../../static/home/right-icon.png" alt="">
          </view>
          <view class="statistics-sign-content">
            <app-loading-content v-if="reportLoading"></app-loading-content>
            <view v-else class="grid col-2 text-center">
              <view class="statistics-sign-content-count">
                <view class="text-center content-num">
                  {{   formatPrice(buy.money) }} 
                </view>
                <view class="content-count">
                  {{ buy.len }} 笔
                </view>
                <view class="content-name">
                  认购
                </view>
              </view>
               <view class="statistics-sign-content-count">
                <view class="text-center content-num">
                  {{  formatPrice(sign.money) }} 
                </view>
                <view class="content-count">
                  {{ sign.len }} 笔
                </view>
                <view class="content-name">
                  签约
                </view>
              </view>
              <view class="statistics-sign-content-count">
                <view class="text-center content-num">
                  {{  formatPrice(commission.money) }} 
                </view>
                <view class="content-count">
                  {{ commission.len }} 笔
                </view>
                <view class="content-name">
                  应收佣金
                </view>
              </view>
               <view class="statistics-sign-content-count">
                <view class="text-center content-num">
                  0 
                </view>
                <view class="content-count">
                  0 笔
                </view>
                <view class="content-name">
                  回款
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="space"></view>
    </view>
    <view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
  import flag from "@/assets/images/flag.svg";
  import Service from "@/apis/service.js";
  import ReportService from "@/apis/report.js";
  import OrderService from "@/apis/order.js";
  import TaskService from "@/apis/task.js";
  import ConsultantService from "@/apis/consultant.js";
  export default {
    data() {
      return {
        consultants: [],
        // 接受经纪人人数
        taskCords: 0,
        flag,
        modalName: null,
        gridCol: 4,
        gridBorder: false,
        skin: false,
        listTouchStart: 0,
        listTouchDirection: null,
        reportList: [{
            status: 0,
            name: "审批",
            number: "0",
            current: false,
            loading: false,
          },
          {
            status: 1,
            name: "报备",
            number: "0",
            current: false,
            loading: false,
          },
          {
            status: 9,
            name: "到访",
            number: "0",
            current: false,
            loading: false,
          },
          {
            status: -2,
            name: "失效",
            number: "0",
            current: false,
            loading: false,
          },
        ],

        records: [{
            title: "日",
            current: true,
            date: 'day'
          },
          {
            title: "周",
            current: false,
            date: 'week'
          },
          {
            title: "月",
            current: false,
            date: 'month'
          },
          {
            title: "季",
            current: false,
            date: 'season'
          },
          {
            title: "年",
            current: false,
            date: 'year'
          },
        ],
        totalPeriod: 'day',
        buy: {
          len: 0,
          money: 0,
        },
        sign: {
          len: 0,
          money: 0,
        },
        commission: {
          len: 0,
          money: 0,
        },
        // loading
        reportLoading: false,
        finishLoading: false,
        brokerLoading: false,

      };
    },
    computed: {
      userId() {
        return this.$store.state.user.id;
      },
      taskId() {
        return uni.getStorageSync("task" + Service.KEY_SUFFIX).id;
      },
      myTasks() {
        return uni.getStorageSync("tasks" + Service.KEY_SUFFIX);
      },
      myTask() {
        console.log(
          uni.getStorageSync("task" + Service.KEY_SUFFIX),
          'uni.getStorageSync("task" + Service.KEY_SUFFIX)'
        );

        return uni.getStorageSync("task" + Service.KEY_SUFFIX);
      },
      myHouses() {
        return uni.getStorageSync("houses" + Service.KEY_SUFFIX);
      },
      myHouse() {
        return uni.getStorageSync("house" + Service.KEY_SUFFIX);
      },
      cuIconList() {
        const roles = this.$store.state.user.roles.map(item => item.id)
        const isRegistrar = roles.includes('registrar')
        const arr = [{
            key: "news",
            name: "楼盘动态",
            explain: '掌握楼盘动态',
            url: '../../static/home/dynamic.png',
            visible: true
          },
          {
            key: "consultant",
            name: "置业顾问",
            explain: '案场负责人',
            url: "../../static/home/counselor.png",
            visible: true
          },
          {
            key: "registrar",
            name: "来访登记",
            explain: '自然来访客户',
            url: "../../static/home/registrar.svg",
            visible: isRegistrar
          },
        ]
        return arr
      },
    },
    mounted() {
      let value = uni.getStorageSync('totalPeriod_date');
      if (value) {
        this.totalPeriod = value
      }
      uni.removeStorageSync('totalPeriod_date')
      this.init();
    },
    beforeDestroy() {
      uni.setStorageSync('totalPeriod_date', this.totalPeriod);
    },
    methods: {
      init() {
        this.getFinish();
      },
      hideModal(e) {
        this.modalName = null;
      },
      Gridchange(e) {
        this.gridCol = e.detail.value;
      },
      more(key) {
        switch (key) {
          case "news":
            this.navTo(`/pages/home/news/news?houseId=${this.myHouse.id}`);
            break;
          case "consultant":
            this.navTo(`/pages/home/consultant/consultant`);
            break;
          case "registrar":
            if (this.consultants.length === 0) {
              this.toast("请先添加置业顾问");
              return
            }
            this.navTo(`/pages/home/registrar/index`);
            break;
          default: 
            this.navTo(`/pages/home/home`)
        }
      },
      toChild(e) {
        this.reportLoading = true;
        this.finishLoading = true;
        if (e) {
          var {
            doing,
            url,
            date
          } = e.currentTarget.dataset;
          this.totalPeriod = date
        } else {
          var date = this.totalPeriod
        }

        let startHour = ' 00:00:00'
        let endHour = ' 23:59:59'
        let params = {
          startTime: '',
          endTime: '',
          taskId: this.taskId,
        };
        switch (date) {
          case 'day':
            params.startTime = this.getDate() + startHour
            params.endTime = this.getDate() + endHour
            this.getTotal(params)
            break;
          case 'week':
            params.startTime = this.getMonday('s') + startHour
            params.endTime = this.getMonday('e') + endHour
            this.getTotal(params)
            break;
          case 'month':
            params.startTime = this.getMonth('s', 0) + startHour
            params.endTime = this.getMonth('e', 0) + endHour
            this.getTotal(params)
            break;
          case 'season':
            params.startTime = this.getQuarterMonth('s') + startHour
            params.endTime = this.getQuarterMonth('e') + endHour
            this.getTotal(params)
            break;
          case 'year':
            params.startTime = this.getYear('s') + startHour
            params.endTime = this.getYear('e') + endHour
            this.getTotal(params)
            break;
          default:
            params.startTime = this.getYear('s') + startHour
            params.endTime = this.getYear('e') + endHour
            this.getTotal(params)
        }
      },
      getTotal(params) {
        let buy = {
          len: 0,
          money: 0,
        };
        let sign = {
          len: 0,
          money: 0,
        };
        let commission = {
          len: 0,
          money: 0,
        };
        const dateParam = { ...params, residentId: this.userId }
        ReportService.getTaskDate(dateParam, (res) => {
          this.reportLoading = false;
          this.reportList.forEach(item => {
            if (item.status === 0) item.number = res.data.data.unchecked.toString()
            if (item.status === 1) item.number = res.data.data.approved.toString()
            if (item.status === 9) item.number = res.data.data.arrived.toString()
            if (item.status === -2) item.number = res.data.data.expired.toString()
          })
        })
        const orderParam = { ...params, userId: this.userId }
        OrderService.queryOrder(orderParam, (res) => {
          this.finishLoading = false;
          if (res.statusCode === 200) {
            res.data.data.content.forEach(item => {
              if (item.status === 0) {
                let price = item.price || 0;
                buy.money = parseInt(buy.money) + parseInt(price)
                  ++buy.len
              }
              if (item.status === 1) {
                let price = item.price || 0;
                sign.money = parseInt(sign.money) + parseInt(price)
                  ++sign.len
              }
              if (item.commissionStatus === 1) {
                let earnest = item.earnest || 0;
                commission.money = parseInt(commission.money) + parseInt(earnest)
                  ++commission.len
              }
            })
          }
          this.buy = buy;
          this.sign = sign;
          this.commission = commission
        })
      },
      toTab(val) {
        switch (val) {
          case "work":
            this.$emit("currentTab", "work");
            break;
          case "finish":
            this.$emit("currentTab", "finish");
            break;
        }
      },
      pullDownRefresh() {
        this.getFinish();
      },
      getFinish() {
        this.reportLoading = true;
        this.finishLoading = true;
        this.brokerLoading = true;
        let {
          taskId,
          buy,
          sign,
          userId,
          reportList
        } = this;
        let params = {
          ...this.maxPagination,
          taskId: taskId,
        };
        this.toChild()
        TaskService.records(taskId, (res) => {
          this.brokerLoading = false;
          if (res.statusCode === 200) {
            this.taskCords = res.data._embedded.taskBrokers.length;
          } else {
            this.toast(res.message);
          }
        });
        this.getConsultants()
        uni.stopPullDownRefresh();
      },
      getConsultants() {
        let params = {
          ...this.maxPagination,
          houseId: this.myHouse.id,
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
      }
    },
  };
</script>

<style lang="less" scoped>
  .page {
    height: 100vh;
    width: 100vw;
  }

  .page.show {
    overflow: hidden;
  }

  // -------------头部---------------------------
  .home-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 164upx;
    border-bottom: 1px solid #F2F2F2;
    margin: 0 24upx;

    .header-left {
      .home-header-task {
        font-size: 36upx;
        font-weight: bold;
        line-height: 50upx;
        color: #000000;
      }

      .home-header-broker {
        font-size: 24upx;
        font-weight: 400;
        line-height: 34upx;
        color: #333333;
      }
    }
  }

  //--------------横幅---------------------------------
  .dynamic {
    padding: 0 24upx;
    height: 360upx;
    display: flex;
    flex-direction: column;

    .dynamic-top {
      display: flex;
      justify-content: space-between;
      margin: 32upx 0;

      .dynamic-list {
        width: 338upx;
        height: 144upx;
        border-radius: 8upx;
        background-color: #EDEFF2;
        padding: 24upx;
        color: #000000;
        position: relative;
        .dynamic-img {
          width: 75upx;
          height: 75upx;
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
    }

    .banner {
      width: 702upx;
      height: 120upx;
    }
  }

  //--------------间距--------------------------------
  .space {
    height: 24upx;
    background-color: #EDEFF2;
  }

  //--------------统计---------------------------------
  .statistics {
    padding: 32upx 24upx;

    .statistics-title {
      display: flex;
      justify-content: center;
      margin-bottom: 32upx;

      .statistics-title-item {
        width: 96upx;
        height: 48upx;
        text-align: center;
        line-height: 48upx;
        border: 1px solid #C2C2C2;
        border-right: none;
      }

      .statistics-title-item-last {
        border-right: 1px solid #C2C2C2;
      }

      .active {
        background-color: #0464E0;
        color: #ffffff;
        border:none;
        & + .statistics-title-item{
           border-left: none;
        }
      }
    }

    .statistics-second-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .statistics-second-title-left {
        display: flex;
        align-items: center;
        font-size: 32upx;
        font-weight: bold;
        color: #333333;

        .left-img {
          width: 36upx;
          height: 36upx;
          margin-right: 16upx;
        }
      }

      .right-img {
        width: 24upx;
        height: 24upx;
      }
    }

    .content-number {
      font-size: 36upx;
      font-weight: bold;
      margin: 32upx 0 24upx;
      color: #333333;

      .content-name {
        margin: 24upx;
        font-size: 24upx;
        color: #999999;
        font-weight: normal;
      }
    }

    .statistics-work {
      .statistics-work-content {
        border-bottom: 1px solid #f2f2f2;
      }
    }

    .statistics-sign {
      padding-top: 32upx;
      .statistics-sign-content{
        .statistics-sign-content-count{
          .content-num {
              font-size: 36upx;
              font-weight: bold;
              margin-top:30upx;
              color: #333333;
          }
          .content-count {         
            font-size: 24upx;
            margin:18upx 0;
            color: #333333;
          }
          .content-name{        
            font-size: 24upx;
            color: #999999;
            margin-bottom:10upx
          }
        }
      }
    }
  }
.space-bottom {
  height:40upx;
  background-color:#EDEFF2;
}
</style>