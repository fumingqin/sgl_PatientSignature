<template>
	<view>
		<view style="width: 100%; height: 24px;"></view>

		<!-- 首页顶部 -->
		<view class="homeTopStyle">
			<view class="hts_view" style="width: 100%;" @click="callOut">
				<image class="hts_v_image" src="../../static/logo.png"></image>
				<view class="hts_v_title">患者手写签名服务</view>
				<!-- <text  class="hts_v_text">职务：护士长 </text> -->
				<text class="hts_v_text">科室：{{userInfo.deptName}}&nbsp;&nbsp;{{callOutStatus ? '▲': '▼'}}</text>
				<text class="hts_v_text" style=" margin-right: 16px;">您好，{{userInfo.userName}}！</text>
			</view>

			<view v-if="callOutStatus" class="hts_callOutView">
				<view class="hts_cot_news" @click="userStatus">我的信息</view>
				<view class="hts_cot_login" @click="signOut">退出登录</view>
			</view>
		</view>


		<u-popup v-model="userInformationStatus" mode="center" width="32%">
			<view class="hts_popup_view">
				<image class="hts_p_v_image" src="../../static/touxiang.jpg" mode="aspectFill"></image>
				<view class="hts_p_v_text">工号：{{userInfo.userId}}</view>
				<view class="hts_p_v_text">姓名：{{userInfo.userName}} </view>
				<view class="hts_p_v_text">手机号码：{{userInfo.mobile}} </view>
				<view class="hts_p_v_text">所属科室：{{userInfo.deptName}} </view>
				<!-- <view class="hts_p_v_text">所属岗位：{{userInfo.deptName}}护士长 </view> -->
				<view class="hts_p_v_text">登录状态：<text :style="userInfo.status == 1 ? 'color: #18B566;' : 'color: #fe5b5a;'">{{userInfo.status == 1 ? '登录中' : '登录过期'}}</text></view>
				<view class="hts_p_v_text">登录时长：{{userInfo.duration}}分钟 </view>
			</view>
		</u-popup>

		<view style="display: flex;">
			<!-- 患者状态栏 -->
			<view class="A_view">
				<u-subsection :list="tabsList" :current="tabsCurrent" @change="tabsChange" bg-color="#3785f9" inactive-color="#fff"
				 height="40" font-size="14"></u-subsection>
				<input type="text" class="view_input" placeholder="搜索: 床号、姓名、性别(0男,1女)、年龄" @input="searchChange" />

				<!-- 患者信息列表 -->
				<scroll-view style="height: 60vh;" scroll-y>
					<view v-for="(item,index) in patientList " :key="index" class="view_listView" :class="patientClickNumber === index ? 'view_listViewColor' : '' "
					 @click="patientClick(index)">
						<u-row gutter="2">
							<u-col span="2" text-align="center">
								<view>{{item.patientBedNo == '' ? '暂无' : item.patientBedNo}}</view>
							</u-col>
							<u-col span="4" text-align="center">
								<view>{{item.patientName}}</view>
							</u-col>
							<u-col span="3" text-align="center">
								<view>{{ageChange(item.patientSex)}}</view>
							</u-col>
							<u-col span="3" text-align="center">
								<view>{{item.patientAge }}岁</view>
							</u-col>
						</u-row>
					</view>
				</scroll-view>
			</view>

			<!-- 同意书列表 -->
			<view class="B_view">
				<view>
					<view class="view_text" style="background: #3785f9;" v-if="patientClickNumber !== -1">{{nameCheck(patientList[patientClickNumber].patientName)}}
						- 患者同意书列表</view>
					<view class="view_text" v-if="patientClickNumber == -1">患者同意书列表</view>
				</view>

				<view style="display: flex;" v-if="patientClickNumber !== -1">
					<view class="box_scrollView" v-for="(item,index) in buttonList" :key="index" @click="buttonClick(index)">
						<view class="scrollView_text" :style="{'background' : item.background}">{{item.title}}</view>
					</view>
				</view>

				<scroll-view style="height: 60vh;" scroll-y>
					<view class="B_ListView"  v-if="patientClickNumber !== -1">
							<uni-swipe-action v-for="(item,index) in bookList " :key="index">
								<uni-swipe-action-item :right-options="options" @click="swipeClick($event,index)">
								<view class="ListView_view">
									<view class="LS_v_text1">{{item.fileName}}</view>
									<text class="LS_v_text2" v-if="item.type !== 2" :class="item.type === 1 ? 'color1' : 'color2'">{{bookTypeCheck(item.status)}}</text>
									<text class="LS_v_text2" v-if="item.type == 2">{{bookTypeCheck(item.status)}}</text>
									<text class="LS_v_text3">{{item.updatedAt}}</text>
								</view>
								</uni-swipe-action-item>
							</uni-swipe-action>
					</view>
				</scroll-view>
			</view>
		</view>

		<u-popup v-model="PickerShow" mode="center" width="55%" height="80%" @close="closeClick">
			<view class="popup_view">
				<view class="v_title">请选择新建的签署模板</view>
				<scroll-view class="v_score" scroll-y>
					<u-radio-group :wrap="true" size="20px">
						<u-radio label-size="14px" class="v_s_radio" v-for="(item, index) in PickerList" :key="index" :disabled="item.disabled"
						 :name="item.title" :style="PickerIndex == index ? 'border: 1px solid #2979FF;' : ''" @change="radioChange(index)"><text
							 :style="PickerIndex == index ? 'color: #2979FF;' : ''">{{item.title}}</text></u-radio>
					</u-radio-group>
				</scroll-view>
				<view class="v_button">
					<text class="v_t_text" style="background: #ff6600; margin-right: 12px;" @click="closeClick">关闭</text>
					<text class="v_t_text" style="background: #2979FF;" @click="defineClick">确认</text>
				</view>
			</view>
		</u-popup>


		
		<u-popup v-model="cancelPopup" mode="center" :closeable="true" width="50%" height="48%" close-icon-size="15px"  >
			<view class="box_Vlew">
				<view style="text-align: center;">
					<text class="box_refundContentTitle">请填写/选择取消签署的原因</text>
				</view>
				
				<!-- 滑动区域 -->
				<scroll-view  style="margin-bottom: 24px;" scroll-x>  
					<view style="display: flex;">
						<view class="box_scrollView" v-for="(item,index) in contentList" :key="index" @click="choiseListData(index)">
							<text class="scrollView_text">{{item}}</text>
						</view>
					</view>
				</scroll-view>
				
				<!-- 输入框 -->
				<view class="box_inputView" >
					<input class="inputStyle" v-model="contentInputData" type="text" placeholder="填写/选择失败原因"/>
				</view>
				
				<!-- 确认按钮 -->
				<view class="box_refundButtonView">
					<text class="box_refundButton" @click="cancel">确认</text>
				</view>
			</view>
		</u-popup>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: '', //用户数据
				tabsList: [{
					name: '在院'
				}, {
					name: '全科'
				}, {
					name: '转科'
				}, {
					name: '出院'
				}], //切换栏列表
				tabsCurrent: 0, //切换栏默认值
				searchValue: '', //搜索值
				patientList: [], //患者列表
				patientClickNumber: -1, //点击患者下标

				bookList: [], // 同意书列表

				buttonList: [{
					title: '新增',
					background: '#00c566'
				}, {
					title: '刷新',
					background: '#ff6600'
				}], //按钮列表

				PickerShow: false, //单选框
				PickerList: [{
					title: '入院告知书',
					url: 'https://www.gjtool.cn/pdfh5/git.pdf', 
					disabled: false,
				}], //选择器列表
				PickerIndex: -1, //选择值
				callOutStatus: false, //呼出面板状态值
				userInformationStatus: false, //用户信息弹框

				options: [{
					text: '开始签署',
					style: {
						backgroundColor: '#2979FF'
					}
				},{
					text: '取消签署',
					style: {
						backgroundColor: '#dd524d'
					}
				}],//滑动按钮样式
				
				cancelPopup : false,//取消签署弹框状态
				contentList : ['新增文书内容错误','患者信息有误','医生信息有误','患者拒绝签署'],//可选取消内容
				contentInputData : '', //取消输入框数据
			}
		},

		onLoad: function() {
			uni.getStorage({
				key: 'UserInfo',
				success: (res) => {
					if (res.data) {
						this.userInfo = res.data
						this.loadData()
					}
				},
				fail: (err) => {
					uni.showModal({
						title: '你暂未登录/登录状态已过期',
						content: '为了确保您的账户安全与相关权益保障，系统会在您长时间无操作时自动退出登录状态~',
						showCancel: false,
						confirmText: '登录',
						confirmColor: '#2979FF',
						success: (res) => {
							uni.redirectTo({
								url: 'login'
							})
						}
					})
				}
			})
		},

		onPullDownRefresh: function() {
			this.loadData();
		},

		onShow: function() {
			if (this.patientClickNumber !== -1) {
				this.loadBooksData()
			}
		},

		onBackPress: () => {
			return true
		},

		methods: {
			//----------------------------------加载医院患者数据 ----------------------------------
			loadData: function() {
				uni.showLoading({
					title: '信息加载中...'
				})
				uni.request({
					url: this.$sgl.SglInterface.datagrid.Url,
					method: this.$sgl.SglInterface.datagrid.method,
					data: {
						deptId: this.userInfo.deptId,
						type: this.tabsCurrent
					},
					success: (res) => {
						console.log(res)
						uni.stopPullDownRefresh()
						uni.hideLoading()
						this.patientList = res.data.data;

					},
					fail: (err) => {
						// console.log(err)
						uni.hideLoading()
						uni.stopPullDownRefresh()
						uni.showToast({
							title: '网络异常，请查看平板是否连接内网WIFI',
							icon: 'none'
						})
					}
				})
			},

			//----------------------------------搜索框输入值监听与请求----------------------------------
			searchChange: function(e) {
				console.log(e)
				this.searchValue = e.detail.value;
				if (e.detail.value == '') {
					this.loadData()
				} else {
					uni.request({
						url: this.$sgl.SglInterface.search.Url,
						method: this.$sgl.SglInterface.search.method,
						data: {
							keyword: this.searchValue,
						},
						success: (res) => {
							uni.hideLoading()
							this.patientList = res.data.data;
							// console.log(res)
						},
						fail: (err) => {
							uni.hideLoading()
							uni.showToast({
								title: '网络异常，请查看平板是否连接内网WIFI',
								icon: 'none'
							})
							// console.log(err)
						}
					})
				}
			},

			//----------------------------------加载同意书列表----------------------------------
			loadBooksData: function() {
				uni.showLoading({
					title: '查询信息中...'
				})
				uni.request({
					url: this.$sgl.SglInterface.tobesigned.Url,
					method: this.$sgl.SglInterface.tobesigned.method,
					data: {
						patientId: this.patientList[this.patientClickNumber].patientId,
						// deptId : this.userInfo.deptId,
					},
					success: (res) => {
						uni.hideLoading()
						this.bookList = res.data.data;
						console.log(res)
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showToast({
							title: '网络异常，请查看平板是否连接内网WIFI',
							icon: 'none'
						})
					}
				})
			},


			//----------------------------------tabs点击传值----------------------------------
			tabsChange: function(e) {
				this.tabsCurrent = e
				this.loadData();
			},

			//----------------------------------点击患者----------------------------------
			patientClick: function(e) {
				if (this.patientClickNumber == e) {
					this.patientClickNumber = -1
				} else {
					this.patientClickNumber = e
					this.loadBooksData()
				}
			},

			//----------------------------------名称校验----------------------------------
			nameCheck: function(e) {
				if (e == undefined) {
					return ''
				} else {
					return e
				}
			},

			//----------------------------------同意书状态校验----------------------------------
			bookTypeCheck: function(e) {
				if (e == 0) {
					return '未签'
				} else if (e == 1) {
					return '已签'
				} else if (e == 2) {
					return '存档'
				} else {
					return '取消'
				}
			},

			//----------------------------------按钮点击----------------------------------
			buttonClick: function(e) {
				if (e == 0) {
					this.PickerShow = true
				} else if (e == 1) {
					this.loadBooksData()
				}
			},


			//----------------------------------关闭弹窗回调----------------------------------
			closeClick: function() {
				this.PickerShow = false;
				this.PickerIndex = -1;
			},

			//----------------------------------确认选择回调----------------------------------
			defineClick: function() {
				if (this.PickerIndex == -1) {
					uni.showToast({
						title: '请选择模板',
						icon: 'none'
					})
				} else {
					this.PickerShow = false;
					uni.showToast({
						title: '接口调试中',
						icon: 'none'
					})
					// uni.navigateTo({
					// 	url:'../bookPreview/bp_show'
					// })
					this.PickerIndex = -1;
				}

			},

			//----------------------------------实时监听选择值----------------------------------
			radioChange: function(e) {
				// console.log(e)
				this.PickerIndex = e
			},

			//----------------------------------打开功能弹框----------------------------------
			callOut: function() {
				if (this.callOutStatus == false) {
					this.callOutStatus = true
				} else {
					this.callOutStatus = false
				}
			},

			//----------------------------------退出登录----------------------------------
			signOut: function(e) {
				this.callOutStatus = false
				uni.showModal({
					title: '您确定要退出账号吗？',
					confirmColor: '#FA3534',
					confirmText: '退出',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorage({
								key: 'UserInfo'
							})
							uni.redirectTo({
								url: 'login'
							})
						}
					}
				})
			},

			//----------------------------------打开用户弹框----------------------------------
			userStatus: function() {
				this.callOutStatus = false
				this.userInformationStatus = true
			},

			//----------------------------------性别参数转换----------------------------------
			ageChange: function(e) {
				if (e == 0) {
					return '男'
				} else {
					return '女'
				}
			},
			
			//点击插入文字
			choiseListData:function(e){
				var a = this.contentList[e]+'，';
				var b = this.contentInputData;
				var c = b.concat(a)
				this.contentInputData = c;
			},
			
			//点击删除
			swipeClick : function(e,index){
				if(e.content.text == '开始签署'){
					uni.navigateTo({
						url: '../bookPreview/bp_show?id=' + this.bookList[index].id
					})
				}else if(e.content.text == '取消签署'){
					this.cancelPopup = true;
				}
			},
			
			//取消
			cancel :function(){
				uni.showLoading({
					title:'提交中...'
				})
				if(this.contentInputData == ''){
					uni.hideLoading()
					uni.showToast({
						title: '取消签署原因不可为空',
						icon:'none'
					})
				}else{
					uni.request({
						url: this.$sgl.SglInterface.cancel.Url,
						method: this.$sgl.SglInterface.cancel.method,
						data: {
							id: Number(this.id),
							reason : this.contentInputData
						},
						success: (res) => {
							uni.hideLoading()
							if(res.data.status){
								uni.showToast({
									title: '取消成功',
									duration: 1000,
								})
								setTimeout(function() {
									uni.navigateBack()
								}, 1000)
							}else{
								uni.showToast({
									title: '取消失败，请重新取消',
									icon:'none'
								})
							}
							
						},
						fail: (err) => {
							uni.hideLoading()
							uni.showToast({
								title: '网络异常，请查看平板是否连接内网WIFI',
								icon: 'none'
							})
							console.log(err)
						}
					})
				}
				
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	//首页顶部样式
	.homeTopStyle {
		background: #2979FF;
		margin: 8px;
		border-radius: 4px;
		color: #FFFFFF;
		padding: 15px 16px 16px 16px;
		height: 56px;

		//顶部界面栏
		.hts_view {
			.hts_v_image {
				width: 18px;
				height: 18px;
				float: left;
				margin: 4px 5px 0 0;
			}

			.hts_v_title {
				font-size: 17px;
				font-weight: bold;
				float: left;
				letter-spacing: 1px;
			}

			.hts_v_text {
				font-size: 14px;
				margin-top: 4px;
				float: right;
			}
		}

		//功能弹框
		.hts_callOutView {
			background: #FFFFFF;
			width: 15vw;
			height: 16.5vh;
			position: absolute;
			right: 24.5px;
			top: 72px;
			box-shadow: 2px 1px 5px #aaa;
			color: #000000;
			font-size: 15px;
			text-align: center;

			.hts_cot_news {
				padding: 11px 0;
				border-bottom: 1px solid #f5f5f5;
			}

			.hts_cot_login {
				padding: 11px 0;
				color: #FA3534;
				width: 100%;
			}
		}
	}

	//个人信息弹框
	.hts_popup_view {
		background: #FFFFFF;
		width: 100%;
		padding: 12px;
		text-align: center;

		.hts_p_v_image {
			width: 120px;
			height: 120px;
			margin-bottom: 8px;
			border-radius: 4px;
		}

		.hts_p_v_text {
			font-size: 14px;
			letter-spacing: 1px;
			text-align: left;
		}
	}


	//患者列表
	.A_view {
		background: #f6f6f6;
		margin: 0 8px;
		width: 38%;

		.view_input {
			margin: 10px 8px;
			background: #fff;
			border-radius: 5px;
			padding: 11px 12px;
			font-size: 13px;
			border: 1px solid #eee;
		}

		.view_listView {
			background: #f6f6f6;
			margin: 0 8px;
			border-bottom: 1px solid #eee;
			padding: 14px 0;
			font-size: 14px;

			&.view_listViewColor {
				background: #A0CFFF;
			}
		}
	}

	//同意书列表
	.B_view {
		margin-right: 8px;
		width: 62%;

		.view_text {
			width: 100%;
			padding: 11.5px 12px;
			font-size: 15px;
			color: #FFFFFF;
			background: #aaa;
			border-radius: 5px;
		}

		.B_ListView {

			// margin: 0px 12px;
			.ListView_view {
				position: relative;
				padding: 15px 0 15px 12px;
				border-bottom: 1px solid #eee;

				.LS_v_text1 {
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					width: 350px;
					font-size: 14px;
				}

				.LS_v_text2 {
					position: absolute;
					right: 0px;
					top: 8px;
					font-size: 13px;

					&.color1 {
						color: #1fd757;
					}

					&.color2 {
						color: #fe5b5a;
						;
					}
				}

				.LS_v_text3 {
					position: absolute;
					right: 0px;
					bottom: 9px;
					font-size: 11px;
				}
			}
		}
	}

	//滑动区域
	.box_scrollView {
		white-space: nowrap;

		.scrollView_text {
			margin: 10px 12px;
			margin-left: 0;
			padding: 8px 32px;
			font-size: 14px;
			color: #FFFFFF;
			border-radius: 4px;
		}
	}



	//弹框样式
	.popup_view {
		width: 100%;
		padding: 16px;
		position: relative;

		.v_title {
			font-weight: bold;
			font-size: 14px;
		}

		.v_score {
			margin: 8px 0;
			width: 100%;
			height: 58vh;

			.v_s_radio {
				padding: 10px 24px;
				margin: 6px 0;
				border: 1px solid #ccc;
				border-radius: 4px;
			}

			.v_s_classRadio {}
		}

		.v_button {
			float: right;
			margin-bottom: 16px;
			background: #FFFFFF;

			.v_t_text {
				border-radius: 4px;
				font-size: 12px;
				padding: 8px 32px;
				color: #FFFFFF;
				text-align: center;
			}
		}
	}
	
	//审核弹框
	.box_Vlew {
		padding: 4px 24px;
		padding-bottom: 12px;
		background: #FFFFFF;
		
		//标题样式
			
			.box_refundContentTitle {
				font-size: 20px;
				font-weight: bold;
			}
		//滑动区域
		.box_scrollView{
			margin:4px 0; 
			white-space: nowrap;
			.scrollView_text{
				padding: 6px 12px; 
				font-size: 14px;  
				color: #AAAAAA; 
				border: 1upx solid #AAAAAA; 
				border-radius: 4px;
			}
		}
		//输入区域
		.box_inputView{
			width: 100%; 
			background: #EEEEEE; 
			border-radius: 60upx;
			.inputStyle{
				// height: 96upx; 
				padding: 12px 16px;
				font-size: 14px;
			}
		}
		
		//确认按钮
		.box_refundButtonView {
			text-align: center;
			margin: 12px 0;
			//确认按钮
			.box_refundButton {
				font-size: 16px;
				color: #FFFFFF;
				border-radius: 56px;
				background: #FF6600;
				padding: 8px 64px;
			}
		}
	}
</style>
