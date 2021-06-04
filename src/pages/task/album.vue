<template>
    <view class="container">
        <cu-custom bgColor="text-bold bg-white text-black" :is-back="true">
            <block slot="content">楼盘相册</block>
        </cu-custom>
        <!-- <view class="title">楼盘相册（999）</view> -->

        <scroll-view
            scroll-x
            class="bg-white nav fixed margin-bottom shadow"
            scroll-with-animation
            :style="tabStyle"
            :scroll-left="scrollLeft"
        >
            <view
                :class="index==tab?'text-green cur cu-item':'cu-item'"
                v-for="(value,index) in tabList"
                :key="index"
                @click="tabSelect"
                :data-index="index"
            >{{value.text}}</view>
        </scroll-view>

        <view :style="contentStyle">
            <view
                class="padding album-item"
                v-for="(item) in tabList"
                :key="item.key"
                :id="item.key"
                :data-key="item.key"
            >
                <view class="text-lg text-bold">{{item.text}}</view>
                <view class="margin-top">
                    <app-media-grid :media="item.media" v-if="item.media && item.media.length > 0" />
                    <view v-if="item.room">
                        <view v-for="room in roomValid" :key="room.id">
                            <view class="text-normal">{{room.name}}</view>
                            <app-media-room :room="room" />
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import HouseService from "@/apis/house";

export default {
    data() {
        return {
            tab: 0,

            tabs: [
                /* {text:'VR看房'}, */
                { key: "mediaDesign", text: "项目效果", media: [] },
                { key: "mediaRoom", text: "户型图", room: true },
                { key: "mediaArea", text: "区位图", media: [] },
                { key: "mediaBuilding", text: "楼栋图", media: [] },
                { key: "mediaScene", text: "项目实景图", media: [] },
                { key: "mediaSocial", text: "小区配套", media: [] },
                { key: "mediaSale", text: "售楼处", media: [] },
                { key: "mediaSand", text: "沙盘图", media: [] },
            ],
            rooms: [],
            page: 0,
            size: 10,
            total: 0,

            scrolling: false,
            mediaLoaded: 0,
        };
    },
    computed: {
        tabStyle() {
            return `top:${this.CustomBar}px`;
        },
        contentStyle() {
            return `margin-top:${this.CustomBar}px;`;
        },

        scrollLeft() {
            return this.tab ? (this.tab - 1) * 60 : 0;
        },
        roomValid() {
            return this.rooms.filter(
                (i) => i.diagrams.length > 0 || i.models.length > 0
            );
        },
        tabList() {
            return this.tabs.filter(
                (i) =>
                    (i.media && i.media.length > 0) ||
                    (i.key === "mediaRoom" && this.roomValid.length > 0)
            );
        },
    },
    onLoad(options) {
        this.houseId = options.houseId;
    },
    mounted() {
        this.init();
    },
    onPageScroll(e) {
        this.onPageScroll(e);
    },
    methods: {
        init() {
            this.loadRooms();
            this.loadMedia();
        },
        loadMedia() {
            for (let i = 0; i < this.tabs.length; i++) {
                this.loadMediaData(i);
            }
        },
        loadMediaData(i) {
            let item = this.tabs[i];
            if (item.media) {
                let func = HouseService[item.key];
                func.call(this, this.houseId, (res) => {
                    if (res.statusCode === 200) {
                        console.log('chenggong', res)
                        item.media = res.data._embedded.medias || [];
                        this.$set(this.tabs, i, item);
                    }
                    this.mediaLoaded += 1;

                    if (this.mediaLoaded == this.tabs.length - 1) {
                        console.log('失败', res)
                        setTimeout(() => {
                            this.parseTop();
                        }, 300);
                    }
                });
            }
        },
        parseTop() {
            const query = uni.createSelectorQuery().in(this);
            query
                .selectAll(".album-item")
                .boundingClientRect((arr) => {
                    //let target = arr[0];
                    arr.forEach((i) => {
                        //console.log(`top=${top},i.top=${i.top}`)
                        let tabs = this.tabs;
                        let key = i.dataset.key;
                        let idx = this.findIdxInArr(tabs, "key", { key });
                        let item = tabs[idx];

                        this.$set(tabs, idx, { ...item, top: i.top });
                    });

                    //this.tab = target.dataset.index;
                })
                .exec();
        },
        loadRooms() {
            let params = {
                houseId: this.houseId,
                page: this.page,
                size: this.size,
                sort: "updateTime,desc",
                projection: "withAll",
            };
            HouseService.getRoomsByHouseId(params, (res) => {
                console.log('dddd', res)
                if (res.statusCode === 200) {
                    this.rooms = res.data._embedded.rooms || [];
                }
            });
        },
        tabSelect(e) {
            let index = e.currentTarget.dataset.index;
            this.tab = index;
            let item = this.tabList[index];
            this.scrolling = true;
            this.$nextTick(() => {
                const query = uni.createSelectorQuery().in(this);
                query
                    .select("#" + item.key)
                    .boundingClientRect((data) => {
                        let duration = 300;

                        uni.pageScrollTo({
                            scrollTop: data.top,
                            duration,
                        });
                        setTimeout(() => {
                            this.scrolling = false;
                        }, duration + 100);
                    })
                    .exec();
            });
        },
        onPageScroll(e) {
            if (!this.scrolling) {
                let top = e.scrollTop;
                // console.log("scrolling="+this.scrolling+";top="+top)
                let tab = 0;
                for (let i = 0; i < this.tabList.length; i++) {
                    if (top > this.tabList[i].top) {
                        tab = i;
                    }
                }
                this.tab = tab;
            }
        },
    },
};
</script>