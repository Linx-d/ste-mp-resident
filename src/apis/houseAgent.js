// 客户相关接口
import Service from './service';

const api = {
	base: '/rest/houseAgents',
	findByhouseAndResidentId: '/rest/houseAgents/search/findByHouseAndResidentId',
	query: '/houseAgent/query'
}

class HouseAgentService extends Service {
	static all(params, callback) {
		const url = Service.requestFormat(api.base, params)
		super.get(url, callback);
	}
	static save(data, callback) {
		const url = api.base
		super.post(url, data, callback)
	}
	static ByHouseIdAndResidentId(params, callback) {
		const url = Service.requestFormat(api.findByhouseAndResidentId, params)
		super.get(url, callback);
	}
	static query(params, callback) {
		const url = Service.requestFormat(api.query, params)
		super.get(url, callback);
	}
}

export default HouseAgentService;
