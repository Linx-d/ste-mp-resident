import Vue from 'vue';
import utils from './utils.js'

import UserService from '@/apis/user.js'
import TaskService from "@/apis/task"
import Service from "@/apis/service.js"
import Oss from "@/apis/oss.js"
import { SUBSCRIBE_TPS, THUMBNAIL, THUMBNAIL_MAX, THUMBNAIL_VIDEO, THUMBNAIL_ORIGIN } from '../common/const'

const methods = Object.assign(utils, {
	/* 跳转 */
	navTo(url, options) {
		let params = Object.assign({}, options, {
			url,
			fail: (e) => {
				console.log('navigate to ', url, e);
			}
		})
		console.log('navTo', params);
		uni.navigateTo(params)
	},
	navBack() {
		uni.navigateBack({
			delta: 1
		});
	},
	to300(params = {}) {
		const url = this.requestFormat('/pages/root/300', params)
		this.navTo(url)
	},
	requestFormat(url, params = null) {
		if (params) {
			url += '?' + Object.keys(params).map(item => `${item}=${params[item]}`).join('&')
		}
		return url
	},
	redirectTo(url, options) {
		let params = Object.assign({}, options, {
			url,
			fail: e => {
				console.log('redirect to fail ', url, e);
			}
		})
		console.log('redirectTo', params);

		uni.redirectTo(params)
	},
	relaunch(url) {
		uni.reLaunch({
			url,
			fail: e => {
				console.log('redirect to fail ', url, e);
			}
		})
	},
	/* 消息弹窗 */
	toast(msg, icon) {
		icon = icon || 'none'
		uni.showToast({
			icon,
			title: msg,
			duration: 1000,
		});
	},
	/* 拨打电话 */
	callPhone(val) {
		uni.makePhoneCall({
			phoneNumber: val
		});
	},
	/* 复制到剪贴板 */
	copy(val) {
		let that = this
		uni.setClipboardData({
			data: val,
			success: function () {
				// that.toast('复制成功')
				console.log(val);
			}
		});
	},
	/* 时间格式化 2020-11-20 9:00:00 */
	format(val) {
		let time = {
			year: new Date(val).getFullYear(),
			month: new Date(val).getMonth() + 1,
			date: new Date(val).getDate(),
			hours: new Date(val).getHours(),
			minutes: new Date(val).getMinutes(),
			secends: new Date(val).getSeconds(),
		}
		for (let key in time) {
			if (key == 'year') {
				continue
			} else {
				if (parseInt(time[key]) < 10) {
					time[key] = `0${time[key]}`
				}
			}
		}
		return `${time.year}-${time.month}-${time.date} ${time.hours}:${time.minutes}:${time.secends}`
	},
	/* 上一页信息 */
	prevPage() {
		return getCurrentPages()[getCurrentPages().length - 2]
	},
	/* 获取任务 楼盘 信息 */
	related(houses,redirect,enter = true) {
		redirect ? redirect = redirect : redirect ='/pages/index/index'
		let myTasks = [];
		houses.forEach((h, index) => {
			let params = {
				page: 0,
				size: 100,
				current: true,
				status: 1,
				houseId: h.id,
			};
			TaskService.query(params, (res) => {
				console.log(res, 'resmyTasksmyTasksmyTasks');
				let { statusCode } = res;
				if (statusCode === 200) {
					let { data } = res.data;
					data.content.forEach((m, i) => {
						myTasks.push(m);
						console.log(i, "i----------------");
						if (i === data.content.length - 1) {
							this.hideLoading()
							uni.setStorageSync('tasks' + Service.KEY_SUFFIX, myTasks)
							if (uni.getStorageSync('task' + Service.KEY_SUFFIX) === undefined || uni.getStorageSync('task' + Service.KEY_SUFFIX) === null || uni.getStorageSync('task' + Service.KEY_SUFFIX) === '') {
								if (myTasks.length !== 0) {
									uni.setStorageSync('task' + Service.KEY_SUFFIX, myTasks[0])
								}
							} else {
								if (myTasks.length !== 0) {
									let taskIds = myTasks.map(m => {
										return m.id
									})
									let nowIdArr = [uni.getStorageSync('task' + Service.KEY_SUFFIX).id]
									taskIds.filter(v => {
										if (nowIdArr.includes(v)) {
											console.log('任务列表有此任务');
											// uni.setStorageSync('task' + Service.KEY_SUFFIX, myTasks[0])
										}
									})
								}
							}
							if (
								uni.getStorageSync("house" + Service.KEY_SUFFIX) ===
								undefined ||
								uni.getStorageSync("house" + Service.KEY_SUFFIX) === null ||
								uni.getStorageSync("house" + Service.KEY_SUFFIX) === ''
							) {
								if (houses.length !== 0) {
									uni.setStorageSync('house' + Service.KEY_SUFFIX, houses[0])
								}
							}

						}
					});
					if (index === houses.length - 1) {
						if (myTasks.length === 0) this.to300({ text: '所在楼盘无有效任务' })
						if (enter) {
							this.redirectTo(redirect);
						} else {
							console.log('switch project');
						}
						console.log(myTasks, 'myTasksmyTasksmyTasksmyTasks');
					}
				} else {
					this.toast("获取任务列表失败");
				}
			});
		});
	},
	/* 微信登陆 */
	weixinLogin(callback) {
		uni.login({
			provider: "weixin",
			success: (res) => {
				let {
					code
				} = res;
				if (code) {
					console.log(code)
					UserService.getWxInfo(code, res2 => {
						if (res2.data && res2.data.data) {
							let { wx, user, token } = res2.data.data;
							this.$store.commit("setMe", wx);
							if (user) {
								this.$store.commit("setUser", user);
								this.$store.commit("setToken", token.token);
								callback(user);
							} else {
								callback(false);
							}
						} else {
							callback && callback(false);
						}
					});
				} else {
					callback && callback(false);
				}
			},
			fail(e) {
				console.log("weixin login fail", e);
				callback && callback(false);
			}
		});
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
	getAddrName(addr) {
		let rs = addr.city === "市辖区"
			? addr.province
			: addr.city

		return rs || '';
	},
	// showLoading(msg, callback) {
	// 	uni.showLoading({
	// 		title: msg,
	// 		success: () => {
	// 			callback && callback();
	// 		}
	// 	})
	// },
	hideLoading() {
		uni.hideLoading();
	},

	/**
	 * 上传附件
	 * fileArr 文件数组
	 */
	upAli(fileArr, name) {
		Oss.sign(res => {
			console.log(res, 'oss');
			if (res.data.success) {
				return fileArr.map(val => {
					let params = res.data.data
					let filename = val.slice(val.lastIndexOf('/'))
					let key =
						`resident/${name}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}/${filename}`
					params.file = val
					params.key = key
					Oss.up(params, res1 => {
						console.log(res1, 'up oss');
						if (res1.success) {
							return key.slice(1)
						}
					})
				})
			} else {
				uni.showToast({
					icon: 'none',
					title: '获取签名失败',
					duration: 1500,
				});
			}
		})
	},
	// 预览图片
	previewImage(urls, current) {
		uni.previewImage({
			current,
			urls,
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
				success: function (data) {
					//console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				},
				fail: function (err) {
					console.log(err.errMsg);
				}
			}
		});
	},
	/**
	 * 表单输入
	 * @param {*} e 
	 */
	iptChange(e) {
		let name = e.currentTarget.dataset.name;
		let value = e.detail.value;
		this.$set(this, name, value);
	},
	/**
	 * 获取配置信息
	 * @param {*} scope 
	 * @param {*} callback 
	 */
	checkSetting(scope, callback) {
		uni.getSetting({
			success: (res) => {
				console.log("setting", res);
				let auth = res.authSetting;
				if (auth[scope]) {
					callback(true)
				} else {
					console.log("get setting ", scope, false);
					callback(false)
				}
			},
			fail: (e) => {
				console.log("get setting fail", e);
				callback(false)
			},
		});
	},
	/**
	 * 尝试获取授权的用户信息
	 * @param {*} callback 
	 */
	tryGetUserInfo(callback) {
		this.fetchUserBySessionKey(me => {
			if (me) {
				callback(me)
			} else {
				let scope = 'scope.userInfo'
				this.checkSetting(scope, has => {
					if (has) {
						uni.authorize({
							scope,
							success: () => {
								this.loginToDecrypt(callback)
							},
							fail(e) {
								console.log("auth user info fail ", e);
								callback(false)
							}
						});
					} else {
						callback(false)
					}
				})

			}
		})
	},
	fetchUserBySessionKey(callback) {
		let key = uni.getStorageSync("sessionKey" + Service.KEY_SUFFIX);
		if (key) {
			UserService.geWxUserBySessionKey(key, res2 => {
				if (res2.success && res2.data) {
					let me = res2.data;
					this.$store.commit("setMe", me);
					callback(me);
				} else {
					callback(false);
				}
			})
		} else {
			callback(false);
		}
	},
	getUserInfo(callback) {
		uni.getUserInfo({
			provider: "weixin",
			lang: "zh_CN",
			success: (res) => {
				console.log(res, 'getUserInfoooooooooooooooooooooooo')
				callback(res)
			},
			fail: (e) => {
				console.log("get user info", e);
				callback(false)
			}
		});
	},
	// 执行登录，然后再解密用户
	loginToDecrypt(callback) {
		this.weixinLogin(res2 => {
			if (res2) {
				let {
					sessionKey
				} = res2;
				console.log(`login to decrypt key : ${sessionKey}`)
				this.getUserInfo(e => {
					if (e) {
						let {
							encryptedData,
							iv
						} = e;
						this.decryptUserInfo(sessionKey, encryptedData, iv, callback);
					} else {
						callback(false);
					}
				})
			} else {
				callback(false)
			}
		})
	},
	/**
	 * 后台解析加密的微信用户
	 * @param {*} key 
	 * @param {*} raw 
	 * @param {*} iv 
	 * @param {*} callback 
	 */
	decryptUserInfo(key, raw, iv, callback) {
		UserService.decrypteUserInfo(key, raw, iv, res3 => {
			if (res3.success) {
				let me = res3.data;
				this.$store.commit("setMe", me);
				callback(me);
			} else {
				callback(false)
			}
		});
	},
	/**
	 * 根据OPEN ID 获取绑定的用户
	 * @param {*} openid 
	 * @param {*} callback 
	 */
	getUserByOpenid(openid, callback) {
		UserService.getUserByOpenid(openid, res => {
			if (res.data) {
				let user = res.data;
				this.$store.commit('setUser', user);
				callback(user)
			} else {
				callback(false)
			}
		})
	},
	/**
	 * 根据OPEN ID 获取绑定的用户
	 * @param {*} id 
	 * @param {*} callback 
	 */
	getHousestByUserId(id, callback) {

	},
	confirm(content, callback) {
		uni.showModal({
			title: '请确认',
			content,
			success: function (res) {
				if (res.confirm) {
					callback(true)
				} else if (res.cancel) {
					callback(false);
				}
			}
		});
	},
	showLoading(callback) {
		uni.showLoading({
			title: '请稍后...',
			mask: true,
			success: () => {
				callback()
			},
		});
	},
	hideLoading() {
		uni.hideLoading();
	},
	// 有效期 startTime 报备开始时间
	/**
	 * 
	 * @param {reportValidType} type 
	 * @param {reportStartTime} startTime 
	 */
	pastTime(type, startTime) {
		//reportValidType
		let now = new Date().getHours()

		if (type === 0) {
			let nowDay = new Date().getDate()
			let endTime = new Date(startTime).getDate() + 1
			console.log(endTime, '0000');
			return this.orderTime(endTime)
		} else {
			let start = new Date(startTime)
			let endTime = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate() + 1} ${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
			console.log(endTime, '11111');
			return this.orderTime(endTime)
		}
	},
	// 倒计时
	orderTime(endTime) {
		let timer = new Date(endTime)
		let endYear = timer.getFullYear()
			, endtMonth = timer.getMonth()
			, endDate = timer.getDate()
			, endHours = timer.getHours()
			, endMinutes = timer.getMinutes()
			, endSeconds = timer.getSeconds()
		return leftTimer(endYear, endtMonth, endDate, endHours, endMinutes, endSeconds)
		function leftTimer(year, month, day, hour, minute, second) {
			var leftTime = (new Date(year, month - 1, day, hour, minute, second)) - (new Date()); //计算剩余的毫秒数 
			var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
			var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时 
			var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
			var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
			days = checkTime(days);
			hours = checkTime(hours);
			minutes = checkTime(minutes);
			seconds = checkTime(seconds);
			// setInterval(() => {
			// 	leftTimer(endYear, endtMonth, endDate, endHours, endMinutes, endSeconds)
			// }, 60000);
			console.log(hours, minutes, seconds, 'hours');
			if (days > 0) {
				return `剩${days}天过期`
			} else if (hours > 0) {
				return `剩${hours}时过期`
			}
			else if (minutes > 0) {
				return `剩${minutes}分过期`
			}
			else if (seconds > 0) {
				return `剩${seconds}秒过期`
			} else {
				return '已过期'
			}
		}
		function checkTime(i) { //将0-9的数字前面加上0，例1变为01 
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		}
	},
	// 格式化 price
	formatPrice(price) {
		let arr = price
			.toString()
			.split("")
			.reverse();
		let count = 0;
		if (arr.length % 3 === 0) {
			count = parseInt(arr.length / 3) - 1;
		} else {
			count = parseInt(arr.length / 3);
		}
		let i = 0;
		let num = 3;
		for (i; i < count; i++) {
			arr.splice(num * (i + 1) + i, 0, ",");
		}
		return arr.reverse().join("");
	},
	
	
	formattingDate(time, format = 'YYYY-MM-DD hh:mm:ss') {
		let date = new Date(time)
		let timeObj = {
			year: date.getFullYear(),
			month: parseInt(date.getMonth()) + 1,
			date: date.getDate(),
			hours: date.getHours(),
			minutes: date.getMinutes(),
			seconds: date.getSeconds(),
		}
		let key = ''
		for (key in timeObj) {
			if (key !== 'year') {
				timeObj[key] = parseInt(timeObj[key]) > 9 ? `${timeObj[key]}` : `0${timeObj[key]}`
			}
		}
		console.log(format);
		switch (format) {
			case 'hh:mm:ss':
				return `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`
			case 'YYYY-MM-DD':
				return `${timeObj.year}-${timeObj.month}-${timeObj.date}`
			case 'hh:mm':
				return `${timeObj.hours}:${timeObj.minutes}`
			default:
				return `${timeObj.year}-${parseInt(timeObj.month)}-${timeObj.date} ${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`
		}
	},

	//版本更新
	checkUpdate(callback) {
		const updateManager = uni.getUpdateManager();

		updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			console.log("update check", res.hasUpdate);
			if (!res.hasUpdate) {
				callback && callback();
			}
		});

		updateManager.onUpdateReady(function (res) {
			console.log("update ready", res);
			this.toast("新版本已经准备好,马上更新");
			updateManager.applyUpdate();
		});

		updateManager.onUpdateFailed(function (res) {
			// 新的版本下载失败
			console.log("update fail", res);
			callback && callback();
		});
	},

		// 得到今日日期 getDate(dates)
		getDate() {
			let dd = new Date();
			dd.setDate(dd.getDate());
			let y = dd.getFullYear();
			let m = dd.getMonth() + 1;
			let d = dd.getDate();
			m = m < 10 ? "0" + m: m;
			d = d < 10 ? "0" + d: d;
			let day = y + "-" + m + "-" + d;
			return day;
		},
		// 得到本周时间 getMonday("s",1)
		// type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，
		// dates为数字类型，不传或0代表本周，-1代表上周，1代表下周
		getMonday(type, dates) {
			let now = new Date();
			let nowTime = now.getTime();
			let day = now.getDay();
			let longTime = 24 * 60 * 60 * 1000;
			let n = longTime * 7 * (dates || 0);
			if (type == "s") {
			var dd = nowTime - (day - 1) * longTime + n;
			};
			if (type == "e") {
				var dd = nowTime + (7 - day) * longTime + n;
			};
			dd = new Date(dd);
			let y = dd.getFullYear();
			let m = dd.getMonth() + 1;
			let d = dd.getDate();
			m = m < 10 ? "0" + m: m;
			d = d < 10 ? "0" + d: d;
			day = y + "-" + m + "-" + d;
			return day;
		},
		// 得到本月时间  getMonth("s",1)
		//type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，
		//months为数字类型，不传或0代表本月，-1代表上月，1代表下月

		getMonth(type, months) {
			var d = new Date();
			var year = d.getFullYear();
			var month = d.getMonth() + 1;
			if (Math.abs(months) > 12) {
				months = months % 12;
			};
			if (months != 0) {
				if (month + months > 12) {
					year++;
					month = (month + months) % 12;
				} else if (month + months < 1) {
					year--;
					month = 12 + month + months;
				} else {
					month = month + months;
				};
			};
			month = month < 10 ? "0" + month: month;
			var date = d.getDate();
			var firstday = year + "-" + month + "-" + "01";
			var lastday = "";
			if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
				lastday = year + "-" + month + "-" + 31;
			} else if (month == "02") {
				if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
					lastday = year + "-" + month + "-" + 29;
				} else {
					lastday = year + "-" + month + "-" + 28;
				};
			} else {
				lastday = year + "-" + month + "-" + 30;
			};
			var day = "";
			if (type == "s") {
				day = firstday;
			} else {
				day = lastday;
			};
			return day;
		},
		
		// 得到今年的开始结束日期  getYear("s",0)
		//type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，
		//dates为数字类型，不传或0代表今年，-1代表去年，1代表明年
		getYear(type, dates) {
			var dd = new Date();
			var n = dates || 0;
			var year = dd.getFullYear() + Number(n);
			if (type == "s") {
				var day = year + "-01-01";
			};
			if (type == "e") {
				var day = year + "-12-31";
			};
			if (!type) {
				var day = year + "-01-01/" + year + "-12-31";
			};
			return day;
		},
		// 得到本季度的开始、结束日期 
		// getQuarterMonth("s",1)
		getQuarterMonth(type){  
			var now = new Date(); 
			var nowMonth = now.getMonth();
			var year = now.getFullYear();
			var quarterStartMonth = 1;     
			if(nowMonth<3){     
			   quarterStartMonth = 1;     
			}     
			if(2<nowMonth && nowMonth<6){     
			   quarterStartMonth = 4;     
			}     
			if(5<nowMonth && nowMonth<9){     
			   quarterStartMonth = 7;     
			}     
			if(nowMonth>8){     
			   quarterStartMonth = 10;     
			} 
			if (type == "s") {
				var day = year+"-"+quarterStartMonth+"-01"; 
			};//1-3 4-6 7-9 10-12
			if (type == "e") {
			if(quarterStartMonth==1){
			var day = year+"-"+(quarterStartMonth+2)+"-31";
			}
			if(quarterStartMonth==10){
			var day = year+"-"+(quarterStartMonth+2)+"-31";
			}
			if(quarterStartMonth==4){
			var day = year+"-"+(quarterStartMonth+2)+"-30";
			}
			if(quarterStartMonth==7){
			var day = year+"-"+(quarterStartMonth+2)+"-30";
			}
			};
			return day;     
		}		
})

Vue.mixin({
	data() {
		return {
			_thumb: THUMBNAIL,
			_thumb_max: THUMBNAIL_MAX,
			_origin: THUMBNAIL_ORIGIN,
			_snapshoot: THUMBNAIL_VIDEO,
			dateStart: '1967-01-01',
			dateEnd: methods.formatDate(),
			VUE_APP_MAP_TILELAYER_URL: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}&mapType=normal', // GMap 服务器地址&配置
			// input
			scrollHeight: '600px',
			limitLength: 30,
			areaLimitLength: 1000,
			areaLimitRows: 10,
			areaLimitText: `长度不能大于1000`,
			defaultCityValue: ['重庆市', '市辖区', '北碚区', '朝阳街道'],
			formLayout: {
					labelCol: {
							xs: { span: 24 },
							sm: { span: 7 }
					},
					wrapperCol: {
							xs: { span: 24 },
							sm: { span: 13 }
					}
			},
			cityField: { label: 'name', value: 'name', children: 'children' },
			// drawer
			drawerWidth: '600px',
			// modal
			modalWidth: '640px',
			// s-table
			defaultScroll: { x: 1500, y: 600 },
			maxPagination: {
					page: 0,
					size: 999,
					sort: 'updateTime,desc'
			},
			defaultPagination: {
					page: 0,
					size: 10,
					sort: 'updateTime,desc'
			},
			defaultCityOptions: [
					{
							name: '重庆市',
							children: [
									{
											name: '市辖区',
											children: [
													{
															name: '北碚区',
															children: [
																	{
																			name: '朝阳街道'
																	}
															]
													}
											]
									}
							]
					}
			],
			asyncTime: 1000 // 异步请求时间
		}
	},
	filters: {
			textFilter(type) {
					const validator = type !== undefined && type !== 'null' && type
					if (validator) {
							return type
					} else {
							return '--'
					}
			},
			numberFilter(type) {
					if (type) {
							return `${priceFormat(type)}`
					} else {
							if (type === 0) {
									return type
							} else {
									return '--'
							}
					}
			},
			phoneFilter(type) {
					const validator = type !== undefined && type !== 'null' && type
					if (validator) {
							return `${phoneFormat(type)}`
					} else {
							return '--'
					}
			},
			priceFilter(type) {
					const validator = type !== undefined && type !== 'null' && type
					if (validator) {
							return `￥${priceFormat(type)}`
					} else {
							if (type === 0) {
									return `￥${type}`
							} else {
									return '--'
							}
					}
			},
			areaFilter(type) {
					if (type) {
							return `${priceFormat(type)} ㎡`
					} else {
							if (type === 0) {
									return `${type} ㎡`
							} else {
									return '--'
							}
					}
			},
			setFilter(type) {
					if (type) {
							return `${priceFormat(type)} 套`
					} else {
							if (type === 0) {
									return `${type} 套`
							} else {
									return '--'
							}
					}
			}
	},
	methods,
});
