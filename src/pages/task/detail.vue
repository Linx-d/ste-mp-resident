<template>
	<view class="container" id="container">
		<cu-custom bg-color="bg-white" :is-back="true">
			<block slot="content" class="text-bold">任务详情</block>
		</cu-custom>
		<app-loading v-if="houseLoading" />
		<view v-if="house">
			<view class="posr">
				<swiper class="screen-swiper">
					<template v-if="media.length > 0">
						<swiper-item v-for="m in media" :key="m.id">
							<video play-btn-position="center" loop :poster="uri + m.path + _snapshoot" :src="uri + m.path" controls></video>
						</swiper-item>
					</template>
					<swiper-item @click="toAlbum" v-for="img in imgList" :key="img.id">
						<image
						    mode="aspectFill"
						    :src="uri + img.path + _thumb_max "
						/>
					</swiper-item>
				</swiper>
				<view class="thumb-label round flex-row align-center" @click="toAlbum">
					<text class="cuIcon-pic margin-right-sm"></text>
					<view>{{ media.length + imgList.length }} 张</view>
				</view>
			</view>
			<!-- 楼盘信息 -->
			<view class="flex-col bg-white padding">
				<view class="flex justify-between">
					<view class="text-bold text-lg">{{ house.name }}</view>
					<view class="text-gray" v-if="task">{{ task.total || "-" }} 套在售</view>
				</view>
				<view v-if="house.label" class="margin-top-sm">
					<view class="cu-tag bg-green radius margin-top-sm" v-if="task.housePropertyType">{{ task.housePropertyType }}</view>
					<view class="cu-tag radius margin-top-sm bg-blue light" v-for="(value,index) in house.labels"
					 :key="index">{{ value }}</view>
				</view>
				<view class="text-gray margin-top" v-if="task">
					有效期：
					{{ task.startTime ? task.startTime.split(' ')[0] : '-' }} 至
					{{ task.endTime ? task.endTime.split(' ')[0] : '-' }}
				</view>
			</view>
		</view>

		<!-- 项目掌柜 -->
		<view class="padding margin-top margin-bottom bg-white flex-row align-center">
			<image src="@/static/img/tetail1.png" class="detail-wh margin-right"></image>
			<view class="flex-1">项目掌柜</view>
			<view class="flex-1 text-right">
				<button class="cu-btn line-blue" :disabled="!task.houseManagerPhone" @click="callPhone(task.houseManagerPhone)">拨打电话</button>
			</view>
		</view>
		<!-- tabFixed -->
		<!-- tab -->
		<scroll-view id="mytabs" :class="tabIsShou?'tabFixed':''" :style="{'top':Custom+'px'}" scroll-x class="bg-white nav "
		 scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect($event,item.id)"
			 :data-id="index">
				{{item.name}}
			</view>
		</scroll-view>
		<view v-if="tabIsShou" :style="{'height': navHeight+'px'}">
		</view>
		<!-- 佣金方案 -->
		<view class="padding bg-white" id="yongjin">
			<view class="text-bold text-lg">佣金方案</view>
			<view class="margin-top text-gray">
				<app-rich-text :text="task.ruleCommission" />
			</view>
		</view>

		<!-- 驻场人员 -->
		<!-- <app-residents-card :items="residents" /> -->
		<!-- 项目信息 -->
		<view class="padding margin-top bg-white" id="xiangmu" v-if="house">
			<view class=" text-lg flex-row">
				<view class="flex-1 flex align-center text-bold">
					<image src="@/static/img/tetail2.png" class="detail-wh margin-right"></image>
					<text>项目信息</text>
				</view>
				<view class=" text-gray flex align-center" @click="more('project')">
					<view class="text-sm">更多信息</view>
					<view class="cuIcon-right  margin-left-sm"></view>
				</view>
			</view>
			<view class="margin-top text-gray">
				<view class="flex-row">
					<view class="flex-1 ">项目单价：<text class="text-red">{{ house.salePrice || '-' }}元/m²</text></view>
					<view class="flex-1">项目类型：{{ task.housePropertyType || '-' }}</view>
				</view>

				<view class="flex-row">
					<view class="flex-1">开盘时间：{{ house.openTime ? house.openTime.split(' ')[0] : "-" }}</view>
					<view class="flex-1">户型：{{roomAll}} 居</view>
					<!-- <view class="flex-1">套内：{{roomArea }}m²</view> -->
				</view>
			</view>
			<!-- <view class="flex-row align-center padding-top " @click="showOnMap"> -->
			<view class="flex-row align-center padding-top">
				<image src="@/static/img/tetail3.png" class="detail-wh margin-right"></image>
				<view class="flex-1">{{ getAddrName(house) }} {{house.district||'-'}} {{ house.address||'-' }}</view>
				<!-- <view class="cuIcon-right text-bold  margin-left-sm"></view> -->
			</view>
		</view>
		<!-- 特色卖点 -->
		<view class="margin-top padding bg-white" id="tese">
			<view class="text-bold text-lg flex-1 flex align-center">
				<image src="@/static/img/tetail4.png" class="detail-wh margin-right"></image>
				<text>特色卖点</text>
			</view>
			<view class="margin-top text-gray">
				<app-rich-text :text="task.feature" />
			</view>
		</view>
		<view class="margin-top padding bg-white" v-if="task" id="baobei">
			<view class="text-bold text-lg flex-1 flex align-center">
				<image src="@/static/img/tetail5.png" class="detail-wh margin-right"></image>
				<text>报备规则</text>
			</view>
			<view class="margin-top text-gray">
				<view class="flex-row">
					<view class="flex-1">报备开始时间</view>
					<view class="flex-2">{{task.reportStartTime ? task.reportStartTime.substr(0 ,task.reportStartTime.length-3):''}}</view>
				</view>
				<view class="flex-row margin-top-sm">
					<view class="flex-1">报备有效期</view>
					<view class="flex-2">{{task.reportValidType === 0 ? '当天': '24小时'}}</view>
				</view>
				<view class="flex-row margin-top-sm">
					<view class="flex-1">到访保护期</view>
					<view class="flex-2">{{task.protectDays || 30}} 天</view>
				</view>
				<view class="flex-row margin-top-sm">
					<view class="flex-1">接访时间</view>
					<view class="flex-2">{{task.openTimeStart|getHoursMinutes}} - {{task.openTimeEnd|getHoursMinutes}}</view>
				</view>
				<view class="flex-row margin-top-sm">
					<view class="flex-1">报备规则备注</view>
					<view class="flex-2">
						<app-rich-text :text="task.reportRemark" />
					</view>
				</view>
			</view>
		</view>
		<view class="margin-top padding bg-white" v-if="task && task.ruleScene" id="anchang">
			<view class="text-bold text-lg flex-1 flex align-center">
				<image src="@/static/img/tetail5.png" class="detail-wh margin-right"></image>
				<text>案场规则</text>
			</view>
			<view class="margin-top text-gray">
				<app-rich-text :text="task.ruleScene" />
			</view>
		</view>
		<view class="margin-top padding bg-white" v-if="task && task.ruleDistributor" id="qudao">
			<view class="text-bold text-lg flex-1 flex align-center">
				<image src="@/static/img/tetail5.png" class="detail-wh margin-right"></image>
				<text>渠道规则</text>
			</view>
			<view class="margin-top text-gray">
				<app-rich-text :text="task.ruleDistributor" />
			</view>
		</view>
		<view class="margin-top padding bg-white" v-if="task && task.ruleSpecial" id="teshu">
			<view class="text-bold text-lg flex-1 flex align-center">
				<image src="@/static/img/tetail5.png" class="detail-wh margin-right"></image>
				<text>特殊规则</text>
			</view>
			<view class="margin-top text-gray">
				<app-rich-text :text="task.ruleSpecial" />
			</view>
		</view>
		<!-- 楼盘动态 -->
		<view class="padding margin-top bg-white" id="loupan">
			<view class=" text-lg flex-row">
				<view class="text-bold text-lg flex-1 flex align-center text-bold">
					<image src="@/static/img/tetail6.png" class="detail-wh margin-right"></image>
					<view>楼盘动态
					<text v-if="newsTotal > 0">({{newsTotal}})</text></view>
				</view>
				<view class=" text-gray flex align-center" @click="more('news')">
					<view class="text-sm">更多信息</view>
					<view class="cuIcon-right  margin-left-sm"></view>
				</view>
			</view>
			<view class="margin-top">
				<app-empty v-if="news.length == 0" />
				<view class="cu-list menu">
					<view class="cu-item" v-for="item in news" :key="item.id" @click="more('news')" style="padding-left:0;padding-right:0;">
						<view class="content padding-tb-sm text-gray">
							<app-rich-text :text="item.content.split('\n').slice(0,5).join('\n')"></app-rich-text>

							<app-media-grid class="margin-top-sm" :media="item.media.slice(0,3)" v-if="item.media && item.media.length > 0" />

							<view class="flex-row text-gray text-sm">
								<text>{{item.category}}</text>
								<view class="flex-1 text-right">{{item.createTime}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 户型介绍 -->
		<view class="padding margin-top bg-white" id="huxing">
			<view class=" text-lg flex-row">
				<view class="text-bold text-lg flex-1 flex align-center">
					<image src="@/static/img/tetail7.png" class="detail-wh margin-right"></image>
					<view>户型介绍
					<text v-if="roomTotal > 0">({{roomTotal}})</text></view>
				</view>
				<view class="text-gray flex align-center" @click="more('room')" v-if="roomTotal > 0">
					<view class="text-sm">更多信息</view>
					<view class="cuIcon-right  margin-left-sm"></view>
				</view>
			</view>

			<view class="margin-top" v-if="rooms.length > 0">
				<scroll-view scroll-x :scroll-y="false" >
					<view class="flex" >
						<view style="width:260rpx" class="margin-right-sm" v-for="(item,index) in rooms" @click="previewRoom(item)" :key="item.id">
							<view class="bg-img margin-right dpib"  :data-index="index"
							  :style="item.diagrams.length > 0 ?  
							`width:260rpx;height:200rpx;background-image:url(${URI_OSS + item.diagrams[0].path + _thumb})` : 
							`width:260rpx;height:200rpx;background-image:url(${DEFAULT_COVER})` ">
								
							</view>
							<view class="text-center margin-top-sm" style="width:260rpx;">
								{{item.name||'-'}}
							</view>
						</view>
					</view>
					
				</scroll-view>
			</view>
			<app-empty v-else />
		</view>
		<!-- 预售许可证 -->
		<view class="padding margin-top margin-bottom bg-white" id="xuke">
			<view class=" text-lg flex-row">
				<view class="text-bold text-lg flex-1 flex align-center">
					<image src="@/static/img/tetail8.png" class="detail-wh margin-right"></image>
					<view>预售许可证
					<text v-if="licences.length > 1">({{licences.length}})</text></view>
				</view>
				<view class="text-gray flex align-center" @click="more('licence')" v-if="licences.length > 0">
					<view class="text-sm">更多信息</view>
					<view class="cuIcon-right  margin-left-sm"></view>
				</view>
			</view>

			<view v-if="licences.length > 0">
				<view class="margin-top text-gray" v-for="item in licences.slice(0,1)" :key="item.id">
					<view class="flex-row">
						<view class="flex-1">预售证号：</view>
						<view class="flex-3">{{item.code}}</view>
					</view>
					<view class="flex-row margin-top-sm">
						<view class="flex-1">发证时间：</view>
						<view class="flex-3">{{item.date ? item.date.split(' ')[0] : '-'}}</view>
					</view>
					<view class="flex-row margin-top-sm">
						<view class="flex-1">绑定楼栋：</view>
						<view class="flex-3">{{item.building || '-'}}</view>
					</view>
				</view>
			</view>
			<app-empty v-else />
		</view>
		<!-- 猜你喜欢 -->
		<!-- <view class="margin-top">
            <view class="padding bg-white text-bold text-lg">猜你喜欢</view>

            <view class="margin-top">
                <app-recommend-task />
            </view>
        </view>-->

		<!-- <view class="cu-tabbar-height" /> -->

		<!-- 按钮 -->
		<!-- <view class="foot bg-white">
			<view class="flex-row  bg-white shadow-lg align-center padding-sm" v-if="task">
				<button class="flex cu-btn lg align-center justify-center " :class="subscribed ? 'text-green' : ''" style="background-color: #EDEFF2;width: 240rpx;" @click="subscribeClick">
					<text class="cuIcon-roundcheckfill margin-right-sm" v-if="subscribed" />
					<image class="margin-right-sm"  v-else src="@/static/img/tetail9.png" style="width: 28rpx;height: 28rpx;"></image>
					<text class="text-sm">{{subscribed ? '已订阅' : '订阅消息'}}</text>
				</button>
				<button class="flex-1 cu-btn bg-blue lg square margin-left radius" @click="reportClient" v-if="task.accepted">报备客户</button>
				<button class="flex-1 cu-btn bg-blue lg square margin-left radius" @click="toAccept" v-else>接任务</button>
			</view>
		</view>
		<app-modal :show="modalShow" @hideModal="hideModal"></app-modal> -->
	</view>
</template>

<script>
	import Service from "@/apis/service.js";
	import TaskService from "@/apis/task";
	import HouseService from "@/apis/house";
	import UserService from "@/apis/user";
	import ResidentService from "@/apis/resident";
	import utils from '../../plugins/utils.js'
	import {
		DEFAULT_COVER
	} from "@/common/const";
	export default {
		components: {},
		data() {
			return {
				modalShow: false,
				taskId: "",

				taskLoading: false,
				task: null,

				houseId: "",
				houseLoading: false,
				house: null,

				URI_OSS: Service.URI_OSS,
				DEFAULT_COVER,

				roomLoading: false,
				rooms: [],

				roomTotal: 0,

				residentLoading: false,
				residents: [],

				news: [],
				newsTotal: 0,

				subscribed: false,
				// 效果图
				media: [],
				imgList:[],
				
				// 许可证
				licences: [],

				subscribeId: '',


				// Tab
				initialTabList: [{
					name: '佣金方案',
					id: 'yongjin'
				}, {
					name: '项目信息',
					id: 'xiangmu'
				}, {
					name: '特色卖点',
					id: 'tese'
				}, {
					name: '报备规则',
					id: 'baobei'
				}, {
					name: '案场规则',
					id: 'anchang'
				}, {
					name: '渠道规则',
					id: 'qudao'
				}, {
					name: '特殊规则',
					id: 'teshu'
				}, {
					name: '楼盘动态',
					id: 'loupan'
				}, {
					name: '户型介绍',
					id: 'huxing'
				}, {
					name: '预售许可证',
					id: 'xuke'
				}],
				TabCur: 0,
				scrollLeft: 0,
				navHeight: 0,
				navTopHeight: 0,
				pageTop: 0
			};
		},
		computed: {
			tabIsShou() {
				if (this.pageTop > this.navTopHeight) {
					return true
				} else {
					return false
				}
			},
			tabList(){
				if(this.task){
					let arr=this.initialTabList;
					if(this.task.ruleScene==null){
						arr=arr.filter(res=>{
							return res.name !=='案场规则'
						})
					}
					if(this.task.ruleDistributor==null){
						arr=arr.filter(res=>{
							return res.name !=='渠道规则'
						})
					}
					if(this.task.ruleSpecial==null){
						arr=arr.filter(res=>{
							return res.name !=='特殊规则'
						})
					}
					this.getNavHeight()
					return arr
				}
			},
			uri(){
			    return Service.URI_OSS;
			},
			Custom() {
				return this.CustomBar
			},
			user() {
				return this.$store.state.user;
			},
			taskIds() {
				return this.$store.state.taskIds;
			},
			brokerHref() {
				return this.user ?
					Service.URI_API + "/rest/brokers/" + this.user.id :
					null;
			},
			houseHref() {
				return this.user ?
					Service.URI_API + "/rest/houses/" + this.houseId :
					null;
			},
			roomScrollStyle() {
				return `height:200rpx;overflow:hidden;white-space:nowrap;`;
			},
			pics() {
				let rs = 0;
				if (this.house) {
					rs += (this.house.mediaDesign || []).length;
					rs += (this.house.mediaArea || []).length;
					rs += (this.house.mediaBuilding || []).length;
					rs += (this.house.mediaScene || []).length;
					rs += (this.house.mediaSocial || []).length;
					rs += (this.house.mediaSale || []).length;
					rs += (this.house.mediaSale || []).length;
					rs += (this.house.mediaSand || []).length;
				}
				return rs;
			},
			roomAll() {
				let rs = "-";
				if (this.house && this.house.roomAll) {
					let obj = {};
					this.house.roomAll.split(",").forEach((i) => {
						obj[i] = true;
					}); //this.getHeadTail(this.house.roomAll);
					rs = Object.keys(obj).join("-");
				}
				return rs;
			},
			roomArea() {
				let rs = "-";
				if (this.house) {
					rs = this.getHeadTail(this.house.roomAreaAll);
				}
				return rs;
			},
		},
		filters: {
			getHoursMinutes(val) {
				if (!val) return ''
				return utils.formatHoursMinutes(val);
			}
		},
		onLoad(options) {
			this.taskId = options.taskId;
			this.houseId = options.houseId;
		},
		mounted() {
			

			this.init();
		},
		methods: {
			init() {
				this.loadTaskInfo();
				this.loadHouseInfo();
				this.loadResidentInfo();
				this.loadRoomInfo();
				this.loadLicenseInfo();
				this.loadMedia();
				this.checkByBrokerIdAndHouseId();
			},
			getNavHeight(){
				setTimeout(res => {
					const query2 = uni.createSelectorQuery().in(this);
					query2.select('#mytabs').boundingClientRect(data => {
						this.navHeight = data.height;
						this.navTopHeight = data.top - this.Custom;
					}).exec();
				}, 700)
			},
			subscribeClick() {
				this.subscribed ? this.cancel() : this.subscribe()
			},
			// 订阅
			subscribe() {
				let data = {
					broker: this.brokerHref,
					house: this.houseHref
				}
				this.confirm("您确定订阅楼盘信息？", (ok) => {
					if (ok) {
						HouseService.brokerHouses(data, res => {
							if (res.statusCode == 201) {
								this.subscribed = true
								this.subscribeId = res.data.id
								this.toast("订阅成功!", true);
							} else {
								this.toast("订阅失败!");
							}
						})
					}
				})
			},
			// 取消订阅
			cancel() {
				this.confirm("是否取消订阅楼盘信息？", (ok) => {
					if (ok) {
						HouseService.delectBrokerHouses(this.subscribeId, res => {
							if (res.statusCode == 204) {
								this.toast("取消订阅!", true);
								this.subscribed = false;
							}
						})
					}
				})
			},
			checkByBrokerIdAndHouseId() {
				let data = {
					brokerId: this.user.id,
					houseId: this.houseId
				}
				HouseService.checkByBrokerIdAndHouseId(data, res => {
					if (res.data._embedded.brokerHouses.length > 0) {
						this.subscribed = res.data == 0 ? false : true
						this.subscribeId = res.data._embedded.brokerHouses[0].id
					}
				})
			},
			loadMedia() {
				HouseService.mediaDesign(this.houseId, (res) => {
					if (res.statusCode === 200) {
						let arr = res.data._embedded.medias || [];
						if (arr.length > 1) {
							this.media=arr.filter(media=>{
								return media.type.indexOf('video') >= 0
							})
							this.imgList=arr.filter(img=>{
								return img.type.indexOf('image') >= 0
							})
							// let max = this.imgList.length > 6 ? 6 : this.imgList.length;
							// this.imgList = arr.slice(1, max);
						}
					}
				});
			},
			loadTaskInfo() {
				this.taskLoading = true;
				TaskService.byId(this.taskId, (res) => {
					this.taskLoading = false;
					if (res.data) {
						let task = res.data;
						task.accepted = this.taskIds.indexOf(task.id) >= 0;
						this.task = task;
					} else {
						this.toast("加载任务信息失败");
					}
				});
			},
			loadHouseInfo() {
				this.houseLoading = true;
				HouseService.byId(this.houseId, (res) => {
					this.houseLoading = false;
					if (res.data) {
						//楼盘信息（项目）
						let data = res.data;
						let labels = data.label ? data.label.split(",") : [];
						this.house = { ...data,
							labels
						};
					} else {
						this.toast("加载楼盘信息失败");
					}
				});
				this.loadHouseNews();
			},
			loadHouseNews() {
				HouseService.getNewsByHouseId({
						size: 1,
						houseId: this.houseId,
						sort: "createTime,desc",
					},
					(res) => {
						if (res.statusCode === 200) {
							this.news = res.data._embedded.news || [];
							this.newsTotal = res.data.page.totalElements || 0;
						}
					}
				);
			},
			loadResidentInfo() {
				this.residentLoading = true;
				ResidentService.findByHousesId(this.houseId, (res) => {
					this.residentLoading = false;
					if (res.statusCode === 200) {
						this.residents = res.data._embedded.residents || [];
					} else {
						//this.toast("加载驻场信息失败");
					}
				});
			},
			loadRoomInfo() {
				let params = {
					houseId: this.houseId,
					page: 0,
					size: 10,
				};
				this.roomLoading = true;
				HouseService.getRoomsByHouseId(params, (res) => {
					this.roomLoading = false;
					if (res.statusCode === 200) {
						let data = res.data;
						let arr = data._embedded.rooms || [];
						this.roomTotal = data.page.totalElements || 0;
						this.rooms = arr;
					} else {
						//this.toast("加载户型信息失败");
					}
				});
			},
			loadLicenseInfo() {
				HouseService.getLicenseByHouseId(this.houseId, (res) => {
					if (res.statusCode === 200) {
						let arr = res.data._embedded.licences || [];
						this.licences = arr;
					} else {
						//this.toast("加载授权许可证信息失败");
					}
				});
			},
			//相册查看
			toAlbum(m) {
				if (m.type.indexOf('video') >= 0) return

				this.navTo(`/pages/task/album?houseId=${this.house.id}`);
			},
			//更多
			more(key) {
				let house = this.house;
				if (key === "project") {
					this.navTo(`/pages/task/project?houseId=${house.id}`);
				} else if (key === "news") {
					this.navTo(`/pages/task/news?houseId=${house.id}`);
				} else if (key === "room") {
					this.navTo(`/pages/task/room?houseId=${house.id}`);
				} else if (key === "licence") {
					this.navTo(`/pages/task/licence?houseId=${house.id}`);
				}
			},
			previewRoom(e) {
				console.log(e);
				this.navTo(`/pages/task/room?houseId=${this.house.id}&room=${e.room}`);
				// let index = e.currentTarget.dataset.index;
				// let crt = this.rooms[index];
				// let media = [...(crt.diagrams || []), ...(crt.models || [])];

				// if (media.length > 0) {
				// 	let urls = media
				// 		.filter((i) => i.type.indexOf("image") >= 0)
				// 		.map((i) => this.URI_OSS + i.path);
				// 	this.previewImage(urls, 0);
				// } else {
				// 	this.toast("暂无图片");
				// }
			},
			// 关闭邀请码弹框
			hideModal() {
				this.modalShow = false
			},

			//报备
			reportClient() {

				this.checkBroker(res => {
					if (res) {
						this.navTo("/pages/report/report?taskId=" + this.task.id);
					} else {
						this.modalShow = true;
					}
				})
			},

			// 验证是否是邀请人
			checkBroker(callback) {
				// 判断是否有邀请码或入驻
				this.byIdCheckBroker(this.user.id, res => {
					if (res.data == true) {
						callback(true)
					} else {
						callback(false)
					}
				});
			},

			//电话
			toAccept() {
				this.checkBroker(res => {
					if (!res) {
						this.modalShow = true;
					} else {
						this.confirm("您确定要接此任务吗？", (ok) => {
							if (ok) {
								let params = {
									task: Service.URI_API + "/rest/tasks/" + this.task.id,
									broker: Service.URI_API + "/rest/brokers/" + this.user.id,
								};
								this.showLoading(() => {
									TaskService.acceptTask(params, (res) => {
										// this.hideModal();
										this.hideLoading();
										if (res.statusCode === 201) {
											this.modal = null;
											this.task.accepted = true;
											this.$store.commit("putTaskId", [
												...this.taskIds,
												this.task.id,
											]);
											this.toast("接收成功", "success");
										}
									});
								});
							}
						});
					}
				})
			},
			showOnMap() {
				let {
					longitude,
					latitude
				} = this.house;
				this.openOnMap({
					longitude,
					latitude
				});
			},
			tabSelect(e, id) {
				const query = uni.createSelectorQuery().in(this);
				query.select('#' + id).boundingClientRect(data => {
					console.log("得到布局位置信息" + JSON.stringify(data));
					console.log("节点离页面顶部的距离为" + data.top);
					uni.pageScrollTo({
						scrollTop: this.pageTop + data.top - 140,
						duration: 300,
					});
				}).exec();
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			}
		},
		onPageScroll(e) {
			this.pageTop = e.scrollTop
		}
	};
</script>
<style scoped lang="less" scoped>
	.detail-wh{
		width: 38rpx;
		height: 38rpx;
	}
	.thumb-label {
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
	}

	.tabFixed {
		position: fixed;
		z-index: 99999;

	}
</style>
