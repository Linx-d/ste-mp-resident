import Vue from 'vue'
import Vuex from 'vuex'

import Service from '../apis/service.js'

Vue.use(Vuex)

const state = {
	me: null, // {openId,nickName}
	user: null,
	token: null,

	openid: null,

	env: null, // 环境
	code: null,

	dicts: [],

	// index
	house: null,
	houses: null,
	task: null,
	tasks: null,

	serial: null,
	taskIds:[],

	redirect: null
};

const setOpenId = (id) => {
	uni.setStorageSync('openid' + Service.KEY_SUFFIX, id);
}

const store = new Vuex.Store({
	state,
	actions: {},
	mutations: {
		// login
		setOpenid(state, payload) {
			state.openid = payload;
			setOpenId(payload);
		},
		setMe(state, payload) {
			console.log(payload, 'payload')
			state.me = payload;
			let openid = payload.openId;
			if (openid) {
				state.openid = openid
				setOpenId(openid);
			}
		},
		setUser(state, payload) {
			state.user = payload;
			uni.setStorageSync('user'+Service.KEY_SUFFIX,payload);
			if (payload.wx) {

				state.me = payload.wx;
				let openid = payload.wx.openId;
				state.openid = openid;

				setOpenId(openid);

			}
		},
		setCode(state, payload) {
			state.code = payload;
		},
		setToken(state, payload) {
			state.token = payload;
			uni.setStorageSync('token' + Service.KEY_SUFFIX, payload);
		},
		setDicts(state, payload) {
			state.dicts = payload;
		},

		// index
		setHouse(state, payload) {
			state.house = payload;
		},
		setHouses(state, payload) {
			state.houses = payload;
		},
		setTask(state, payload) {
			state.task = payload;
		},
		setTasks(state, payload) {
			state.tasks = payload;
		},
		setEnv(state, payload) {
			state.env = payload;
		},
		setSerial(state, payload) {
			state.serial = payload;
		},

		// redirect
		setRedirect(state, payload) {
			state.redirect = payload;
		},
		putTaskId(state,payload){
			state.taskIds = [...state.taskIds,...payload];
		},
	},
	getters: {}
})

export default store
