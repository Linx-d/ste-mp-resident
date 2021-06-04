<template>
    <view class="cu-card case">
        <view class="cu-item shadow posr">
            <view
                class="thumb-label"
                style="top:10px;right:10px"
                v-if="media.length > 0"
            >{{current+1}} / {{media.length}}</view>

            <swiper
                class="screen-swiper"              
                autoplay="true"
                interval="5000"
                duration="500"
                @change="onSwipeChange"
                v-if="media.length > 0"
            >
                <swiper-item v-for="(m, index) in media" :key="index" @click="toPreview(index)">
                    <app-media-item :item="m" />
                </swiper-item>
            </swiper>

            <view class="padding solids-bottom">
                <view class="text-bold text-lg">{{item.name}}</view>
                <view v-if="tags.length >0">
                    <text class="cu-tag" v-for="(t,index) in tags" :key="index">{{t}}</text>
                </view>
            </view>
            <div class="padding flex-row solids-bottom">
                <view class="flex-1">
                    <text class="text-bold text-xl text-red">{{ item.price || '-'}}万/套</text>
                </view>
                <view class="flex-1 text-center">
                    <text
                        class="text-bold text-xl text-red"
                    >{{item.room || '0'}}室{{item.hall || '0'}}厅{{item.toilet || '0'}}卫</text>
                </view>
                <view class="flex-1 text-right">
                    <text class="text-bold text-xl text-red">{{item.areaAll || '-'}} ㎡</text>
                </view>
            </div>
            <view class="padding">
                <view class="flex-row margin-bottom">
                    <view class="flex-1">物业类型：{{item.type || '-'}}</view>
                    <view class="flex-1 text-right">朝向：{{item.direction || '-'}}</view>
                </view>

                <app-rich-text :text="item.description" v-if="item.description" class="text-gray" />
            </view>
        </view>
    </view>
</template>

<script>
import Service from "@/apis/service";
export default {
    props: {
        item: { type: Object, default: () => {} },
    },
    data() {
        return {
            current: 0,
        };
    },
    computed: {
        tags() {
            let rs = [];
            if (this.item.label) {
                rs = this.item.label.split(",");
            }
            return rs;
        },
        media() {
            let rs = [];
            let { diagrams, models } = this.item;

            if (diagrams) {
                rs = rs.concat(diagrams);
            }

            if (models) {
                rs = rs.concat(models);
            }

            return rs;
        },
        uri() {
            return Service.URI_OSS;
        },
    },
    methods: {
        onSwipeChange(e) {
            this.current = e.detail.current;
        },
        toPreview(index) {
            this.previewImage(
                this.media
                    .filter((i) => i.type.indexOf("image") >= 0)
                    .map((i) => this.uri + i.path),
                index
            );
        },
    },
};
</script>