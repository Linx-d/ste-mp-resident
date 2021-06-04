<template>
  <view class="container">
    <cu-custom
      bgColor="text-bold bg-white text-black"
      :isBack="true"
    >
      <block slot="backText">返回</block>
      <block slot="content">置业顾问</block>
    </cu-custom>

    <view class="cu-bar tabbar bg-white add-conselor">
      <view class="action text-gray add-action">
        <button
          class="cu-btn cuIcon-add bg-green shadow"
          @click="toChild"
          data-url="../consultant/add"
        ></button>
      </view>
    </view>

    <view
      class="cu-bar bg-white search fixed"
      :style="[{ top: CustomBar + 'px' }]"
    >
      <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input
          type="text"
          placeholder="输入搜索的关键词"
          confirm-type="search"
        />
      </view>
      <view class="action">
        <button class="cu-btn bg-gradual-green shadow-blur round">搜索</button>
      </view>
    </view>
    <scroll-view
      scroll-y
      class="indexes"
      :scroll-into-view="'indexes-' + listCurID"
      :style="[{ height: 'calc(100vh - ' + CustomBar + 'px - 50px)' }]"
      :scroll-with-animation="true"
      :enable-back-to-top="true"
    >
      <block v-for="(item, index) in list" :key="index">
        <view
          :class="'indexItem-' + item.name"
          :id="'indexes-' + item.name"
          :data-index="item.name"
        >
          <!-- <view class="padding">{{ item.name }}</view> -->
          <view class="cu-list menu-avatar no-padding">
            <!-- <view
              class="cu-item"
              v-for="(items, sub) in index"
              :key="sub"
              @click="checkClient(item)"
            > -->
            <view class="cu-item" @click="checkClient(item)">
              <view class="cu-avatar round lg">{{
                item.name.slice(0, 1)
              }}</view>
              <view class="content">
                <view class="text-grey"
                  >{{ item.name }}
                  <!-- <text class="text-abc">{{ list[sub].name }}</text
                  >君 -->
                </view>
                <view class="text-gray text-sm">
                  {{ item.phone ? item.phone : "无" }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </block>
    </scroll-view>
    <!--  <view
      class="indexBar"
      :style="[{ height: 'calc(100vh - ' + CustomBar + 'px - 50px)' }]"
    >
      <view
        class="indexBar-box"
        @touchstart="tStart"
        @touchend="tEnd"
        @touchmove.stop="tMove"
      >
        <view
          class="indexBar-item"
          v-for="(item, index) in list"
          :key="index"
          :id="index"
          @touchstart="getCur"
          @touchend="setCur"
        >
          {{ item.name }}</view
        >
      </view> 
    </view>-->
    <!--选择显示-->
    <!-- <view v-show="!hidden" class="indexToast">
      {{ listCur }}
    </view> -->
  </view>
</template>

<script>
import Service from "@/apis/service.js";
import ConsultantService from "@/apis/consultant";
export default {
  data() {
    return {
      StatusBar: this.StatusBar,
      CustomBar: this.CustomBar,
      hidden: true,
      page: 0,
      size: 10,
      total: 0,
      listData: [],
      listCurID: "",
      list: [],
      listCur: "",
    };
  },
  computed: {
    houseId() {
      return uni.getStorageSync("house" + Service.KEY_SUFFIX).id;
    },
  },
  onShow() {
    this.load();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.load();
    },
    load() {
      //获取数据
      let pramars = {
        page: this.page,
        size: this.size,
        sort: "updateTime,desc",
      };

      ConsultantService.inHouse(this.houseId, (res) => {
        if (res.statusCode === 200) {
          console.log("client", res);
          let listData = res.data._embedded.consultants;
          console.log("listData", listData);
          const newArr = [];
          listData.forEach((item, index) => {
            console.log("item", item);
            const obj = { name: item.name, id: item.id, phone: item.phone };
            newArr.push(obj);
            // newArr[index].name = String.fromCharCode(65 + index);
          });
          this.list = newArr;
          this.listCur = newArr[0];
          console.log("listCur", this.listCur);

          this.$nextTick(() => {
            this.ready();
          });
          setTimeout(() => {
            uni.stopPullDownRefresh();
          }, 800);
        } else {
          this.toast(res.message);
        }
      });

      //将获取的数字字符串转义为26个字母
      // let list = [{}];
      // for (let i = 0; i < 26; i++) {
      //   list[i] = {};
      //   //编码转义
      //   list[i].name = String.fromCharCode(65 + i);
      // }

      // this.list = list;
      // this.listCur = list[0];
      // console.log('listCur',this.listCur)

      // this.$nextTick(() => {
      //   this.ready();
      // });
    },
    checkClient(items) {
      console.log("clientList:", items);
      uni.navigateTo({
        url: `/pages/index/client/user-message/user-message?clientId=${items.id}`,
      });
    },
    ready() {
      let that = this;
      let el = uni
        .createSelectorQuery()
        .in(this)
        .select(".indexBar-box");
      el.boundingClientRect((res) => {
        that.boxTop = res ? res.top : 0;
      }).exec();

      let el2 = uni
        .createSelectorQuery()
        .in(this)
        .select(".indexes");
      el2
        .boundingClientRect((res) => {
          that.barTop = res ? res.top : 0;
        })
        .exec();
    },

    //获取文字信息
    getCur(e) {
      this.hidden = false;
      this.listCur = this.list[e.target.id].name;
    },
    setCur(e) {
      this.hidden = true;
      this.listCur = this.listCur;
    },
    //滑动选择Item
    tMove(e) {
      let y = e.touches[0].clientY,
        offsettop = this.boxTop,
        that = this;
      //判断选择区域,只有在选择区才会生效
      if (y > offsettop) {
        let num = parseInt((y - offsettop) / 20);
        this.listCur = that.list[num].name;
      }
    },

    //触发全部开始选择
    tStart() {
      this.hidden = false;
    },

    //触发结束选择
    tEnd() {
      this.hidden = true;
      this.listCurID = this.listCur;
    },
    indexSelect(e) {
      let that = this;
      let barHeight = this.barHeight;
      let list = this.list;
      console.log("indexSelect", list);
      let scrollY = Math.ceil((list.length * e.detail.y) / barHeight);
      for (let i = 0; i < list.length; i++) {
        if (scrollY < i + 1) {
          that.listCur = list[i].name;
          that.movableY = i * 20;
          return false;
        }
      }
    },
    toChild(e) {
      let { doing, url } = e.currentTarget.dataset;
      if (doing) {
        this.toast("功能暂未开放，敬请期待");
      } else if (url) {
        this.navTo(url);
      }
    },
  },
};
</script>

<style lang="less">
page {
  padding-top: 100upx;
}

.indexes {
  position: relative;
}

.indexBar {
  position: fixed;
  right: 0px;
  bottom: 0px;
  padding: 20upx 20upx 20upx 60upx;
  display: flex;
  align-items: center;
}

.indexBar .indexBar-box {
  width: 40upx;
  height: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
  border-radius: 10upx;
}

.indexBar-item {
  flex: 1;
  width: 40upx;
  height: 40upx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24upx;
  color: #888;
}

movable-view.indexBar-item {
  width: 40upx;
  height: 40upx;
  z-index: 9;
  position: relative;
}

movable-view.indexBar-item::before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 10upx;
  height: 20upx;
  width: 4upx;
  background-color: #f37b1d;
}

.indexToast {
  position: fixed;
  top: 0;
  right: 80upx;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100upx;
  height: 100upx;
  border-radius: 10upx;
  margin: auto;
  color: #fff;
  line-height: 100upx;
  text-align: center;
  font-size: 48upx;
}
//拉到底部
.lastContent {
  padding: 0 0 15px 0;
  box-sizing: border-box;

  .content {
    margin: 0 38%;
    font-size: 14px;
    color: #aaaaaa;
  }
}

.add-conselor {
  position: fixed;
  z-index: 1;
  right: 200upx;
  bottom: 200upx;

  .add-action::before {
    width: 0 !important;
  }

  .add-action:after {
    width: 95rpx !important;
    height: 95rpx !important;
    top: -47rpx !important;
    left: -7px !important;
  }
}
</style>
