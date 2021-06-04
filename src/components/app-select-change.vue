<template>
	<view class="container">
		<view class="cu-form-group">
		    <view class="title">区域</view>
		</view>
		<view class="cu-form-group">
		    <view class="title">价格</view>
		</view>
		<view class="cu-form-group">
		    <view class="title">户型</view>
		</view>
		<view class="cu-form-group">
		    <view class="title">排序</view>
		</view>
	</view>
</template>

<script>
	export default {
	 data() {
	    return {
	     }
	  },
	}
</script>

<style lang="less">
.container{
	display: flex;
	.cu-form-group{
		width: 25%;
		font-size: 14px;
	}
}
</style>
