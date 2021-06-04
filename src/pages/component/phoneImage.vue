<template>
<image src="@/static/common/phone.png" mode="" @click="subPhone" v-if="infoPhone"/>
</template>

<script>
    export default {
        props: {
            infoPhone: String
        },
        methods: {
            subPhone() {
                this.callPhone(this.infoPhone)
            }
        },
    }
</script>

<style lang="less" scoped>
image{
    width:32upx;
    height:32upx;
    display:inline-block;
    vertical-align:middle;
}
</style>