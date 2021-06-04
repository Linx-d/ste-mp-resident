<template>
	<view class="container">
		<form class="Form" ref="form" :model="formData" :rules="rules" @submit="submitForm">
			<!-- 真实姓名 -->
			<view class="cu-form-group">
				<view class="title">真实姓名</view>
				<input class="inputContent" v-model="formData.username" placeholder="请输入真实姓名" />
			</view>
			
			<!-- 身份证号 -->
			<view class="cu-form-group">
				<view class="title">身份证号</view>
				<input class="inputContent" v-model="formData.idnumber" type="text" placeholder="请输入身份证号"  />
			</view>
			
			<!-- 出生日期 -->
			<view class="cu-form-group">
				<view class="title">出生日期</view>
				<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{date}}</view>
				</picker>
			</view>
			
			<!-- 籍贯 -->
			<view class="cu-form-group">
				<view class="title">籍贯</view>
				<xfl-select
					class="select"
					:list="nativeplaceList"
					:showItemNum="5" 
					:listShow="false"
					:isCanInput="true"  
					:style_Container="'height: 25px; font-size: 12px;'"
					:placeholder = "'请选择籍贯'"
					:selectHideType="'hideAll'">
				</xfl-select>
			</view>
			
			<!-- 民族 -->
			<view class="cu-form-group">
				<view class="title">民族</view>
				<xfl-select
					class="select"
					:list="nationList"
					:showItemNum="5" 
					:listShow="false"
					:isCanInput="true"  
					:style_Container="'height: 25px; font-size: 12px;'"
					:placeholder = "'请选择民族'"
					:selectHideType="'hideAll'">
				</xfl-select>
			</view>
			
			<!-- 学历 -->
			<view class="cu-form-group">
				<view class="title">学历</view>
				<xfl-select
					class="select"
					:list="educationList"
					:showItemNum="6" 
					:listShow="false"
					:isCanInput="true"  
					:style_Container="'height: 25px; font-size: 12px;'"
					:placeholder = "'请选择学历'"
					:selectHideType="'hideAll'">
				</xfl-select>
			</view>
			
			<!-- 自我介绍 -->
			<view class="selfDesc">
				<view class="title">自我介绍</view>
				<view class="cu-form-group">
					<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaAInput" placeholder="多行文本输入框"></textarea>
				</view>
			</view>
			
			<!-- 标签 -->
			<view class="sel-type">
				<view class="title">投诉类型</view>
				<view class="type">
					<button 
						:class="activeClass == index ? 'active':''" 
						v-for="(item,index) in btnText" 
						:key="index"
						@click="getItem(index)">{{item.text}}</button>
				</view>
			</view>
		</form>	
	</view>
		
</template>

<script>
	export default {
		data() {
			//定义时间数据
			const currentDate = this.getDate({ format: true })
			return {
				//表单数据
				formData:{
					username:'',
					idnumber:""
				},
				//表单验证规则
				rules:{
					//对姓名进行验证
					username:{
						rules:[
							{
							}
						]
					}
				},
				//时间选择相关数据
				date:currentDate,
				//下拉框
				nativeplaceList:[
					'重庆市',
					"上海市",
					"北京市",
					"四川省"
				],
				nationList: [       
					//要展示的数据
					'汉族',
					'回族',
					'土家族',
					'白族',
					'维吾尔族'
				],
				educationList:[
					"高中",
					"中专",
					"专科",
					"本科",
					"硕士",
					"博士"
				],
				//标签
				//按钮
				 btnText:[
					 {text:'热情'},
					 {text:'友善亲切'},
					 {text:'专业证书'},
					 {text:'本科毕业'},
					 {text:'数据分析'},
					 {text:'税费计算'},
					 {text:'熟知法规'},
					 {text:'理解政策'},
				],
				 //按钮默认选择第一个
				 activeClass:0,
			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods:{
			bindTimeChange: function(e) {
				this.time = e.target.value
			},
			//获取时间	
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			//点击改变按钮的状态
			getItem(index){
				this.activeClass = index
			},
		}
	}
</script>

<style lang="less">
.container{
	border: 0;
	.Form{
		.cu-form-group{
			border-top: 0;
			padding: 0;
			.inputContent{
				font-size: 12px;
			}
			.select{
				display: flex;
				justify-content: flex-start;
				margin: 0 34% 0 0;
				width: 150px;
			}
			
		}
		.selfDesc{
			font-size: 30rpx;
			.title{
				margin:10px 0;
			}
		}
		.sel-type{
			font-size: 30rpx;
			.title{
				margin:10px 0;
			}
			.type{
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				padding: 10rpx 5rpx 10rpx 0;
				box-sizing: border-box;
				button{
					margin: 10rpx;
					height: 55rpx;
					line-height: 55rpx;
					font-size: 12px;
					border-radius: 10px;
					display: flex;
					justify-content: flex-start;
					color: #A7A7A7;
					border: 1px solid #F1F1F1;
					&.active{
						background-color: #FF6855;
						color: #FFFFFF;
					}
				}
				
			}	
		}
	}
}
</style>
