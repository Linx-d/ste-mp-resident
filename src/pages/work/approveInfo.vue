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
        <view class="content" v-else @click="toTask">
          <image
            :src="info.cover ? info.cover : DEFAULT_COVER"
            mode="aspectFill"
          ></image>
          <view class="house-header">
              <view class="grid col-1">
                <view class="text-black text-lg text-bold margin-ss" style="margin-top:0;">
                  {{ info.house || "-" }}
                </view>
                <view class="flex text-lightGrey text-sm margin-ss">
                  <view>
                    {{ info.address || "-" }}
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
                      {{
                        info.housePropertyType === "别墅"
                          ? info.housePropertyType
                          : info.houseType === 0
                          ? "住宅"
                          : "商业"
                      }}
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
    <view class="bg-white margin-top" v-if="info.naturalVisit !== 0">
      <view class="cu-list menu margin-top padding">
        <view class="text-lg">
          <text class="text-black text-bold">经纪人信息</text>
        </view>
        <view class="cu-item" style="padding:16px 0 0">
          <view class="cu-avatar lg margin-right bg-white">
            <image
              :src="info.avatar"
              mode=""
              style="height: 90rpx; width: 90rpx;border-radius:50%"
            />
          </view>
          <view class="content">
            <text class="text-black">{{ info.broker.name }}</text>
          </view>
          <view class="action"  @click="callPhone(info.broker.phone)">
            <view class="cu-avatar-group">
            <image src="@/static/common/phone.png" style="width:36rpx;height:36rpx;" mode="" />
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="info.status === 9" class="bg-white padding margin-top">
      <view class="text-lg">
        <text class="text-black text-bold">确认信息</text>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">确认人</view>
        <view class="flex-twice text-content">{{
          info.acceptUser.name
        }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">确认时间</view>
        <view class="flex-twice text-content">{{ info.updateTime }}</view>
      </view>
    </view>

    <view
      class="bg-white padding margin-top"
      v-if="info.status === 9 || info.status === -2"
    >
      <view class="text-lg">
        <text class="text-black text-bold">到访信息</text>
        <!-- <view v-if="info.status == 9" class="cu-capsule radius margin-left">
          <view class="cu-tag bg-blue">保护期</view>
          <view class="cu-tag line-blue"
            >{{
              info.leftProtectDays ? info.leftProtectDays : "-"
            }}天</view
          >
        </view> -->
      </view>

      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">客户姓名</view>
        <view class="flex-twice text-content">{{
          info.client.name
        }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">客户性別</view>
        <view class="flex-twice text-content">{{
          info.client.sex === 0 ? '男' : '女'
        }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm" v-if="!info.client.arrPhone">
        <view class="flex-sub text-gray">客户号码</view>
        <view class="flex-twice text-content">{{
          info.client.phone
        }}</view>
      </view>
      <view  v-else>
        <view class="flex padding-top p-xs mb-sm" v-for="(item,index) in info.client.arrPhone" :key="index">
          <view class="flex-sub text-gray">客户号码</view>
          <view  class="flex-twice text-content">
              {{ item }}
          </view>
        </view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">置业顾问</view>
        <view class="flex-twice flex justify-between text-content">
          <view>{{ selectItem ? selectItem.name : info.consultant.name }}</view>
        <view class="text-blue" @click="toConsultant">修改</view>
        </view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">需求面积</view>
        <view class="flex-twice text-content">{{
          `${info.client.areaStart || "-"} - ${info.client.areaEnd ||
            "-"} m²` || "-"
        }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">需求户型</view>
        <view class="flex-twice text-content">{{ info.client.room | textFilter }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">需求业态</view>
        <view class="flex-twice text-content">{{
          info.client.propertyType || "-"
        }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">到访时间</view>
        <view class="flex-twice text-content">{{ info.acceptTime }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">备注信息</view>
        <view class="flex-twice text-content">{{
          info.remark || "-"
        }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">证据链</view>
        <view class="flex-twice">
          <app-media-border
            :media="info.evidence"
            @evidence="evidence(info)"
          />         
        </view>
      </view>
        <!-- <view class="flex  p-xs mb-sm">
        <view class="flex-sub  padding-sm radius text-gray">    </view>
          <view
              class="cu-btn bg-blue round shadow"
              @click.stop="evidence(info)"
          >上传证据链</view>
      </view> -->
    </view>
    <view v-if="info.status == -1" class="bg-white padding margin-top">
      <view class="text-lg">
        <text class="text-black text-bold">报备失败</text>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">审批人</view>
        <view class="flex-twice text-content">{{
          info.auditUser.name
        }}</view>
      </view>
      <view class="flex padding p-xs mb-sm">
        <view class="flex-sub text-gray">否决时间</view>
        <view class="flex-twice text-content">{{ info.auditTime }}</view>
      </view>
      <view class="flex padding p-xs mb-sm">
        <view class="flex-sub text-gray">审批备注</view>
        <view class="flex-twice text-content">{{
          info.auditRemark
        }}</view>
      </view>
    </view>

    <view v-if="info.status == 1" class="bg-white padding margin-top">
      <view class="text-lg">
        <text class="text-black text-bold">确认信息</text>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">确认人</view>
        <view class="flex-twice text-content">{{
          info.auditUser.name || "-"
        }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">确认时间</view>
        <view class="flex-twice text-content">{{
          info.auditTime || "-"
        }}</view>
      </view>
    </view>

    <view class="bg-white padding margin-top" v-if="info.naturalVisit !== 0">
      <view class="text-lg flex justify-between">
        <text>
          <text class="text-black text-bold">报备信息</text>
        </text>
        <text class="cuIcon-copy text-blue text-lg" @click="copyInfo(info,report)"></text>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">客户姓名</view>
        <view class="flex-twice flex text-content">
          <text>{{ info.client.name }}</text>
          <image v-if="info.client.sex==0" src="@/static/common/man.png"
            style="width: 36rpx;height: 36rpx;margin-left: 10rpx;" mode=""></image>
          <image v-else src="@/static/common/woman.png" style="width: 36rpx;height: 36rpx;margin-left: 10rpx;"
         mode="">
         </image>
        </view>
      </view>
      <view class="flex padding-top p-xs mb-sm" v-if="!info.client.arrPhone">
        <view class="flex-sub text-gray">客户手机号</view>
        <view class="flex-twice text-content">{{
          info.client.phone
        }}</view>
      </view>
      <view v-else>
      <view class="flex padding-top p-xs mb-sm" v-for="(item,index) in info.client.arrPhone" :key="index">
        <view class="flex-sub text-gray">客户手机号</view>
        <view  class="flex-twice text-content">
          {{ item }}
        </view>
      </view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">需求面积</view>
        <view class="flex-twice text-content">{{
          `${info.client.areaStart || "-"} - ${info.client.areaEnd ||
            "-"} m²` || "-"
        }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">需求业态</view>
        <view class="flex-twice text-content">{{
          info.client.propertyType || "-"
        }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">意向强度</view>
        <view class="flex-twice text-content">
          <uni-rate :readonly="true" :size="15" :value="info.client.intention" />
        </view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">预计到访时间</view>
        <view class="flex-twice text-content">{{
          info.appointment
        }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">报备申请时间</view>
        <view class="flex-twice text-content">{{
          report.createTime
        }}</view>
      </view>
      <view class="flex padding-top p-xs mb-sm">
        <view class="flex-sub text-gray">备注信息</view>
        <view class="flex-twice text-content">{{
          info.remark || "-"
        }}</view>
      </view>
    </view>
<view class="bg-white padding margin-top" v-if="info.status === 0">
      <!-- <view class="title">审批备注</view> -->
      <view class="text-lg">
          <text class="text-black text-bold">审批备注</text>
      </view>
      <view class="flex">
          <view class="cu-tag bg-blue text-sm margin-top margin-right-sm radius" @tap="showModal" data-target="bottomModal">
            常用语
          </view>
          <textarea
          class="from-textarea"
            maxlength="-1"
            @input="auditText"
            placeholder="请输入审批备注"
            v-model="selectOftenItem"
          ></textarea>
      </view>
    </view> 
    <!-- 模态框 -->
    <view @touchmove.stop.prevent = "stopPenetrate">
      	<view class="cu-modal bottom-modal z-index-modal" :class="modalName=='bottomModal'?'show':''" @click="modalName = null">
			<view class="cu-dialog">
				<view class="padding-xl bg-white">
          <view class="text-left padding" v-for="item in often" :key="item" @click="selectOften(item)">
             {{ item }}
          </view>
				</view>
			</view>
		</view>
    </view>
    
    <view v-if="info.status == 0" class="bg-white text-center">
      <view class="flex p-xs mb-sm">
        <view class="flex-twice padding-sm margin-xs">
          <view class="padding flex flex-direction">
            <button class="cu-btn bg-red lg" @click="audit(false)">
              否决
            </button>
          </view>
        </view>
        <view class="flex-twice padding-sm margin-xs">
          <view class="padding flex flex-direction">
            <button class="cu-btn bg-blue lg" @click="audit(true)">通过</button>
          </view>
        </view>
      </view>
    </view>
    <!-- <view class="padding flex flex-direction bg-white" v-if="info.status === 9">
			<button class="cu-btn bg-blue lg"
       @click="putIn(info)"
       
       >认购
       </button>
		</view>                -->
  </view>
</template>

<script>
import { DEFAULT_COVER } from "@/common/const";
import Service from "@/apis/service.js";
import ReportService from "@/apis/report.js";
import appLoadingContent from "../../components/app-loading-content.vue";
import {uniRate} from '@dcloudio/uni-ui';
// import appMediaBorder from "@/components/app-media-border.vue"
export default {
  components: { appLoadingContent, uniRate },
  data() {
    return {
      id: "",
      houseLoading: false,
      reportLoading: false,
      info: {},
      report: {},
      auditRemark: "",
      DEFAULT_COVER,
      copyData: {},
      selectItem: {},
      modalName: null,
      often: [
        '已被别人报备过',
        '已到访过此项目',
        '客户为老业主，不能重复报备'
      ],
      selectOftenItem:''
    };
  },
  onLoad(option) {
    this.id = option.id;
  },
  mounted() {
    this.init();
  },
  onShow() {
    this.selectItem = uni.getStorageSync('selectItem');
    uni.removeStorageSync('selectItem')
    console.log(this.selectItem)
  },
  computed: {
    title() {
      let { info } = this;
      switch (info.status) {
        case 0:
          return "待审批";
        case 1:
          return "已报备";
        case -1:
          return "已否决";
        case 9:
          return "已到访";
        case -2:
          return "已失效";
      }
    },
    auditUserId() {
      return this.$store.state.user.id;
    },
  },
  methods: {
    init() {
      this.houseLoading = true;
      let { id, info } = this;
      ReportService.byIdAll(id, (res) => {
        if (res.statusCode === 200) {
          let { data } = res;
          for (let key in data) {
            if (data[key] == null) {
              if (key == "appointment") {
                continue;
              }
              data[key] = "";
            }
          }
          info = { ...data };
          this.report = { ...data };
          ReportService.byId(id, (res) => {

            this.houseLoading = false;
            if (res.statusCode === 200) {
              let { data } = res;
              let { task, broker } = data._embedded;
              let { house } = task;
              info = {
                ...info,
                house: house.name,
                naturalVisit: data.naturalVisit,
                propertyType: house.propertyType,
                acreage: house.acreage,
                salePrice: house.salePrice,
                cover: ReportService.URI_OSS + house.cover,
                saleStatus: house.saleStatus,
                address: `${house.province}·${house.district}`,
                leftProtectDays: data.leftProtectDays
              };
              if (broker !== undefined) info.avatar = broker.wx.avatarUrl
              info.fixedHour = this.getFixedHour(info);
              this.info = info;
              this.info.evidence.forEach(item => {
                let date = new Date(item.updateTime)
                item.sortTime = date.getTime()
                item.remark ? item.label = item.remark : item.label = '经纪人'
              });
                 function compare(prop) {
              return function(a,b) {
                let value1 = a[prop];
                let value2 = b[prop];
                return value2 - value1
              }
          }
              this.info.evidence.sort(compare('sortTime'))
              if(this.info.client.phone.indexOf(',') != -1){
                  this.info.client.arrPhone = this.info.client.phone.split(',')
              }
            } else {
              this.toast(res.message);
            }
          });
        } else if (res.statusCode === 400) {
          this.toast("请先授权");
        } else {
          this.toast(res.message);
        }
      });
    },
    toTask() {
      this.navTo(`../task/detail?houseId=${this.info.houseId}&taskId=${this.info.taskId}`)
    },
    audit(val) {
      let { id } = this;
      let msg = val ? "报备" : "否决";
      let auditStatus = val ? 1 : -1;
      const params = {
        auditRemark: this.auditRemark,
        auditUserId: this.auditUserId,
        id: id,
        pass: val,
      };
      this.confirm(`您确定要${msg}审批吗`, (ok) => {
        if (ok) {
          this.showLoading(() => {
            ReportService.saveById(params, (res) => {
              if (res.statusCode === 202) {
                uni.hideLoading();
                this.info.status = auditStatus;
                this.toast(`${msg}成功`);
                setTimeout(() => {
                  uni.navigateBack({
                    delta: 1,
                  });
                }, 800);
              } else {
                this.toast(`${msg}成功`);
              }
            });
          });
        }
      });
    },
    auditText(e) {
      // this.auditRemark = e.detail.value;
      this.auditRemark = this.selectOftenItem
    },
      putIn(item) {
            this.navTo(`./subscription?id=${item.id}`)
        
      },
    // 过期时间
    getFixedHour(item) {
      if (item && item.auditTime) {
        let cTime = new Date(item.auditTime.replace(/-/g, "/"));
        let vType = item.task.reportValidType; // 0=当天 1=24小时
        let endTime =
          vType === 0
            ? new Date(this.formatDate(cTime).replace(/-/g, "/") + " 23:59:59")
            : new Date(cTime.getTime() + 24 * 60 * 60 * 1000);

        let h = 60 * 60 * 1000;

        let left = endTime - new Date();

        return left <= 0 ? 0 : (left / h).toFixed(0);
      }
      return 0;
    },
    evidence(item) {
      this.navTo(
        `./sub-evidence?reportId=${item.id}&status=0`    
      )
        },
    copyInfo(item,report) {
      let arr = [];
      arr.push({
        title: "项目名称",
        value: item.house || "-",
      });
      arr.push({
        title: "报备公司",
        value: item.agentName || "-",
      });
      arr.push({
        title: "报备客户",
        value: item.client.name || "-",
      });
      arr.push({
        title: "客户性别",
        value: item.client.sex === 0 ? '男' : '女'
      });
      arr.push({
        title: "客户电话",
        value: item.client.phone || "-",
      });
      arr.push({
        title: "报备经纪人",
        value: item.broker.name || "-",
      });
      arr.push({
        title: "经纪人电话",
        value: item.broker.phone || "-",
      });
      arr.push({
        title:"需求面积",
        value: `${item.client.areaStart || "-"} - ${item.client.areaEnd || "-"} m²` || "-",
      });
      arr.push({
        title:"需求业态",
        value: item.client.propertyType || "-",
      });
      arr.push({
        title:"预计到访时间",
        value: item.appointment,
      });
       arr.push({
        title: "报备时间",
        value: report.createTime,
      });
      arr.push({
        title:"备注信息",
        value: item.remark || "-",
      });
      let infos = arr
        .map((i) => {
          return `${i.title}：${i.value}`;
        })
        .join("\n");
      this.copy(infos);
    },
    toConsultant() {
        this.navTo(`../index/selectConsultant?houseId=${this.info.houseId}&status=1&id=${this.info.id}`)
    },
    // 弹框禁止滑动
      stopPenetrate(){
          return;
      },
    showModal(e) {
				this.modalName = e.currentTarget.dataset.target
		},
		// hideModal(e) {
		// 		this.modalName = null
    // },
    selectOften(item) {
        this.selectOftenItem = item
        // this.auditRemark
        this.modalName = null
    }
  },
};
</script>

<style lang="less" scope>
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
