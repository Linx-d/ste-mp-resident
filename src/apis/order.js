// 认购相关接口
import Service from './service';


class OrderService extends Service {

	// adviser
	static all(params, callback) {
		let url = `/rest/orders`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
	static add(params, callback) {
		let url = `/rest/orders`;
		super.post(url, params, callback);
	}
	static save(id, data, callback) {
		let url = `/rest/orders/${id}`
		super.post(url, data, callback)
	}

	// 关联图片
	static putPhoto(id, data, callback) {
		let url = `/rest/orders/${id}/photos`;
		super.put(url, data, { 'Content-Type': 'text/uri-list' }, callback);
	}
	// put order
	static putContract(data, callback) {
		let url = `/order/contract`;
		super.put(url, data, null, callback);
	}
	// 合同照片 
	static getContractPhotos(id, callback) {
		let url = `/rest/orders/${id}/contractPhotos`;
		super.get(url, callback);
	}
	// 认购单照片
	static getPhotos(id, callback) {
		let url = `/rest/orders/${id}/photos`;
		super.get(url, callback)
	}
	//上传认购单
	static putPhotos(id, data, callback) {
		let url = `/rest/orders/${id}/photos`
		super.put(url, data, {
			'Content-Type': 'text/uri-list'
		}, callback)
	}
	// 上传签约单
	static putContractPhotos(id, data, callback) {
		let url = `/rest/orders/${id}/contractPhotos`
		super.put(url, data, {
			'Content-Type': 'text/uri-list'
		}, callback)
	}
	// id
	static byId(id, callback) {
		let url = `/rest/orders/${id}`
		super.get(url, callback);
	}
	static byIdAll(params, callback) {
		let url = `/rest/orders/${params}?projection=withAll`;
		super.get(url, callback);
	}
	static putById(id, data, callback) {
		let url = `/rest/orders/${id}`;
		super.put(url, data, null, callback);
	}
	static delById(id, callback) {
		let url = `/rest/orders/${id}`;
		super.del(url, callback);
	}
	static byOrderIdReport(id, callback) {
		let url = `/rest/orders/${id}/report`;
		super.get(url, callback);
	}

	// include
	static includeId(params, callback) {
		let url = `/rest/orders/${params.id}/${params.name}`;
		super.request(url, params.method, params.data, params.header, callback);
	}

	static byHouseId(params, callback) {
		let url = `/rest/orders/search/findByHouseIdOrder`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// order-HouseId-ResidentId
	static byHouseIdAndResidentId(params, callback) {
		let url = `/rest/orders/search/findByHouseIdAndResidentId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
	static byStatusAndTaskId(params, callback) {
		let url = `/rest/orders/search/findByStatusAndTaskId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// put commissionStatus
	static back(params, callback) {
		let url = '/order/money/back'
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.put(url, null, null, callback)
	}

	//search phone or name
	static queryOrder(params, callback) {
		let url = '/order/query'
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback)
	}
}

export default OrderService;
