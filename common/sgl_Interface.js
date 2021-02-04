// 接口Js文件

const url = 'http://192.168.1.82:8088';

const SglInterface = {
	
	doLogin:{
		Url: url + '/patient/tabletSign/doLogin',
		name:'登录校验',
		method:'POST',
		header:{'content-type':'application/x-www-form-urlencoded'},
	},
	
	datagrid:{
		Url: url + '/patient/tabletSign/patient/datagrid',
		name:'患者列表',
		method:'POST',
		header:{'content-type':'application/x-www-form-urlencoded'},
	},
	
	search:{
		Url: url + '/patient/tabletSign/patient/search',
		name:'搜索',
		method:'POST',
		header:{'content-type':'application/x-www-form-urlencoded'},
	},
	
	tobesigned:{
		Url: url + '/patient/tabletSign/patient/tobesigned',
		name:'同意书列表',
		method:'POST',
		header:{'content-type':'application/x-www-form-urlencoded'},
	},
	
	details:{
		Url: url + '/patient/tabletSign/record/details',
		name:'文档详情查询',
		method:'POST',
		header:{'content-type':'application/x-www-form-urlencoded'},
	},
	
	uploadStamp:{
		Url: url + '/patient/tabletSign/record/uploadStamp',
		name:'手写签字图片上传',
		method:'POST',
		header:{'content-type':'application/x-www-form-urlencoded'},
	},
	
	composePDF:{
		Url: url + '/patient/tabletSign/record/composePDF',
		name:'签名文件合成',
		method:'POST',
		header:{'content-type':'application/x-www-form-urlencoded'},
	},
	
	submit:{
		Url: url + '/patient/tabletSign/record/submit',
		name:'确认提交',
		method:'POST',
		header:{'content-type':'application/x-www-form-urlencoded'},
	},
	
	cancel:{
		Url: url + '/patient/tabletSign/record/cancel',
		name:'取消签署',
		method:'POST',
		header:{'content-type':'application/x-www-form-urlencoded'},
	},
	
}

//声明接口
export default{
	SglInterface,
}