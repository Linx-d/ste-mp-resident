<template>
    <view class="bg-white margin-top padding">
        <view class="text-bold text-lg">{{title}}</view>

        <view class="margin-top">
            <view class="flex-row margin-bottom-sm" v-for="(item,index) in infos" :key="index">
                <view class="flex-1 text-gray">{{item.title||'-'}}</view>
                <view class="flex-2">{{item.value||'-'}}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        title: { type: String, default: () => "信息标题" },
        infos: {
            type: Array,
            default: () => [],
        },
    },
};
</script>