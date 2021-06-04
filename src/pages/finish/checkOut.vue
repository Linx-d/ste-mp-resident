<template>
    <view>
        <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">历史变更</block>
        </cu-custom>
        <view class="bg-white padding margin-top">
            <view class="text-lg">
                <text class="cuIcon-titles text-orange lg margin-right"></text>
                <text class="text-black text-blod">退房</text>
            </view>
            <view class="cu-form-group">
                <view class="title">客户姓名</view>
                <input v-model="order.clientName" disabled></input>
            </view>
            <view class="cu-form-group">
                <view class="title">手机号码</view>
                <input v-model="order.clientPhone" disabled></input>
            </view>
            <view class="cu-form-group">
                <view class="title">退房日期</view>
                <picker mode="date" :value="date" start="2020-09-01" end="2030-09-01" @change="DateChange">
                    <view class="picker">
                        {{date}}
                    </view>
                </picker>
            </view>
            <view class="cu-form-group">
                <view class="title">退房时间</view>
                <picker mode="time" :value="time" start="09:01" end="21:01" @change="TimeChange">
                    <view class="picker">
                        {{time}}
                    </view>
                </picker>
            </view>
            <view class="cu-form-group align-start">
                <view class="title">退房原因</view>
                <textarea maxlength="-1" @input="textareaInput" placeholder="请输入内容"></textarea>
            </view>
            <view class="cu-bar bg-white margin-top" v-if="leftSize > 0 || imgSize > 0">
                <view class="action">附件</view>
                <view class="action">{{ fileList.length }}/{{ leftSize }}</view>
            </view>
            <!-- 上传图片 -->
            <view class="cu-form-group" v-if="leftSize > 0 || imgSize > 0">
                <view class="grid col-4 grid-square flex-sub">
                    <view 
                    class="bg-img" 
                    v-for="(item, index) in fileList" 
                    :key="index" 
                    @click="ViewImage"
                    :data-url="fileList[index].thumb"
                    >
                    <image :src="fileList[index].thumb" mode="aspectFill" />
                    <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
                        <text class="cuIcon-close"></text>
                    </view>
                    </view>
                    <view class="solids" @tap="ChooseImage" v-if="leftSize - imgSize > 0">
                        <text class="cuIcon-cameraadd"></text>
                    </view>
                </view>
            </view>
            <view class="flex justify-center margin-top">
                <button class="cu-btn bg-blue" style="width: 150upx;" @click="issue">
                    提交
                </button>
            </view>
        </view>
    </view>


</template>

<script>
    import OrderService from '@/apis/order'
    export default {
        data() {
            return {
                orderId: null,
                order: null,
                time: `${new Date().getHours()}:${new Date().getMinutes()}`,
                date: `${new Date().getFullYear()}-${new Date().getMonth() + 1
                }-${new Date().getDate()}`,
                textareaBValue: null,
                max: 9,
                fileList: [],
                leftSize: 9,

            }
        },
        onLoad(options) {
            console.log(options)
            this.orderId = options.orderId
        },
        mounted() {
            if (this.orderId) {
                this.init()
            } else {
                this.toast("获取信息失败");
            }

        },
        computed: {
            imgSize() {
                return this.fileList.length
            }
        },
        methods: {
            init() {
                let id = this.orderId
                OrderService.byId(id, res => {
                    if (res.statusCode === 200) {
                        this.order = res.data
                    } else {
                        this.toast("获取信息失败");
                    }

                })
            },
            TimeChange(e) {
                this.time = e.detail.value
            },
            DateChange(e) {
                this.date = e.detail.value
            },
            textareaInput(e) {
                this.textareaBValue = e.detail.value
            },
            ViewImage(e) {
                uni.previewImage({
                    urls: this.fileList.map((i) => i.thumb),
                    current: e.currentTarget.dataset.url,
                });
            },
            ChooseImage() {
                uni.chooseMedia({
                    count: this.leftSize - this.imgSize,//默认9
                    mediaType: ["image","video"],
                    sizeType: ["original", "compressed"],
                    sourceType: ["album", "camera"],
                    success: (res) => {
                        let {
                            tempFiles,
                            type                     
                        } = res;
                        let arr = 
                        type === "video" ? [{
                        type: "video/mp4",
                        path: tempFiles[0].tempFilePath,
                        thumb: tempFiles[0].thumbTempFilePath,
                        }, ] : 
                        tempFiles.map((i) => {
                            let path = i.tempFilePath;
                            return {
                                type: "image/jpeg",
                                path,
                                thumb: path,
                            }
                        });
                        if (this.fileList.length > 0) {
                            this.fileList = [...this.fileList, ...arr]
                        } else {
                            this.fileList = [...arr]
                        }
                    }
                })
            },
            DelImg(e) {
                this.comfirm("确定删除此内容吗？", (ok)=> {
                    this.fileList.splice(e.currentTarget.dataset.index, 1)
                })
            },
            issue() {
                if(!this.textareaBValue) {
                    this.toast("请填写退房原因")
                } else {
                    let params = {
                        id: this.orderId,
                        date: this.date + ' ' + this.time + ':00',
                        cause: this.textareaBValue
                    }
                    this.confirm("确认退房吗？", (ok)=> {
                        if (ok) {
                            this.toast("功能正在更新中")
                        }
                    })
                }
            }
        },
    }
</script>

<style lang="less" scoped>

</style>