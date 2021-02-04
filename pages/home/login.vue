<template>
	<view>
		<!-- 背景图片 -->
		<view class="br_view">
			<image class="br_image" src="../../static/background.png" mode="aspectFill"></image>
		</view>
		
		<!-- 主体内容 -->
		<view class="window">
			<view class="window_top">
				
				<view class="w_t_view">
					<view class="w_t_v_view" >
						<image class="w_t_v_v_image"  src="../../static/wjw_logo.png" mode="aspectFit"></image>
					</view>
					<text class="w_t_v_text" >患者手写签名服务</text>
				</view>
				
				<view class="w_t_view2">
					<view class="w_t_v2_view">
						<view class="w_t_v2_v_view">
							<image style="width: 100%; height: 100%;" src="../../static/login_image1.png" mode="aspectFit"></image>
						</view>
					</view>

					<view class="w_t_v2_view2" :hidden="userStatus == true">
						<view class="w_t_v2_v2_title">选择登陆方式</view>
						<view class="buttom_btn buttom_view1" @click="userStatus = true">云签账号登录</view>
						<view class="buttom_btn buttom_view2" @click="popupUser = true" >云签扫码登录</view>
						<view class="w_t_v2_v2_text">
							<!-- <text style="float: left;">优化意见</text> -->
							<text style="float: right;" @click="iphoneNumber" >联系客服</text>
						</view>
					</view>
					
					<view class="w_t_v2_view3" :hidden="userStatus == false">
						<view class="w_t_v2_v3_title">云签账号登录</view>
						<view class="w_t_v2_v3_text" >请输入云签账号密码进行登录</view>
						
						<!-- 手机号+验证码 -->
							<!-- 手机号 -->
							<view class="w_t_v2_v3_view">
								<image class="w_t_v2_v3_v_image"  src="../../static/shouji.png" mode="aspectFit" ></image>
								<input class="w_t_v2_v3_v_text" type="text" placeholder="输入账号/工号"  v-model="phoneNumber"  @input="inputChange" @confirm="putAway"/>
							</view>
							<view class="w_t_v2_v3_view" >
								<image class="w_t_v2_v3_v_image" src="../../static/yanzhengma.png" mode="aspectFit" ></image>
								<input class="w_t_v2_v3_v_text" type="password" placeholder="输入密码"  v-model="password" :focus="inputStatus == true" @input="inputChange2" @confirm="loginNetTo" />
							</view>
							<view class="loginButton_view">
								<view  class="lb_v_buttonStyle lb_v_button1" @click="returnClick">返回</view>
								<view class="lb_v_buttonStyle lb_v_button2" @click="loginCheck" >登录</view>
							</view>
					</view>
					 
					<u-popup v-model="popupUser" mode="center" width="32%" height="42%">
						<view class="popupView">
							<view class="popupView_view"> 云签扫码登录</view>
							<image class="popupView_image" src="../../static/erweima.png" mode="aspectFill"></image>
							<view style="font-size: 12px;">请使用'深圳卫健委云签'小程序，扫码登录</view>
						</view>
					</u-popup>
				</view>
			</view>
		</view>
		<view class="BottomCopuer">技术支持：深圳市圣格灵科技有限公司</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popupUser : false,//云签登录弹框
				userStatus : false, //账号登录模式
				inputStatus : false,//密码框聚焦状态
				
				phoneNumber : '0316', //账号
				password : '123456', //密码 
			} 
		},
		methods: {
			//--------------------------------拨打手机号码--------------------------------
			iphoneNumber : function(){
				uni.showModal({
					title:'检查到您的平板不支持电话功能',
					content:'请手动拨打：1348 9208 672，客服名称：小杨',
					showCancel:false, 
					confirmText:'好的 ~'
				})
			},
			
			//-------------------------------------监听input的变化----------------------------------
			inputChange: function(e) {
				this.phoneNumber = e.detail.value;
			},
			
			//-------------------------------------监听input的变化----------------------------------
			inputChange2: function(e) {
				this.password = e.detail.value;
			},
			
			//--------------------------------收起键盘--------------------------------
			putAway : function(){
				uni.hideKeyboard()
				this.inputStatus = true
				
			},
			
			//--------------------------------选择返回--------------------------------
			returnClick : function(){
				this.userStatus = false
				this.inputStatus = false
			},
			
			//--------------------------------登录前校验--------------------------------
			loginCheck : function(){
				uni.showLoading({
					title:'登录校验中...'
				})
				if(this.phoneNumber !== '' && this.password !== ''){
					this.loginNetTo()
					
				}else if(this.phoneNumber == ''){
					uni.hideLoading()
					uni.showToast({
						title:'云签账号不能为空',
						icon:'none'
					})
				}else if(this.password == ''){
					uni.hideLoading()
					uni.showToast({
						title:'云签密码不能为空',
						icon:'none'
					})
				}
			},
			
			//--------------------------------登录，跳转页面--------------------------------
			loginNetTo:function(e){
				this.inputStatus = false;
				var a  = btoa(this.password);
				console.log(a)
				uni.request({
					url: this.$sgl.SglInterface.doLogin.Url,
					method:this.$sgl.SglInterface.doLogin.method,
					data:{
						userId : this.phoneNumber,
						userPin : a
					},
					success: (res) => {
						console.log(res)
						uni.hideLoading()
						if(res.data.status == true){
							uni.showToast({
								title:'登录成功'
							})
							uni.setStorage({
								key:'UserInfo',
								data:res.data.data
							})
							uni.redirectTo({
								url:'./h_index'
							})
						}else{
							uni.showToast({
								title:'云签账号/密码错误，请重试~',
								icon:'none'
							})
						}
					},
					fail: (err) => {
						console.log(err)
						uni.hideLoading()
						uni.showToast({
							title:'网络异常，请查看平板是否连接内网WIFI',
							icon:'none'
						})
					}
				})
				
			}
			
		}
	}
</script>

<style lang="scss">
	page{
		background: #0774f0;
	}
	//背景样式
	.br_view {
		z-index: 1;
		position: absolute;
		width: 100%;
		height: 100vh;

		.br_image {
			width: 100%;
			height: 100%
		}
	}
	
	//主体内容样式
	.window {
		position: relative;
		width: 100%;
		padding: 24px 32px;

		.window_top {
			z-index: 2;
			position: relative;
			padding: 0px 32px 0 32px;
			border-radius: 10upx;
			-webkit-align-items: center;
			background: #FFFFFF;
			
			.w_t_view{
				display: flex; border-bottom: 1upx dashed #EAEAEA; padding: 24px 0; 
				.w_t_v_view{
					width: 50%; height:100%; position:relative; text-align: right; -webkit-align-items:center; border-right: 1upx solid; border-image: linear-gradient(#55C794,#FFA54D,#FF828C) 0 100;
					.w_t_v_v_image{
						padding-top: 10upx; padding-right: 20upx; width: 130upx; height: 36upx;
					}
				}
				.w_t_v_text{
					padding: 15px 32px; font-size: 20px; color: #1c6adf; font-weight: bold; letter-spacing: 2px;
				}
			}
			
			.w_t_view2{
				display: flex;
				.w_t_v2_view{
					width: 50%; height: 70vh; padding: 56px 0 90px 0;
					.w_t_v2_v_view{
						height: 100%; padding: 0px 72px; border-right: 1upx dashed #EAEAEA;
					}
				}
				.w_t_v2_view2{
					width: 50%; height: 70vh; padding: 36px; padding-top: 60px;
					.w_t_v2_v2_title{
						text-align: center; font-weight: 600; font-size: 24px; color: #1c6adf; letter-spacing: 4px;
					}
					.w_t_v2_v2_text{
						font-size: 12px; margin: 0 32px; color: #888;
					}
				}
				.w_t_v2_view3{
					width: 50%; height: 70vh; padding: 36px; padding-top: 48px;
					.w_t_v2_v3_title{
						text-align: center; font-weight: 600; font-size: 24px; color: #1c6adf;
					}
					.w_t_v2_v3_text{
						text-align: center; font-size: 12px; color: #aaa;
					}
					.w_t_v2_v3_view{
						display: flex; border-bottom: 1upx solid #EAEAEA; margin: 10px 24px;
						.w_t_v2_v3_v_image{
							width: 16px; height: 16px; margin-top: 15px;
						}
						.w_t_v2_v3_v_text{
							padding: 12px 12px; font-size: 15px; width: 100%;
						}
					}
				}
			}
			
		}
	}
	
	//popup弹框样式
	.popupView{
		background: #FFFFFF; width:100%; text-align: center;
		.popupView_view{
			font-size: 20px; font-weight: bold; margin: 12px 0; letter-spacing: 4px; color: #1c6adf;
		}
		
		.popupView_image{
			width: 25vh; height: 25vh;
		}
	}
	
	//底部公司标识
	.BottomCopuer{
		font-size: 10px; color: #FFFFFF; text-align: center; width: 100%; z-index: 3; position: relative; bottom: 16px;
	}
	
	//--------------------动态按钮样式-----------------------
	.buttom_btn {
		flex: 1 1 auto;
		margin: 16px 24px;
		padding: 12px 30px;
		text-align: center;
		text-transform: uppercase;
		transition: 0.5s;
		background-size: 200% auto;
		color: white;
		font-size: 16px;
		border-radius: 4px;
		letter-spacing: 2px;
	}

	.buttom_btn:hover {
		background-position: right center;
		/* change the direction of the change here */
	}

	.buttom_view1 {
		background-image: linear-gradient(to right, #f6d365 0%, #fda085 51%, #f6d365 100%);
	}

	.buttom_view2 {
		background-image: linear-gradient(to right, #66e595 0%, #8fd3f4 51%, #54f590 100%)
	}
	
	//动态按钮样式2
	.loginButton_view{
		display: flex; 
		width: 100%; 
		padding: 0 24px; 
		font-size: 16px; 
		text-align: center; 
		margin-top: 24px;
	}
	.lb_v_buttonStyle{
		color: #FFFFFF; 
		padding: 8px 0; 
		border-radius: 4px;
		
		//动态按钮核心代码
		flex: 1 1 auto;
		transition: 0.5s;
		background-size: 200% auto;
		color: white;
		letter-spacing: 2px;
	}
	.lb_v_button1{
		width: 32%; 
		margin-right: 12px; 
		background-image: linear-gradient(to right, #f6d365 0%, #fda085 51%, #f6d365 100%);
	}
	
	.lb_v_button2{
		width: 68%; 
		background-image: linear-gradient(to right, #66e595 0%, #8fd3f4 51%, #54f590 100%)
	}
	
	//动态事件关联
	.lb_v_buttonStyle:hover {
		background-position: right center;
		/* change the direction of the change here */
	}
	
	
</style>
