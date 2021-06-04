<template>
	<view class="container">
		<cu-custom bg-color="bg-white" :is-back="true">
			<block slot="content" class="my-text-color-black text-bold">户型信息</block>
		</cu-custom>
		<!-- 户型选择 -->

		<scroll-view scroll-x class="bg-white nav fixed shadow" scroll-with-animation :style="tabStyle" :scroll-left="scrollLeft"
		 id="tab">
			<view :class="index===tab?'cur cu-item my-text-color-blue':'cu-item'" v-for="(item, index) in tabList" :key="index"
			 @click="tabSelect(item,index)">{{item}}</view>
		</scroll-view>

		<!-- 户型介绍 -->
		<view :style="contentStyle">
			<view v-for="item in rooms" :key="item.id" :class="'room'+item.room">
				<app-room-item :item="item" />
			</view>
		</view>

		<app-loading v-if="loading" />
		<app-empty v-if="!loading && rooms.length == 0" />
	</view>
</template>

<script>
	import HouseService from "@/apis/house";
	const DEFAULT_COVER = "/static/img/placeholder.svg";
	export default {
		data() {
			return {
				pageTop:0,
				
				tab: 0,
				tabHeight:0,
				houseId: "",
				room:'',
				rooms: [],

				URI_OSS: HouseService.URI_OSS,
				DEFAULT_COVER,
			};
		},
		computed: {
			tabStyle() {
				return `top:${this.CustomBar}px`;
			},
			contentStyle() {
				return `margin-top:${this.CustomBar-10}px;`;
			},
			tabList() {
				let rs = [];
				if (this.rooms) {
					let obj = {};
					this.rooms.forEach((i) => {
						obj[i.room] = (obj[i.room || 1] || 0) + 1;
					});
					//rs = this.rooms.map((i) => `${i.room}居`);
					rs = Object.keys(obj).map((i) => {
						let count = obj[i];
						return `${i}居` + (count > 1 ? `(${count})` : "");
					});
					if(this.room){
						let arr=rs.map(res=>{
							return res.substring(0,1)
						})
						this.tab=arr.indexOf(this.room)
					}
				}
				return rs;
			},
		},
		onLoad(options) {
			this.houseId = options.houseId;
			if(options.room){
				this.room=options.room;
			}
		},
		mounted() {
			this.init();
			this.getTabHeight();
		},
		methods: {
			init() {
				this.load();
			},
			getTabHeight(){
				setTimeout(()=>{
					const query = uni.createSelectorQuery().in(this);
					query.select('#tab' ).boundingClientRect(data => {
						this.tabHeight=data.height
						if(this.room !==''){
							this.position();
						}
					}).exec();
				},100)
				
			},
			position(){
				setTimeout(()=>{
					this.tabSelect(this.room,2)
				},100)
			},
			load() {
				this.loading = true;
				HouseService.getRoomsByHouseId({
						houseId: this.houseId,
						size: 100,
						sort: "room",
					},
					(res) => {
						this.loading = false;
						if (res.statusCode === 200) {
							this.rooms = res.data._embedded.rooms || [];
						}
					}
				);
			},
			tabSelect(item, index) {
				this.tab = index;
				let id = item.substring(0, 1);
				const query = uni.createSelectorQuery().in(this);
				query
					.select(".room" + id)
					.boundingClientRect((data) => {
						if (data) {
							let duration = 300;

							uni.pageScrollTo({
								scrollTop: this.pageTop+data.top-this.CustomBar-this.tabHeight,
								duration,
							});
						}
					})
					.exec();
			},
		},
		onPageScroll(e) {
			this.pageTop = e.scrollTop
		}
	};
</script>
