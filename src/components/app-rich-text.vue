<template>
    <view class="flex-col">
        <view v-for="(line,index) in rows" :key="index">{{line}}</view>
    </view>
</template>

<script>
    export default {
        props:{
            text:{String ,default:()=>'-'}
        },
        computed:{
            rows(){
                return (this.text||'-').split('\n');
            }
        },
    }
</script>