<template>
	<view>
		<form>
			<view class="cu-form-group">
				<view class="title">房款总价</view>
				<input v-model="totalPrice" name="input" type="number" class="text-right" />
				<view>万元</view>
			</view>
			<view class="cu-form-group ">
				<view class="title">首付比例</view>
				<picker @change="downRateChange" :value="downRateIndex" range-key="value" :range="downRateList">
					<view class="picker">{{ payRateLabel }}</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">贷款总额</view>
				<input v-model="loanMoney" name="input" type="number" disabled class="text-right" />
				<view>万元</view>
			</view>
			<view class="cu-form-group ">
				<view class="title">按揭年数</view>
				<picker @change="yearChange" :value="YearIndex" :range="loanYearsList">
					<view class="picker">{{ loanYearsList[YearIndex] }}年</view>
				</picker>
			</view>
			<view class="cu-form-group ">
				<view class="title">利率方式</view>
				<picker @change="rateChange" :value="rateIndex" range-key="value" :range="rateList">
					<view class="picker">{{ rateList[rateIndex].value }}({{actRate}}%)</view>
				</picker>
			</view>
<!-- 
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
			</view> -->
		</form>
		<button type="primary" class="margin-top" style="width: 90%;" @click="caculateLoan">开始计算</button>
		<!-- <group v-show="!showPayPage">

      <x-input type="number" title="房款总价" v-model="totalPrice">
        <span slot="right">万元</span>
      </x-input>
      <cell is-link @click.native="showPayPage=true">
        <span slot="title"><span>首付比例</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{payPercent}}</span></span>
      </cell>
      <cell value="万元">
         <span slot="title"><span>贷款总额</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{loanMoney}}</span></span>
      </cell>
      <popup-picker title="按揭年数" :data="loanYearsList"  v-model="loanYear" value-text-align="left">

      </popup-picker>
      <cell is-link @click.native="showRatePage=true">
        <span slot="title"><span>利&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;率</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{showRate}}</span></span>
      </cell>
      <x-button style="margin: 20px auto; width: 95%;" type="warn" @click.native="caculateLoan">开始计算</x-button>
    </group>
    <PayRate v-show="showPayPage" class="payRate" @submit="submit" ></PayRate>
    <MoneyRate v-show="showRatePage" class="payRate" @submit="RateSubmit" :baseRate="baseRate"></MoneyRate> -->
	</view>
</template>
<script>
	// import PayRate from "@/components/calculator/PayRate";
	// import MoneyRate from "@/components/calculator/MoneyRate";
	
	export default {
		// components: {
		//   MoneyRate,
		//   PopupPicker,
		//   PayRate,
		//   XInput,
		//   Group,
		//   Cell,
		//   XButton
		// },
		mounted() {
			let initalLoanYears = [];
			for (let i = 1; i < 31; i++) {
				initalLoanYears.push(i + "年" + "(" + i * 12 + "期)");
			}
			this.loanYearsList=initalLoanYears;
			console.log(this.loanYearsList);
		},
		data() {
			return {
				YearIndex:19,
				rateIndex:0,
				downRateIndex:0,
				loanYear: "20年(240期)",
				
				
				rateList: [
				  { key: 1, value: "基准利率" },
				  { key: 0.7, value: "7折" },
				  { key: 0.85, value: "85折" },
				  { key: 0.88, value: "88折" },
				  { key: 0.9, value: "9折" },
				  { key: 0.95, value: "95折" },
				  { key: 1.05, value: "1.05倍" },
				  { key: 1.1, value: "1.1倍" },
				  { key: 1.2, value: "1.2倍" },
				  { key: 1.3, value: "1.3倍" }
				],
				downRateList: [
				  { key: 0.1, value: "一成" },
				  { key: 0.2, value: "二成" },
				  { key: 0.3, value: "三成" },
				  { key: 0.4, value: "四成" },
				  { key: 0.5, value: "五成" },
				  { key: 0.6, value: "六成" },
				  { key: 0.7, value: "七成" },
				  { key: 0.8, value: "八成" },
				  { key: 0.9, value: "九成" }
				],
				isUnique: true,
				loanYearsList: [],
				
				totalPrice: 100,
				payRate: 0.3,
				payMoney: 0,
				loanYears: "",
				moneyRate: "",
				// baseRate: 4.9 / 100,
				actRate: 4.9,
				// showRate: "4.9%",
				payRateLabel: "三成",
				showPayPage: false,
				showRatePage: false
			};
		},
		computed: {
			baseRate() {
				if (this.years <= 1) {
					return 4.35
				} else if (this.years <= 5) {
					return 4.75
				}

				return 4.9
			},
			years() {
				const month = this.loanYear.match(/\((\S*)\)/);
				return parseInt(month[1].substr(0, month[1].length - 1) / 12);
			},
			showRate() {
				return (this.actRate * 100).toFixed(2) + '%'
			},
			loanMoney() {
				return (this.totalPrice * (1 - this.payRate)).toFixed(2);
			},
			payPercent() {
				if (!this.payRateLabel) {
					this.payMoney = this.payRate;
					return this.payRate + "万";
				} else {
					this.payMoney = (this.totalPrice * this.payRate).toFixed(2);
					return (
						this.payRateLabel +
						"(" +
						(this.totalPrice * this.payRate).toFixed(2) +
						"万" +
						")"
					);
				}
			}
		},
		methods: {
			yearChange(e){
				this.loanYear=this.loanYearsList[e.detail.value]
				this.YearIndex=e.detail.value;
				console.log(this.loanYearsList[e.detail.value]);
			},
			rateChange(e){
				let val=this.rateList[e.detail.value].key;
				this.actRate=(this.baseRate*val).toFixed(3);
				this.rateIndex=e.detail.value;
				console.log(this.actRate);
			},
			downRateChange(e){
				this.downRateIndex=e.detail.value;
				this.payRateLabel=this.downRateList[e.detail.value].value
				this.payRate=this.downRateList[e.detail.value].key
				console.log(this.downRateList[e.detail.value].key);
			},
			
			
			
			
			caculateLoan() {
				let month = this.loanYear.match(/\((\S*)\)/);
				let months = month[1].substr(0, month[1].length - 1);
				let query= {
					totalPrice: this.totalPrice,
					loanMoney: this.loanMoney,
					months: months,
					rate: this.actRate,
					payMoney: this.payMoney
				}
				uni.navigateTo({
					url:'./PaymentPage?query='+JSON.stringify(query)
				})
				console.log(query);
			},
			submit(payRate, label) {
				this.payRateLabel = label;
				this.showPayPage = false;
				this.payRate = payRate;
			},
			RateSubmit(showValue, actRate) {
				this.showRatePage = false;
				this.actRate = actRate;
				// this.showRate = showValue;
			}
		}
	};
</script>
<style>
	.payRate {
		position: absolute;
		top: 0;
		bottom: 0;
		background-color: #ffffff;
	}

	.vux-popup-picker-value {
		padding-left: 20px !important;
	}
</style>
