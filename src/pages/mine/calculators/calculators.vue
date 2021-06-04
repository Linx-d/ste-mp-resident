<template>
	<view class="">
		<cu-custom bg-color="bg-white" :is-back="true">
			<text slot="content" class="text-black text-bold">房贷计算器</text>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav text-center">
			<view class="cu-item" :class="index == TabCur ? 'text-green cur' : ''" v-for="(item, index) in navData" :key="index"
			 @tap="tabSelect" :data-id="index">{{ item }}</view>
		</scroll-view>
		<div v-show="TabCur==0">
		    <ShangDaiPage></ShangDaiPage>
		</div>
		<div v-show="TabCur==1">
		    <GongJiJinPage></GongJiJinPage>
		</div>
		<div v-show="TabCur==2">
		    <ZuHePage></ZuHePage>
		</div>
	</view>
</template>

<script>
	import ShangDaiPage from "./ShangDaiPage"
	import GongJiJinPage from "./GongJiJinPage"
	import ZuHePage from "./ZuHePage"
	export default{
		data() {
			return {
				TabCur: 0,
				// navData: ['商业贷款', '公积金贷款', '组合贷款'],
				navData: ['商业贷款', '公积金贷款', '组合贷款'],
			}
		},
		components:{
			ShangDaiPage,
			GongJiJinPage,
			ZuHePage
		},
		methods:{
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
			},
		}
	}
</script>

<style>
</style>
