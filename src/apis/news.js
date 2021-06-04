//房屋信息相关接口
import Service from './service';

class NewsService extends Service {
        //添加楼盘动态
        static postNews(params, callback){
            let url = `/rest/news`;
            super.post(url, params, callback);
        }

          	//上传楼盘动态图片
	static putNewsPhotos(id, data, callback) {
		let url = `/rest/news/${id}/media`
		super.put(url, data, {
			'Content-Type': 'text/uri-list'
		}, callback)
	}

}

export default NewsService;