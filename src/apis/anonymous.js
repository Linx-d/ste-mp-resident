//任务信息相关接口
import Service from './service';


class AnonymousService extends Service {

	// report
	static byTaskId(id, callback) {
		let url = `/anonymous/task/${id}`;
		super.get(url, callback);
	}

	// report
	static byUserId(id, callback) {
		let url = `/anonymous/user/${id}`;
		super.get(url, callback);
	}
}

export default AnonymousService;
