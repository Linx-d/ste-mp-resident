//报备信息相关接口
import Service from './service';

const api = {
	visitRegistration: '/report/visitRegistration'
}

class ReportService extends Service {

	// report
	static all(params, callback) {
		let url = `/rest/reports`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
	static save(params, data, callback) {
		let url = `/rest/reports/${params}`;
		super.post(url, data, callback);
	}
	static stat(id, callback) {
		let url = `/report/stat/resident?residentId=${id}`;
		super.get(url, callback);
	}

	// id
	static byId(id, callback) {
		let url = `/rest/reports/${id}`;
		super.get(url, callback);
	}
	static byIdInfo(id, callback) {
		let url = `/rest/reports/${id}?projection=withAll`;
		super.get(url, callback);
	}
	static byIdAll(params, callback) {
		let url = `/rest/reports/${params}?projection=withAll`;
		super.get(url, callback);
	}
	static putById(params, data, callback) {
		let url = `/rest/reports/${params}`;
		super.put(url, data, null, callback);
	}
	static saveById(params, callback) {
		let url = `/report/audit`;
		super.put(url, params, null, callback);
	}
	static accept(params, callback) {
		let url = `/report/accept`;
		super.put(url, params, null, callback);
	}
	static delById(params, callback) {
		let url = `/rest/reports/${params}`;
		super.del(url, callback);
	}

	static checkReportAuth(params, callback) {
		let url = `/report/checkReportAuth`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}


	// include
	static includeId(params, callback) {
		let url = `/rest/reports/${params.id}/${params.name}`;
		super.request(url, params.method, params.data, params.header, callback);
	}

	// report-visit
	static visit(params, callback) {
		let url = '/report/'
		super.put(url, params, null, callback)
	}

	// report-status
	static byStatus(params, callback) {
		let url = `/rest/reports/search/findByStatus`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// report-HouseId
	static byHouseId(params, callback) {
		let url = `/rest/reports/search/findByByTaskHouseId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// report-TaskId
	static byTaskId(params, callback) {
		let url = `/rest/reports/search/findByTaskId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// report-status-residentId
	static byStatusAndResidentId(params, callback) {
		let url = `/rest/reports/search/findByStatusAndResidentId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// report-status-taskId
	static byStatusAndTaskId(params, callback) {
		let url = `/rest/reports/search/findByStatusAndTaskId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	//上传证据链
	static putEvidence(id, data, callback) {
		let url = `/rest/reports/${id}/evidence`
		super.put(url, data, {
			'Content-Type': 'text/uri-list'
		}, callback)
	}

	//查询报备单
	static queryReport(params, callback) {
		let url = `/report/query`
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
	// 更改置业顾问
	static putConsultant(id, params, callback) {
		let url = `/rest/reports/${id}/consultant`;
		super.put(url, params,  {
			'Content-Type': 'text/uri-list'
		}, callback);
	}
		// 根据任务和时间统计报备情况
	static getTaskDate(params, callback) {
		let url = `/report/stat/taskDate`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback)
	}
	static visitRegistration(data, callback) {
		const url = api.visitRegistration
		super.put(url, data, null, callback)
	}
}

export default ReportService;
