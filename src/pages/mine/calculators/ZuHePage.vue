<template>
	<view>
		<form>
			<view class="cu-form-group">
				<view class="title">商业贷款</view>
				<input v-model="sloanMoney" name="input" placeholder="请输入贷款总额" type="number" class="text-right" />
				<view>万元</view>
			</view>
			<view class="cu-form-group ">
				<view class="title">商业贷款按揭年数</view>
				<picker @change="sloanYearChange" :value="sloanYearIndex" :range="loanYearsList">
					<view class="picker">{{ loanYearsList[sloanYearIndex] }}年</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">公积金贷款</view>
				<input v-model="gloanMoney" name="input" placeholder="请输入贷款总额" type="number" class="text-right" />
				<view>万元</view>
			</view>
			<view class="cu-form-group ">
				<view class="title">公积金贷款按揭年数</view>
				<picker @change="gloanYearChange" :value="gloanYearIndex" :range="loanYearsList">
					<view class="picker">{{ loanYearsList[gloanYearIndex] }}年</view>
				</picker>
			</view>
			<view class="cu-form-group ">
				<view class="title">商业利率</view>
				<picker @change="sloanRateChange" :value="sloanRateIndex" range-key="value" :range="rateList">
					<view class="picker">{{ rateList[sloanRateIndex].value }}({{sactRate}}%)</view>
				</picker>
			</view>
			<view class="cu-form-group ">
				<view class="title">公积金利率</view>
				<picker @change="gloanRateChange" :value="gloanRateIndex" range-key="value" :range="rateList">
					<view class="picker">{{ rateList[gloanRateIndex].value }}({{gactRate}}%)</view>
				</picker>
			</view>
		</form>
		<button type="primary" class="margin-top" style="width: 90%;" @click="caculateLoan">开始计算</button>
	</view>
	
 <!-- <div>
    <group v-show="!showsRatePage && !showgRatePage">
      <x-input  title="商业贷款:"  placeholder="请输入贷款总额" v-model="sloanMoney">
        <span slot="right">万元</span>
      </x-input>
       <popup-picker  :data="sloanYearsList" title="商业贷款按揭年数:"  v-model="sloanYear" style="text-align:left">
      </popup-picker>
      <x-input  title="公积金贷款:"  placeholder="请输入贷款总额" v-model="gloanMoney">
        <span slot="right">万元</span>
      </x-input>
       <popup-picker  :data="gloanYearsList" title="公积金贷款按揭年数" v-model="gloanYear"  style="text-align:left">
      </popup-picker>
        <cell is-link @click.native="srateClick">
        <span slot="title"><span>商业利率:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{sshowRate}}</span></span>
      </cell>
      <cell is-link @click.native="grateClick">
        <span slot="title"><span>公积金利率:</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{gshowRate}}</span></span>
      </cell>
      <x-button style="margin: 20px auto; width: 95%;" type="warn" @click.native="caculateLoan">开始计算</x-button>
    </group>
    <MoneyRate v-show="showsRatePage" class="payRate" @submit="sRateSubmit" :baseRate="sbaseRate"></MoneyRate>
    <MoneyRate v-show="showgRatePage" class="payRate" @submit="gRateSubmit" :baseRate="gbaseRate"></MoneyRate>
  </div> -->
</template>
<script>
// import MoneyRate from "../components/MoneyRate"
// import {PopupPicker, XInput, Group, Cell, XButton } from "vux";
export default {
  data() {
    return {
		sloanYearIndex:19,
		gloanYearIndex:19,
		loanYearsList:[],
		sloanRateIndex:0,
		gloanRateIndex:0,
		rateList: [{
				key: 1,
				value: "基准利率"
			},
			{
				key: 0.7,
				value: "7折"
			},
			{
				key: 0.85,
				value: "85折"
			},
			{
				key: 0.88,
				value: "88折"
			},
			{
				key: 0.9,
				value: "9折"
			},
			{
				key: 0.95,
				value: "95折"
			},
			{
				key: 1.05,
				value: "1.05倍"
			},
			{
				key: 1.1,
				value: "1.1倍"
			},
			{
				key: 1.2,
				value: "1.2倍"
			},
			{
				key: 1.3,
				value: "1.3倍"
			}
		],
		downRateList: [{
				key: 0.1,
				value: "一成"
			},
			{
				key: 0.2,
				value: "二成"
			},
			{
				key: 0.3,
				value: "三成"
			},
			{
				key: 0.4,
				value: "四成"
			},
			{
				key: 0.5,
				value: "五成"
			},
			{
				key: 0.6,
				value: "六成"
			},
			{
				key: 0.7,
				value: "七成"
			},
			{
				key: 0.8,
				value: "八成"
			},
			{
				key: 0.9,
				value: "九成"
			}
		],
		
      sloanMoney:50,
      gloanMoney:50,
      // sloanYearsList:[],
      sloanYear:"20年(240期)",
      // gloanYearsList:[],
      gloanYear:"20年(240期)",
      sshowRate:'4.90%',
      gshowRate:'3.25%',
      sactRate:'4.9',
      gactRate:'3.25',
      showsRatePage:false,
      showgRatePage:false,
    };
  },
  mounted() {
  	let initalLoanYears = [];
  	for (let i = 1; i < 31; i++) {
  		initalLoanYears.push(i + "年" + "(" + i * 12 + "期)");
  	}
  	this.loanYearsList = initalLoanYears;
  },
  computed: {
    syears () {
      const month = this.sloanYear.match(/\((\S*)\)/);
      return parseInt(month[1].substr(0,month[1].length-1) / 12);
    },
    gyears () {
      const month = this.gloanYear.match(/\((\S*)\)/);
      return parseInt(month[1].substr(0,month[1].length-1) / 12);
    },
    sbaseRate () {
      if (this.syears <= 1) {
        return 4.35
      } else if (this.syears <= 5) {
        return 4.75
      }

      return 4.9
    },
    gbaseRate () {
      if (this.gyears <= 5) {
        return 2.75 
      }

      return 3.25
    },
  },
  methods:{
	  sloanYearChange(e){
		  this.sloanYear = this.loanYearsList[e.detail.value]
		  this.sloanYearIndex = e.detail.value;
		  console.log(this.sloanYear);
	  },
	  gloanYearChange(e){
		  this.gloanYear = this.loanYearsList[e.detail.value]
		  this.gloanYearIndex = e.detail.value;
		  console.log(this.gloanYear);
	  },
	  sloanRateChange(e){
		  let val = this.rateList[e.detail.value].key;
		  this.sactRate = (this.sbaseRate * val).toFixed(2);
		  this.sloanRateIndex = e.detail.value;
		  console.log(this.sactRate);
	  },
	  gloanRateChange(e){
	  		  let val = this.rateList[e.detail.value].key;
	  		  this.gactRate = (this.gbaseRate * val).toFixed(2);
	  		  this.gloanRateIndex = e.detail.value;
	  		  console.log(this.gactRate);
	  },
      caculateLoan() {
      let smonth = this.sloanYear.match(/\((\S*)\)/);
      let smonths = smonth[1].substr(0,smonth[1].length-1);
      let gmonth = this.gloanYear.match(/\((\S*)\)/);
      let gmonths = gmonth[1].substr(0,gmonth[1].length-1);
      let query= {
      sloanMoney:this.sloanMoney,//商业贷款总额
      gloanMoney:this.gloanMoney,//公积金贷款总额
      smonths:smonths,//商业贷款年限
      gmonths:gmonths,//公积金贷款年限
      srate:this.sactRate,//商业贷款利率
      grate:this.gactRate,//公积金贷款利率
       }
	   console.log(query);
    },
    sRateSubmit(showValue,actRate){
      this.showsRatePage=false;
      this.showgRatePage=false;
      this.sshowRate = showValue;
      this.sactRate = actRate
    },
    gRateSubmit(showValue,actRate){
      this.showsRatePage=false;
      this.showgRatePage=false;
      this.gshowRate = showValue;
      this.gactRate = actRate;
    },
    srateClick(){
      this.showsRatePage = true;
    },
    grateClick(){
      this.showgRatePage = true;
    },
  }
};
</script>
<style>
.payRate{
  position: absolute;
  top:0;
  bottom: 0;
  background-color: #ffffff
}
</style>
