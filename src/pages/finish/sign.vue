<template>
  <view>
    <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content"><text>签约确认</text></block>
    </cu-custom>

    <form>
      <view class="cu-form-group margin-top">
        <view class="title">客户</view>
        <input
          placeholder="请输入客户名称"
          name="input"
          v-model="info.clientName"
          disabled
        />
      </view>
      <view class="cu-form-group">
        <view class="title">客户手机</view>
        <input
          placeholder="请输入客户手机"
          name="input"
          v-model="info.clientPhone"
          disabled
        />
      </view>
      <view class="cu-form-group" v-if="info.brokerName">
        <view class="title">经纪人</view>
        <input
          placeholder="请输入经纪人"
          name="input"
          v-model="info.brokerName"
          disabled
        />
      </view>
      <view class="cu-form-group">
        <view class="title">置业顾问</view>
        <input
          placeholder="请输入置业顾问"
          name="input"
          v-model="info.consultant"
          disabled
        />
      </view>

      <view class="cu-form-group margin-top">
        <view class="title">签约房号<text class="text-orange">*</text></view>
        <input
          style="height:80upx;text-centent"
          placeholder="请输入房号"
          name="input"
          v-model="info.room"
          :focus="true"
          maxlength="15"
        />
      </view>
      <view class="cu-form-group">
        <view class="title">房屋总价 <text class="text-orange">*</text></view>
        <input
          style="height:80upx;text-centent"
          placeholder="请输入房屋总价"
          name="input"
          v-model="info.price"
          maxlength="15"
        />
        <text class="text-gray">元</text>
      </view>
      <view class="cu-form-group">
        <view class="title">暂定佣金<text class="text-orange">*</text></view>
        <input
          style="height:80upx;text-centent"
          placeholder="请输入暂定佣金"
          name="input"
          v-model="earnest"
          maxlength="15"
        />
        <text class="text-gray">元</text>
      </view>
      <view class="cu-form-group">
        <view class="title">签约日期</view>
        <picker
          mode="date"
          :value="date"
          start="2020-11-01"
          @change="DateChange"
        >
          <view class="picker">
            {{ date }}
          </view>
        </picker>
      </view>
      <view class="cu-form-group">
        <view class="title">签约时间</view>
        <picker
          mode="time"
          :value="time"
          start="00:00"
          end="24:00"
          @change="TimeChange"
        >
          <view class="picker">
            {{ time }}
          </view>
        </picker>
      </view>
      <view class="cu-form-group align-start">
        <view class="title">备注</view>
        <textarea
          maxlength="-1"
          :disabled="modalName != null"
          @input="textareaBInput"
          placeholder="请输入备注"
        ></textarea>
      </view>

      <view class="cu-bar bg-white margin-top">
        <view class="action">合同照片</view>
        <view class="action">{{ imgList.length }}/9</view>
      </view>

      <view class="cu-form-group">
        <view class="grid col-4 grid-square flex-sub">
          <view
            class="bg-img"
            v-for="(item, index) in imgList"
            :key="index"
            @click="ViewImage"
            :data-url="imgList[index]"
          >
            <image :src="imgList[index]" mode="aspectFill" />
            <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
              <text class="cuIcon-close"></text>
            </view>
          </view>
          <view class="solids" @tap="ChooseImage" v-if="imgList.length < 9">
            <text class="cuIcon-cameraadd"></text>
          </view>
        </view>
      </view>
      <div class="padding text-orange">注：已上传图片不可编辑</div>

      <view class="flex justify-center margin-top">
        <view class="padding flex flex-direction">
          <button class="cu-btn bg-blue lg" @click="toCommit">提交</button>
        </view>
      </view>
    </form>
  </view>
</template>

<script>
import OrderService from "@/apis/order";
import OssService from "@/apis/oss";
import Service from "@/apis/service";
export default {
  data() {
    return {
      id: "",
      info: {
        clientName: "",
      },
      modalName: null,
      imgList: [],
      date: `${new Date().getFullYear()}-${new Date().getMonth() +
        1}-${new Date().getDate()}`,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      contractRemark: "",
      contractRoom: "",
      contractPrice: "",
      earnest: "",
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.id;
    },
  },
  onLoad(options) {
    this.id = options.id;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.load();
    },
    load() {
      let { id } = this;
      OrderService.byId(id, (res) => {
        console.log(id, "order id");
        console.log(res, "order res");
        if (res.statusCode === 200) {
          this.info = {
            ...res.data,
            consultant: res.data._embedded.report.consultant.name,
          };
          console.log(this.info, "info");
        } else {
          this.toast("获取认购单信息失败");
        }
      });
    },
    ChooseImage() {
      uni.chooseImage({
        count: 9, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        // sourceType: ["album"], //从相册选择
        success: (res) => {
          if (this.imgList.length != 0) {
            this.imgList = [...this.imgList.concat(res.tempFilePaths)];
          } else {
            this.imgList = [...res.tempFilePaths];
          }
        },
      });
    },
    ViewImage(e) {
      uni.previewImage({
        urls: this.imgList,
        current: e.currentTarget.dataset.url,
      });
    },
    DelImg(e) {
      uni.showModal({
        title: "合同照片",
        content: "确定要删除这些合同吗？",
        cancelText: "取消",
        confirmText: "删除",
        success: (res) => {
          if (res.confirm) {
            this.imgList.splice(e.currentTarget.dataset.index, 1);
          }
        },
      });
    },
    textareaBInput(e) {
      this.contractRemark = e.detail.value;
    },
    DateChange(e) {
      this.date = e.detail.value;
    },
    TimeChange(e) {
      this.time = e.detail.value;
    },
    toCommit() {
      let {
        userId,
        id,
        // contractRoom,
        // contractPrice,
        contractRemark,
        earnest,
        imgList,
      } = this;
      if (!this.info.room || this.info.room.length === 0) {
          this.toast("请填写正确房号");
          return;
      }
       if (this.info.price || this.info.price.length === 0) {
        let myreg = /^(-?\d+)(\.\d+)?$/;
        if (!myreg.test(this.info.price)) {
          this.toast("请填写正确房屋总价");
          return;
        }
      }
      if (!earnest || earnest.length === 0) {
        this.toast("请填写正确暂定佣金");
        return;
      }
      if (contractRemark.length > 500) {
        this.toast("备注不能超过500字");
        return;
      }
      let sign = {
        id: id,
        contractResidentId: this.userId,
        // contractRoom: this.contractRoom,
        contractRoom: this.info.room,
        contractPrice: Number(this.info.price),
        contractRemark: this.contractRemark,
        earnest: this.earnest,
        contractTime: this.date + " " + this.time + ":00",
        contractPhotos: [],
      };
      this.confirm("确定要签约吗？", (ok) => {
        if (ok) {
          this.showLoading(() => {
            if (imgList.length !== 0) {
              Service.uploadOssBatch(
                this.imgList,
                "/report/evidence/" + this.reportId
              ).then((media) => {
                if (media) {
                  let urls = [...media].map((m) => {
                    return Service.URI_API + "/rest/medias/" + m.id;
                  });
                  sign.contractPhotos = [...media].map((m) => {
                    return { id: m.id };
                  });
                  OrderService.putContract(sign, (res) => {
                    if (res.statusCode === 202) {
                      this.toast("签约成功", "success");
                      setTimeout(() => {
                        uni.navigateBack({
                          delta: 1,
                        });
                      }, 800);
                    } else {
                      this.toast("签约失败");
                    }
                  });
                } else {
                  this.toast("上传附件失败");
                }
                this.hideLoading();
              });
            } else {
              OrderService.putContract(sign, (res) => {
                if (res.statusCode === 202) {
                  this.hideLoading();
                  this.toast("签约成功", "success");
                  // this.navTo("/pages/index/index");
                  uni.navigateBack();
                } else {
                  this.hideLoading();
                  this.toast("签约失败");
                }
              });
            }
          });
        }
      });
    },
  },
};
</script>
<style>
.cu-form-group .title {
  min-width: calc(4em + 15px);
}
</style>
