<template>
  <view>
    <cu-custom
      bgColor="text-bold bg-white text-black"
      :isBack="true"
    >
      <block slot="backText">返回</block>
      <block slot="content">{{ title }}</block>
    </cu-custom>
      <view class="cu-card article bg-white work-header shadow">
        <view class="cu-item shadow">
          <app-loading-content v-if="houseLoading"></app-loading-content>
          <view v-else class="content" @click="toTask">
            <image
              :src="info.cover ? info.cover : DEFAULT_COVER"
              mode="aspectFill"
            ></image>
            <view class="house-header">
                <view class="grid col-1">
                  <view class="text-black text-lg text-bold margin-ss" style="margin-top:0;">
                    {{ order.houseName || "-" }}
                  </view>
                  <view class="flex text-lightGrey text-sm margin-ss">
                  <view>
                    {{ info.province || '-' }}·{{ info.district || '-' }}
                  </view>     
                  <text class="margin-lr-sm">|</text>             
                  <view>
                    建面{{ info.acreage || "-" }}m²
                  </view>
                </view>
                <view class="text-red margin-ss">
                    <text class="text-red text-df text-bold">{{
                      info.salePrice ? this.formatPrice(info.salePrice) : "-"
                    }}元</text>
                    <text class="text-red text-sm">/m²</text>
                  </view>
                  <view class="flex ">
                    <view class="cu-tag bg-green radius margin-ss" style="line-height:38rpx;">
                      {{ order.housePropertyType }}
                    </view>
                    <view
                      class="bg-blue cu-tag light radius margin-ss"
                      style="line-height:38rpx;"
                      >
                     <view v-if="info.saleStatus === 0" 
                    >待售</view
                  >
                  <view v-if="info.saleStatus === 1"
                    >在售</view
                  >
                  <view v-if="info.saleStatus === -1"
                    >停售</view
                  >                     
                    </view>
                  </view>
                </view>
            </view>
          </view>
        </view>
      </view>

      <view class="bg-white padding margin-top">
        <view class="text-lg">
          <text class="text-black text-bold">订单信息</text>
        </view>
        <app-loading-content v-if="orderLoading"></app-loading-content>
        <view v-else>
          <view class="flex padding-top p-xs mb-sm">
            <view class="flex-sub text-gray">订单编号</view>
            <view class="flex-twice text-content">
              {{ order.id || "-" }}
              <view class="cu-avatar-group">
                <view class="cuIcon-copy text-orange" @click="copy(order.id)">
                </view>
              </view>
            </view>
          </view>
          <view v-if="order.status === 1" class="flex padding-top p-xs mb-sm">
            <view class="flex-sub text-gray">签约时间</view>
            <view class="flex-twice text-content">{{
              order.contractTime || "-"
            }}</view>
          </view>
          <view class="flex padding-top p-xs mb-sm">
            <view class="flex-sub text-gray">认购时间</view>
            <view class="flex-twice text-content">{{
              order.createTime || "-"
            }}</view>
          </view>
          <view class="flex padding-top p-xs mb-sm">
            <view class="flex-sub text-gray">客户姓名</view>
            <view class="flex-twice text-content flex">
              <text>{{ order.clientName }}</text>
            </view>
          </view>
          <view class="flex padding-top p-xs mb-sm">
            <view class="flex-sub text-gray">手机号码</view>
            <view class="flex-twice text-content">       
              <text class="margin-right" @click="callPhone(order.clientPhone)">
                 {{ order.clientPhone || "-" }}
              </text>
              <phone-image :infoPhone="order.clientPhone"></phone-image>
              </view>
          </view>
          <view v-if="report.naturalVisit === 1">
            <view class="flex padding-top p-xs mb-sm">
              <view class="flex-sub text-gray">经纪人</view>
              <view class="flex-twice text-content">{{
                order.brokerName
              }}</view>
            </view>
            <view class="flex padding-top p-xs mb-sm">
              <view class="flex-sub text-gray"
                >手机号码</view
              >
              <view class="flex-twice text-content">                 
                <text class="margin-right" @click="callPhone(report.broker.phone)">
                  {{ report.broker.phone || "-" }}
                </text>
                  <phone-image :infoPhone="report.broker.phone"></phone-image>
              </view>
            </view>
          </view>
          <!-- <view class="flex  p-xs mb-sm">
          <view class="flex-sub padding-sm radius text-gray"></view>
          <view class="flex-twice  padding-sm radius">
            <view
              class="cu-btn bg-blue round shadow"
              @click.stop="toCheckOut(id)"
          >退房</view>
          </view>
        </view> -->
        </view>
      </view>

      <view class="bg-white padding margin-top" v-if="order.status === -1">
        <view class="text-lg">
          <text class="text-black text-bold">退房信息</text>
        </view>

        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">驻场</view>
          <view class="flex-twice text-content">
            <text>
              {{ order.contractResident.name }}
            </text>
          </view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">客户姓名</view>
          <view class="flex-twice text-content">{{
            order.clientName
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">手机号码</view>
          <view class="flex-twice text-content">
          <text class="margin-right" @click="callPhone(order.clientPhone)">
            {{ order.clientPhone || "-" }}
          </text>
            <phone-image :infoPhone="order.clientPhone"></phone-image>
          </view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">退房时间</view>
          <view class="flex-twice text-content">{{
            order.returnTime
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">退房原因</view>
          <view class="flex-twice text-content">{{
            order.returnRemark
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">证据链</view>
          <view class="flex-twice text-content">
            <app-media-grid :media="evidence" v-if="evidence && evidence.length > 0" />
            <view v-else class="flex-twice  padding-sm radius"
              >未上传</view
            ></view
          >
        </view>
      </view>

      <view class="bg-white padding margin-top" v-if="order.status !== 0">
        <view class="text-lg">
          <text class="text-black text-bold">签约信息</text>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">驻场</view>
          <view class="flex-twice text-content">
            {{ order.contractResident.name }}
          </view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">手机号码</view>
          <view class="flex-twice text-content">
             <text class="margin-right" @click="callPhone(order.contractResident.phone)">
                {{ order.contractResident.phone || "-"}}
             </text>
            <phone-image :infoPhone="order.contractResident.phone"></phone-image>
        </view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">置业顾问</view>
          <view class="flex-twice text-content">{{
            report.consultant.name
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">签约房号</view>
          <view class="flex-twice text-content">{{
            order.contractRoom || "-"
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">房屋总价</view>
          <view class="flex-twice text-content">{{
            order.contractPrice ? this.formatPrice(order.contractPrice) : "-"
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">签约备注</view>
          <view class="flex-twice text-content">{{
            order.contractRemark || "-"
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">暂定佣金</view>
          <view class="flex-twice text-content">{{
            order.earnest ? this.formatPrice(order.earnest) : "-"
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">合同</view>
          <app-loading-content v-if="contractLoading"></app-loading-content>
          <view class="flex-twice text-content">
            <app-media-border
              :media="contractPhotos"
               @evidence="subscription(id,'2')"
            />
            </view
          >
        </view>
      </view>

      <view class="bg-white padding margin-top">
        <view class="text-lg">
          <text class="text-black text-bold">认购信息</text>
        </view>

        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">驻场</view>
          <view class="flex-twice text-content">
            {{ order.resident.name }}
          </view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">手机号码</view>
          <view class="flex-twice text-content">
            <text class="margin-right" @click="callPhone(order.resident.phone)">
              {{ order.resident.phone || "-" }}
            </text>
            <phone-image :infoPhone="order.resident.phone"></phone-image>
          </view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">置业顾问</view>
          <view class="flex-twice text-content">{{
            report.consultant.name
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray"
            >手机号码</view
          >
          <view class="flex-twice text-content">
            <text class="margin-right" @click="callPhone(report.consultant.phone)">
              {{ report.consultant.phone || "-"}}
            </text>
            <phone-image :infoPhone="report.consultant.phone"></phone-image>
            </view>
        </view>
        <template v-if="order.status !== 1">    
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">认购房号</view>
          <view class="flex-twice text-content">{{ order.room }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">房屋总价</view>
          <view class="flex-twice text-content">{{
            order.price ? this.formatPrice(order.price) : "-"
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">认购时间</view>
          <view class="flex-twice text-content">{{
            order.createTime || "-"
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">预计签约时间</view>
          <view class="flex-twice text-content">{{
            order.signDate
              ? order.signDate.slice(0, order.signDate.indexOf(" "))
              : "-"
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">备注</view>
          <view class="flex-twice text-content">{{
            order.remark || "-"
          }}</view>
        </view>
        </template>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">认购单</view>
          <view class="flex-twice">
            <app-media-border
              :media="photos"
              @evidence="subscription(id,'1')"
            />
            </view>
        </view>
      </view>
      <view class="bg-white padding margin-top">
        <view class="text-lg">
          <text class="text-black text-bold">到访信息</text>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">驻场</view>
          <view class="flex-twice text-content">
            {{ report.acceptUser.name }}
          </view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">置业顾问</view>
          <view class="flex-twice text-content">{{
            report.consultant.name
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">到访时间</view>
          <view class="flex-twice text-content">{{
            report.acceptUser.createTime
          }}</view>
        </view>
        <view class="flex padding-top p-xs mb-sm">
          <view class="flex-sub text-gray">证据链</view>
          <view class="flex-twice text-content">
            <app-media-grid :media="evidence" v-if="evidence && evidence.length > 0" />
            <view v-else class="flex-twice text-content"
              >未上传</view
            ></view
          >
        </view>
      </view>
  </view>
</template>

<script>
import { DEFAULT_COVER } from "@/common/const";
import Service from "@/apis/service.js";
import OrderService from "@/apis/order";
import HouseService from "@/apis/house";
import PhoneImage from "../component/phoneImage";
export default {
  components:{
    PhoneImage
  },
  data() {
    return {
      id: "",
      info: {}, // 楼盘信息
      photos: [], // 认购单附件
      contractPhotos: [], // 签约合同信息
      evidence: [],
      order: {}, // 订单信息
      report: {},
      houseLoading: false,
      orderLoading: false,
      contractLoading: false,
      DEFAULT_COVER,
    };
  },
  computed: {
    title() {
      switch (this.order.status) {
        case 0:
          return "已认购";
        case 1:
          return "已签约";
        case 2:
          return "已回款";
        case 9:
          return "已到访";
        case -1:
          return "已退房";
      }
    },

    house() {
      return uni.getStorageSync("house" + Service.KEY_SUFFIX);
    },
  },
  onLoad(options) {
    this.id = options.id;
  },
  onReady() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.load();
    },
    subscription(id,subStatus) {
      this.navTo(
            `../work/sub-evidence?orderId=${this.order.id}&status=${subStatus}`
        );
    },
    toCheckOut(id) {
      this.navTo(
        `./checkOut?orderId=${this.order.id}`
      )
    },
    load() {
      this.houseLoading = true;
      this.orderLoading = true;
      this.contractLoading = true;
      let { id } = this;
      this.loadOrderInfo(id);
      this.loadPhoto(id);
      this.loadContractPhoto(id);
    },
    loadOrderInfo(id) {
      OrderService.byId(id, (res) => {
        this.orderLoading = false;
        if (res.statusCode === 200) {
          let { data } = res;
          let order = {
            ...data,
            report: data._embedded.report,
            contractResident: data._embedded.contractResident,
            resident: data._embedded.resident,
          };
          this.order = order;
          this.report = data._embedded.report
          this.evidence = data._embedded.report.evidence;
          console.log(data, "order");
          // 获取楼盘信息
          let houseId = data.houseId;

          this.loadHouseInfo(houseId);
        } else {
          this.toast(res.message);
        }
      });
    },
    loadHouseInfo(houseId) {
      HouseService.byId(houseId, (res1) => {
        this.houseLoading = false;
        if (res1.statusCode === 200) {
          let data1 = res1.data;
          console.log(data1, "house data");
          let { info } = this;
          info = {
            ...data1,
          };

          let { signDate } = info;

          info.cover = HouseService.URI_OSS + info.cover;
          this.info = info;
          console.log(this.info,'hhhhhhhhhhhh')
        } else {
          this.toast(res1.message);
        }
      });
    },
        toTask() {
          console.log(this.info, 'info')
      this.navTo(`/pages/task/detail?houseId=${this.info.id}&taskId=${this.info.id}`)
    },
    loadContractPhoto(id) {
      let contractParams = {
        id,
        name: "contractPhotos",
        method: "get",
      };
      OrderService.includeId(contractParams, (res2) => {
        this.contractLoading = false;
        if (res2.statusCode === 200) {
          let data2 = res2.data;
          let medias = data2._embedded.medias;
          if(medias) {
          medias.forEach(item => {
               let date = new Date(item.updateTime)
                item.sortTime = date.getTime()
            })
          }
          function compare(prop) {
              return function(a,b) {
                let value1 = a[prop];
                let value2 = b[prop];
                return value2 - value1
              }
          }
          medias.sort(compare('sortTime'))
          this.contractPhotos = medias || [];
        } else {
          this.toast(res2.message);
        }
      });
    },
    loadPhoto(id) {
      let params = {
        id,
        name: "photos",
        method: "get",
      };
      OrderService.includeId(params, (res2) => {
        this.contractLoading = false;
        if (res2.statusCode === 200) {
          let data2 = res2.data;
          let medias = data2._embedded.medias;
           if(medias) {
              medias.forEach(item => {
               let date = new Date(item.updateTime)
                item.sortTime = date.getTime()
            })
          }
             function compare(prop) {
              return function(a,b) {
                let value1 = a[prop];
                let value2 = b[prop];
                return value2 - value1
              }
          }
          medias.sort(compare('sortTime'))
          this.photos = medias || [];
          console.log(res2, "res2 photos");
          console.log(this.photos, "this.photos");
        } else {
          this.toast(res2.message);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.work-header {
  .cu-item {
    padding-bottom: 0 !important;

    .content {
      padding: 0 !important;
    }
  }
}
// 头部
.house-header{
  flex: 1;
	display: flex;
	flex-direction: column;
}

</style>
