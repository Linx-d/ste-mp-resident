<template>
	<view class="">
		<ul class="flex justify-around margin">
			<li :class="showIndex==0?'my-text-color-blue':''" @click="anewSelect(0)">总价(万/套)</li>
			<li :class="showIndex==1?'my-text-color-blue':''" @click="anewSelect(1)">单价(万/㎡)</li>
		</ul>
		<view class="margin flex flex-wrap" v-if="showIndex==0">
			 <view class='radius my-bgColor-hui margin-bottom-sm' style="width: 144upx;height: 64upx;line-height: 64upx;margin-left: 25upx;"  :class="totalPrices==item?'my-text-color-blue bgColor':''"   @click="totalPricesClick(item)"  v-for="(item,index) in totalPricesList" :key="index">{{item}}{{index==0?'':index==1?'万以下':index==totalPricesList.length-1?'万以上':'万'}}</view>
		</view>
		<view class="margin flex flex-wrap" v-else>
			 <view class='radius my-bgColor-hui margin-bottom-sm' :class="unitPrice==item?'my-text-color-blue bgColor':''"  style="width: 144upx;height: 64upx;line-height: 64upx;margin-left: 25upx;"  @click="unitPriceClick(item)" v-for="(item,index) in unitPriceList" :key="index">{{item}}{{index==0?'':index==1?'万以下':index==unitPriceList.length-1?'万以上':'万'}}</view>
		</view>
		<view class="flex justify-around text-lg padding" style="border-top: 1rpx solid #F2F2F2; border-bottom: 1rpx solid #8b8b8b;">
			<view class="my-text-color-blue" style="width: 320upx;height: 88upx;line-height: 88upx;background-color: #EDEFF2;border-radius: 4upx;" @click="cancel">取消</view>
			<view class="bg-blue" style="width: 320upx;height: 88upx;line-height: 88upx;border-radius: 4upx;" @click="priceConfirm">确认</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['pickerTitle'],
		data() {
			return {
				showIndex:0,
				totalPricesList:['不限','80','80-100','120-150','100-120','150-200','200'],
				unitPriceList:['不限','1','1-1.5','1.5-2','2-3','3-4','4-5','5'],
				totalPrices:'',
				unitPrice:''
			}
		},
		watch:{
			pickerTitle(item){
				this.totalPrices=item.totalPrices;
				this.unitPrice=item.unitPrice;
			}
		},
		created(){
			this.totalPrices=this.pickerTitle.totalPrices?this.pickerTitle.totalPrices:'';
			this.unitPrice=this.pickerTitle.unitPrice?this.pickerTitle.unitPrice:'';
		},
		methods:{
			
			anewSelect(index){
				this.showIndex=index;
			},
			
			cancel(){
				this.$emit('cancel');
			},
			priceConfirm(){
				let maxPrice='';
				let minPrice='';
				let maxUnitPrice='';
				let minUnitPrice='';
				if(this.totalPricesList.indexOf(this.totalPrices)==1){
					maxPrice=this.totalPrices;
				}else if(this.totalPricesList.indexOf(this.totalPrices)==this.totalPricesList.length-1){
					minPrice=this.totalPrices;
				}else{
					maxPrice = this.totalPrices.split('-')[1]?this.totalPrices.split('-')[1]:'';
					minPrice = this.totalPrices.split('-')[0]?this.totalPrices.split('-')[0]:'';
				}
				
				if(this.unitPriceList.indexOf(this.unitPrice)==1){
					maxUnitPrice=this.unitPrice;
				}else if(this.unitPriceList.indexOf(this.unitPrice)==this.unitPriceList.length-1){
					minUnitPrice=this.unitPrice;
				}else{
					maxUnitPrice = this.unitPrice.split('-')[1]?this.unitPrice.split('-')[1]:'';
					minUnitPrice = this.unitPrice.split('-')[0]?this.unitPrice.split('-')[0]:'';
				}
				this.$emit('priceConfirm',maxPrice, minPrice,maxUnitPrice,minUnitPrice,{totalPrices:this.totalPrices,unitPrice:this.unitPrice});
			},
			
			totalPricesClick(item){
				this.totalPrices=this.totalPrices==item?'':item;
			},
			unitPriceClick(item){
				this.unitPrice=this.unitPrice==item?'':item
			}
		}
	}
</script>

<style scoped>
	.bgColor{
		background-color: #E6F0FC;
	}
</style>
