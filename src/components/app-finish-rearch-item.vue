<template>
  <view>
    <view
      class="cu-card case"
      @click.stop="getOrderInfo(item)"
      @longpress="parseInfo(item)"
    >
      <view class="bg-gray padding-sm shadow">
        <view class="grid col-1 border-e0">
          <view class="bg-white solid-bottom">
            <view class="flex  p-xs mb-sm">
              <view
                class="flex-treble bg-white padding-tb-sm margin-left tex-gray text-sm"
              >
                {{ `单号: ${item.id}` }}
                <!-- - -->
              </view>
              <view class="flex-twice bg-white text-right">
                <view class="text-gray text-sm padding-tb-sm padding-right-xs">
                  <text
                    class="lg text-gray cuIcon-timefill margin-left-xs"
                  ></text
                  >{{ item.createTime }}
                </view>
              </view>
            </view>
          </view>
          <view class="bg-white radius">
            <view class="flex  p-xs mb-sm">
              <view class="flex-treble margin-xs">
                <view class="grid col-1">
                  <view
                    class="padding-top-xs padding-bottom-xs padding-right-xs text-gray flex margin-left-sm"
                    >{{ item.houseName }}
                    <view class="margin-left padding-sm cu-tag bg-black sm">
                      {{
                        item.housePropertyType === "别墅"
                          ? item.housePropertyType
                          : item.houseType === 0
                          ? "住宅"
                          : "商业"
                      }}
                    </view>
                  </view>
                  <view class="padding-tb-xs margin-left-sm text-df">
                    <view class=" margin-right-sm" style="color:#333333"></view>
                    {{ item.room || "-" }}
                  </view>
                  <view class="padding-tb-xs">
                    <view
                      class="cu-avatar round margin-right-sm margin-left-sm"
                      >{{ item.clientName.slice(0, 1) }}</view
                    >
                    {{ item.clientName }}
                  </view>
                  <view class="padding-xs margin-left-xs text-gray" v-if="!item.arrClientPhone">手机号：{{ item.clientPhone }}</view>
                  <view v-else>
                     <view class="padding-xs margin-left-xs text-gray" 
                     v-for="content in item.arrClientPhone" 
                     :key="content"
                     >手机号：{{ content }}</view>
                  </view>
                </view>
              </view>
              <view class="flex-sub flex align-center">
                <view
                  v-if="item.status === 0"
                  class="grid text-center col-1 flex align-center text-orange"
                >
                  {{ fixedDays == 0 ? `认购成功` : `已认购${fixedDays}天` }}
                </view>
                <view
                  v-else
                  class="grid text-center col-1 flex align-center text-green"
                >
                  签约成功
                </view>
              </view>
            </view>
          </view>
          <view v-if="item.status === 0" class="bg-white solid-top">
            <view class="flex  p-xs mb-sm">
              <view class="flex-twice bg-white">
                <view class="text-gray  padding-xs margin-left-xs">
                  <text>预计签约：</text
                  >{{
                    item.signDate
                      ? item.signDate.slice(0, item.signDate.indexOf(" "))
                      : "-"
                  }}
                </view>
              </view>
              <button
                class="cu-btn bg-blue margin-xs sm text-df"
                style="width: 150upx;"
                @click.stop="putIn(item)"
              >
                <!-- {{ item.room }} -->
                签约
              </button>
            </view>
          </view>
          <view
            v-if="item.status === 2 || item.status === -1"
            class="bg-white solid-top"
          >
            <view class="flex  p-xs mb-sm">
              <view class="flex-twice bg-white col-1">
                <view class="text-gray padding-xs">
                  <text>报备时间：</text>{{ item.report.createTime }}
                </view>
                <view class="text-gray padding-xs">
                  <text>到访时间：</text>{{ item.report.acceptTime }}
                </view>
              </view>
              <view
                v-if="item.status === -1"
                class="flex-sub bg-white padding text-right"
                @click="callBroker(item.report.broker.phone)"
              >
                {{ item.brokerName }}
                <text class="lg text-green cuIcon-dianhua margin-left"> </text>
              </view>
            </view>
          </view>
          <!-- <view
            v-if="item.status === 1"
            class="bg-white solid-top"
          >
          <view class="flex  p-xs mb-sm justify-end">
              
            <button
              v-if="item.commissionStatus === 1"
              class="cu-btn bg-blue margin-xs sm"
              style="width: 150upx; font-size: 13px;"
              @click.stop="showModal(item)"
            >
              标记
            </button>
            <view v-if="item.commissionStatus === 2" class="text-green padding-xs padding-right-xl">
              回款中
            </view>
            </view>
          </view> -->
        </view>
      </view>
    </view>

    <!-- <view class="cu-modal" :class="modalName == 'tagApprove' ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">标记为回款中</view>
          <view class="action" @click="hideModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="bg-white padding-sm">
          <text>是否通知经纪人结佣流程已经入开发商回款阶段</text>
        </view>
        <view>
          <view class="cu-form-group">
            <view class="title">备注</view>
            <input placeholder="请输入备注" :focus="true" v-model="orderRemark" name="input" />
          </view>
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn line-green text-green" @click="hideModal">
              取消
            </button>
            <button class="cu-btn bg-green margin-left" @click="tagApprove">
              确定
            </button>
          </view>
        </view>
      </view>
    </view> -->
  </view>
</template>

<script>
import Service from "@/apis/service.js";
import OrderService from "@/apis/order";
export default {
  props: {
    item: { type: Object, default: () => null },
  },
  data() {
    return {
      // order tag back
      modalName: null,
      order: null,
      orderRemark: null,
    };
  },
  computed: {
    fixedDays() {
      let rs = "-";
      if (this.item) {
        let time = new Date(this.item.createTime.replace(/-/g, "/"));

        let left = new Date().getTime() - time.getTime();
        let d = 24 * 60 * 60 * 1000;

        return (left / d).toFixed(0);
      }

      return rs;
    },
  },
  mounted() {},
  methods: {
    getOrderInfo(item) {
      console.log(item.id, "item sign");
      this.navTo(`/pages/finish/info?id=${item.id}`);
    },
    callBroker(val) {
      this.callPhone(val);
    },
    putIn(item) {
      this.navTo(`/pages/finish/sign?id=${item.id}`);
    },
    tagApprove() {
      const { order, orderRemark } = this;
      const params = {
        id: order.id,
        remark: orderRemark,
      };

      OrderService.back(params, (res) => {
        if (res.statusCode === 200) {
          this.modalName = null
          this.taost("标记成功");
          this.$emit('reload')
        } else {
          this.toast(res.message);
        }
      });
    },
    showModal(data) {
      this.modalName = "tagApprove";
      this.order = data;
    },
    hideModal() {
      this.orderRemark = null
      this.modalName = null;
    },
    parseInfo(item) {
      let arr = [];
      arr.push({
        title: "客户",
        value: item.clientName || "-",
      });
      arr.push({
        title: "手机",
        value: item.clientPhone || "-",
      });
      let info = arr
        .map((i) => {
          return `${i.title}：${i.value}`;
        })
        .join("\n");
      this.copy(info);
    },
  },
};
</script>
