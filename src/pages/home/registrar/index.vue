<template>
  <view class="container">
    <cu-custom bgColor="text-bold bg-white text-black" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">来访登记</block>
    </cu-custom>
    <view class="wrap">
      <u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
        <u-form-item
          :label-position="labelPosition"
          label="姓名"
          prop="name"
          :label-width="labelWidth"
          :required="true"
        >
          <u-input
            :border="border"
            placeholder="请输入姓名"
            v-model="model.name"
            type="text"
          ></u-input>
        </u-form-item>
        <u-form-item
          :label-position="labelPosition"
          label="性别"
          prop="sex"
          :label-width="labelWidth"
          :required="true"
        >
          <u-radio-group
            v-model="model.sex"
            @change="radioGroupChange"
            :width="radioCheckWidth"
            :wrap="radioCheckWrap"
          >
            <u-radio
              shape="circle"
              v-for="(item, index) in radioList"
              :key="index"
              :name="item.name"
              >{{ item.name }}</u-radio
            >
          </u-radio-group>
        </u-form-item>
        <u-form-item
          :rightIconStyle="{ color: '#888', fontSize: '32rpx' }"
          right-icon="kefu-ermai"
          :label-position="labelPosition"
          label="手机号码"
          prop="phone"
          :label-width="labelWidth"
          :required="true"
        >
          <u-input
            :border="border"
            placeholder="请输入手机号"
            v-model="model.phone"
            type="number"
          ></u-input>
        </u-form-item>
        <u-form-item
          :label-position="labelPosition"
          label="职业顾问"
          prop="consultant"
          :label-width="labelWidth"
          :required="true"
        >
          <u-input
            :border="border"
            type="select"
            :select-open="selectShow"
            v-model="model.consultant"
            placeholder="请选择职业顾问"
            @click="selectShow = true"
          ></u-input>
        </u-form-item>
        <u-form-item
          :label-position="labelPosition"
          label="备注"
          prop="remark"
          :label-width="labelWidth"
        >
          <u-input
            type="textarea"
            :border="border"
            placeholder="请填写备注"
            v-model="model.remark"
          />
        </u-form-item>
        <u-form-item
          :label-position="labelPosition"
          label="意向总价"
          prop="price"
          :label-width="labelWidth"
        >
          <u-row :justify="'start'">
            <u-col
              v-for="item in prices"
              :key="item.id"
              :span="4"
              :offset="0"
              stop
            >
              <view class="demo-layout">
                <u-tag
                  class="m-tag"
                  :text="item.value"
                  :bg-color="item.active ? '#fdf3ec' : '#f5f5f5'"
                  :border-color="item.active ? '#fdf3ec' : '#f5f5f5'"
                  :color="item.active ? '#ef8d4a' : '#acacac'"
                  type="primary"
                  shape="square"
                  mode="light"
                  @click="tagClick(item, prices)"
                  size="default"
                />
              </view>
            </u-col>
          </u-row>
        </u-form-item>
        <u-form-item
          :label-position="labelPosition"
          label="意向面积"
          prop="area"
          :label-width="labelWidth"
        >
          <u-row :justify="'start'">
            <u-col
              v-for="item in areas"
              :key="item.id"
              :span="4"
              :offset="0"
              stop
            >
              <view class="demo-layout">
                <u-tag
                  class="m-tag"
                  :text="item.value"
                  :bg-color="item.active ? '#fdf3ec' : '#f5f5f5'"
                  :border-color="item.active ? '#fdf3ec' : '#f5f5f5'"
                  :color="item.active ? '#ef8d4a' : '#acacac'"
                  type="primary"
                  shape="square"
                  mode="light"
                  @click="tagClick(item, areas)"
                  size="default"
                />
              </view>
            </u-col>
          </u-row>
        </u-form-item>
        <u-form-item
          :label-position="labelPosition"
          label="意向户型"
          prop="room"
          :label-width="labelWidth"
        >
          <u-row :justify="'start'">
            <u-col
              v-for="item in rooms"
              :key="item.id"
              :span="4"
              :offset="0"
              stop
            >
              <view class="demo-layout">
                <u-tag
                  class="m-tag"
                  :text="item.value"
                  :bg-color="item.active ? '#fdf3ec' : '#f5f5f5'"
                  :border-color="item.active ? '#fdf3ec' : '#f5f5f5'"
                  :color="item.active ? '#ef8d4a' : '#acacac'"
                  type="primary"
                  shape="square"
                  mode="light"
                  @click="tagClick(item, rooms)"
                  size="default"
                />
              </view>
            </u-col>
          </u-row>
        </u-form-item>
        <u-form-item
          :label-position="labelPosition"
          label="意向业态"
          prop="room"
          :label-width="labelWidth"
        >
          <u-row :justify="'start'">
            <u-col
              v-for="item in commercials"
              :key="item.id"
              :span="4"
              :offset="0"
              stop
            >
              <view class="demo-layout">
                <u-tag
                  class="m-tag"
                  :text="item.value"
                  :bg-color="item.active ? '#fdf3ec' : '#f5f5f5'"
                  :border-color="item.active ? '#fdf3ec' : '#f5f5f5'"
                  :color="item.active ? '#ef8d4a' : '#acacac'"
                  type="primary"
                  shape="square"
                  mode="light"
                  @click="tagClick(item, commercials)"
                  size="default"
                />
              </view>
            </u-col>
          </u-row>
        </u-form-item>
      </u-form>
      <!-- <view class="agreement">
        <u-checkbox v-model="check" @change="checkboxChange"></u-checkbox>
        <view class="agreement-text">
          勾选代表同意《保护用户隐私协议》
        </view>
      </view> -->
      <u-button @click="submit" type="primary">提交</u-button>
      <u-select
        mode="single-column"
        :list="consultants"
        v-model="selectShow"
        @confirm="selectConfirm"
      ></u-select>
    </view>
  </view>
</template>

<script>
import Service from "@/apis/service";
import HouseIntentionDataService from "@/apis/houseIntentionData";
import HouseAgentService from "@/apis/houseAgent";
import ReportService from "@/apis/report";
import ConsultantService from "@/apis/consultant";
import ClientService from "@/apis/client";
import DictService from "@/apis/dict";
export default {
  data() {
    let that = this;
    return {
      prices: [],
      areas: [],
      rooms: [],
      commercials: [],
      consultants: [],
      clients: [],
			client: null,
			houseAgentId: '',
			consultantId: 0,

      tagColor: "#f5f5f5",

      model: {
        name: "",
        sex: "男",
        remark: "",
        agreement: false,
        consultant: "",
        phone: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 5,
            message: "姓名长度在2到5个字符",
            trigger: ["change", "blur"],
          },
          {
            // 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
            validator: (rule, value, callback) => {
              // 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
              return this.$u.test.chinese(value);
            },
            message: "姓名必须为中文",
            // 触发器可以同时用blur和change，二者之间用英文逗号隔开
            trigger: ["change", "blur"],
          },
          // 异步验证，用途：比如用户注册时输入完账号，后端检查账号是否已存在
          // {
          // 	trigger: ['blur'],
          // 	// 异步验证需要通过调用callback()，并且在里面抛出new Error()
          // 	// 抛出的内容为需要提示的信息，和其他方式的message属性的提示一样
          // 	asyncValidator: (rule, value, callback) => {
          // 		this.$u.post('/ebapi/public_api/index').then(res => {
          // 			// 如果验证出错，需要在callback()抛出new Error('错误提示信息')
          // 			if(res.error) {
          // 				callback(new Error('姓名重复'));
          // 			} else {
          // 				// 如果没有错误，也要执行callback()回调
          // 				callback();
          // 			}
          // 		})
          // 	},
          // }
        ],
        sex: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change",
          },
        ],
        consultant: [
          {
            required: true,
            message: "请选择职业顾问",
            trigger: "change",
          },
        ],
        remark: [
          {
            required: false,
            message: "请填写备注",
          },
          {
            min: 5,
            message: "备注不能少于5个字",
            trigger: "change",
          },
          // 正则校验示例，此处用正则校验是否中文，此处仅为示例，因为uView有this.$u.test.chinese可以判断是否中文
          {
            pattern: /^[\u4e00-\u9fa5]+$/gi,
            message: "备注只能为中文",
            trigger: "change",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["change", "blur"],
          },
          {
            validator: (rule, value, callback) => {
              // 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
              return this.$u.test.mobile(value);
            },
            message: "手机号码不正确",
            // 触发器可以同时用blur和change，二者之间用英文逗号隔开
            trigger: ["change", "blur"],
          },
					{
						trigger: ["change"],
						asyncValidator: (rule, value, callback) => {
							const params = { keyword: value }
							if (value.length === 11) {
								ClientService.query(params, res => {
									if (res.data.success) {
										if (res.data.data.content.length === 0) {
											this.client = null
											callback()
										} else {
											this.client = res.data.data.content[0]
											callback()
										}
									} else {
										this.toast('客户查询失败')
									}
								})
							}
						}
					}
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: ["change", "blur"],
          },
          {
            type: "number",
            message: "验证码只能为数字",
            trigger: ["change", "blur"],
          },
        ],
      },
      radioList: [
        {
          name: "男",
          checked: true,
          disabled: false,
        },
        {
          name: "女",
          checked: false,
          disabled: false,
        },
      ],
      pickerShow: false,
      selectShow: false,
      border: true, // true\false
      check: false,
      radioCheckWidth: "auto", // 50\auto
      radioCheckWrap: false, // true\false
      labelPosition: "left", // top\left
      codeTips: "",
      errorType: ["message", 'border'], // ['message']\['toast']\['border-bottom']\['border']
      labelWidth: 150,
    };
  },
  onLoad() {},
  computed: {
    houseId() {
      return uni.getStorageSync("house" + Service.KEY_SUFFIX).id;
    },
    taskId() {
      return uni.getStorageSync("task" + Service.KEY_SUFFIX).id;
    },
    userId() {
      return this.$store.state.user.id;
    },
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.fetchIntention(1);
      this.fetchIntention(2);
      this.fetchIntention(3);
      this.fetchConsultants();
      this.fetchCommercials();
			this.fetchAgent()
    },
    fetchIntention(type = 1) {
      const params = {
        page: 0,
        size: 10,
        type: type,
      };
      HouseIntentionDataService.query(params, (res) => {
        console.log(res, "res");
        const data = res.data;
        const content = data.data.content;
        if (data.success) {
          if (type === 1) {
            this.prices = content.map((item) => {
              item.active = false;
              if (
                item.minValue === null ||
                (item.minValue === "" && item.maxValue === "100")
              )
                item.value = "100万以下";
              if (item.minValue === "100" && item.maxValue === "150")
                item.value = "100-150万";
              if (item.minValue === "150" && item.maxValue === "200")
                item.value = "150-200万";
              if (item.minValue === "200" && item.maxValue === "300")
                item.value = "200-300万";
              if (item.minValue === "300" && item.maxValue === "400")
                item.value = "300-400万";
              if (item.minValue === "400" && item.maxValue === "500")
                item.value = "400-500万";
              if (
                (item.minValue === "500" && item.maxValue === null) ||
                item.maxValue === ""
              )
                item.value = "500万以上";
              return item;
            });
          }
          if (type === 2) {
            this.areas = content.map((item) => {
              item.active = false;
              if (
                item.minValue === null ||
                (item.minValue === "" && item.maxValue === "60")
              )
                item.value = "60㎡以下";
              if (item.minValue === "60" && item.maxValue === "80")
                item.value = "60-80㎡";
              if (item.minValue === "80" && item.maxValue === "100")
                item.value = "80-100㎡";
              if (item.minValue === "100" && item.maxValue === "120")
                item.value = "100-120㎡";
              if (item.minValue === "120" && item.maxValue === "150")
                item.value = "120-150㎡";
              if (item.minValue === "150" && item.maxValue === "200")
                item.value = "150-200㎡";
              if (
                (item.minValue === "200" && item.maxValue === null) ||
                item.maxValue === ""
              )
                item.value = "200㎡以上";
              return item;
            });
          }
          if (type === 3) {
            this.rooms = content.map((item) => {
              item.active = false;
              return item;
            });
          }
        } else {
          this.toast("获取基础数据失败");
        }
      });
    },
    fetchConsultants() {
      let params = {
        ...this.maxPagination,
        houseId: this.houseId,
      };
      ConsultantService.query(params, (res) => {
        const data = res.data;
        if (data.success) {
          this.consultants = data.data.content.map((item) => {
            item.value = item.id;
            item.label = item.name + `(${item.phone})`;
            return item;
          });
        } else {
          this.toast("获取置业顾问数据失败");
        }
      });
    },
    fetchCommercials() {
      DictService.byId("YETAI", (res) => {
        if (res.statusCode === 200) {
          this.commercials = res.data.values.map((item) => {
            item.active = false;
            return item;
          });
        } else {
          this.toast("获取业态数据失败");
        }
      });
    },
		fetchAgent() {
			const params = { residentId: this.userId, houseId: this.houseId }
			HouseAgentService.ByHouseIdAndResidentId(params, res => {
				if (res.statusCode === 200) {
					this.houseAgentId = res.data
				}
			})
		},
    tagClick(record, content) {
      content.forEach((item) => {
        if (record.id === item.id) {
          item.active = !item.active;
        } else {
          item.active = false;
        }
      });
    },
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
					// if (!this.model.agreement) return this.$u.toast("请勾选协议");
					this.confirm('您确定要自然到访登记吗？', (ok) => {
						if (ok) {
							this.showLoading(() => {
							const { prices, areas, rooms, commercials, userId, taskId, model, houseAgentId, consultantId } = this;
							const params = {};
							prices.forEach((item) => {
								if (item.active) {
									params.acceptPriceStart = item.minValue;
									params.acceptPriceEnd = item.maxValue;
								}
							});
							areas.forEach((item) => {
								if (item.active) {
									params.areaStart = item.minValue;
									params.areaEnd = item.maxValue;
								}
							});
							rooms.forEach((item) => {
								if (item.active) {
									params.room = item.value;
								}
							});
							commercials.forEach((item) => {
								if (item.active) {
									params.propertyType = item.value;
								}
							});
							const param = {
								remark: model.remark,
								houseAgentId,
								resident: { id: userId },
								task: { id: taskId },
								client: {
									name: model.name,
									phone: model.phone,
									sex: model.sex === '男' ? 0 : 1,
								},
								consultant: {
									id: consultantId
								}
							};
							const clientParam = {
								name: model.name,
								phone: model.phone,
								sex: model.sex === '男' ? 0 : 1
							}
							if (this.client) {
								param.client.id = clientParam.id = this.client.id
							}
							Object.assign(clientParam, params)
							this.saveClient(clientParam, (res) => {
								if(res) {
									param.client.id = res.id
									Object.assign(params, param);
									ReportService.visitRegistration(params, res => {
										if (res.data.success) {
											this.toast('登记成功')
											this.hideLoading()
											setTimeout(() => {
												this.navBack()
											}, this.asyncTime)
										} else {
											this.toast(res.data.message)
										}
									})
								}
							})
							})
						}
					})
        } else {
          console.log("验证失败");
        }
      });
    },
		saveClient(params, cb) {
			ClientService.save(params, res => {
				if (res.statusCode === 201) {
					cb(res.data)
				} else {
					cb(false)
					this.toast('客户信息保存失败')
				}
			})
		},
    // radio选择发生变化
    radioGroupChange(e) {
      this.model.sex = e;
    },
    // 勾选版权协议
    checkboxChange(e) {
      this.model.agreement = e.value;
    },
    // 选择职业顾问回调
    selectConfirm(e) {
      this.model.consultant = "";
      e.map((val, index) => {
        this.model.consultant +=
          this.model.consultant == "" ? val.label : "-" + val.label;
					this.consultantId = val.value
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  background: #fff;
}
.wrap {
  padding: 30rpx;
}
.agreement {
  display: flex;
  align-items: center;
  margin: 40rpx 0;

  .agreement-text {
    padding-left: 8rpx;
    color: $u-tips-color;
  }
}
.m-tag {
  .u-tag {
    width: 100% !important;
    text-align: center !important;
  }
}
</style>
