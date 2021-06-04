//置业顾问相关接口
import Service from './service';


class IntentionDataService extends Service {

	// consultants
	static all(params, callback) {
		let url = `/rest/consultants`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
	static save(data, callback) {
		let url = `/rest/consultants`;
		super.post(url, data, callback);
	}
	static edit(data, callback) {
		let url = `/consultant/update`;
		super.put(url, data, null, callback);
	}

	// id
	static byId(id, callback) {
		let url = `/rest/consultants/${id}`;
		super.get(url, callback);
	}
	static delById(id, callback) {
		let url = `/rest/consultants/${id}`;
		super.del(url, callback);
	}

	// consultant-houseId
	static inHouse(id, callback) {
		let url = `/rest/consultants/search/findAllByHouseId?houseId=${id}`;
		super.get(url, callback);
	}

	// consultant-houseId
	static query(params, callback) {
		let url = `/consultant/query`;
		if (params) {
			url = url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
}

export default IntentionDataService;
