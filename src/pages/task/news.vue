<template>
    <view>
        <cu-custom bg-color="bg-white" :isBack="true">
            <block slot="content" class="text-bold">楼盘动态</block>
        </cu-custom>
        <app-loading v-if="loading" />
        <app-empty v-else-if="news.length === 0" />
		<view class="padding">
			<view class="margin-bottom" v-for="(item) in news" :key="item">
				<view class="flex align-center">
					<view class="my-radio margin-right"></view>
					<view class="text-blue text-bold" >{{item.createTime}}</view>
				</view>
					<view class="padding" style="border-left: 3rpx solid #F2F2F2;margin-left: 12rpx;">
					    <view v-if="item.title" class="text-lg text-bold margin-bottom">{{item.title}}</view>
						
					    <app-rich-text class="margin-bottom-sm" :text="item.content"></app-rich-text>
						<app-media-grid class=""  :media="item.media" v-if="item.media && item.media.length > 0" />
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
                    let arr = res.data._embedded.news || [];
                    this.news = page === 0 ? arr : [...this.news, ...arr];
                    this.page = page;
                }
                this.loading = false;
            });
        },
    },
};
</script>
<style>
	page{
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
	.my-radio{
		width: 24rpx;
		height: 24rpx;
		border: 4rpx solid #0464E0;
		border-radius: 50%;
	}
</style>