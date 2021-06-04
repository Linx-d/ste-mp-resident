<template>
  <view>
      <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content"><text>认购确认</text></block>
    </cu-custom>
    <form>
      <view class="cu-form-group margin-top">
        <view class="title">客户</view>
        <input
          placeholder="请输入客户名称"
          name="input"
          v-model="info.client"
          disabled
        />
      </view>
      <view class="cu-form-group">
        <view class="title">客户手机</view>
        <input
          placeholder="请输入客户手机"
          name="input"
          v-model="info.phone"
          disabled
        />
      </view>
      <view class="cu-form-group" v-if="info.broker">
        <view class="title">经纪人</view>
        <input
          placeholder="请输入经纪人"
          name="input"
          v-model="info.broker"
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
        <view class="title">客户身份证号<text class="text-orange">*</text></view>
        <input
          :focus="true"
          style="height:80upx;text-centent"
          placeholder="请输入客户身份证号"
          name="input"
          v-model="idcard"
        />
      </view>
      <view class="cu-form-group">
        <view class="title">认购房号<text class="text-orange">*</text></view>
        <input
          style="height:80upx;text-centent"
          placeholder="请输入房号"
          name="input"
          v-model="room"
          maxlength="15"
        />
      </view>
      <view class="cu-form-group">
        <view class="title">房屋总价<text class="text-orange">*</text></view>
        <input
          style="height:80upx;text-centent"
          placeholder="请输入房屋总价"
          name="input"
          v-model="price"
          maxlength="15"
        />
        <text class="text-gray">元</text>
      </view>
      <view class="cu-form-group">
        <view class="title">预计签约日期选择</view>
        <picker
          mode="date"
          v-model="date"
          start="2020-11-20"
          @change="DateChange"
        >
          <view class="picker">
            {{ date }}
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
        <view class="action">认购单照片</view>
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
      <div class="padding text-blue bg-white">注：已上传图片不可编辑</div>
      <view class="padding flex flex-direction bg-white">
			<button class="cu-btn bg-blue lg" @click="toCommit">提交</button>
		</view> 
      <!-- <view class="flex justify-center margin-top">
        <view class="padding flex flex-direction">
          <button class="cu-btn bg-blue" @click="toCommit">提交</button>
        </view>
      </view> -->
    </form>
  </view>
</template>

<script>
import OrderService from "@/apis/order.js";
import ReportService from "@/apis/report.js";
import Service from "@/apis/service.js";
import OssService from "@/apis/oss";
export default {
  data() {
    return {
      id: "",
      imgList: [],
      info: {},
      room: "",
      price: "",
      idcard: null,
      date: `${new Date().getFullYear()}-${new Date().getMonth() +
        1}-${new Date().getDate()}`,
      remark: "",
      modalName: null,
      photos: [],
    };
  },
  onLoad(options) {
    this.id = options.id;
  },
  computed: {
    userId() {
      return this.$store.state.user.id;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 获取报备单信息
      let { id, info } = this;
      ReportService.byIdAll(id, (res) => {
        console.log(res, "res");
        if (res.statusCode === 200) {
          console.log(res);
          let { info } = this;
          let { data } = res;
          let { client, task, broker, consultant } = data;
          info = {
            project: task.name,
            client: client.name,
            phone: client.phone,
            appointment: data.appointment,
            consultant: consultant.name,
          };
          if (broker) info.broker = broker.name
          this.info = info;
        } else {
          this.toast("获取失败");
        }
      });
    },
    TimeChange(e) {
      this.time = e.detail.value;
    },
    DateChange(e) {
      this.date = e.detail.value;
    },
    ChooseImage() {
      uni.chooseImage({
        count: 9, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], //从相册选择
        success: (res) => {
          if (this.imgList.length != 0) {
            // this.imgList = this.imgList.concat(res.tempFilePaths);
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
      this.confirm("确定删除此图片吗？", (ok) => {
        if (ok) {
          this.imgList.splice(e.currentTarget.dataset.index, 1);
        }
      });
    },
    textareaBInput(e) {
      this.remark = e.detail.value;
    },
    toCommit() {
      let { userId, id, room, price, remark, imgList, idcard, photos } = this;
      let params = {
        acceptUserId: userId,
        id: id,
      };
      const idReg = /^([0-9]){7,18}(x|X)?$/
      console.log(this.$store.state.user, "userssss");
      console.log(params, "params");

      if (!room || room.length === 0) {
        this.toast("请填写正确房号");
        return;
      }
      if (!price || price.length === 0) {
        this.toast("请填写正确房屋总价");
        return;
      }
      if (!idcard || idcard.length === 0 || !idReg.test(idcard)) {
        this.toast("请填写正确客户身份证号");
        return;
      }
      if (remark.length > 500) {
        this.toast("备注不能超过500字");
        return;
      }
      let buy = {
        resident: ReportService.URI_API + "/rest/residents/" + userId,
        report: ReportService.URI_API + "/rest/reports/" + id,
        room: this.room,
        price: Number(this.price),
        remark: this.remark,
        signDate: `${this.date} 00:00:00`,
        status: 0,
        idcard
      };
      this.confirm("确定要提交认购单吗？", (ok) => {
        if (ok) {
          this.showLoading(() => {
            if (imgList.length !== 0) {
              OrderService.add(buy, (res) => {
                if (res.statusCode === 201) {
                  let orderId = res.data.id;
                  Service.uploadOssBatch(
                    this.imgList,
                    "/order/photo/" + orderId
                  ).then((media) => {
                    if (media) {
                      let urls = [...media].map((m) => {
                        return Service.URI_API + "/rest/medias/" + m.id;
                      });
                      OrderService.putPhoto(orderId, urls.join("\n"), (res) => {
                        if (res.statusCode === 204) {
                          this.toast("认购成功", "success");
                          setTimeout(() => {
                            uni.navigateBack({
                              delta: 1,
                            });
                          }, 800);
                        } else {
                          this.toast("认购失败");
                        }
                      });
                    } else {
                      this.toast("上传附件失败");
                    }
                    this.hideLoading();
                  });
                }
              });
            } else {
              OrderService.add(buy, (res) => {
                this.hideLoading();
                if (res.statusCode === 201) {
                  setTimeout(() => {
                    uni.navigateBack({
                      delta: 1,
                    });
                  }, 800);
                  this.toast("认购成功", "success");
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
