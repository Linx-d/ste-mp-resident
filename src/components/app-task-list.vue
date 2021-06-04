<template>
	<view class="container">
		<view class="singerHouse" v-for="(item) in houseDate" :key="item">
			<!-- 上 -->
			<view class="topContent" >
				<!-- 左 : 图片-->
				<cover-view>
					<cover-image class="houseImg" :src="item.imgUrl" @click="navTo('/pages/show-houses-detial/show-houses-detial')"></cover-image>
				</cover-view>
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
			<!-- 按钮 -->
			<view class="takeTask" ref="chagetext">
				<button 
					:style="{'color':status === true ? '#ffffff' : '#555555','backgroundColor':status === true ? '#169BD5' :'#d7d7d7'}" 
					class="btn" 
					@click="changeTask">
					{{ status === true ? '接任务' : '任务已接受' }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status : true,
				houseDate:[{
					imgUrl:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2237869168,688755325&fm=26&gp=0.jpg',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'渝北·礼嘉',
					remainingday:'99',
					brokerage:'4%+1万扣10%'
				},
				{
					imgUrl:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2237869168,688755325&fm=26&gp=0.jpg',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'北碚·蔡家',
					remainingday:'99',
					brokerage:'80方以下：25000+2%跳3%扣15%平台费 80方以上...'
				},
				{
					imgUrl:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2237869168,688755325&fm=26&gp=0.jpg',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'北碚·蔡家',
					remainingday:'99',
					brokerage:'80方以下：25000+2%跳3%扣15%平台费 80方以上...'
				},{
					imgUrl:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2237869168,688755325&fm=26&gp=0.jpg',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'北碚·蔡家',
					remainingday:'99',
					brokerage:'80方以下：25000+2%跳3%扣15%平台费 80方以上...'
				},{
					imgUrl:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2237869168,688755325&fm=26&gp=0.jpg',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'北碚·蔡家',
					remainingday:'99',
					brokerage:'80方以下：25000+2%跳3%扣15%平台费 80方以上...'
				}]
			};
		},
		methods:{
			changeTask(){
				this.status = false
			},
		}
	}
	
</script>

<style lang="less">
	.container{
		.singerHouse{
			padding-bottom: 15px;
			border-bottom: 1px solid #D7D7D7;
			box-sizing: border-box;
			.topContent{
				display: flex;
				.houseImg{
					width: 120px;
					height: 80px;
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
			.takeTask{
				.btn{
					width: 100px;
					height: 25px;
					line-height: 25px;
					font-size: 14px;
					color: #FFFFFF;
					background-color: #169BD5;
					margin-right: 20px;
					margin-top: 10px;
					&.active{
						background-color: #d7d7d7;
						color: #555555;
					}
				}
			}
		}
		
	}
</style>
