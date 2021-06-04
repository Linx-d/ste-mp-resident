<template>
	<view class="container">
		<view class="nav">
			<view class="nav-singer">
				<navigator url="/pages/index/task/task-lsit/task-lsit">
					<uni-view class="cu-avatar round lg margin-xs bg-olive">
						<uni-text class="avatar-text">
							<span class="iconfont icon-shangpinliebiao"></span>
						</uni-text>
					</uni-view>
					<view class="text">任务列表</view>
				</navigator>
			</view>
			<view class="nav-singer">
				<navigator url="/">
					<uni-view class="cu-avatar round lg margin-xs bg-green">
						<uni-text class="avatar-text">
							<span class="iconfont icon-ditu"></span>
						</uni-text>
					</uni-view>
					<view class="text">地图找房</view>
				</navigator>
			</view>
			<view class="nav-singer">
				<navigator url="/">
					<uni-view class="cu-avatar round lg margin-xs bg-orange">
						<uni-text class="avatar-text">
							<span class="iconfont icon-yanjing"></span>
						</uni-text>
					</uni-view>
					<view class="text">客房匹配</view>
				</navigator>
			</view>
			<view class="nav-singer">
				<navigator url="/">
					<uni-view class="cu-avatar round lg margin-xs bg-circle">
						<uni-text class="avatar-text">
							<span class="iconfont icon-quanzi"></span>
						</uni-text>
					</uni-view>
					<view class="text">房产圈子</view>
				</navigator>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less">
	.nav{
		width: 100%;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
		box-sizing: border-box;
		.nav-singer {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 10px 20px;
			box-sizing: border-box;

			.bg-olive {
			  background-color: #ffab63;

			  .icon-shangpinliebiao {
				font-size: 35px;
			  }
			}

			.bg-green {
			  background-color: #055661;

			  .icon-ditu {
				font-size: 35px;
			  }
			}

			.bg-orange {
			  background-color: #e95411;

			  .icon-yanjing {
				font-size: 35px;
			  }
			}

			.bg-circle {
			  background-color: #00a651;

			  .icon-quanzi {
				font-size: 35px;
			  }
			}

			.text {
			  font-size: 14px;
			}
		}
	}

</style>
