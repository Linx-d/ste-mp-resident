<template class="ht">
    <view class="container bg-white ht">
        <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
            <block slot="content">添加动态</block>
        </cu-custom>
        <view class="margin-top">
            <textarea 
            class="solid margin-auto padding-sm" 
            maxlength="-1" 
            @input="textareaAInput" 
            placeholder="请输入内容" 
            style="width:690upx"></textarea>
        </view>
        <view class="cu-form-group" @click="toTag">
        <view class="title">标签</view>
        <view class="flex align-center">
          <view class="margin-right-xs">{{ tag ? tag : '请选择' }}</view>
           <view class="cuIcon-right:before"></view>
        </view>
      </view> -->
        <view>
            <!-- 上传图片 -->
            <view class="cu-bar bg-white margin-top" v-if="leftSize > 0 || imgSize > 0">
                <view class="action">上传照片</view>
                <view class="action">{{ fileList.length }}/{{ leftSize }}</view>
            </view>
            <view class="cu-form-group" v-if="leftSize > 0 || imgSize > 0">
                <view class="grid col-4 grid-square flex-sub">
                    <view class="bg-img" v-for="(item, index) in fileList" :key="index" @click="ViewImage"
                        :data-url="fileList[index].thumb">
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
        </view>

      <view class="flex justify-center margin-top">
            <button class="cu-btn bg-blue" style="width: 150upx;" @click="issue">
                发布
            </button>
        </view>

    </view>
</template>

<script>
    import Service from "@/apis/service";
    import UserService from '@/apis/user.js';
    import ResidentService from '@/apis/resident.js'
    import HouseService from '@/apis/house.js'
    import NewsService from '@/apis/news.js'
    export default {
        data() {
            return {
                modalName: null,
                textareaAValue: "",
                tag: '',
                max: 9,
                fileList: [],
                leftSize: 9,
                residentId: null,
                houseLink: null,
                residentLink: null,
                arrTag: [
                    '楼盘咨询', '促销活动', '紧急通知', '佣金调整', '紧急加推', '开盘提醒'
                ]
            };
        },
        mounted() {
            let house = uni.getStorageSync("house" + Service.KEY_SUFFIX);
            this.houseLink = Service.URI_API + '/rest/houses/' + house.id
            UserService.getResidentInfo((res) => {
                let params = res.data.data.id
                ResidentService.byId(params, res => {
                    this.residentLink = res.data._links.resident.href
                    this.residentId = res.data.id
                })
            })
        },
        onShow() {
            let tag = uni.getStorageSync('selectTag')
            tag ? this.tag = tag : this.tag = ''
        },
        methods: {
            textareaAInput(e) {
                this.textareaAValue = e.detail.value;
            },
            toTag() {
                this.navTo(`./selectTag`)
            },
            ViewImage(e) {
                uni.previewImage({
                    urls: this.fileList.map((i) => i.thumb),
                    current: e.currentTarget.dataset.url,
                });
            },
            ChooseImage() {
                uni.chooseMedia({
                    count: this.leftSize - this.imgSize, //默认9
                    mediaType: ["image", "video"],
                    sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
                    sourceType: ["album", "camera"], //从相册选择
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
                                };
                            });

                        if (this.fileList.length > 0) {
                            this.fileList = [...this.fileList, ...arr];
                        } else {
                            this.fileList = [...arr];
                        }
                    },
                });
            },
            DelImg(e) {
                this.confirm("确定删除此内容吗？", (ok) => {
                    if (ok) {
                        this.fileList.splice(e.currentTarget.dataset.index, 1);
                    }
                });
            },
            issue() {
                if (this.tag && this.textareaAValue) {
                    let params = {
                        category: this.tag,
                        content: this.textareaAValue,
                        house: this.houseLink,
                        user: this.residentLink
                    }
                    this.confirm('确认要提交楼盘动态吗？', (ok) => {
                        if (ok) {
                            NewsService.postNews(params, res => {
                                if (res.statusCode === 201) {
                                    if (this.fileList.length === 0) {
                                        this.toast("保存成功", "success");
                                        this.successBack();
                                    } else {
                                        this.fileListUpload(res.data.id, this.fileList)
                                    }
                                }else if(res.statusCode === 400) {
                                        this.toast(`${res.data.message}`);
                                }
                            })
                        }
                    })
                }
            },
            fileListUpload(id, fileList) {
                Service.uploadOssBatch(
                    fileList,
                    '/news/img/' + id
                ).then((media) => {
                    if (media) {
                        let urls = [...fileList, ...media].map((m) => {
                            return Service.URI_API + "/rest/medias/" + m.id;
                        })
                        NewsService.putNewsPhotos(
                            id,
                            urls.join("\n"),
                            (res) => {
                                console.log(res, 'res')
                                if (res.statusCode === 204) {
                                    this.toast("保存成功", "success");
                                    this.successBack();
                                }
                            }
                        )
                    } else {
                        this.toast("上传附件失败");
                    }
                })
            },
            successBack() {
            uni.removeStorageSync('selectTag')
                let pages = getCurrentPages();
                let pre = pages[pages.length - 2]; //当前页面
                pre.$vm.init();
                this.navBack();
            },
        },
        computed: {
            imgSize() {
                return this.fileList.length;
            },
            // leftSize() {
            //   return this.max - this.fileList.length;
            // },
        },
    };
</script>

<style lang="less" scoped>

    .ht{
        height:100vh !important;
    }

</style>