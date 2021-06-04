<template>
    <view class="container">
        <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
            <block slot="content">项目详细信息</block>
        </cu-custom>
        <!-- 基本信息 -->
        <app-info-card title="基本信息" :infos="base" />

        <!-- 小区概况 -->
        <app-info-card title="小区概况" :infos="social" />

        <!-- 建筑规划 -->
        <app-info-card title="建筑规划" :infos="plan" />

        <!-- 销售信息 -->
        <app-info-card title="销售信息" :infos="sale" />

        <!-- 物业信息 -->
        <app-info-card title="物业信息" :infos="property" />
    </view>
</template>

<script>
import HouseService from "@/apis/house";

export default {
    data() {
        return {
            base: [],
            social: [],
            plan: [],
            sale: [],
            property: [],

            houseId: null,
            house: null,
        };
    },
    onLoad(options) {
        this.houseId = options.houseId;
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            HouseService.byId(this.houseId, (res) => {
                if (res.statusCode === 200) {
                    this.house = res.data;
                    this.parseInfo(this.house);
                }
            });
        },
        parseInfo(house) {
            if (house) {
                this.parseBase(house);
                this.parseSocial(house);
                this.parsePlan(house);
                this.parseSale(house);
                this.parseProperty(house);
            }
        },
        parseBase(house) {
            let arr = [];

            arr.push({ title: "楼盘名称", value: house.name });
            arr.push({ title: "物业类型", value: house.propertyType });
            arr.push({ title: "开发商", value: house.developerName });
            arr.push({ title: "楼盘地址", value: house.address });
            arr.push({ title: "售楼地址", value: house.addressSale });

            this.base = arr;
        },
        parseSocial(house) {
            let arr = [];

            arr.push({ title: "供电方式", value: house.electricity });
            arr.push({ title: "供水方式", value: house.water });
            arr.push({ title: "供暖方式", value: house.heat });
            arr.push({ title: "容积率", value: (house.plotratio||'-') + '%' });
            arr.push({ title: "装修标准", value: house.decorate });
            arr.push({ title: "绿化率", value: (house.green ||'-') + '%'});
            arr.push({ title: "占地面积", value: (house.floorArea ? this.numberWithCommas(house.floorArea) : '-') + '㎡' });
            arr.push({ title: "建筑面积", value: (house.acreage ? this.numberWithCommas(house.acreage) : '-') + '㎡'});

            this.social = arr;
        },
        parsePlan(house) {
            let arr = [];

            arr.push({ title: "产权年限", value: (house.term||'-') + '年' });
            arr.push({ title: "交房时间", value: house.deliveryTime ? house.deliveryTime.split(' ')[0] : '-' });
            arr.push({ title: "开盘时间", value: house.openTime ? house.openTime.split(' ')[0] : '-' });

            this.plan = arr;
        },
        parseSale(house) {
            let arr = [];

            arr.push({
                title: "楼盘均价",
                value: house.salePrice
                    ? '￥'+this.numberWithCommas(house.salePrice)
                    : "-",
            });
            // 0=未销售,1=在售-1=停售
            arr.push({ title: "销售状态", value: this.getSaleStatus(house.saleStatus) });
            arr.push({ title: "可售面积", value: (house.saleArea || '-') + '㎡'});

            this.sale = arr;
        },
        parseProperty(house) {
            console.log(house, 'house');
            let arr = [];
            arr.push({ title: "物业公司", value: house.propertyCompany });
            arr.push({ title: "物业费(小)", value: house.minPropertyPrice || '--'});
            arr.push({ title: "物业费(大)", value: house.maxPropertyPrice || '--' });
            arr.push({ title: "车位数", value: house.propertyParkSlot });
            arr.push({ title: "车位占比", value: '1:'+ (house.propertyParkPercent||'-') });

            this.property = arr;
        },
    },
};
</script>