//报备信息相关接口
import Service from './service';


class MediaService extends Service {

	// media
	static all(params, callback) {
		let url = `/rest/medias`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
	static add(data, callback) {
		let url = `/rest/medias`;
		super.post(url, data, callback);
	}
	// id
	static byId(id, callback) {
		let url = `/rest/medias/${id}`;
		super.get(url, callback);
	}
	static byIdContract(id, callback) {
		let url = `/rest/medias/${id}/contractPhotos`;
		super.get(url, callback);
	}
	static byIdAll(params, callback) {
		let url = `/rest/medias/${params}?projection=withAll`;
		super.get(url, callback);
	}
	static putById(params, data, callback) {
		let url = `/rest/medias/${params}`;
		super.put(url, data, null, callback);
	}
	static accept(params, callback) {
		let url = `/media/accept`;
		super.put(url, params, null, callback);
	}
	static delById(params, callback) {
		let url = `/rest/medias/${params}`;
		super.del(url, callback);
	}

	// include
	static includeId(params, callback) {
		let url = `/rest/medias/${params.id}/${params.name}`;
		super.request(url, params.method, params.data, params.header, callback);
	}

	// media-visit
	static visit(params, callback) {
		let url = '/media/'
		super.put(url, params, null, callback)
	}

	// media-status
	static byStatus(params, callback) {
		let url = `/rest/medias/search/findByStatus`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// media-HouseId
	static byHouseId(params, callback) {
		let url = `/rest/medias/search/findByByTaskHouseId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// media-TaskId
	static byTaskId(params, callback) {
		let url = `/rest/medias/search/findByTaskId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// media-status-residentId
	static byStatusAndResidentId(params, callback) {
		let url = `/rest/medias/search/findByStatusAndResidentId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// media-status-taskId
	static byStatusAndTaskId(params, callback) {
		let url = `/rest/medias/search/findByStatusAndTaskId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

}

export default MediaService;
