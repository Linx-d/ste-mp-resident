<template>
    <view>
        <form>
            <view class="cu-form-group">
                <view class="title">真实姓名</view>
                <input class="text-right" placeholder="请输入" :value="payload.name" @change="e=>iptChange(e,'name')" />
            </view>
            <view class="cu-form-group">
                <view class="title">身份证号</view>
                <input
                    class="text-right"
                    type="number"
                    maxlength="18"
                    placeholder="请输入身份证号"
                    :value="payload.idcard"
                    @change="e=>iptChange(e,'idcard')"
                />
            </view>
            <view class="cu-form-group">
                <view class="title">出生日期</view>
                <picker mode="date" :start="dateStart" :end="dateEnd" @change="birthdayChange">
                    <view class="picker">{{payload.birthday || '请选择'}}</view>
                </picker>
            </view>
            <view class="cu-form-group">
                <view class="title">籍贯</view>
                <input class="text-right" placeholder="请输入" :value="payload.birthplace" @change="e=>iptChange(e,'birthplace')"/>
            </view>
            <view class="cu-form-group">
                <view class="title">民族</view>
                <input class="text-right" placeholder="请输入" :value="payload.nation" @change="e=>iptChange(e,'nation')" />
            </view>
            <view class="cu-form-group">
                <view class="title">学历</view>
                <picker @change="educationChange" :value="educationIndex" :range="education">
                    <view class="picker cuIcon-left">{{payload.education || "请选择"}}</view>
                </picker>
            </view>

            <view class="cu-form-group margin-top">
                <textarea maxlength="500" :value="payload.description"  @change="e=>iptChange(e,'description')" placeholder="简介"></textarea>
            </view>
        </form>
    </view>
</template>

<script>
export default {
    props: {
        item: { type: Object, default: {} },
    },
    data() {
        return {
            payload: {},

            ///education
            educationIndex: -1,
            education: ["初中", "中专", "高中", "大专", "本科", "硕士", "博士"],
        };
    },
    watch: {
        payload: {
            deep: true,
            handler(n, o){
                this.$emit("change", n);
            },
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
			this.payload = {...this.item};
        },
        iptChange(e,key){
            this.$set(this.payload,key,e.detail.value);
        },
        birthdayChange(e) {
            this.$set(this.payload, "birthday", e.detail.value);
        },        

        educationChange(e) {
            this.educationIndex = e.detail.value;
            this.$set(
                this.payload,
                "education",
                this.education[this.educationIndex]
            );
        },
    },
};
</script>