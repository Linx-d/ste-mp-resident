<template>
  <view>
      <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">
              已否决报备
            </block>
    </cu-custom>
    <app-report-list :status="status" ref="list-1"></app-report-list>
  </view>
</template>

<script>
import ReportService from "@/apis/report.js";
export default {
  data() {
    return {
      status: -1,
    };
  },
  mounted() {
    this.init();
  },
  onLoad() {},
  watch: {},
  onPullDownRefresh(){
    this.$refs['list-1'].reload()
  },
  onReachBottom(){
    this.$refs['list-1'].loadmore()
  },
  methods: {
    init() {
      this.load();
    },
    load() {},
    loadmore() {},
  },
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
