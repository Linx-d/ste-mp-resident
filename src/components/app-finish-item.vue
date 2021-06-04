<template>
  <view>
    <view
      class="cu-card case"
      @click.stop="getOrderInfo(item)"
      @longpress="parseInfo(item)"
    >
      <view class="bg-gray padding-sm shadow">
        <view class="grid col-1">
          <view class="bg-white padding-xs padding-left">
            <view class="flex  p-xs mb-sm">
              <view
                class="flex-treble bg-white padding-tb-sm text-sm text-bold"
                style="color:#000000"
              >
                {{ `单号: ${item.id}` }}
                <!-- - -->
              </view>
              <view class="flex-twice bg-white text-right">
                <view class="text-gray text-sm padding-tb-sm padding-right-xs">
                  <view
                    class="padding-sm cu-tag bg-blue light sm"
                    v-if="item.status === 0"
                  >
                    {{ fixedDays == 0 ? `认购成功` : `已认购${fixedDays}天` }}
                  </view>
                  <view
                    v-else
                    class="margin-left padding-sm cu-tag bg-red light sm"
                  >
                    签约成功
                  </view>
                  <view
                    class="margin-left padding-sm cu-tag bg-green light sm"
                    v-if="report.naturalVisit === 0"
                  >
                    自然到访
                  </view>
                </view>
              </view>
            </view>
            <view style="border-bottom:1px solid #f2f2f2"></view>
          </view>
          <view class="bg-white radius">
            <view class="flex  p-xs mb-sm">
              <view class="flex-treble margin-xs">
                <view class="grid col-1">
                  <view
                    class="padding-top-xs padding-bottom-xs flex margin-left-sm"
                  >
                    <view style="color:#333333" class="text-lg">
                      {{ item.houseName }}
                    </view>
                    <view
                      class="margin-left padding-sm cu-tag bg-green sm margin-right-sm"
                    >
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
                    <view class="margin-right-sm" style="color:#333333"></view>
                    {{ item.room || "-" }}
                  </view>

                  <view
                    class="padding-xs margin-left-xs text-gray flex align-center text-black"
                  >
                    <text>{{ item.client.name }} </text>
                    <image
                      v-if="item.client.sex == 0"
                      src="@/static/common/man.png"
                      style="width: 36rpx;height: 36rpx;margin-left: 10rpx;"
                      mode=""
                    ></image>
                    <image
                      v-else
                      src="@/static/common/woman.png"
                      style="width: 36rpx;height: 36rpx;margin-left: 10rpx;"
                      mode=""
                    ></image>
                    <view v-if="!item.client.arrPhone" class="margin-left-xs">
                      {{ item.client.phone }}
                    </view>
                    <view v-else class="margin-left-xs">
                      <view>
                        {{ item.client.arrPhone[0] }}
                      </view>
                    </view>
                  </view>
                  <view
                    class="padding-tb-xs margin-left-sm"
                    v-if="item.status === 1"
                  >
                    <view class=" margin-right-sm"></view>
                    签约时间：{{ item.contractTime || "-" }}
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view v-if="item.status === 0" class="bg-white text-df">
            <view
              class="margin-lr-sm margin-bottom-xs"
              style="border-top:1px solid #f2f2f2"
            ></view>
            <view
              class="flex align-center justify-between p-xs mb-sm padding-right-xs"
            >
              <view class="bg-white">
                <view class="text-gray  padding-xs margin-left-sm">
                  <text>预计签约：</text
                  >{{
                    item.signDate
                      ? item.signDate.slice(0, item.signDate.indexOf(" "))
                      : "-"
                  }}
                </view>
              </view>
              <button
                class="cu-btn bg-blue margin-xs sm"
                style="width: 144upx; height:64upx;font-size:28rpx"
                @click.stop="putIn(item)"
              >
                签约
              </button>
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
    report() {
      return this.item.report
    }
  },
  mounted() {
    console.log(this.item, "item");
  },
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
          this.modalName = null;
          this.taost("标记成功");
          this.$emit("reload");
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
      this.orderRemark = null;
      this.modalName = null;
    },
    parseInfo(item) {
      let arr = [];
      arr.push({
        title: "客户",
        value: item.client.name || "-",
      });
      arr.push({
        title: "手机",
        value: item.client.phone || "-",
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
