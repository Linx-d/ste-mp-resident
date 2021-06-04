//房屋信息相关接口
import Service from './service';

class DictService extends Service {

    static getAll(callback){
        let url = `/rest/dicts`;
        super.get(url,callback);
    }
    static byId(id, callback){
        let url = `/rest/dicts/${id}`;
        super.get(url,callback);
    }

}

export default DictService;