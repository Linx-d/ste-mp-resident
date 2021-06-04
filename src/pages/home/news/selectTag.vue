<template>
  <view>
    <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">添加标签</block>
    </cu-custom>
    <form>
      <view class="cu-form-group margin-top cu-item">
        <input name="input" placeholder="请选择标签" v-model="selectItem" @input="enter"/>
      </view>
    </form>
    <view class="bg-white flex margin-top flex-wrap">
      <view
        class="cu-tag margin"
        v-for="(item, index) in arrTag"
        :key="index"
        @click="selectName(item)"
      >
        {{ item }}
      </view>
    </view>
  </view>
</template>

<script>
import consultantService from "@/apis/consultant.js";
import ReportService from '@/apis/report.js'
export default {
  data() {
    return {
      selectItem: "",
      arrTag: [
        '楼盘咨询', '促销活动', '紧急通知', '佣金调整', '紧急加推', '开盘提醒'
      ]
    };
  },
  mounted() {
 
  },
  methods: {
    selectName(item) {
      this.selectItem = item;
      if(this.selectItem === item) {
         uni.setStorageSync('selectTag', this.selectItem);
         this.navBack()
      }
    },
  },
  onLoad() {
  },
};
</script>

<style lang="less" scoped>
</style>