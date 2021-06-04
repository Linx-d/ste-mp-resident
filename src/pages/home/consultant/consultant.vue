<template>
  <view class="container">
    <view id="navHeader">
    <cu-custom
     bgColor="text-bold bg-white text-black"
      :isBack="true"
    >
      <block slot="backText">返回</block>
      <block slot="content">置业顾问</block>
    </cu-custom>         
    </view>
  		<view class="fixed nav" :style="vHeight">
			<view class="cu-bar bg-white search">
				<view class="search-form">
					<text class="cuIcon-search"></text>
					<input type="text" v-model="keyword" confirm-type="search" @input="doSearch" placeholder="请输入姓名或手机号" />			
				</view>
				<!-- <view class="cu-btn margin-right-xs bg-blue" @click="doSearch">搜索</view> -->
			</view>  
		</view>
    <view class="portrait bg-blue flex align-center justify-center text-xxl addBtn"
     @click="toChild"
     data-url="../consultant/add"
    >
        <view class="cuIcon-add text-bold">
      </view>
    </view>

    <!-- <view class="cu-bar bg-white search margin-bottom">
      <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input
          type="text"
          placeholder="输入搜索的关键词"
          confirm-type="search"
          v-model="keyword"
          @confirm="doSearch"
        />
      </view>
      <view class="action">
        <button
          class="cu-btn bg-gradual-green shadow-blur round"
          @click="doSearch"
          v-if="!search"
        >
          搜索
        </button>
        <button class="cu-btn line-red" @click="undoSearch" v-if="search">
          清除
        </button>
      </view>
    </view> -->
    <view style="margin-top:50px;">


    <view-scroll scroll-y class="cu-list menu-avatar no-padding">
      <view
        class="cu-item"
        @click.stop="editConsultant(item.id)"
        @longpress="delConsultant(item.id)"
        v-for="item in rows"
        :key="item.id"
      >
        <view class="cu-avatar portrait bg-blue">{{ item.name.substring(0, 1) }}</view>
        <view class="content">
          <view class="text-black text-lg">{{ item.name }}</view>
          <view class="text-gray text-sm"
            >{{ item.phone || "" }} {{ item.remark || "" }}</view
          >
        </view>
        <image src="@/static/common/phone.png" class="phone" @click.stop="callPhone(item.phone)" mode="" />
      </view>
    </view-scroll>
      </view>
    <app-loading v-if="loading" />
    <app-nomore v-if="nomore" />
    <app-emptyu v-if="!loading && rows.length === 0" />
  </view>
</template>

<script>
import Service from "@/apis/service.js";
import ConsultantService from "@/apis/consultant";
export default {
  data() {
    return {
      loading: false,
      nomore: false,
      search: false,

      keyword: null,

      page: 0,
      size: 10,
      total: 0,
      rows: [],
      vHeight: '',
      sHeight: ''
    };
  },
  onShow() {
    this.load(0);
  },
  computed: {
    houseId() {
      return uni.getStorageSync("house" + Service.KEY_SUFFIX).id;
    },
  },
  mounted() {
    this.compHeight()
    this.init();
  },
  methods: {
    compHeight() {
          const query = uni.createSelectorQuery().in(this);
          query.select('#navHeader').boundingClientRect(data => {
          console.log(data)
          this.vHeight = `margin-top:${data.height}px`   
    }).exec(); 
    },
    init() {
      this.reload();
    },
    reload() {
      this.load(0);
    },
    loadmore() {
      if ((this.page + 1) * this.size < this.total) {
        this.load(this.page + 1);
      } else if (!this.nomore) {
        this.nomore = true;
        this.toast("没有更多数据啦~");
      }
    },
    doSearch() {
      this.search = true;
      this.reload();
    },
    undoSearch() {
      this.search = false;
      this.keyword = null;
      this.reload();
    },
    load(page) {
      //获取数据
      let params = {
        page: page,
        size: this.size,
        sort: "updateTime,desc",
        houseId: this.houseId,
      };
      if (this.search && this.keyword) {
        params.keyword = this.keyword;
      }
      this.loading = true;

      ConsultantService.query(params, (res) => {
        this.loading = false;
        if (res.data.data && res.data) {
          let data = res.data.data.content;
          let arr = data || [];

          this.rows = arr;
          this.page = page;
          this.total = data.totalElements || 0;
        } else {
          this.toast("获取置业顾问数据失败");
        }
      });
    },
    // 上拉到底部
    reachBottom() {
      this.loadmore();
    },
    //下拉刷新
    pullDownRefresh() {
      this.reload();
    },
    checkClient(item) {
      console.log(item, "consultant item");
    },
    toChild(e) {
      let { doing, url } = e.currentTarget.dataset;
      if (doing) {
        this.toast("功能暂未开放，敬请期待");
      } else if (url) {
        this.navTo(url);
      }
    },
    delConsultant(consultantId) {
      this.confirm("确认删除吗？", (ok) => {
        if (ok) {
          ConsultantService.delById(consultantId, (res) => {
            if (res.statusCode === 200) {
              this.load();
              this.toast("删除成功");
            } else {
              this.toast("删除失败");
            }
          });
        }
      });
    },
    editConsultant(consultantId) {
          this.navTo(`/pages/home/consultant/edit?id=${consultantId}`)
      // this.confirm("确认修改置业顾问的信息吗？", (ok) => {
      //   if (ok) {
      //     this.navTo(`/pages/home/consultant/edit?id=${consultantId}`)
      //   }
      // });
    },
  },
};
</script>

<style lang="less" scoped>
// 头像
.portrait{
  width: 90rpx;
  height:90rpx;
  border-radius: 50%;
  &.addBtn{
    position: fixed;
    bottom:200rpx;
    right:24rpx;
    z-index: 2000;
  }
}
.phone{
  width:36rpx;
  height:36rpx;
  margin-right:24rpx;
}
</style>
