<template>
	<view class="bg-white">
		<cu-custom bg-color="bg-white" :is-back="true">
			<text slot="content" class="my-text-color-black text-bold">房贷计算器</text>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav text-center">
			<view class="cu-item" :class="index == TabCur ? 'text-red' : ''" v-for="(item, index) in navData" :key="index" @tap="tabSelect" :data-id="index">{{ item }}</view>
		</scroll-view>
		<!-- 商业贷款 -->
		<view v-if="TabCur == 0">
			<form>
				<view class="cu-form-group margin-top">
					<view class="title">计算方式</view>
					<picker @change="PickerChange" :value="index" :range="loanData">
						<view class="picker">{{ loanData[index] }}</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">商贷金额</view>
					<input v-model="commercialLoanAmount" name="input" type="number" class="text-right" />
					<view>万</view>
				</view>
				<view class="cu-form-group ">
					<view class="title">商贷年限</view>
					<picker @change="yearChange" :value="index" :range="years">
						<view class="picker">{{ years[yearIndex] }}年</view>
					</picker>
				</view>

				<view class="cu-form-group ">
					<view class="title">利率方式</view>
					<picker @change="rateChange" :value="index" :range="rateMode">
						<view class="picker">{{ rateMode[rateIndex] }}</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">LPR</view>
					<input name="input" class="text-right" type="number" v-model="lpr" />
					<text class="">%</text>
				</view>
				<view class="cu-form-group" v-if="rateIndex == 0">
					<view class="title">基点</view>
					<input v-model="basisPoint" name="input" type="number" class="text-right" />
					<text class="">‰</text>
				</view>
				<view class="cu-form-group" style="border-bottom: 1rpx solid #eee;">
					<view class="title">商贷利率</view>
					<input placeholder="" name="input" type="number" class="text-right" v-model="commercialLoanRate" />
					<text class="">%</text>
				</view>
			</form>
		</view>
		<!-- 公积金贷款 -->
		<view v-if="TabCur == 1">
			<form>
				<view class="cu-form-group margin-top">
					<view class="title">计算方式</view>
					<picker @change="PickerChange" :value="index" :range="loanData">
						<view class="picker">{{ loanData[index] }}</view>
					</picker>
				</view>

				<view class="cu-form-group">
					<view class="title">公积金金额</view>
					<input v-model="reserveAmount" type="number" name="input" class="text-right" />
					<text>万</text>
				</view>
				<view class="cu-form-group ">
					<view class="title">公积金年限</view>
					<picker @change="yearChange" :value="index" :range="years">
						<view class="picker">{{ years[yearIndex] }}</view>
					</picker>
				</view>
				<view class="cu-form-group ">
					<view class="title">公积金利率</view>
					<picker @change="reserveChange" :value="index" :range="reserveData">
						<view class="picker">{{ reserveData[reserveIndex] }}</view>
					</picker>
				</view>
			</form>
		</view>
		<!-- 组合贷款 -->
		<view v-if="TabCur == 2">
			<form>
				<view class="cu-form-group margin-top">
					<view class="title">计算方式</view>
					<picker @change="PickerChange" :value="index" :range="loanData">
						<view class="picker">{{ loanData[index] }}</view>
					</picker>
				</view>
			<!-- 	<view class="cu-form-group">
					<view class="title">贷款总金额</view>
					<input v-model="commercialLoanAmount" type="number" name="input" class="text-right" />
					<text>万</text>
				</view> -->
				
				<view class="cu-form-group">
					<view class="title">商贷金额</view>
					<input v-model="commercialLoanAmount" type="number" name="input" class="text-right" />
					<text>万</text>
				</view>

				<view class="cu-form-group ">
					<view class="title">利率方式</view>
					<picker @change="rateChange" :value="index" :range="rateMode">
						<view class="picker">{{ rateMode[rateIndex] }}</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">LPR</view>
					<input name="input" class="text-right" type="number" v-model="lpr" />
					<text class="">%</text>
				</view>
				<view class="cu-form-group" v-if="rateIndex == 0">
					<view class="title">基点</view>
					<input name="input" v-model="basisPoint" type="number" class="text-right" />
					<text class="">‰</text>
				</view>
				<view class="cu-form-group">
					<view class="title">商贷利率</view>
					<input v-model="lpr" name="input" type="number" class="text-right" />
					<text class="">%</text>
				</view>
				<view class="cu-form-group ">
					<view class="title">商贷年限</view>
					<picker @change="sdZhPickerChange" :value="index" :range="years">
						<view class="picker">{{ years[sdYearIndex] }}年</view>
					</picker>
				</view>
				<view class="" style="height: 20upx;width: 100%; background-color: #EEEEEE;"></view>

				<view class="cu-form-group">
					<view class="title">公积金金额</view>
					<input v-model="reserveAmount" name="input" type="number" class="text-right" />
					<text>万</text>
				</view>
				<view class="cu-form-group ">
					<view class="title">公积金年限</view>
					<picker @change="gjjZhPickerChange" :value="index" :range="years">
						<view class="picker">{{ years[gjjYearIndex] }}年</view>
					</picker>
				</view>
				<view class="cu-form-group ">
					<view class="title">公积金利率</view>
					<picker @change="reserveChange" :value="index" :range="reserveData">
						<view class="picker">{{ reserveData[reserveIndex] }}</view>
					</picker>
				</view>
			</form>
		</view>
		<button  class="margin-top margin-bottom-xl  bg-red" style="width: 90%;" @click="calculate">开始计算</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loanData: ['按贷款总额', '按房屋总价'],
			years: [30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
			TabCur: 0,
			navData: ['商业贷款', '公积金贷款', '组合贷款'],
			// navData: ['商业贷款', '公积金贷款'],
			index: 0,
			rateMode: ['按最新LPR', '按旧版基准利率'],
			rateIndex: 0, //利率类型索引
			yearIndex: 0, //贷款年限索引
			loanIndex: 0, //贷款价格类型索引
			lpr: 4.75, //贷款利率
			reserveData: ['最新基准利率(3.25%)', '最新基准利率上浮10%(3.575%)'],
			reserve: 3.25, //公积金利率
			reserveAmount: 0, //公积金金额
			commercialLoanAmount: 0, //商业贷款金额
			reserveIndex: 0, //公积金利率索引
			basisPoint: 0 ,//基点
			sdYearIndex:0,//组合商贷年限index
			gjjYearIndex:0,//组合公积金年限index
		};
	},
	computed: {
		commercialLoanRate() {
			if (this.rateIndex == 1) {
				return this.lpr;
			} else {
				return this.lpr + this.basisPoint / 100;
			}
		}
	},
	methods: {
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
		},
		PickerChange(e) {
			this.index = e.detail.value;
		},
		sdZhPickerChange(e){
			this.sdYearIndex = e.detail.value;
		},
		gjjZhPickerChange(e){
			this.gjjYearIndex = e.detail.value;
		},
		yearChange(e) {
			this.yearIndex = e.detail.value;
		},
		reserveChange(e) {
			this.reserveIndex = e.detail.value;
		},
		rateChange(e) {
			this.rateIndex = e.detail.value;
			if (this.rateIndex == 1) {
				this.lpr = 4.9;
			} else {
				this.lpr = 4.75;
			}
		},
		
		calculate() {
			if (this.TabCur == 0) {
				if(this.commercialLoanAmount <= 0){
					uni.showToast({
						icon:'none',
						title:'必须输入贷款金额'
					})
					return
				}
				let datas ={
					money:this.commercialLoanAmount,
					year:this.years[this.yearIndex],
					lilv:this.commercialLoanRate/100
				}
				uni.navigateTo({
					url:'/pages/mine/calculators/result?title=商业贷款&datas='+JSON.stringify(datas)
				})
			}
			if (this.TabCur == 1) {
				if(this.reserveAmount <= 0){
					uni.showToast({
						icon:'none',
						title:'必须输入贷款金额'
					})
					return
				}
				if(this.reserveIndex == 0){
					this.reserve = 3.25
				}else{
					this.reserve = 3.575
				}
				if(this.reserveAmount >70){
					uni.showToast({
						icon:'none',
						title:'公积金贷款总额度不超过70万'
					})
					this.reserveAmount = 70;
					return
				}
				let datas ={
					money:this.reserveAmount,
					year:this.years[this.yearIndex],
					lilv:this.reserve/100
				}
				
				uni.navigateTo({
					url:'/pages/index/workbench/calculators/result?title=公积金贷款&datas='+JSON.stringify(datas)
				})
			}
			if (this.TabCur == 2) {
				// sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv
				if(this.reserveIndex == 0){
					this.reserve = 3.25
				}else{
					this.reserve = 3.575
				}
				if(this.reserveAmount >70){
					uni.showToast({
						icon:'none',
						title:'公积金贷款总额度不超过70万'
					})
					this.reserveAmount = 70;
					return
				}
				
				if((this.reserveAmount + this.commercialLoanAmount) <= 0){
					uni.showToast({
						icon:'none',
						title:'必须输入贷款金额'
					})
					return
				}
				
				let datas={
					sdmoney:this.commercialLoanAmount,
					sdyear:this.years[this.sdYearIndex],
					sdlilv:this.commercialLoanRate/100,
					gjjmoney:this.reserveAmount,
					gjjyear:this.years[this.gjjYearIndex],
					gjjlilv:this.reserve/100
				}
				uni.navigateTo({
					url:'/pages/index/workbench/calculators/result?title=组合贷款&datas='+JSON.stringify(datas)
				})
			}
		}
	}
};
</script>

<style lang="less">
page {
	background-color: #ffffff;
	.title {
		width: 30%;
	}
	.cu-form-group {
		input {
			padding-right: 40upx;
		}
		.picker {
			padding-right: 40upx;
		}
	}
}
</style>
