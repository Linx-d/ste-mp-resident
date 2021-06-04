//置业顾问相关接口
import Service from './service';

const api = {
	base: '/rest/houseIntentionDatas',
	query: '/houseIntentionData/query'
}

class HouseIntentionDatasService extends Service {
	static all(params, callback) {
		const url = Service.requestFormat(api.base, params)
		super.get(url, callback);
	}
	static save(data, callback) {
		const url = api.base
		super.post(url, data, callback)
	}
	static query(params, callback) {
		const url = Service.requestFormat(api.query, params)
		super.get(url, callback);
	}
}

export default HouseIntentionDatasService;
