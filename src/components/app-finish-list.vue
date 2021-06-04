<template>
  <view>
    <app-finish-item
      v-for="item in rows"
      :key="item.id"
      :item="item"
    ></app-finish-item>

    <app-emptyu v-if="!loading && rows.length === 0" />
    <app-loading-content v-if="loading"></app-loading-content>
    <app-nomore v-if="nomore"></app-nomore>
  </view>
</template>

<script>
import Service from "@/apis/service.js";
import OrderService from "@/apis/order";
import appLoadingContent from './app-loading-content.vue';
export default {
  components: { appLoadingContent },
  props: {
    status: {
      type: Number,
      default: () => 0,
    },
    params: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      rows: [],
      page: 0,
      size: 5,
      total: 0,
      loading: false,
      nomore: false,
    };
  },
  computed: {
    residentId() {
      return this.$store.state.user.id;
    },
    houseId() {
      return uni.getStorageSync("house" + Service.KEY_SUFFIX).id;
    },
    taskId() {
      return uni.getStorageSync("task" + Service.KEY_SUFFIX).id;
    },
	userId() {
	  return this.$store.state.user.id;
	}
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.load(0);
    },
    reload() {
      this.load(0);
    },
    loadmore() {
      if(this.loading) return
      
      this.load(this.page + 1);
      if ((this.page + 1) * this.size < this.total) {
        this.load(this.page + 1);
      } else if (!this.nomore) {
        this.toast("没有更多数据了");
        this.nomore = true;
      }
    },
    load(page) {
      let params = {
        page: page,
        size: this.size,
        taskId: this.taskId,
        status: this.status,
        sort: "updateTime,desc",
		userId:this.userId,
        ...params,
      };
      this.loading = true;
      if (page === 0) {
        this.nomore = false;
      }

      OrderService.queryOrder(params, (res) => {
        this.loading = false;
        console.log(params, "params");
        console.log(res, "res order");
        if (res.statusCode === 200) {
          let rows = res.data.data.content;
          let total = res.data.data.totalElement;
          rows = rows.map((v, index) => {
            let task = v.report.task;
            let report = v.report;
            return {
              ...v,
              houseName: task.houseName,
              houseType: task.houseType,
              leftProtectDays: report.leftProtectDays,
              //头像*无
              avatar: v.avatar,
              appointment: report.appointment,
              acceptTime: report.acceptTime,
              createTime: report.createTime,
              //顾客信息-id
              client: report.client,
            };
          });

          this.total = total;
          this.page = page;
          this.rows = page === 0 ? rows : [...this.rows, ...rows];
          console.log(this.rows, 'rows')
          this.rows.forEach(item => {
            if(item.client.phone.indexOf(',') != -1) {
              item.client.arrPhone = item.client.phone.split(',')
            }
          });
        } else {
          this.toast("获取数据失败");
        }
        // 下拉刷新关闭
        uni.stopPullDownRefresh();
      });
    },
  },
};
</script>
