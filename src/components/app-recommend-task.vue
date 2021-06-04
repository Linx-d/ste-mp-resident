<template>
	<view class="container">
		<view class="padding text-center" v-if="loading">
			<app-loading />
		</view>
		<view v-else>

		
		<view class="cu-card case no-card" v-for="(item,index) in rows" :key="index">
			<view class="cu-item shadow">
				<!-- 上图 -->
				<cover-view class="topImg" @click="goDetail(item)">
					<cover-image class="houseImg" :src="OSS_URI+item.house.cover"></cover-image>
					<cover-view class="expire" >还有{{ (dateDiffInDays(new Date(item.endTime), new Date())) > 0 ? `${dateDiffInDays(new Date(item.endTime), new Date())}` : '0' }}天到期</cover-view>
				</cover-view>
				<!-- 下内容 -->
				<view class="bottomContent">
					<view class="detailContent">
						<view class="houseContent">
							<view class="houseName" >{{ item.house.name }}</view>
							<view class="houseSinger">
								<view class="insideSpace" >套内 {{ item.house.saleArea }}m²</view>
								<view class="housePrice">{{ item.house.salePrice  }}元/平</view>
							</view>
						</view>
						<view class="takeTask" ref="chagetext">
							<button 
								:style="{'color':status === true ? '#ffffff' : '#555555','backgroundColor':status === true ? '#169BD5' :'#d7d7d7'}" 
								class="btn" 
								@click="changeTask">
								{{ status === true ? '接任务' : '任务已接受' }}
							</button>
						</view>
					</view>
					<view class="bottomCentent">
						<view class="tiitleY">佣</view>
						<view class="brokerage">{{ item.ruleCommission }}</view>
					</view>
				</view>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
import TaskService from '@/apis/task';
	export default {
		data() {
			return {
				status : true,
				/* houseDate:[{
					imgUrl:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1599229738,2791448605&fm=26&gp=0.jpg',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'渝北·礼嘉',
					remainingday:'99',
					brokerage:'4%+1万扣10%',
					expire:'30',
					insidespace:'39-91'
				},
				{
					imgUrl:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1599229738,2791448605&fm=26&gp=0.jpg',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'北碚·蔡家',
					remainingday:'99',
					brokerage:'80方以下：25000+2%跳3%扣15%平台费 80方以上...',
					expire:'30'
				},{
					imgUrl:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1599229738,2791448605&fm=26&gp=0.jpg',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'渝北·礼嘉',
					remainingday:'99',
					brokerage:'4%+1万扣10%',
					expire:'30',
					insidespace:'39-91'
				},
				{
					imgUrl:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1599229738,2791448605&fm=26&gp=0.jpg',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'渝北·礼嘉',
					remainingday:'99',
					brokerage:'4%+1万扣10%',
					expire:'30',
					insidespace:'39-91'
				},
				{
					imgUrl:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1599229738,2791448605&fm=26&gp=0.jpg',
					housenmae:'恒大金凯悦府',
					housetype:'住宅',
					housebulid:'102-165',
					houseprice:'19000',
					housepalce:'渝北·礼嘉',
					remainingday:'99',
					brokerage:'4%+1万扣10%',
					expire:'30',
					insidespace:'39-91'
				}], */

				OSS_URI: TaskService.URI_OSS,
				page:0,
				size:10,
				total:0,
				loading:false,
				rows:[],
			};
		},
		mounted(){
			this.init();
		},
		methods:{

			init(){
				this.reload();
			},

			reload(){
				this.load(0);
			},
			loadmore(){
				this.load(this.page +1);
			},
			load(page){
				let params = {
					page:this.page,
					size:this.size,
					sort:'updateTime,desc',
				}
				this.loading = true;
				TaskService.all(params,res=>{
					this.loading = false;
					console.log('app-recommed',res)
					if(res.statusCode === 200 )	{
						let {page,_embedded} = res.data;
						let rows = _embedded.tasks || [];
						let total = page.totalElements || 0;

						this.rows = rows;
						this.page = page;
						this.total = total;

					}
				})

			},
			changeTask(){
				this.status = false
			},
			goDetail(item){
				console.log('task INFO',item );
				uni.navigateTo({
					 url: `/pages/show-houses-detial/show-houses-detial?houseId=${item.house.id}&taskId=${item.id}`
				});
				/* this.$emit('showDetail',value) */

			}
		}
	}
</script>

<style lang="less">
	.container{
		.cu-card{
			.cu-item{
				//上图
				.topImg{
					position: relative;
					.houseImg{
						width: 100%;
						height: 120px;
						
					}
					.expire{
						position: absolute;
						right: 7px;
						bottom: 12px;
						width: 85px;
						height: 25px;
						text-align: center;
						line-height: 25px;
						font-size: 13px;
						background-color: #D7D7D7;
					}
				}
				//下内容
				.bottomContent{
					width: 100%;
					height: 80px;
					//标题
					.detailContent{
						height: 50px;
						display: flex;
						justify-content: space-between;
						margin: 10px 10px 0 10px;
						//字
						.houseContent{
							height: 40px;
							.houseName{
								font-size: 14px;
								font-weight: bold;
							}
							.houseSinger{
								width: 100%;
								display: flex;
								font-size: 14px;
								.housePrice{
									margin: 0 10px;
									
								}
							}
						}
						//按钮
						.takeTask{
							.btn{
								width: 90px;
								height: 30px;
								background-color: #169BD5;
								color: #FFFFFF;
								font-size: 12px;
							}
						}
					}
					//佣金计算
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
		}
	}

</style>
