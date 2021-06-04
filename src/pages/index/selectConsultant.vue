<template>
  <view>
    <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">到访确认</block>
    </cu-custom>
    <form>
      <view class="cu-form-group margin-top cu-item">
        <input name="input" placeholder="按名字筛选" v-model="selectItem" @input="enter"/>
      </view>
      <!-- <view class="cu-bar.tabbar .btn-group">
      <view class="cu-btn bg-blue round shadow" @click.stop="reset">删除</view>
      <view class="cu-btn bg-blue round shadow" @click.stop="submit">确定</view>
       </view> -->
    </form>
    <view class="bg-white flex margin-top flex-wrap">
      <view
        class="cu-tag margin"
        v-for="(item, index) in consultantList1"
        :key="index"
        @click="selectName(item)"
      >
        {{ item.name }}
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
      houseId: "",
      consultantList: [],
      consultantList1: [],
      idList: [],
      selectItem: "",
      status: null,
      id: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 获取顾客列表
      consultantService.inHouse(this.houseId, (res) => {
        let { consultants } = res.data._embedded;
        console.log(consultants)
        this.consultantList = consultants
        this.consultantList1 = this.consultantList
        if (this.consultantList.length === 0) {
          this.toast("请先添加置业顾问");
        }
        uni.hideLoading();
      });
    },
    selectName(item) {
      this.selectItem = item.name;
      let have = this.consultantList.filter((item) => {
        return item.name === this.selectItem;
      });
      if(this.status == 1) {
        let params = item._links.self.href
        console.log(params)
        ReportService.putConsultant(this.id, params, (res)=>{
          console.log(res)
        })
      }
      if(have) {
         uni.setStorageSync('selectItem', have[0]);
         this.navBack()
      }
    },
    // submit() {
    //   let have = this.consultantList.filter((item) => {
    //     return item.name === this.selectItem;
    //   });
    //   if(have) {
    //      uni.setStorageSync('selectItem', have[0]);
    //      this.navBack()
    //   }
    // },
    // reset() {
    //     this.selectItem = '';
    //     this.consultantList1 = this.consultantList
    // },
    enter() {
        let arr = this.consultantList.filter(item => {
            return item.name.indexOf(this.selectItem) != -1
        })
        this.consultantList1 = arr
    }
  },
  onLoad(options) {
    this.houseId = options.houseId;
    this.status = options.status;
    this.id = options.id;
    console.log(options);
  },
};
</script>

<style lang="less" scoped>
</style>