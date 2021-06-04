<template>
  <view>
    <view class="cu-card case" @click="getOrderInfo(item)" @longpress="parseInfo(item)">
      <view class="bg-gray padding-sm shadow">
        <view class="grid col-1">
          <view class="bg-white radius">
            <view class="flex  p-xs mb-sm">
              <view class="flex-treble margin-xs">
                <view class="grid col-1">
                  <view class="padding-top-xs padding-bottom-xs flex margin-left-sm">
                    <view style="color:#000000"
                    class="text-bold text-lg">
                      {{ item.task.houseName }}
                    </view>
                    <view class="margin-left padding-sm cu-tag bg-green sm margin-right-sm">
                      {{
                        item.housePropertyType === "别墅"
                          ? item.housePropertyType
                          : item.houseType === 0
                          ? "住宅"
                          : "商业"
                      }}
                    </view>
                    <view v-if="item.status === 1" class="margin-left padding-sm cu-tag bg-blue light sm"
                      :class="item.auditTime && fixedHour === 0 ? 'text-red' : ''"
                      style="font-weight:normal">
                      {{ fixedHour > 0 ? `${fixedHour}小时后过期` : "作废" }}
                    </view>
                   <view v-if="item.status === 9" class="margin-left padding-sm cu-tag bg-green light sm"
                      :class="item.auditTime && fixedHour === 0 ? 'text-red' : ''">
                      <span v-if="item.naturalVisit === 1">保护期{{ item.leftProtectDays || '---' }}天</span>
                      <span v-else>保护期永久</span>
                    </view>
                   <view v-if="item.naturalVisit === 0" class="margin-left padding-sm cu-tag bg-green light sm">
                      <span>自然到访</span>
                    </view>
                  </view>
                  <view class="padding-xs margin-left-xs flex align-center">
                    <text class="text-black">{{ item.client.name }} </text>
                    <image v-if="item.client.sex==0" src="@/static/common/man.png"
                      style="width: 36rpx;height: 36rpx;margin-left: 10rpx;" mode=""></image>
                    <image v-else src="@/static/common/woman.png" style="width: 36rpx;height: 36rpx;margin-left: 10rpx;"
                      mode=""></image>
                      <view v-if="!item.client.arrPhone" class="margin-left-xs">
                        {{ item.client.phone }}
                      </view>
                      <view v-else  class="margin-left-xs">
                          <view>
                              {{ item.client.arrPhone[0] }}
                          </view>
                      </view>                      
                  </view>

                  <!-- <view class="padding-xs margin-left-xs text-gray" v-if="!item.client.arrPhone">
                    手机号：{{ item.client.phone }}</view>
                  <view v-else>
                    <view class="padding-xs margin-left-xs text-gray" v-for="content in item.client.arrPhone"
                      :key="content">手机号：{{ content }}</view>
                  </view> -->
                  <view v-if="
                      item.status === 0 ||
                        item.status === 1
                    " class="padding-xs margin-left-xs text-gray">预计到访时间：{{ item.appointment || "-" }}</view>
                  <view v-if="item.status === 9 || item.status === -1" class="padding-xs margin-left-xs text-gray">
                    到访时间：{{ item.acceptTime || '-' }}</view>
                    <view class="padding-xs text-gray margin-bottom-xs"
                    style="border-bottom:1px solid #F2F2F2;"
                    ></view>
                  <!--审批 报备-->
                  <view v-if="item.status === 0 || item.status === 1">
                    <view class="text-gray margin-lr-xs margin-left-xs flex align-center justify-between">
                      <view @click.stop="callPhone(item.broker.phone)" class="flex align-center"
                      style="flex:1;height:62rpx">
                      <view class="margin-right:20rpx">
                        经纪人：{{ item.broker.name }}
                      </view>
                        
                        <image src="@/static/common/phone.png" style="width: 32rpx;height: 32rpx;"
                          mode=""></image>
                      </view>
                      <view v-if="item.status === 0" class="grid text-center col-1 flex align-center">
                        <view class="flex flex-direction">
                          <button class="cu-btn bg-blue" style="width: 150upx;">
                            审批
                          </button>
                        </view>
                      </view>
                    </view>
                  </view>
                  <!-- 已到访 -->
                  <view v-if="item.status === 9 || item.status === -2 || item.status === -1">
                    <view class="text-gray padding-xs margin-left-xs flex align-center">
                      <view v-if="item.naturalVisit !== 0" class="margin-right-xs">
                        经纪人：{{ item.broker.name }}
                      </view>
                      <view class="margin-left-xs" v-if="item.status !== -1">
                        置业顾问：{{ item.consultant.name || "-" }}
                      </view>
                    </view>
                  </view>
                </view>
                <view class="grid col-2 flex justify-around padding-xs" v-if="item.status === 9">
                  <button class="cu-btn line-blue lg" style="width:46%;height:64rpx;font-size:12px"
                    @click.stop="evidence(item)">
                    上传证据链
                  </button>
                  <button class="cu-btn bg-blue lg" style="width:46%;height:64rpx;font-size:12px" @click.stop="putIn(item)" v-if="
                          item.orderId === undefined || item.orderId === null
                        ">
                    认购
                  </button>
                  <view v-else class="grid text-center col-1 flex align-center text-gray margin-left">
                    已认购
                  </view>
                </view>
              </view>
              <!-- <view class="flex-sub flex align-center">

                <view
                  v-if="item.status === -2"
                  class="flex-sub flex align-center"
                >
                  <view
                    class="grid text-center col-1 flex align-center text-gray"
                  >
                    已失效
                  </view>
                </view>

                <view
                  v-if="item.status === -1"
                  class="flex-sub flex align-center"
                >
                  <view
                    class="grid text-center col-1 flex align-center text-gray"
                  >
                    {{ item.auditRemark }}
                  </view>
                </view>
              </view> -->
            </view>
          </view>
        </view>
        <!--到访-->
        <!-- <view class="bg-white solid-top" v-if="item.status === 9">
          <view class="flex  p-xs mb-sm">
            <view class="flex-twice bg-white">
              <view class="text-gray padding-xs margin-left-xs" style="width: 500upx;">
                报备时间：{{ item.auditTime || "-" }}
              </view>
            </view>
            <view v-if="item.leftProtectDays > 0"
              class="bg-white text-green text-right padding-top-xs padding-right-xs">保护期{{ item.leftProtectDays }}天
            </view>
            <view v-else class="bg-white text-red text-right padding-top-xs">超过保护期
            </view>
          </view>
        </view> -->
        <!--失效-->
        <!-- <view v-if="item.status === -2" class="bg-white solid-top">
          <view class="flex  p-xs mb-sm">
            <view class="flex-twice bg-white">
              <view class="text-gray padding-xs margin-left-xs" style="width: 500upx;">
                报备时间：{{ item.auditTime || "-" }}
              </view>
            </view>
            <view class="flex-sub bg-white  padding-xs margin-left-xs" @click.stop="callPhone(item.broker.phone)">{{ item.broker.name
                }}<text class="lg text-green cuIcon-dianhua margin-left"></text>
            </view>
          </view>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script>
  import Service from "@/apis/service.js";
  export default {
    props: {
      item: {
        type: Object,
        default: () => null
      },
    },
    computed: {
      fixedHour() {
        if (this.item && this.item.auditTime) {
          let cTime = new Date(this.item.auditTime.replace(/-/g, "/"));
          let vType = this.item.task.reportValidType; // 0=当天 1=24小时
          let endTime =
            vType === 0 ?
            new Date(this.formatDate(cTime).replace(/-/g, "/") + " 23:59:59") :
            new Date(cTime.getTime() + 24 * 60 * 60 * 1000);

          let h = 60 * 60 * 1000;

          let left = endTime - new Date();

          return left <= 0 ? 0 : (left / h).toFixed(0);
        }
        return 0;
      }
    },
    mounted() {
      console.log(this.item, 'item')
    },
    methods: {
      getOrderInfo(item) {
        this.navTo(`../work/approveInfo?id=${item.id}`);
      },
      putIn(item) {
        this.navTo(`/pages/`);
        switch (item.status) {
          case 9:
            this.navTo(`/pages/work/subscription?id=${item.id}`);
            break;
        }
      },
      evidence(item) {
        this.navTo(
          `../work/sub-evidence?reportId=${item.id}&status=0`
        );
      },
      parseInfo(item) {
        let arr = [];
        arr.push({
          title: "报备楼盘",
          value: item.task.houseName || "-",
        });
        arr.push({
          title: "客户姓名",
          value: item.client.name || "-",
        });
        arr.push({
          title: "客户手机",
          value: item.client.phone || "-",
        });
        arr.push({
          title: "经纪人姓名",
          value: item.broker.name || "-",
        });
        arr.push({
          title: "经纪人手机号",
          value: item.broker.phone || "-",
        });
        arr.push({
          title: "预计到访时间",
          value: item.appointment || "-",
        });
        arr.push({
          title: "备注信息",
          value: item.remark || "-",
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