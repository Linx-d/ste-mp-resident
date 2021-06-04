<template>
  <view>
    <app-report-item
      v-for="item in rows"
      :key="item.id"
      :item="item"
    ></app-report-item>

    <app-emptyu v-if="!loading && rows.length === 0"></app-emptyu>
    <app-loading-content height="32px" v-if="loading"></app-loading-content>
    <app-nomore v-if="nomore"></app-nomore>
  </view>
</template>

<script>
import Service from "@/apis/service.js";
import ReportService from "@/apis/report.js";
export default {
  props: {
    status: { type: Number, default: () => 0 },
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
    userId() {
      return this.$store.state.user.id;
    },
    houseId() {
      return uni.getStorageSync("house" + Service.KEY_SUFFIX).id;
    },
    taskId() {
      return uni.getStorageSync("task" + Service.KEY_SUFFIX).id;
    },
  },
  mounted() {
    this.init();
  },
  onLoad() {},
  watch: {},
  methods: {
    init() {
      this.load(0);
    },
    reload() {
      this.load(0);
    },
    loadmore() {
      if(this.loading) return
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
        userId:this.userId
      };
      this.loading = true;
      if (page === 0) {
        this.nomore = false;
      }

      ReportService.queryReport(params, (res) => {
        this.loading = false;
        if (res.statusCode === 200) {
          let reports = res.data.data.content;
          // let rows = res.data._embedded.orders;
          let total = res.data.data.totalElement;
          let rows = reports.map((value, index) => {
            return {
              ...value,
            };
          });
          this.total = total;
          this.page = page;
          this.rows = page === 0 ? rows : [...this.rows, ...rows];
          this.rows.forEach(item => {
            if(item.client.phone.indexOf(',') != -1){
                item.client.arrPhone = item.client.phone.split(',')
            }
          });
        } else {
          this.toast(res.message);
        }

        // 下拉刷新关闭
        uni.stopPullDownRefresh();
      });
    },
  },
  components: {},
};
</script>

<style lang="less">
.border-e0 {
  border: 1px solid #e0e0e0;
}

.noData {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
</style>
