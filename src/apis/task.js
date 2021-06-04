//任务信息相关接口
import Service from './service';


class TaskService extends Service {

	// report
	static all(params, callback) {
		let url = `/rest/tasks`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
	static save(params, data, callback) {
		let url = `/rest/tasks/${params}`;
		super.post(url, data, callback);
	}
	// /rest/tasks/{id}/brokerRecords
	static records(id, callback) {
		let url = `/rest/tasks/${id}/brokerRecords`;
		super.get(url, callback);
	}

	// id
	static byId(params, callback) {
		let url = `/rest/tasks/${params}`;
		super.get(url, callback);
	}
	static byIdAll(params, callback) {
		let url = `/rest/tasks/${params}?projection=withAll`;
		super.get(url, callback);
	}
	static taskHouse(id, callback) {
		let url = `/rest/tasks/${id}/house`;
		super.get(url, callback);
	}

	static putById(params, data, callback) {
		let url = `/rest/tasks/${params}`;
		super.put(url, data, null, callback);
	}
	static accept(params, callback) {
		let url = `/report/accept`;
		super.put(url, params, null, callback);
	}
	static delById(params, callback) {
		let url = `/rest/tasks/${params}`;
		super.del(url, callback);
	}

	// include
	static includeId(params, callback) {
		let url = `/rest/tasks/${params.id}/${params.name}`;
		super.request(url, params.method, params.data, params.header, callback);
	}

	// query
	static query(params, callback) {
		let url = `/task/query`
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback)
	}
}

export default TaskService;
