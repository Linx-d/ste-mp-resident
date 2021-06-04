<template>
    <view class="wrap">
        <u-empty :mode="mode"></u-empty>
    </view>
    
</template>

<script>
    export default {
        props: {
            mode: {
                type: String,
                default: 'list'
            }
        },
        data() {
            return {}
        }
    }
</script>

<style lang="less" scoped>
    .wrap {
        min-height: 800rpx !important;
        u-empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
</style>
