// 上传oss相关接口
import Service from './service';

import MediaService from "@/apis/media"
class OssService extends Service {

	// sign
	static sign(callback) {
		let url = `/cloud/aliyun/oss/sign`;
		super.get(url, callback);
	}
	// up
	static up(params, callback) {
		let url = params.host
		// let parameters = new FormData()
		// parameters.append('key', params.key)
		// parameters.append('key', `${key}?x-oss-process=image/resize,w_300`)
		// parameters.append('OSSAccessKeyId', params.accessKeyId)
		// parameters.append('policy', params.policy)
		// parameters.append('Signature', params.signature)
		// parameters.append('file', params.file)
		let parameters = {
			key: params.key,
			OSSAccessKeyId: params.accessKeyId,
			policy: params.policy,
			Signature: params.signature,
			file: params.file
		}
		super.requestUp(url, 'put', parameters, {
			"Content-Type": "application/x-www-form-urlencoded"
		}, callback)
	}

	/*
	*  批量上传函数 对象存储
	*  
	*/

	static upploadToOss(file, path, option, callback) {
		let that = this;

		let name = file.split('/').pop();

		path = (path.endsWith('/') ? path + name : path + "/" + name)
		let formData = {
			"key": (path.startsWith("/") ? path.substring(1) : path),
			"success_action_status": 200,
		};
		// 分3步
		// 1、获取授权header
		// 2、上传到bucket
		// 3、保存附件信息        
		that.sign(authRes => {
			console.log(authRes, 'authRes');
			if (authRes.data.success) {
				let auth = authRes.data.data;

				formData["OSSAccessKeyId"] = auth.accessKeyId;
				formData["policy"] = auth.policy;
				formData["Signature"] = auth.signature;
				let url = Service.URI_OSS;
				uni.uploadFile({
					url,
					header: {
						"Content-Type": "multipart/form-data"
					},
					filePath: file,
					name: "file",
					formData,
					dataType: 'json',
					responseType: 'text',
					success(res) { // 返回code为指定结果表示上传成功反之上传失败
						let code = res.statusCode;
						if (code == 200) { // OSS上传成功
							let request = {
								path,
								type: file.type,
							}
							MediaService.add(request, res1 => {
								console.log(res1, 'media res1');
								if (res1.statusCode === 201) {
									switch (option) {
										case 'report':
											callback(res1.data._links.self.href)
											break
										case 'order':
											callback({ id: res1.data.id })
											break
										default:
											callback({ id: res1.data.id })
											break
									}

								} else {
									console.log(res.message, 'media res1 add error');
								}
							})

						} else {
							console.error("updateToOss fail http code : " + code);
							callback && callback(null)
						}
					},
					fail(res) {
						console.error("updateToOss fail : " + JSON.stringify(res))
						callback && callback(null)
					}
				})
			} else {
				console.error("updateToOss get auth header err : " + authRes.data.message)
				callback && callback(null)
			}
		});
	}
}

export default OssService;
