<template>

	<view class="">
		<cu-custom bg-color="bg-white" :is-back="true">
			<text slot="content" class="my-text-color-black text-bold">计算结果</text>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav text-center">
			<view class="cu-item" :class="index == TabCur ? 'text-green cur' : ''" v-for="(item, index) in navData" :key="index"
			 @tap="tabSelect" :data-id="index">{{ item }}</view>
		</scroll-view>
		<view class="flex-col align-center">
			<canvas canvas-id="canvasPie" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px'}" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
			<view class="padding">
				房贷总价: {{totalPrice}} 元
			</view>
			<view class="padding">
				首付金额: {{payMoney}} 元
			</view>
			<view class="padding">
				贷款总额: {{loanMoney}} 元
			</view>
			<view class="padding">
				支付利息: {{totalInterest}} 元
			</view>
			<view class="padding">
				利率: {{(rate*100).toFixed(2)}}%
			</view>
			<view class="padding">
				每月月供: {{monthPay}} 元
			</view>
			<view class="padding" v-if="TabCur==1">
				每月递减: {{monthDecMoney}} 元
			</view>
			<view class="padding text-red">
				以上结果仅供参考
			</view>
		</view>
		<!-- <div style="margin:0 auto;width:220px;">
    <button-tab v-model="selectedItem">
        <button-tab-item @on-item-click="itemChange">等额本息</button-tab-item>
        <button-tab-item @on-item-click="itemChange">等额本金</button-tab-item>
    </button-tab>

    <p class="disctext">{{lineOne}}</p>

    <ul>
      <li class="houseMoney">
        <span></span>
        <span class="interestrate">利&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;率</span>
        <span>:</span>
        <span><span>{{(this.rate*100).toFixed(2)}}</span><span class="sign">%</span></span>
        <span></span>
      </li>
      <li class="houseMoney">
        <span></span>
        <span>{{this.selectedItem === 0 ? '每月' : '首月'}}月供</span>
        <span>:</span>
        <span>{{this.monthPay}}</span>
        <span>元/月</span>
      </li>
       <li v-show="this.selectedItem==1" class="houseMoney">
        <span></span>
        <span>每月递减</span>
        <span>:</span>
        <span>{{this.monthDecMoney}}</span>
        <span>元/月</span>
      </li>
    </ul>
    <p class="disctext" style="text-align:center">以上结果仅供参考</p>
    </div> -->
	</view>

</template>
<script>
	// import { ButtonTab, ButtonTabItem, Divider } from "vux";
	// import RingChart from "../components/RingChart"
	import LoanCaculate from "@/components/calculator/LoanCaculate.js"
	import uCharts from '@/components/u-charts/u-charts.min.js';
	var _self;
	var canvaPie = null;
	export default {
		data() {
			return {
				TabCur: 0,
				navData: ['等额本息', '等额本金'],
				cWidth: '',
				cHeight: '',
				pixelRatio: 0.7,
				totalInterest: '',
				monthDecMoney: 0,

				selectedItem: 0,
				lineOne: "每月还款额固定，所还总利息较多，适合收入稳定者。",
				ringList: [],
				houseTotalPrice: "",
				totalPrice: 0,
				loanMoney: 0,
				payMoney: 0,
				months: 0,
				monthPay: 0,
				rate: 0
			}
		},
		// components: {
		//   ButtonTab,
		//   ButtonTabItem,
		//   Divider,
		//   RingChart
		// },
		onLoad(option) {
			_self = this

			let query = JSON.parse(option.query)
			console.log(query);
			this.totalPrice = query.totalPrice * 10000;
			this.loanMoney = query.loanMoney * 10000;
			this.payMoney = query.payMoney * 10000;
			this.months = query.months;
			this.rate = query.rate/100;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(750);
			this.caculateAcpi(true)

		},
		methods: {
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				if (this.TabCur == 0) {
					this.caculateAcpi(true);
				} else {
					this.caculateAcpi(false);
				}
			},


			getServerData() {
				console.log(this.loanMoney);
				console.log(this.payMoney);
				console.log(Number(this.totalInterest));
				let series = [{
					name: "贷款总额",
					data: this.loanMoney
				}, {
					name: "首付金额",
					data: this.payMoney
				}, {
					name: "支付利息",
					data: Number(this.totalInterest)
				}];
				// let series=[{name: "贷款总额", data: 22},{name: "首付金额", data: 220.233},{name: "支付利息", data: 22}];
				//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				_self.showPie("canvasPie", series);
			},
			showPie(canvasId, chartData) {
				canvaPie = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 22,
					padding: [15, 0, 15, 0],
					legend: {
						show: true,
						padding: 5,
						lineHeight: 11,
						margin: 0,
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							border: true,
							borderColor: '#FFFFFF',
							borderWidth: 3
						}
					},
				});
			},




			itemChange() {
				if (this.selectedItem == 0) {
					this.caculateAcpi(true);
				} else {
					this.caculateAcpi(false);
				}

			},
			caculateAcpi(isAcpi) {
				let monthPay = 0;
				let totalPay = 0;
				if (isAcpi) {
					monthPay = LoanCaculate.Acpi(this.rate, this.loanMoney, this.months)
					totalPay = monthPay * this.months;
					this.lineOne = "每月还款额固定，所还总利息较多，适合收入稳定者。"
				} else {
					for (let month = 0; month < this.months; month++) {
						monthPay = LoanCaculate.AverageCapital(this.rate, this.loanMoney, this.months, month)
						totalPay += monthPay;
					}
					monthPay = LoanCaculate.AverageCapital(this.rate, this.loanMoney, this.months, 0)
					let nextmonthPay = LoanCaculate.AverageCapital(this.rate, this.loanMoney, this.months, 1)
					this.monthDecMoney = (monthPay - nextmonthPay).toFixed(2);
					this.lineOne = "每月还款额递减，所还总利息较低，前期还款额较大。"
				}
				//console.log("月供",Math.ceil(monthPay));
				this.monthPay = Math.ceil(monthPay);
				//console.log("总还款",Math.ceil(totalPay));
				this.totalInterest = (totalPay - this.loanMoney).toFixed(2);
				this.getServerData();
			},
			touchPie(e) {
				console.log(e);
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
				canvaPie.touchLegend(e, {
					animation: true
				});
			}
		}



	}
</script>
