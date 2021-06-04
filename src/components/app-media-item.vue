<template>
    <view v-if="item" class="posr wh100">
        <image
            v-if="!isVideo"
            mode="aspectFill"
            :src="uri + item.path + _thumb_max "
        />
        <image
            v-if="isVideo"
            mode="aspectFill"
            :src=" uri + item.path + _snapshoot"
        /> 

        <view class="player-mask" v-if="isVideo" >
            <view class="cu-btn line-white round player-btn">
                <text class="cuIcon-playfill"></text>
            </view>
        </view>

    </view>
</template>

<script>
import Service from '@/apis/service';
export default {
    props: {
        item: { type: Object, default: () => null },
    },
    computed:{
        isVideo(){
            return this.item && this.item.type ? this.item.type.indexOf('video') >= 0 : false;
        },
        uri(){
            return Service.URI_OSS;
        },
    },
};
</script>
<style scoped lang="less">
.player-mask{
    position: absolute;
    background-color: rgba(0,0,0,.2);
    top:0;
    left:0;
    right:0;
    bottom: 0;

    .player-btn{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        display: inline-block;
        width: 60px;
        height: 60px;
        line-height: 80px;
        border: 1px solid rgba(255,255,255,.3);
        border-radius: 60px;

        display: flex;
        align-content: center;

        .cuIcon-playfill{
            font-size: 3em;
        }
    }
}
</style>