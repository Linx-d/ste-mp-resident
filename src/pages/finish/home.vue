<template>
  <view>
    <cu-custom bgColor="text-bold bg-white">
      <block slot="content" style="color:#000000">签约管理</block>
    </cu-custom>
      <view id="navHeader" class="fixed nav" :style="tabStyle">
			<view class="cu-bar bg-white search">
				<view class="search-form">
					<text class="cuIcon-search"></text>
					<input type="text" placeholder="请输入姓名和手机号后四位" disabled @click="toSearch" />
				</view>
			</view>   
    <scroll-view
      scroll-x
      class="bg-white  shadow"
    >
      <view class="flex text-center">  
        <view
          class="cu-item flex-sub"
          :class="item.status == status ? 'text-blue;text-bold' : ''"
          v-for="(item, index) in tabList"
          :key="index"
          @click="changeTab(item)"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
          :data-status="item.status"
        >
          {{ item.name + `  (${item.number})` }}
          <view :class="item.status == status ? 'item-cur' : ''"></view>
        </view>
      </view>
    </scroll-view>
      </view>
      <view @touchstart="touchstart"  @touchend="touchend" :style="contentStyle">
    <view v-if="status === 0">
      <app-finish-list :status="status" :keyword="keyword" ref="list0"></app-finish-list>
    </view>
    <view v-if="status === 1">
      <app-finish-list :status="status" :keyword="keyword" ref="list1"></app-finish-list>
    </view>
    <view v-if="status === -1">
      <app-finish-list :status="status" :keyword="keyword" ref="list-1"></app-finish-list>
    </view>
    </view>
    
		<view class="cu-tabbar-height"></view>
  </view>
</template>

<script>
import Service from "@/apis/service";
import OrderService from "@/apis/order";
export default {
  data() {
    return {
      keyword:'',
      status: 0,
      page: 0,
      size: 5,
      sort: "updateTime,desc",
      CustomBar: this.CustomBar,
      tabList: [
        {
          status: 0,
          name: "已认购",
          number: "0",
          current: false,
          loading: false,
        },
        {
          status: 1,
          name: "已签约",
          number: "0",
          current: false,
          loading: false,
        },
        // {
        //   status: 2,
        //   name: "已回款",
        //   number: "0",
        //   current: false,
        //   loading: false,
        // },
        {
          status: -1,
          name: "已退房",
          number: "0",
          current: false,
          loading: false,
        },
      ],
       // 左滑
			startX:0,
			endX:0,
      divHeight:0,
      heightTotal: 0 //导航高度
    };
  },
  onLoad(options) {
    // uni.startPullDownRefresh();
  },
  mounted() {
    this.compHeight()
    const e= uni.getSystemInfoSync();
		this.divHeight=e.screenHeight-this.CustomBar-130;
    this.init();
  },
  computed: {
    taskId() {
      return uni.getStorageSync("task" + Service.KEY_SUFFIX).id;
    },
    tabStyle() {
            return `top:${this.CustomBar}px`;
    },
    contentStyle() {
      return `margin-top:${this.heightTotal}px;min-height: ${this.divHeight}px`;
    },
	userId() {
	  return this.$store.state.user.id;
	}
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
      let { size, sort, taskId } = this;
      let params = {
        size: 1000,
        page: 0,
        sort: "updateTime,desc",
        taskId: taskId,
		userId:this.userId
      };
      this.tabList.forEach((item) => {
        params.status = item.status;
        OrderService.queryOrder(params, (res) => {
          let { data } = res.data;
          let reports = data.content;
          if (res.statusCode === 200) {
            item.number = reports.length;
          } else {
            this.toast(res.message);
          }
        });
      });
    },
    // 下拉刷新
    pullDownRefresh() {
      this.load()
      this.$refs[`list${this.status}`].reload();
    },
    // 上拉到底部
    reachBottom() {
      this.$refs[`list${this.status}`].loadmore();
    },
    changeTab(item) {
      this.keyword='';
      this.status = item.status;
    },
     toSearch() {
      this.navTo('../work/searchForm')
    },
		touchstart(e){
			this.startX=e.changedTouches[0].clientX
    },
		touchend(e){
			let status=[0,1,-1];
			this.endX=e.changedTouches[0].clientX
			if(this.endX-this.startX<-100){
				let indx=status.indexOf(this.status);
				if(indx==status.length-1) return
				this.keyword='';
				this.status = status[indx+1];
			}else if(this.endX-this.startX>100){
				let indx=status.indexOf(this.status);
				if(indx==0) return
				this.keyword='';
				this.status = status[indx-1];
			}
		}  
  },
};
</script>

<style lang="less">
page {
  height:L 100%
}
</style>
