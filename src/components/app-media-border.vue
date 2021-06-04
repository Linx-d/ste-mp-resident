<template>
    <view>
        <view :class="gridClass ">
            <view
                class="bg-img"
                v-for="(item,index) in media"
                :key="item.id"
                @click="toPreview"
                :data-index="index"
            >
                <app-media-item :item="item" class="wh100 posa" />
                <view
                    class="cu-bar bg-shadeBottom posa justify-center"
                    v-if="item.label"
                    style="bottom:0;left:0;right:0;"
                >{{item.label}}</view>
            </view>
        <view class="subImgs" v-if="media.length < 9" @click="evidence">
            +
        </view> 
        </view>
        
    </view>
</template>

<script>
import Service from "@/apis/service";
export default {
    props: {
        media: { type: Array, default: () => [] },
        col: { type: Number, default: () => 3 },
    },
    data() {
        return {
           
        };
    },
    computed: {
        gridClass() {
            return `grid col-${this.col} grid-square`;
        },
        uri() {
            return Service.URI_OSS;
        },
    },
    methods: {
        toPreview(e) {
            let index = e.currentTarget.dataset.index;
            let item = this.media[index];
            if (item.type.indexOf("image") >= 0) {
                let urls = this.media.filter(i=>i.type.indexOf('image')>=0).map((i) => this.uri + i.path);
                this.previewImage(urls, index);
            } else if (item.type.indexOf("video") >= 0) {
                let src = this.uri + item.path;
                this.navTo('/pages/media/video?src='+src);
            }
        },
        evidence() {
            this.$emit('evidence')
        },
    },
};
</script>
<style lang="less">
    // 上传图片
.subImgs{
  width:140upx;
  height:140upx;
  border:1px solid #cccccc;
  border-radius: 8px;
  text-align: center;
  line-height: 140upx;
  font-size: 40upx;
}
</style>