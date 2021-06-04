//驻场人员相关接口
import Service from './service';

class ResidentService extends Service {

	// report
	static all(params, callback) {
		let url = `/rest/residents`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
	static save(params, data, callback) {
		let url = `/rest/residents/${params}`;
		super.post(url, data, callback);
	}

	// id
	static byId(params, callback) {
		let url = `/rest/residents/${params}`;
		super.get(url, callback);
	}
	static byIdAll(params, callback) {
		let url = `/rest/residents/${params}?projection=withAll`;
		super.get(url, callback);
	}
	static putById(params, data, callback) {
		let url = `/rest/residents/${params}`;
		super.put(url, data, null, callback);
	}
	static accept(params, callback) {
		let url = `/report/accept`;
		super.put(url, params, null, callback);
	}
	static delById(params, callback) {
		let url = `/rest/residents/${params}`;
		super.del(url, callback);
	}
	static houseQuery(param, callback) {
		let url = `/house/query`
		if (param) {
			url += '?' + Object.keys(param).map(k => `${k}=${param[k]}`).join('&')
		}
		super.get(url, callback)
	}
	// include
	static includeId(params, callback) {
		let url = `/rest/residents/${params.id}/${params.name}`;
		super.request(url, params.method, params.data, params.header, callback);
	}

	static getResidentByHouseId(params, callback) {
		let url = `/rest/residents/search/findByHouses_Id/${params}?projection=withAll`;
		super.get(url, callback);
	}

	static findByPhone(params, callback) {
		let url = `/rest/residents/search/findByPhone`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	static residentWx(params, callback) {
		let url = `/rest/residents/${params.id}/wx`;
		super.request(url, params.method, params.data, params.header, callback);
	}

	static idWx(id, callback) {
		let url = `/rest/residents/${id}/wx`;
		super.get(url, callback);
	}

	static getResidentByHouseId(params,callback){
        let url = `/rest/residents/search/findByHouses_Id/${params}?projection=withAll`;
        super.get(url,callback);
    }

    static findByHousesId(houseId,callback){
        let url = `/rest/residents/search/findByHouses_Id?houseId=${houseId}`
        super.get(url,callback);
    }
}


export default ResidentService;
