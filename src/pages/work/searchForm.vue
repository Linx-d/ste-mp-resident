<template>
	<view>
		<cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
			<block slot="backText">返回</block>
     		<block slot="content">搜索</block>
		</cu-custom>
		<view class="fixed nav" :style="tabStyle">
			<view class="cu-bar bg-white search">
				<view class="search-form">
					<text class="cuIcon-search"></text>
					<input type="text" v-model="value" focus placeholder="请输入姓名和手机号后四位" />
					
				</view>
				<view class="cu-btn margin-right-xs bg-blue" @click="search">搜索</view>
			</view>  
		</view>
        <view v-if="reports.length != 0"
		:style="[{ marginTop: CustomBar  +  'px' }]">
            <scroll-view scroll-y>
				<view class="text-center text-grey" v-if="reports.length">———— 报备单 ————</view>
               <app-report-rearch-item v-for="item in reports" :key="item.id" :item="item"></app-report-rearch-item>
			   
			   <view class="more text-blue" v-if="reports.length">
				   <view @click="reportMore">更多</view>
				   <view class="cuIcon-right:before"></view>
				</view>
				<view class="text-center text-grey" v-if="orders.length">———— 签约单 ————</view>
				<app-finish-rearch-item v-for="item in orders" :key="item.id" :item="item"></app-finish-rearch-item>
				 <view class="more text-blue padding-bottom" v-if="orders.length">
				   <view @click="orderMore">更多</view>
				   <view class="cuIcon-right:before"></view>
				</view>
            </scroll-view>
        </view>
	</view>
</template>

<script>
import ReportService from "@/apis/report.js";
import OrderService from '@/apis/order.js';
import Service from '@/apis/service.js'
	export default {
		data() {
			return {
                CustomBar: this.CustomBar,
				value: '',
				reports: [],
				orders: [],
				moreStatus: false,
				divHeight:0
			}
		},
		computed: {
			tabStyle() {
				return `top:${this.CustomBar}px`;
			},
			contentStyle() {
				return `margin-top:${this.CustomBar+20}px;min-height: ${this.divHeight}px`;
			},
		},
		mounted() {
		const e= uni.getSystemInfoSync();
		this.divHeight=e.screenHeight-this.CustomBar-130;
    	// this.init();
			// this.setHeight();
		},
		methods: {
			// setHeight() {
			// 	let windowHeight = uni.getSystemInfoSync().windowHeight; //页面可见区域
			// 	console.log("windowHeight = " + windowHeight)

			// 	windowHeight = windowHeight - 44; //页面可见区域 - 在线购物条高度					
			// 	console.log("windowHeight = " + windowHeight)
			// 	var query = uni.createSelectorQuery();
			// 	uni.createSelectorQuery().select('.view_head').boundingClientRect(rect => {
			// 		console.log(rect, 'rect')
			// 		if (rect) {
			// 			console.log("view_head.height = " + rect.height)
			// 			this.height = windowHeight - rect.height; //页面可见区域 - 头部高度
			// 			console.log("this.height = " + this.height)
			// 		}
			// 	}).exec();
			// },
			reportMore() {
				this.moreReportStatus = true
				let parmas = this.setParmas()
					this.searchReport(parmas)
			},
			orderMore() {
				this.moreOrderStatus = true
				let parmas = this.setParmas()
					this.searchOrder(parmas)	
	
				
			},
			search() {
				let parmas = this.setParmas()
				if (parmas.size) {
					this.searchReport(parmas)
					this.searchOrder(parmas)		
				}
						
			},
			setParmas() {
				if(!this.value) return
					let reg = new RegExp(/^\d{4}$/)
					let reg1 = new RegExp(/^\S*$/)
					let parmas = {}
					let task = uni.getStorageSync('task' + Service.KEY_SUFFIX)
				if(reg.test(this.value)) {
					console.log('tongg')
					return {
						clientPhone: this.value,
						size: this.moreReportStatus || this.moreOrderStatus ? '' : 3,
						taskId: task.id
					}
				} else if(reg1.test(this.value)) {
					return {
						clientName: this.value,
						size: this.moreReportStatus || this.moreOrderStatus ? '' : 3,
						taskId: task.id
					}
				} else {
					return {}
				}
			},
			searchReport(parmas) {
				ReportService.queryReport(parmas, (res) => {
					console.log(res, 'res')		
					this.reports = res.data.data.content
					this.reports.forEach((item)=>{
						if(item.client.phone.indexOf(',') != -1){
							item.client.phones = item.client.phone.split(',')
						}
					})
					this.moreReportStatus = false
					})
			},
			searchOrder(parmas) {
				OrderService.queryOrder(parmas, (res) => {
					console.log(res, 'order')
					this.orders = res.data.data.content
					this.orders.forEach((item)=>{
						if(item.clientPhone.indexOf(',') != -1){
							item.arrClientPhone = item.clientPhone.split(',')
						}
					})
					this.moreOrderStatus = false
				})
			},
		}
	}
</script>

<style lang="less">
</style>
