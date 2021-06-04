<template>
	<view class="container" >
		<view class="singerHouse" v-for="(item) in houseDate" :key="item" @click="navTo('/pages/show-houses-detial/show-houses-detial')">
			<!-- 上 -->
			<view class="topContent" >
				<!-- 左 : 图片-->
				<image class="houseImg" :src="imgUrl">{{ item.imgUrl }}</image>
				<!-- 右 -->
				<view class="rightCentent" >
					<!-- 名字 类别 -->
					<view class="nameType">
						<view class="houseName" >{{ item.housenmae }}</view>
						<view class="houseType">{{ item.housetype }}</view>
					</view>
					<!-- 建面、价格 -->
					<view class="bulidPrice">
						<view class="houseBulid" >建面 {{ item.housebulid }}m²</view>
						<view class="housePrice">{{ item.houseprice }}元/平</view>
					</view>
					<!-- 地点 天数 -->
					<view class="placeDay">
						<view class="housePlace" >{{ item.housepalce }}</view>
						<view class="remainingDay">剩{{ item.remainingday }}天</view>
					</view>
				</view>
			</view>
			<!-- 下 -->
			<view class="bottomCentent">
				<view class="tiitleY">佣</view>
				<view class="brokerage">{{ item.brokerage }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				houseDate:[{
					imgUrl:'',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'渝北·礼嘉',
					remainingday:'99',
					brokerage:'4%+1万扣10%'
				},
				{
					imgUrl:'',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'北碚·蔡家',
					remainingday:'99',
					brokerage:'80方以下：25000+2%跳3%扣15%平台费 80方以上...'
				},]
			};
		},
		methods:{
			
		}
	}
</script>

<style lang="less">
	.container{
		.singerHouse{
			padding-bottom: 20px;
			border-bottom: 1px solid #D7D7D7;
			box-sizing: border-box;
			.topContent{
				display: flex;
				.houseImg{
					width: 120px;
					height: 80px;
					background-color: #007AFF;
					margin: 10px 20px 10px 10px;
				}
				.rightCentent{
					margin: 10px 0 20px 10px;
					.nameType{
						display: flex;
						justify-content: space-between;
						.houseType{
							background-color: #D7D7D7;
							width: 40px;
							height: 20px;
							line-height: 20px;
							text-align: center;
							font-size: 12px;
						}
					}
					.bulidPrice{
						display: flex;
						justify-content: space-between;
						margin-top: 10px;
						font-size: 12px;
						.housePrice{
							margin-left: 20px;
						}
					}
					.placeDay{
						display: flex;
						justify-content: space-between;
						margin-top: 10px;
						font-size: 12px;
					}
				}
			}
			.bottomCentent{
				display: flex;
				margin-left: 10px;
				.tiitleY{
					background-color: #A30014;
					font-size: 12px;
					width: 15px;
					height: 15px;
					line-height: 15px;
					text-align: center;
					color: #FFFFFF;
					margin-right: 5px;
				}
				.brokerage{
					font-size: 12px;
				}
			}
		}
		
	}
</style>
