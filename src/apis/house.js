//房屋信息相关接口
import Service from './service';

class HouseService extends Service {
    // adviser
	static all(params, callback) {
		let url = `/rest/houses`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
	static add(params, callback) {
		let url = `/rest/houses`;
		super.post(url, params, callback);
	}
	static save(id, data, callback) {
		let url = `/rest/houses/${id}`
		super.post(url, data, callback)
	}

	// id
	static byId(id, callback) {
		let url = `/rest/houses/${id}`
		super.get(url, callback);
	}
	static byIdAll(params, callback) {
		let url = `/rest/houses/${params}?projection=withAll`;
		super.get(url, callback);
	}
	static putById(id, data, callback) {
		let url = `/rest/houses/${id}`;
		super.put(url, data, null, callback);
	}
	static delById(id, callback) {
		let url = `/rest/houses/${id}`;
		super.del(url, callback);
	}

	// include
	static includeId(params, callback) {
		let url = `/rest/houses/${params.id}/${params.name}`;
		super.request(url, params.method, params.data, params.header, callback);
	}

    static getHouseById(params,callback){
        let url = `/rest/houses/${params}?projection=withAll`;
        super.get(url,callback);
    }
	// 查看许可证
	static getLicenseByHouseId(id,callback){
        let url = `/rest/licences/search/findByHouseId?houseId=${id}&size=5`
        super.get(url,callback);
	}
	
    //楼盘动态
    static getNewsByHouseId(params,callback){
        let url = `/rest/news/search/findByHouseId`;
        if(params){
            url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
        }
        super.get(url,callback);
    }

    //户型
    static getRoomsByHouseId(params,callback){
        let url = `/rest/rooms/search/findByHouseId`;
        if(params){
            url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
        }
        // console.log(url, 'url')
        super.get(url,callback);
	}
	//图片
	static mediaArea(id,callback){
        let url = `/rest/houses/${id}/mediaArea`
        super.get(url,callback)
    }
    static mediaBuilding(id,callback){
        let url = `/rest/houses/${id}/mediaBuilding`
        super.get(url,callback)
    }
    static mediaDesign(id,callback){
        let url = `/rest/houses/${id}/mediaDesign`
        super.get(url,callback)
    }
    static mediaSale(id,callback){
        let url = `/rest/houses/${id}/mediaSale`
        super.get(url,callback)
    }
    static mediaSand(id,callback){
        let url = `/rest/houses/${id}/mediaSand`
        super.get(url,callback)
    }
    static mediaScene(id,callback){
        let url = `/rest/houses/${id}/mediaScene`
        super.get(url,callback)
    }
    static mediaSocial(id,callback){
        let url = `/rest/houses/${id}/mediaSocial`
        super.get(url,callback)
    }

    static allMedia(params,callback){
        let url = `/rest/medias`
        if(params){
            url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
        }
        super.get(url,callback)
    }
	static checkByBrokerIdAndHouseId(params,callback){
	    let url = `/rest/houses/search/checkByBrokerIdAndHouseId`;
		if(params){
		    url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
		}
	    super.get(url,callback);
	}
	
	static houseQuery(params,callback){
	    let url = `/house/query`
	    if(params){
	        url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
	    }
	    super.get(url,callback)
	}
	
}

export default HouseService;