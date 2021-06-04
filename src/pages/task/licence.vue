<template>
    <view>
         <cu-custom bgColor="text-bold bg-white text-black" :is-back="true">
            <block slot="content">预售许可证</block>
        </cu-custom>
        <app-loading v-if="loading" />
        <app-empty v-if="!loading && rows.length === 0"/>

        <view class="cu-card case" v-else-if="rows.length > 0">
            <view class="cu-item shadow" v-for="item in rows" :key="item.id">
                <view class="image" v-if="item.img">
                    <image :src="uri + item.img + _thumb_max" mode="widthFix" />
                </view>
                <view class="padding">
                    <view class="flex-row">
                        <view class="flex-1">预售证号：</view>
                        <view class="flex-3">{{item.code}}</view>
                    </view>
                    <view class="flex-row margin-top-sm">
                        <view class="flex-1">发证时间：</view>
                        <view class="flex-3">{{item.date ? item.date.split(' ')[0] : '-'}}</view>
                    </view>
                    <view class="flex-row margin-top-sm">
                        <view class="flex-1">绑定楼栋：</view>
                        <view class="flex-3">{{item.building || '-'}}</view>
                    </view>   
                </view>
            </view>
        </view>

    </view>
</template>

<script>
import Service from '@/apis/service';
import HouseService from '@/apis/house';

export default {

    data(){
        return {
            rows:[],
            loading:false,
            houseId:'',
        };
    },
    computed:{
        uri(){
            return Service.URI_OSS;
        },
    },
    onLoad(options){
        this.houseId = options.houseId;
    },
    mounted(){
        this.load();
    },
    methods: {
        load() {
            this.loading = true;
            HouseService.getLicenseByHouseId(this.houseId, (res) => {
                this.loading = false;
                if (res.statusCode === 200) {
                    this.rows = res.data._embedded.licences || [];
                } else {
                    this.toast("加载授权许可证信息失败");
                }
            });
        },
    },
};
</script>