<template>
	<view class="">
		<view class="level-container flex">
			<!-- <ul class="name-list">
				<li :class="showIndex==0?'select':''" @click="anewSelect(0)">{{province}}</li>
				<li :class="showIndex==1?'select':''" @click="anewSelect(1)" v-if="showIndex>=1">{{city}}</li>
				<li :class="showIndex==2?'select':''" @click="anewSelect(2)" v-if="showIndex>=2">{{area}}</li>
				<li :class="showIndex==3?'select':''" @click="anewSelect(3)" v-if="showIndex>=3">{{street}}</li>
			</ul> -->
			<ul class="content" :style="'height:'+ heightCot + 'upx'" style="background-color: #EDEFF2;width: 200upx;">
				<li @click="selectaArea(index,item)" :class="area==item.name?'seletBgColor seletColor':''" v-for="(item,index) in areaRows"
				 :key="item">{{item.name}}</li>
			</ul>

			<radio-group @change="radioChange" v-if="showIndex==1" class="content flex-1" :style="'height:'+ heightCot + 'upx'"
			 style="border-left: 1rpx solid #8b8b8b;">
				<view class="flex justify-between" style="padding: 20upx 30upx;" @click="selectCity(item.name)" :class="item.name==streets?'seletColor':''"
				 v-for="(item,index) in streetsData" :key="item">
					{{item.name}}
					<radio :value="item.name" :checked="item.name==streets" style="transform:scale(0.7);" color="#0464E0" />
				</view>
			</radio-group>
		</view>
		<view class="flex justify-around text-lg padding" style="border-top: 1rpx solid #F2F2F2; border-bottom: 1rpx solid #8b8b8b;">
			<view class="my-text-color-blue" style="width: 320upx;height: 88upx;line-height: 88upx;background-color: #EDEFF2;border-radius: 4upx;" @click="cancel">取消</view>
			<view class="bg-blue" style="width: 320upx;height: 88upx;line-height: 88upx;border-radius: 4upx;" @click="areaConfirm">确认</view>
		</view>
	</view>
</template>

<script>
	import AddrService from '@/apis/addr';
	export default {
		props: ['areaRows'],
		data() {
			return {
				area: '', //选择的区域
				streets: '', //选择的街道
				streetsData: '', //当前展示的街道数据
				showIndex: 0,
				heightCot: 0,
			}
		},
		created() {
			uni.getSystemInfo({
				success: res => {
					console.log(res.safeArea.height)
					this.heightCot = (res.safeArea.height * 2) / 2
				}
			})
		},
		computed: {
			location() {
				return this.$store.state.location;
			}
		},
		watch: {
			location() {
				this.streetsData = []
			}
		},
		mounted() {},
		methods: {
			cancel() {
				this.$emit('cancel');
			},
			areaConfirm() {
				if (this.area == '不限' && this.streets == '不限') {
					// 市级查询
					this.$emit('areaConfirm', this.streets, 1);
				} else if (this.area !== '不限' && this.streets == '不限') {
					this.streets = this.area;
					// 区域查询
					this.$emit('areaConfirm', this.streets, 2);
				} else {
					// 街道查询
					this.$emit('areaConfirm', this.streets, 3);
				}
			},
			selectaArea(index, item) {
				// let data = {
				// 	size:1000,
				// 	level: 'street',
				// 	parentId:item.id
				// }
				// AddrService.addrQuery(data, res => {
				// 	if (res.data && res.data.data.content) {

				// 	}
				// })
				this.streetsData = [{
					name: '不限'
				}, ...item.children]
				this.area = item.name;
				this.showIndex = 1;

			},
			radioChange(event) {

				this.streets = event.detail.value;
			},
			selectCity(label) {
				this.streets = label;
				console.log(label);
			}
		}
	}
</script>

<style lang="less">
	ul,
	li {
		list-style: none;
	}

	.seletBgColor {
		background-color: #fff;
	}

	.seletColor {
		color: #0464E0;
	}

	.level-container {
		width: 100%;
		background: #fff;
		// position: fixed;
		// bottom: 0;

		.select {
			color: red;
			white-space: nowrap;
			// position: relative;

			&::after {
				content: '';
				width: 40upx;
				height: 6upx;
				background: red;
				// position: absolute;
				left: 50%;
				bottom: -8upx;
				margin-left: -20upx;
			}
		}

		li {
			font-size: 26upx;
		}

		.content,
		.name-list {}

		.title {
			font-size: 32upx;
			margin: 30upx 20upx;
		}

		.name-list {
			display: flex;

			li {
				margin-right: 40upx;
				padding-bottom: 6upx;
			}
		}

		.content {
			margin-top: 20upx;
			height: 600upx;
			overflow-y: auto;

			li {
				border-bottom: 1px solid #f1f1f1;
				padding: 20upx 0;
			}

			li:last-child {
				border-bototm: none !important;
			}
		}
	}
</style>
