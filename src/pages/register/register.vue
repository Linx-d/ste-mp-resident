<template>
	<view class="register">
		<view class="reg-head flex-col align-center justify-center">
			<view class="reg-welcome text-bold flex align-center">
				<image src="@/static/yuanlogo.svg" mode="" style="width: 56rpx;height: 56rpx;"></image>
				<text class="margin-left-sm">屋掌柜驻场端</text>
			</view>
			<view class="reg-title margin-top">买房就找屋掌柜</view>
		</view>
		<!-- <view class="padding">
			<view class="cu-steps">
				<view class="cu-item" :class="index>num?'':'text-blue'" v-for="(item,index) in numList" :key="index">
					<text class="num" :class="index==2?'err':''" :data-index="index + 1"></text> {{item.name}}
				</view>
			</view>
		</view> -->

		<!-- <button v-if="!status" class="reg-btn" @getuserinfo="onUserInfo" open-type="getUserInfo" lang="zh_CN">
			绑定微信
		</button>
		<button v-else class="reg-btn" @getphonenumber="getPhone" open-type="getPhoneNumber" lang="zh_CN">
			绑定手机
		</button> -->
	
		<view class="cu-modal" :class="modalName=='login'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="content">登录</view>
					<view class="action" @click="hideLogin">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<form>
						<view class="cu-form-group">
							<input placeholder="请输入11位手机号" v-model="username" name="input" maxlength="11" />
						</view>
						<view class="cu-form-group margin-top">
							<input placeholder="请输入6位密码" v-model="password" name="input" maxlength="6" />
						</view>
					</form>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @click="hideLogin">取消</button>
						<button class="cu-btn bg-green margin-left" @click="putLogin">确定</button>
					</view>
				</view>
			</view>
		</view>

		
		<!-- <view class="reg-agreement">
			<checkbox style="transform: scale(0.5);"/>我已阅读并同意<navigator url="#" class="agreementContent">《屋掌柜》用户协议</navigator>
		</view> -->
		<view class="reg-bottom">
			<view class="reg-bottom-bg">
			</view>
			<view class="reg-bottom-btnBox">
				<view class="text-center"  v-if="!status">
					<button class="cu-btn reg-btn lg  bg-blue shadow" style="border-radius: 100rpx;" @getuserinfo="onUserInfo" open-type="getUserInfo"
					 lang="zh_CN">绑定微信</button>
				</view>
				<view class="text-center margin-bottom" v-else>
					<button class="cu-btn reg-btn lg  bg-blue shadow" style="border-radius: 100rpx;" @getphonenumber="getPhone" open-type="getPhoneNumber"
					 lang="zh_CN">绑定手机</button>
				</view>
				<view v-if="pass&&status" @click="showLogin" class="text-center">
					<button class="cu-btn reg-btn lg  bg-blue shadow" style="border-radius: 100rpx;">账号密码登录</button>
				</view>
				<!-- <view class="reg-agreement text-gray">
					注册就代表自动同意<navigator url="#" @click="navTo('/pages/register/agreement')" class="text-blue">《屋掌柜》隐私政策</navigator>
				</view>  -->
				<view class="reg-agreement text-gray">小程序仅限企业用户登录使用</view>

			</view>

		</view>
	</view>
</template>

<script>
	// props,components,data,computed,watch,
	// created, mounted,
	// methods
	import Service from '@/apis/service'
	import UserService from "@/apis/user";
	import ResidentService from "@/apis/resident";

	export default {
		data() {
			return {
				status: false,
				phone: null,
				modalName: null,
				username: '',
				password: '',
				username: '',
				numList: [{
					name: '绑定微信'
				}, {
					name: '登录'
				}],
				num: 0,
			};
		},
		computed: {
			me() {
				return this.$store.state.me;
			},
			serial(){
				return this.$store.state.serial
			},
			pass() {
				return this.serial === 'trial' 
			}
		},
		mounted() {
		},
		methods: {
			onUserInfo(e) {
				let { userInfo,iv, encryptedData } = e.detail;
				if (userInfo) {
					console.log(this.me, 'this.me')
					console.log(userInfo, 'userInfo')
					let wxUser = { ...this.me, ...userInfo };	
					let sessionKey = this.me.sessionKey
					let raw = encryptedData
					UserService.decrypteUserInfo(sessionKey, raw, iv,res=>{
							this.saveWxUser(res.data.data);
					})		
				} else {
					this.toast("请统一授权获取微信信息");
				}
			},
			saveWxUser(wxUser) {
				console.log(wxUser, 'wxUser')
				this.showLoading(() => {
					UserService.saveWxUser(wxUser, (res) => {
						this.hideLoading();
						if (res.data.success) {
							this.num= this.num == this.numList.length - 1 ? 0 : this.num + 1
							this.status = true
							this.$store.commit("setMe", wxUser);
							this.toast('成功绑定微信')
						} else {
							this.toast('绑定失败')
						}
					});
				});
			},
			showLogin(){
				this.modalName = 'login'
			},
			hideLogin(){
				this.modalName = null
			},
			putLogin(){
				let { username, password } = this
				if(username ==='19922297443' && password === '297443') {
					this.validatePhone(username)
				} else {
					this.toast('请输入正确的账号密码')
				}
			},
			getPhone(e) {
				let {
					encryptedData,
					iv
				} = e.detail;
				if(encryptedData) {
					let sessionKey = this.me.sessionKey;
								
					if (sessionKey) {
						this.decryptPhone(sessionKey, encryptedData, iv);
					} else {
						this.showLoading(() => {
							this.wexinLogin((res) => {
								this.hideLoading();
								if (res) {
									sessionKey = me.sessionKey;
									this.decryptPhone(sessionKey, encryptedData, iv);
								} else {
									this.toast("获取失败", "error");
								}
							});
						});
					}
				}else {
					this.toast("请统一授权获取手机号");
				}
				
			},
			getTokenByOpenId(openid, callback) {
				UserService.getTokenByOpenId(openid, (res) => {
					if (res.data && res.data.data) {
						let {
							token
						} = res.data.data;

						uni.setStorageSync("token" + Service.KEY_SUFFIX, token);
						this.$store.commit('setToken', token)

						callback(token);
					} else {
						callback(false);
					}
				});
			},
			getTokenByPassword(account, callback) {
				UserService.getTokenByPassword(account, (res) => {
					if (res.data && res.data.data) {
						let {
							token
						} = res.data.data;

						uni.setStorageSync("token" + Service.KEY_SUFFIX, token);
						this.$store.commit('setToken', token)

						callback(token);
					} else {
						callback(false);
					}
				});
			},
			fetchUserInfo(token) {
				this.$store.commit('setToken', token)
				Service.token = token;

				UserService.getResidentInfo((res) => {
					console.log(res, 'getResidentInfo res')
					if (res.data.success) {
						let user = res.data.data;
						this.$store.commit("setUser", user);
						// to do---
						let {
							id
						} = user,
						params = {
							userId: id
						};
						ResidentService.houseQuery(params, res2 => {
							if (res2.statusCode === 200) {
								let houses = res2.data.data.content || []
								console.log(res2, 'house res')
								if(houses.length===0) {
									this.redirectTo('/pages/root/300')
								}else {
									uni.setStorageSync('houses' + Service.KEY_SUFFIX, houses)
									this.related(houses)
								}
								
							} else {

								this.redirectTo("/pages/register/register");
								this.toast('获取楼盘信息失败，请重新登录');
							}
						})
						// this.redirectTo("/pages/index/index");
						// this.toast('登录成功', 'success');
					} else {
						this.getTokenByOpenId(this.$store.state.openid, (token) => {
							console.log(token, 'new token')
							this.$store.commit('setToken', token)
							uni.setStorageSync("token" + Service.KEY_SUFFIX, token);
							if (token) {
								// this.fetchUserInfo(token);
							} else {
								this.redirectTo("/pages/register/register");
							}
						});
					}
				});
			},
			decryptPhone(key, raw, iv) {
				this.showLoading(() => {
					UserService.decryptPhone(key, raw, iv, res => {
						this.hideLogin()
						if (res.data.success) {
							let {
								phoneNumber
							} = res.data.data;
							this.phone = phoneNumber;
							console.log(this.phone)
							this.validatePhone(this.phone)
						} else {
							this.toast('获取失败', 'error');
						}
					})
				})
			},
			validatePhone(phone){
				let requestParameters = {
					phone
				}
				ResidentService.findByPhone(requestParameters, res => {
					// 400 请先添加成为驻场人员
					let code = res.statusCode
					if (code === 200) {
						let openid = uni.getStorageSync('openid' + Service.KEY_SUFFIX)
						// 根据openid获取token
						const params = {
							id: res.data.id,
							method: 'put',
							header: {
								'Content-Type': 'text/uri-list'
							},
							data: `${Service.URI_API}/rest/wxUsers/${openid}`
						}
						if(this.modalName!=='login') {
							ResidentService.residentWx(params, res => {
								console.log('注册系统用户', res)
								this.getTokenByOpenId(this.$store.state.openid, (token) => {
									this.$store.commit('setToken', token)
									if (token) {
										this.fetchUserInfo(token);
									} else {
										this.redirectTo("/pages/register/register");
									}
								});
							})
						}else {
							ResidentService.residentWx(params, res => {
								console.log('注册系统用户', res)
								// 根据账号密码获取token
								const account = {
									username: this.username,
									password: this.password
								}
								this.getTokenByPassword(account, (token) => {
									this.$store.commit('setToken', token)
									if (token) {
										this.fetchUserInfo(token);
									} else {
										this.redirectTo("/pages/register/register");
									}
								});
							})
						}


					} else if(code === 400) {
						// this.toast('请联系管理员，将您添加为驻场人员，并成为楼盘下的驻场人员', 'error');
						this.redirectTo('/pages/root/300')
					} else {
						this.toast('获取失败', 'error');
					}
				})
			}
		},
	};
</script>

<style lang="less" scoped>
page{
	height:100%;

	.register {
		//字体颜色
		text-align: center;
		height: 100%;
		box-sizing: border-box;


		.reg-head{
			width: 478rpx;
			height: 514rpx;
			background-image: url(@/static/common/regisTop.png);
			background-size: 100% 100%;
		}
		//欢迎使用
		.reg-welcome {
			font-size: 48rpx;
			margin-top: 180rpx;
			
		}

		//标题
		.reg-title {
			font-size: 24upx;
			margin-bottom: 20%;
			color: #999999;
			letter-spacing:10rpx;
		}

		.reg-text {
			width: 100%;
		}
		
		
		.reg-bottom{
			width: 100%;
			height: 560rpx;
			margin-top: 50rpx;
			position: absolute;
			bottom:0;
		}
		.reg-bottom-bg{
			margin-left: auto;
			width: 609rpx;
			height: 100%;
			background-image: url(@/static/common/regisBtm.png);
			background-size: 100% 100%;
		}
		.reg-bottom-btnBox{
			position: absolute;
			top: 100rpx;
			width: 100%;
		}
		.reg-text-border{
			letter-spacing:4rpx;
			width: 85%;
			height: 160rpx;
			color: #666666;
			image{
				width: 80rpx;
				height: 80rpx;
				margin:  0 10rpx;
			}
		}

		//协议
		.reg-agreement {
			font-size: 14px;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			margin-top: 60rpx;
		}

		.reg-btn {
			width: 85%;
		}
	}
	}
</style>
