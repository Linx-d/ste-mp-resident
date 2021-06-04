<template>
  <view>
    <cu-custom bgColor="text-bold bg-white text-black" :is-back="true">
      <block slot="backText">返回</block>
      <block slot="content">{{
        status === "0"
          ? "到访证据链"
          : status === "1"
          ? "上传认购单"
          : "上传合同照片"
      }}</block>
    </cu-custom>
    <form>
      <view class="cu-form-group margin-top">
        <view class="title">客户</view>
        <view>{{ client.name || "-" }}</view>
      </view>
      <view class="cu-form-group">
        <view class="title">客户手机</view>
        <view>{{ client.phone || "-" }}</view>
      </view>
      <view class="cu-form-group">
        <view class="title">经纪人</view>
        <view>{{ broker.name || "-" }}</view>
      </view>
      <view class="cu-form-group">
        <view class="title">到访时间</view>
        <view>{{ report.acceptTime || "-" }}</view>
      </view>

      <view class="cu-form-group margin-top">
        <view class="title">置业顾问</view>
        <view>{{ consultant ? consultant.name : "-" }}</view>
      </view>

      <view v-if="report.evidence.length > 0">
        <view class="cu-bar bg-white margin-top">
          <view class="action">{{
            status === "0"
              ? "已上传证据"
              : status === "1"
              ? "已上传认购图片"
              : "已上传合同照片"
          }}</view>
          <view class="action"
            >{{
              status === "0"
                ? report.evidence.length
                : status === "1"
                ? photos.length
                : contractPhotos.length
            }}/{{ max }}</view
          >
        </view>
        <view class="padding-lr-xl bg-white">
          <app-media-grid
            :media="
              status === '0'
                ? report.evidence
                : status === '1'
                ? photos
                : contractPhotos
            "
          />
        </view>
      </view>

      <view
        class="cu-bar bg-white margin-top"
        v-if="leftSize > 0 || imgSize > 0"
      >
        <view class="action">{{
          status === "0"
            ? "到访确认证据"
            : status === "1"
            ? "上传认购照片"
            : "上传合同照片"
        }}</view>
        <view class="action">{{ fileList.length }}/{{ leftSize }}</view>
      </view>

      <view class="cu-form-group" v-if="leftSize > 0 || imgSize > 0">
        <view class="grid col-4 grid-square flex-sub">
          <view
            class="bg-img"
            v-for="(item, index) in fileList"
            :key="index"
            @click="ViewImage"
            :data-url="fileList[index].thumb"
          >
            <image :src="fileList[index].thumb" mode="aspectFill" />
            <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
              <text class="cuIcon-close"></text>
            </view>
          </view>
          <view class="solids" @tap="ChooseImage" v-if="leftSize - imgSize > 0">
            <text class="cuIcon-cameraadd"></text>
          </view>
        </view>
      </view>
      <div class="padding text-blue">注：已上传内容不可编辑</div>

      <view class="padding flex flex-direction margin-top">
        <button
          class="cu-btn bg-blue lg"
          @click="subCommit"
          :disabled="imgSize === 0"
        >
          提交
        </button>
      </view>
    </form>
  </view>
</template>

<script>
import Service from "@/apis/service";
import ReportService from "@/apis/report";
import OrderService from "@/apis/order";
// import ClientService from "@/apis/client";

export default {
  data() {
    return {
      fileList: [],
      modalName: null,
      clientId: "",
      reportId: "",
      orderId: "",
      info: "",
      max: 9,
      report: {},
      status: "",
      photos: [], //认购单信息
      contractPhotos: [], //合同照片
    };
  },
  computed: {
    client() {
      return this.report ? this.report.client : null;
    },
    broker() {
      return this.report ? this.report.broker : null;
    },
    consultant() {
      return this.report ? this.report.consultant : null;
    },
    imgSize() {
      return this.fileList.length;
    },
    leftSize() {
      switch (this.status) {
        case "0":
          return (
            this.max - (this.report ? (this.report.evidence || []).length : 0)
          );
          break;
        case "1":
          return this.max - (this.photos ? (this.photos || []).length : 0);
          break;
        case "2":
            return this.max - (this.contractPhotos ? (this.contractPhotos || []).length : 0)
      }
    },
  },
  onLoad(options) {
    this.status = options.status;
    switch (this.status) {
      case "0":
        this.reportId = options.reportId;
        break;
      case "1":
        this.orderId = options.orderId;
        break;
      case "2":
        this.orderId = options.orderId;
        break;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    sortPhoto(arrayPhoto) {
        arrayPhoto.forEach(item => {
          let date = new Date(item.updateTime)
         item.sortTime = date.getTime()
          });
      function compare(prop) {
        return function(a,b) {
        let value1 = a[prop];
        let value2 = b[prop];
        return value2 - value1
         }
        }
        arrayPhoto.sort(compare('sortTime'))
    },
    init() {
      switch (this.status) {
        case "0":
          ReportService.byIdInfo(this.reportId, (res) => {
            if (res.data) {
              this.report = res.data;
              this.sortPhoto(this.report.evidence)
            }
          });
          break;
        case "1":
          OrderService.byOrderIdReport(this.orderId, (res) => {
            if (res.data) {
              this.report = res.data;
            }
          });
          OrderService.getPhotos(this.orderId, (res) => {
            this.photos = res.data._embedded.medias;
            this.sortPhoto(this.photos)
          });
          break;
        case "2":
          OrderService.byOrderIdReport(this.orderId, (res) => {
            if (res.data) {
              this.report = res.data;
            }
          });
          OrderService.getContractPhotos(this.orderId, (res) => {
            this.contractPhotos = res.data._embedded.medias;
            this.sortPhoto(this.contractPhotos)
          });
          break;
      }
    },

    ChooseImage() {
      uni.chooseMedia({
        count: this.leftSize - this.imgSize, //默认9
        mediaType: ["image", "video"],
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], //从相册选择
        success: (res) => {
          let { tempFiles, type } = res;

          let arr =
            type === "video"
              ? [
                  {
                    type: "video/mp4",
                    path: tempFiles[0].tempFilePath,
                    thumb: tempFiles[0].thumbTempFilePath,
                  },
                ]
              : tempFiles.map((i) => {
                  let path = i.tempFilePath;
                  return {
                    type: "image/jpeg",
                    path,
                    thumb: path,
                  };
                });

          if (this.fileList.length > 0) {
            this.fileList = [...this.fileList, ...arr];
          } else {
            this.fileList = [...arr];
          }
        },
      });
    },
    ViewImage(e) {
      uni.previewImage({
        urls: this.fileList.map((i) => i.thumb),
        current: e.currentTarget.dataset.url,
      });
    },
    DelImg(e) {
      this.confirm("确定删除此内容吗？", (ok) => {
        if (ok) {
          this.fileList.splice(e.currentTarget.dataset.index, 1);
        }
      });
    },
    subCommit() {
      switch (this.status) {
        case "0":
          let commitData = {
            commitUrl: "/report/evidence/" + this.reportId,
            photo: this.report.evidence,
          };
          this.toCommit(commitData);
          break;
        case "1":
          commitData = {
            commitUrl: "/orders/photos" + this.orderId,
            photo: this.photos,
          };
          this.toCommit(commitData);
          break;
          case "2":
          commitData = {
            commitUrl: "/orders/contractPhotos" + this.orderId,
            photo: this.contractPhotos,
          };
          this.toCommit(commitData);
          break;
      }
    },
    toCommit(commitData) {
      this.confirm("确定要提交证据链吗？", (ok) => {
        if (ok) {
          console.log(commitData)
          this.showLoading(() => {
            Service.uploadOssBatch(
              this.fileList,
              //   "/report/evidence/" + this.reportId,
              commitData.commitUrl
            ).then((media) => {
              this.hideLoading();
              if (media) {
                let urls = [...commitData.photo, ...media].map((m) => {
                  return Service.URI_API + "/rest/medias/" + m.id;
                });
                if (this.status === "0") {
                  ReportService.putEvidence(
                    this.reportId,
                    urls.join("\n"),
                    (res) => {
                      if (res.statusCode === 204) {
                        this.toast("保存成功", "success");
                        this.successBack();
                      } else {
                        this.toast("保存失败");
                      }
                    }
                  );
                }
                if (this.status === "1") {
                  OrderService.putPhotos(
                    this.orderId,
                    urls.join("\n"),
                    (res) => {
                      if (res.statusCode === 204) {
                        this.toast("保存成功", "success");
                        this.successBack();
                      } else {
                        this.toast("保存失败");
                      }
                    }
                  );
                }
                if (this.status === "2") {
                  OrderService.putContractPhotos(
                    this.orderId,
                    urls.join("\n"),
                    (res) => {
                      if (res.statusCode === 204) {
                        this.toast("保存成功", "success");
                        this.successBack();
                      } else {
                        this.toast("保存失败");
                      }
                    }
                  );
                }
              } else {
                this.toast("上传附件失败");
              }
            });
          });
        }
      });
    },
    successBack() {
      let pages = getCurrentPages();
      let pre = pages[pages.length - 2]; //当前页面
      pre.$vm.init();

      this.navBack();
    },
  },
};
</script>