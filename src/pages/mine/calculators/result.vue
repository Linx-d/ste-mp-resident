<template>
	<view>
		<cu-custom bg-color="bg-white" :is-back="true">
			<text slot="content" class="my-text-color-black text-bold">{{ title }}</text>
		</cu-custom>
		<view class="flex justify-center align-center margin-top">
			<view class="fixed">
				<scroll-view scroll-x class="bg-white nav text-center">
					<view
						class="cu-item text-bold"
						:class="index == TabCur ? 'text-red' : ''"
						v-for="(item, index) in navData"
						:key="index"
						@tap="tabSelect"
						:data-id="index"
					>
						{{ item }}
					</view>
				</scroll-view>
				<view class="flex justify-center align-center margin-top">
					<view class="bg-red  radius" style="height: 160px;width: 85%;">
						<view class="text-center text-white flex justify-center align-center" style="height: 120px;width: 100%;">
							<view>
								<text v-if="TabCur == 0" class="text-white">每月应还</text>
								<text v-else class="text-white">首月月供</text>
								<view class="text-sl">
									<text >{{ yuegong.toFixed(2) }}</text>
									<text class="text-sm">元</text>
								</view>
								<view class="text-white" v-if="TabCur == 1">每月约递减{{ yuegongdijian.toFixed(2) }}元</view>
							</view>
						</view>
						<view class="flex justify-between" style="height: 30px;width: 100%;">
							<view class="flex justify-center align-center" style="width: 33%;">
								<view class="text-center">
									<view class="text-sm " style="color: #DDDDDD;">贷款总额</view>
									<view class="">{{ totalMoney }}万</view>
								</view>
							</view>
							<view class="flex justify-center align-center lixi-total">
								<view class="text-center">
									<view class="text-sm " style="color: #DDDDDD;">利息总额</view>
									<view class="">{{ totalLixi.toFixed(2) }}万</view>
								</view>
							</view>
							<view class="flex justify-center align-center" style="width: 33%;">
								<view class="text-center">
									<view class="text-sm " style="color: #DDDDDD;">贷款年限</view>
									<view class="">{{ year }}年</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="margin-top flex justify-center align-center">
					<view class="" style="width: 85%;">
						<view v-if="TabCur == 0">
							<text class="text-bold text-red">每月还款金额不变</text>
							<text>其中还款的本金逐月递减，利息逐月递减。计算结果仅供参考。</text>
						</view>
						<view v-else>
							<text class="text-bold text-red">每月还款金额递减{{ yuegongdijian.toFixed(2) }}元</text>
							<text>其中每月还款的本金不变，利息逐月减少。计算结果仅供参考。</text>
						</view>
					</view>
				</view>
				
				
				<view v-if="!showZh" class="flex justify-center align-center">
					<view style="width: 85%;">
						<view class="flex justify-between margin-top table-head">
							<view class="text-center" style="width: 15%;">期数</view>
							<view class="text-center" style="width: 20%;">月供金额</view>
							<view class="text-center" style="width: 20%;">月供本金</view>
							<view class="text-center" style="width: 20%;">月供利息</view>
							<view class="text-center" style="width: 25%;">剩余本息</view>
						</view>
					</view>
				</view>
				<view v-else class=" flex justify-center align-center">
					<view style="width: 85%;">
						<view class="flex justify-between margin-top table-head">
							<view class="text-center" style="width: 15%;">期数</view>
							<view class="text-center" style="width: 25%;">总还款金额</view>
							<view class="text-center" style="width: 25%;">商贷还款</view>
							<view class="text-center" style="width: 25%;">公积金还款</view>
						</view>
					</view>
				</view>
			</view>
			
			<view v-if="!showZh" class=" flex justify-center align-center" style="margin-top:220px;width: 100%;">
				<view style="width: 85%;">
					<view style="margin-bottom: 10px;">
						<view class="flex justify-between table-head-content " v-for="(item, index) in mouthdataArray" :key="index">
							<view class="text-center" style="width: 15%;">{{ item.topNum }}</view>
							<view class="text-center" style="width: 20%;">{{ item.yueToatl.toFixed(2) }}</view>
							<view class="text-center" style="width: 20%;">{{ item.yuebenjin.toFixed(2) }}</view>
							<view class="text-center" style="width: 20%;">{{ item.yuelixi.toFixed(2) }}</view>
							<view class="text-center" style="width: 25%;">{{ item.leftFund.toFixed(2) }}</view>
						</view>
					</view>
				</view>
			</view>
			
			<view v-else class=" flex justify-center align-center" style="margin-top:220px;width: 100%;">
				<view style="width: 85%;">
					<view style="margin-bottom: 10px;">
						<view class="flex justify-between table-head-content " v-for="(item, index) in zuheMouthdataArray" :key="index">
							<view class="text-center" style="width: 15%;">{{ item.topNum }}</view>
							<view class="text-center" style="width: 25%;">{{ turnString(parseFloat(item.sdyuegong.toFixed(2)) + parseFloat(item.gjjyuegong.toFixed(2)))  }}</view>
							<view class="text-center" style="width: 25%;">{{ item.sdyuegong.toFixed(2) }}</view>
							<view class="text-center" style="width: 25%;">{{ item.gjjyuegong.toFixed(2) }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			TabCur: 0,
			navData: ['等额本息', '等额本金'],
			mouthdataArray: [],
			yuegong: 0, //每月月供
			totalMoney: 0, //贷款本金
			totalLixi: 0, //总利息
			year: 0, //贷款年限
			yuegongdijian: 0, //每月递减金额
			optionData: {},
			titles: '',
			showZh:false,
			zuheMouthdataArray:[],//组合贷款
		};
	},
	onLoad(option) {
		uni.setNavigationBarTitle({
			title: option.title
		});
		this.titles = option.title;
		if (option.title == '组合贷款') {
			this.optionData = JSON.parse(option.datas);
			let data = this.optionData;
			this.totalMoney = parseFloat(data.gjjmoney) + parseFloat(data.sdmoney);
			
			if(data.gjjyear < data.sdyear){
				this.year = data.sdyear;
			}else{
				this.year = data.gjjyear
			}
			this.showZh = true;
			this.zuhe(1, data.sdmoney, data.gjjmoney, data.sdyear, data.gjjyear, data.sdlilv, data.gjjlilv);
			
		} else {
			this.optionData = JSON.parse(option.datas);
			let data = this.optionData;
			this.totalMoney = data.money;
			this.year = data.year;
			this.benxi(data.money, data.year, data.lilv);
		}
	},
	methods: {
		turnString(num){
			return num.toFixed(2)
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			let data = this.optionData;
			if (this.titles == '组合贷款') {
				if (this.TabCur == 0) {
					this.zuhe(1, data.sdmoney, data.gjjmoney, data.sdyear, data.gjjyear, data.sdlilv, data.gjjlilv);
				} else {
					this.zuhe(2, data.sdmoney, data.gjjmoney, data.sdyear, data.gjjyear, data.sdlilv, data.gjjlilv);
				}
				
			} else {
				if (this.TabCur == 0) {
					this.benxi(data.money, data.year, data.lilv);
				} else {
					this.benjin(data.money, data.year, data.lilv);
				}
			}
		},
		//等额本息计算
		benxi(num, year, lilv) {
			//每月月供额=〔贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔(1＋月利率)＾还款月数-1〕
			var mouth = parseInt(year) * 12,
				mouthlilv = parseFloat(lilv) / 12,
				dknum = parseFloat(num) * 10000;

			//每月月供
			var yuegong = (dknum * mouthlilv * Math.pow(1 + mouthlilv, mouth)) / (Math.pow(1 + mouthlilv, mouth) - 1);
			this.yuegong = yuegong;
			//总利息=还款月数×每月月供额-贷款本金
			var totalLixi = mouth * yuegong - dknum;
			this.totalLixi = totalLixi / 10000;
			//还款总额 总利息+贷款本金
			var totalPrice = totalLixi + dknum,
				leftFund = totalLixi + dknum;

			//循环月份
			var mouthdataArray = [],
				nowmouth = new Date().getMonth(),
				realmonth = 0;

			for (var i = 1; i <= mouth; i++) {
				realmonth = nowmouth + i;
				var yearlist = Math.floor(i / 12);

				realmonth = realmonth - 12 * yearlist;

				if (realmonth > 12) {
					realmonth = realmonth - 12;
				}
				//console.log(realmonth)
				//每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
				var yuelixi = (dknum * mouthlilv * (Math.pow(1 + mouthlilv, mouth) - Math.pow(1 + mouthlilv, i - 1))) / (Math.pow(1 + mouthlilv, mouth) - 1);
				//每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
				var yuebenjin = (dknum * mouthlilv * Math.pow(1 + mouthlilv, i - 1)) / (Math.pow(1 + mouthlilv, mouth) - 1);
				leftFund = leftFund - (yuelixi + yuebenjin);
				if (leftFund < 0) {
					leftFund = 0;
				}
				mouthdataArray[i - 1] = {
					monthName: realmonth + '月',
					yuelixi: yuelixi,
					yuebenjin: yuebenjin,
					//剩余还款
					leftFund: leftFund,
					yueToatl: yuelixi + yuebenjin,
					topNum: i,
					totalLixi:totalLixi
				};
			}
			return this.mouthdataArray = mouthdataArray;
		},
		//等额本金计算
		benjin(num, year, lilv) {
			var mouth = parseInt(year) * 12,
				mouthlilv = parseFloat(lilv) / 12,
				dknum = parseFloat(num) * 10000,
				yhbenjin = 0; //首月还款已还本金金额是0
			//每月应还本金=贷款本金÷还款月数
			var everymonthyh = dknum / mouth;
			//每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
			var yuegong = everymonthyh + (dknum - yhbenjin) * mouthlilv;

			this.yuegong = yuegong;
			//每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
			var yuegongdijian = everymonthyh * mouthlilv;
			this.yuegongdijian = yuegongdijian;
			//总利息=〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×还款月数-总贷款额
			var totalLixi = ((everymonthyh + dknum * mouthlilv + (dknum / mouth) * (1 + mouthlilv)) / 2) * mouth - dknum;
			this.totalLixi = totalLixi / 10000;
			//还款总额 总利息+贷款本金
			var totalPrice = totalLixi + dknum,
				leftFund = totalLixi + dknum;

			//循环月份
			var mouthdataArray = [],
				nowmouth = new Date().getMonth(),
				realmonth = 0;

			for (var i = 1; i <= mouth; i++) {
				realmonth = nowmouth + i;
				var yearlist = Math.floor(i / 12);

				realmonth = realmonth - 12 * yearlist;

				if (realmonth > 12) {
					realmonth = realmonth - 12;
				}
				yhbenjin = everymonthyh * (i - 1);
				var yuebenjin = everymonthyh + (dknum - yhbenjin) * mouthlilv;
				//每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
				var yuelixi = (dknum - yhbenjin) * mouthlilv;
				leftFund = leftFund - yuebenjin;
				if (leftFund < 0) {
					leftFund = 0;
				}
				mouthdataArray[i - 1] = {
					monthName: realmonth + '月',
					yuelixi: yuelixi,
					//每月本金
					yuebenjin: everymonthyh,
					//剩余还款
					leftFund: leftFund,
					//每月还款总额
					yueToatl: yuelixi + everymonthyh,
					topNum: i,
					totalLixi:totalLixi
				};
			}
			return this.mouthdataArray = mouthdataArray;
		},
		//商贷-公积金贷款统一函数
		singleDk(type, num, year, lilv) {
			var _this = this;
			// type:1等额本息 2等额本金，num 贷款金额 year贷款年限，lilv：贷款基准利率
			if (type == 1) {
				return _this.benxi(num, year, lilv);
			} else if (type == 2) {
				return _this.benjin(num, year, lilv);
			}
		},
		//组合贷款计算 type 1等额本息 2等额本金  sdnum商贷金额  gjjnum公积金金额  sdyear商贷年限  gjjyear公积金年限  sdlilv商贷利率 gjjlilv公积金利率
		zuhe(type, sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv) {
			var _this = this,
				year = sdyear > gjjyear ? sdyear : gjjyear;
			if (type == 1) {
				var sdObj = _this.benxi(sdnum, sdyear, sdlilv);
				var gjjObj = _this.benxi(gjjnum, gjjyear, gjjlilv);
				
				this.totalLixi = (sdObj[0].totalLixi + gjjObj[0].totalLixi) /10000;
				if (sdObj.length > gjjObj.length) {
					var mergemouthdataArray = sdObj.map(function(item, index) {
						if (index < gjjObj.length) {
							return {
								monthName: item.monthName,
								yuelixi: item.yuelixi + gjjObj[index].yuelixi,
								yuebenjin: item.yuebenjin + gjjObj[index].yuebenjin,
								leftFund: item.leftFund + gjjObj[index].leftFund,
								topNum:item.topNum,
								sdyuegong:item.yuelixi+ item.yuebenjin,
								gjjyuegong:gjjObj[index].yuelixi + gjjObj[index].yuebenjin
							};
						} else {
							return {
								monthName: item.monthName,
								yuelixi: item.yuelixi,
								yuebenjin: item.yuebenjin,
								leftFund: item.leftFund,
								topNum:item.topNum,
								sdyuegong:item.yuelixi+ item.yuebenjin,
								gjjyuegong:0
							};
						}
					});
				} else {
					var mergemouthdataArray = gjjObj.map(function(item, index) {
						if (index < sdObj.length) {
							return {
								monthName: item.monthName,
								yuelixi: item.yuelixi + sdObj[index].yuelixi,
								yuebenjin: item.yuebenjin + sdObj[index].yuebenjin,
								leftFund: item.leftFund + sdObj[index].leftFund,
								topNum:item.topNum,
								sdyuegong:sdObj[index].yuelixi+ sdObj[index].yuebenjin ,
								gjjyuegong:item.yuelixi+ item.yuebenjin
							};
						} else {
							return {
								monthName: item.monthName,
								yuelixi: item.yuelixi,
								yuebenjin: item.yuebenjin,
								leftFund: item.leftFund,
								topNum:item.topNum,
								sdyuegong:0,
								gjjyuegong:item.yuelixi + item.yuebenjin
							};
						}
					});
				}
				
				this.zuheMouthdataArray = mergemouthdataArray;
				this.yuegong = this.zuheMouthdataArray[0].sdyuegong +  this.zuheMouthdataArray[0].gjjyuegong;
				return  this.zuheMouthdataArray;
			} else if (type == 2) {
				var sdObj = _this.benjin(sdnum, sdyear, sdlilv);
				var gjjObj = _this.benjin(gjjnum, gjjyear, gjjlilv);
				
				this.totalLixi = (sdObj[0].totalLixi + gjjObj[0].totalLixi) /10000;
				
				if (sdObj.length > gjjObj.length) {
					var mergemouthdataArray = sdObj.map(function(item, index) {
						if (index < gjjObj.length) {
							return {
								monthName: item.monthName,
								yuelixi: item.yuelixi + gjjObj[index].yuelixi,
								yuebenjin: item.yuebenjin + gjjObj[index].yuebenjin,
								leftFund: item.leftFund + gjjObj[index].leftFund,
								topNum:item.topNum,
								gjjyuegong:gjjObj[index].yuelixi + gjjObj[index].yuebenjin,
								sdyuegong:item.yuelixi+ item.yuebenjin,
							};
						} else {
							return {
								monthName: item.monthName,
								yuelixi: item.yuelixi,
								yuebenjin: item.yuebenjin,
								leftFund: item.leftFund,
								topNum:item.topNum,
								gjjyuegong:item.yuelixi + item.yuebenjin,
								sdyuegong:0
							};
						}
					});
				} else {
					var mergemouthdataArray = gjjObj.map(function(item, index) {
						if (index < sdObj.length) {
							return {
								monthName: item.monthName,
								yuelixi: item.yuelixi + sdObj[index].yuelixi,
								yuebenjin: item.yuebenjin + sdObj[index].yuebenjin,
								leftFund: item.leftFund + sdObj[index].leftFund,
								sdyuegong:sdObj[index].yuelixi + sdObj[index].yuebenjin,
								gjjyuegong:item.yuelixi + item.yuebenjin,
								topNum:item.topNum
							};
						} else {
							return {
								monthName: item.monthName,
								yuelixi: item.yuelixi,
								yuebenjin: item.yuebenjin,
								leftFund: item.leftFund,
								sdyuegong:0,
								gjjyuegong:item.yuelixi + item.yuebenjin,
								topNum:item.topNum
							};
						}
					});
				}
				this.zuheMouthdataArray = mergemouthdataArray;
				this.yuegong = this.zuheMouthdataArray[0].sdyuegong +  this.zuheMouthdataArray[0].gjjyuegong;
				return this.zuheMouthdataArray;
			}
		}
	}
};
</script>

<style lang="less">
page {
	background-color: #ffffff;
}
.fixed {
	position: fixed;
	top: 0px;
	width: 100%;
	left: 0px;
	background-color: #ffffff;
}
.lixi-total {
	width: 34%;
	border-left: 1px solid #dddddd;
	border-right: 1px solid #dddddd;
}
.table-head {
	height: 70upx;
	width: 100%;
	line-height: 70upx;
	background-color: #eeeeee;
}
.table-head-content {
	height: 70upx;
	width: 100%;
	line-height: 70upx;
	background-color: #ffffff;
	font-size: 12px;
}
</style>
