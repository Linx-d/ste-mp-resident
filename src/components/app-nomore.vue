<template>
    <view class="padding text-center">
        <text class="text-gray text-sm">- 已加载全部 -</text>
        <!-- <view class="margin-top">
            <text class="text-gray text-sm">{{info}}</text>
        </view> -->
    </view>
</template>

<script>
    export default {
        data(){
            return {
                version: 'v1.0.1',
                date: '20201201',
                time: '1823'
            }
        },
        computed: {
            info (){
                let {version, date, time} = this
                return `${version}-${date}-${time}`
            }
        }
    }
</script>