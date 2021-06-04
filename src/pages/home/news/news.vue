<template>
    <view class="container">
        <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
            <block slot="content">楼盘动态</block>
        </cu-custom>
    <!-- <view class="cu-bar tabbar bg-white add-conselor">
      <view class="action text-gray add-action">
        <button
          class="cu-btn cuIcon-add bg-green shadow"
          @click="toChild"
          data-url="./editNews"
        ></button>
      </view>
    </view> -->
        <app-loading v-if="loading" />
        <app-empty v-else-if="news.length === 0" />
        <view class="cu-card dynamic margin-top">
            <view class="cu-item shadow padding-top" v-for="(item) in news" :key="item">
                <view class="text-content" style="max-height:none;">
                    <view v-if="item.title" class="text-lg text-bold margin-bottom">{{item.title}}</view>

                    <app-rich-text class="margin-bottom-sm" :text="item.content"></app-rich-text>
                </view>
                <view class="padding-lr">
                    <app-media-grid :media="item.media" v-if="item.media && item.media.length > 0" />
                </view>
                <view class="text-gray text-sm flex-row padding slids-top">
                    <text class="cu-tag bg-blue light" style="line-height:36upx">{{item.category}}</text>
                    <view class="flex-1 text-right text-blue text-content">{{item.createTime}}</view>
                </view>
            </view>
        </view>

			
    </view>
    
</template>

<script>
import HouseService from "@/apis/house";

const DEFAULT_COVER = "/static/img/placeholder.svg";

export default {
    data() {
        return {
            news: "",
            page: 0,
            size: 10,
            total: 0,
            houseId: "",
            loading: false,

            URI_OSS: HouseService.URI_OSS,
            DEFAULT_COVER,
            houseImg: "",
        };
    },
    onLoad(options) {
        this.houseId = options.houseId;
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.reload();
        },
        reload() {
            this.load(0);
        },
        load(page) {
            let params = {
                page,
                size: this.size,
                sort: "updateTime,desc",
                houseId: this.houseId,
            };
            this.loading = true;
            HouseService.getNewsByHouseId(params, (res) => {
                if (res.statusCode === 200) {
                  console.log(res)
                    let arr = res.data._embedded.news || [];
                    this.news = page === 0 ? arr : [...this.news, ...arr];
                    this.page = page;
                }
                this.loading = false;
            });
        },
        toChild(e) {
            let { doing, url } = e.currentTarget.dataset;
            if (doing) {
                this.toast("功能暂未开放，敬请期待");
            } else if (url) {
                this.navTo(url);
        }
    },
    },
};
</script>
<style lang="less" scoped>
// add
.add-conselor {
  position: fixed;
  z-index: 1;
  right: 200upx;
  bottom: 80upx;

  .add-action::before {
    width: 0 !important;
  }

  .add-action:after {
    width: 95rpx !important;
    height: 95rpx !important;
    top: -47rpx !important;
    left: -7px !important;
  }
}
</style>