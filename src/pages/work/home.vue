<template>
  <view>
    <cu-custom bgColor="text-bold bg-white text-black">
        <block slot="content">报备管理</block>
      </cu-custom>
      <view id="navHeader" class="fixed nav" :style="tabStyle">
        <view class="cu-bar bg-white search">
          <view class="search-form">
            <text class="cuIcon-search"></text>
            <input type="text" placeholder="请输入姓名和手机号后四位" disabled @click="toSearch" />
          </view>
        </view>
        <scroll-view scroll-x class="bg-white  shadow">
          <view class="flex text-center">
            <view class="cu-item flex-sub" :class="item.status == status ? 'text-blue;text-bold' : ''"
              v-for="(item, index) in tabList" :key="index" @click="changeTab(item)" :data-status="item.status">
              {{ item.name + `  (${item.number})` }}
              <view :class="item.status == status ? 'item-cur' : ''"></view>
            </view>
          </view>
        </scroll-view>
      </view>
   

   
    <view @touchstart="touchstart" @touchend="touchend" :style="contentStyle">
      <view v-if="status === 0">
        <app-report-list :status="status" ref="list0"></app-report-list>
      </view>
      <view v-if="status === 1">
        <app-report-list :status="status" :keyword="keyword" ref="list1"></app-report-list>
      </view>
      <view v-if="status === 9">
        <app-report-list :status="status" :keyword="keyword" ref="list9"></app-report-list>
      </view>
      <view v-if="status === -1">
        <app-report-list :status="status" :keyword="keyword" ref="list-1"></app-report-list>
      </view>
      <view v-if="status === -2">
        <app-report-list :status="status" :keyword="keyword" ref="list-2"></app-report-list>
      </view>
    </view>
    
		<view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
  import Service from "@/apis/service";
  import ReportService from "@/apis/report";
  export default {
    data() {
      return {
        status: 0,
        page: 0,
        keyword: '',
        size: 1000,
        sort: "updateTime,desc",
        CustomBar: this.CustomBar,
        loading: false,
        tabList: [{
            status: 0,
            name: "待审批",
            number: "0",
            current: false,
            loading: false,
          },
          {
            status: 1,
            name: "已报备",
            number: "0",
            current: false,
            loading: false,
          },
          {
            status: 9,
            name: "已到访",
            number: "0",
            current: false,
            loading: false,
          },
          {
            status: -2,
            name: "已失效",
            number: "0",
            current: false,
            loading: false,
          },
          {
            status: -1,
            name: "已否决",
            number: "0",
            current: false,
            loading: false,
          },
        ],
        // 左滑
        startX: 0,
        endX: 0,
        divHeight: 0,
        heightTotal: 0 //导航高度
      };
    },
    computed: {
      tabStyle() {
        return `top:${this.CustomBar}px`;
      },
      contentStyle() {
        return `margin-top:${this.heightTotal}px;min-height: ${this.divHeight}px`;
      },
      taskId() {
        return uni.getStorageSync("task" + Service.KEY_SUFFIX).id;
      },
      userId() {
        return this.$store.state.user.id;
      }
    },
    mounted() {
      this.compHeight()
      const e = uni.getSystemInfoSync();
      this.divHeight = e.screenHeight - this.CustomBar - 130;
      this.init();
    },
    methods: {
      init() {
        this.load();
      },
      compHeight() {
        const query = uni.createSelectorQuery().in(this);
        query.select('#navHeader').boundingClientRect(data => {
          this.heightTotal = data.height
        }).exec();
      },
      load() {
        let {
          size,
          page,
          sort,
          taskId
        } = this;
        let params = {
          size: 1000,
          page: 0,
          sort: "updateTime,desc",
          taskId: taskId,
		  userId:this.userId
        };
        this.tabList.forEach((item) => {
          params.status = item.status;
          ReportService.queryReport(params, (res) => {
            let {
              data
            } = res.data;
            let reports = data.content;
            this.copyData = data.content;
            if (res.statusCode === 200) {
              item.number = reports.length;
            } else {
              this.toast(res.message);
            }
          });
        });
      },
      changeTab(item) {
        this.keyword = '';
        this.status = item.status;
      },
      // 下拉刷新
      pullDownRefresh() {
        this.load();
        this.$refs[`list${this.status}`].reload();
      },
      // 上拉到底部
      reachBottom() {
        this.$refs[`list${this.status}`].loadmore();
      },
      toSearch() {
        this.navTo('../work/searchForm')
      },
      touchstart(e) {
        this.startX = e.changedTouches[0].clientX

      },
      touchend(e) {
        let status = [0, 1, 9, -2, -1];
        this.endX = e.changedTouches[0].clientX
        if (this.endX - this.startX < -100) {
          let indx = status.indexOf(this.status);
          if (indx == status.length - 1) return
          this.keyword = '';
          this.status = status[indx + 1];
        } else if (this.endX - this.startX > 100) {
          let indx = status.indexOf(this.status);
          if (indx == 0) return
          this.keyword = '';
          this.status = status[indx - 1];
        }
      }
    },
  };
</script>

<style lang="less">
  //----------------搜索---------------------
  page {
    height: L 100%
  }
</style>