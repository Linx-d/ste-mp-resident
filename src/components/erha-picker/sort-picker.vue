<template>
	<view class="">
		<view class="margin">
			 <view class='flex radius flex-col padding'  :class="sortType==(Object.values(item))[0]?'my-text-color-blue':''"  @click="sortPricesClick(item)"  v-for="(item,index) in sortList" :key="index">{{(Object.keys(item))[0]}}</view>
		</view>
		<view class="flex justify-around text-lg padding" style="border-top: 1rpx solid #F2F2F2; border-bottom: 1rpx solid #8b8b8b;">
			<view class="my-text-color-blue" style="width: 320upx;height: 88upx;line-height: 88upx;background-color: #EDEFF2;border-radius: 4upx;" @click="cancel">取消</view>
			<view class="bg-blue" style="width: 320upx;height: 88upx;line-height: 88upx;border-radius: 4upx;" @click="sortConfirm">确认</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['pickerTitle'],
		data() {
			return {
				sortList:[{
					'单价由高到低':'house.salePrice,desc'
				},
				{
					'单价由低到高':'house.salePrice'
				},
				{
					'开盘时间顺序':'createTime'
				},
				{
					'开盘时间倒序':'createTime,desc'
				}],
				sortType:''
			}
		},
		// watch:{
		// 	pickerTitle(item){
		// 		this.houseType=item.maxRoom;
		// 	}
		// },
		// created(){
		// 	this.houseType=this.pickerTitle?this.pickerTitle:'';
		// },
		methods:{
			cancel(){
				this.$emit('cancel');
			},
			sortConfirm(){
				this.$emit('sortConfirm',this.sortType);
			},
			
			sortPricesClick(item){
				this.sortType=this.sortType==(Object.values(item))[0]?'':(Object.values(item))[0];
			},
		}
	}
</script>

<style scoped>
	.select{
		color: blue;
	}
</style>
