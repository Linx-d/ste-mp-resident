<template name="components">
	<view>
		<cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">报备</block>
		</cu-custom>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">报备项目</view>
				<picker @change="ReportChange" :value="index" :range="report" data-name="report">
					<view class="picker">
						{{index>-1?report[index]:report[0]}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">客户姓名</view>
				<input placeholder="请输入姓名" name="input"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">性别</view>
				<picker @change="SexChange" :value="sexIndex" :range="sexList" data-name="sexList">
					<view class="picker">
						{{sexIndex>-1?sexList[sexIndex]:sexList[0]}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">客户手机号</view>
				<input placeholder="请输入手机号" name="input"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">日期选择</view>
				<picker mode="date" :value="date" start="2020-11-20" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">时间选择</view>
				<picker mode="time" :value="time" @change="TimeChange">
					<view class="picker">
						{{time}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">需求面积(选填)</view>
				<input placeholder="请输入面积m²"  :value="areaEnd" name="input" />
			</view>
			<view class="cu-form-group">
				<view class="title">需求户型</view>
				<picker @change="TypeChange" :value="typeIndex" :range="typeList" data-name="typeList">
					<view class="picker">
						{{typeIndex>-1?typeList[typeIndex]:typeList[0]}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">备注(选填)</view>
				<input placeholder="请输入备注" name="input"></input>
			</view>
			
			<view class="padding flex flex-wrap justify-center">
				<button class="cu-btn bg-blue">报备</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index: -1,
				report: ['锦馨苑', '融创文旅城', '恒大时代新城', '西里江山', '阳光城未来庭院'],
				typeIndex: -1,
				typeList: ['住宅', '别墅'],
				sexIndex: -1,
				sexList: ['男', '女'],
				time: '12:01',
				date: '2018-12-25'
			};
		},
		methods: {
			ReportChange(e) {
				this.index = e.detail.value
			},
			TypeChange(e) {
				this.typeIndex = e.detail.value
			},
			SexChange(e) {
				this.sexIndex = e.detail.value
			},
			TimeChange(e) {
				this.time = e.detail.value
			},
			DateChange(e) {
				this.date = e.detail.value
			}
		}
	}
</script>

<style scoped>
	.page {
		height: 100Vh;
		width: 100vw;
	}

	.page.show {
		overflow: hidden;
	}
	
/*-------------------- form start -----------------------*/

/*-------------------- form end -----------------------*/
</style>
