//驻场人员相关接口
import Service from './service';

class InviteCodeService extends Service {

	// report
	static all(params, callback) {
		let url = `/rest/inviteCodes`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
	static save(params, data, callback) {
		let url = `/rest/inviteCodes/${params}`;
		super.post(url, data, callback);
	}

	// id
	static byId(params, callback) {
		let url = `/rest/inviteCodes/${params}`;
		super.get(url, callback);
	}
	static byIdAll(params, callback) {
		let url = `/rest/inviteCodes/${params}?projection=withAll`;
		super.get(url, callback);
	}
	static putById(params, data, callback) {
		let url = `/rest/inviteCodes/${params}`;
		super.put(url, data, null, callback);
	}
	static accept(params, callback) {
		let url = `/report/accept`;
		super.put(url, params, null, callback);
	}
	static delById(params, callback) {
		let url = `/rest/inviteCodes/${params}`;
		super.del(url, callback);
	}

	static createLink(params, callback) {
		let url = `/invite-code/create`;
		if(params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.post(url, callback);
	}

	static generate(callback) {
		let url = `/invite-code/generate`;
		super.post(url, null, callback);
	}
	static editShare(id, params, callback) {
		let url = `/invite-code/${id}/share`;
		if(params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.put(url, null, null, callback);
	}
	static check(code, callback) {
		let url = `/invite-code/check?code=${code}`;
		super.get(url, callback);
	}
}


export default InviteCodeService;
