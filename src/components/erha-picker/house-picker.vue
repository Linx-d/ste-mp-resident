<template>
	<view class="">
		<view class="margin flex flex-wrap">
			 <view class='radius my-bgColor-hui margin-bottom-sm'  :class="houseType==item?'my-text-color-blue bgColor':''"  style="width: 144upx;height: 64upx;line-height: 64upx;margin-left: 25upx;" @click="housePricesClick(item)"  v-for="(item,index) in houseList" :key="index">{{item}}{{item=='不限'?'':'居'}}</view>
		</view>
		<view class="flex justify-around text-lg padding" style="border-top: 1rpx solid #F2F2F2; border-bottom: 1rpx solid #8b8b8b;">
			<view class="my-text-color-blue" style="width: 320upx;height: 88upx;line-height: 88upx;background-color: #EDEFF2;border-radius: 4upx;" @click="cancel">取消</view>
			<view class="bg-blue" style="width: 320upx;height: 88upx;line-height: 88upx;border-radius: 4upx;" @click="houseConfirm">确认</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['pickerTitle'],
		data() {
			return {
				houseList:['不限','1','2','3','4','5'],
				houseType:''
			}
		},
		watch:{
			pickerTitle(item){
				this.houseType=item.maxRoom;
			}
		},
		created(){
			this.houseType=this.pickerTitle?this.pickerTitle:'';
		},
		methods:{
			cancel(){
				this.$emit('cancel');
			},
			houseConfirm(){
				this.$emit('houseConfirm',this.houseType);
			},
			
			housePricesClick(item){
				this.houseType=this.houseType==item?'':item;
			},
		}
	}
</script>

<style scoped>
	.bgColor{
		background-color: #E6F0FC;
	}
</style>
