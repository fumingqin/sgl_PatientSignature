<template>
	<view>
		<view class="br_view">
			<image class="br_image" src="../../static/background.png" mode="aspectFill"></image>
		</view>
		<view class="window">
			<view class="window_top">
				<view style="display: flex; border-bottom: 1upx dashed #EAEAEA; padding: 24px; 0">
					<view style="width: 50%; height:100%; position:relative; text-align: right; -webkit-align-items:center; border-right: 1upx solid; border-image: linear-gradient(#55C794,#FFA54D,#FF828C) 0 100;">
						<image class="wd_image" src="../../static/wjw_logo.png" mode="aspectFit"></image>
					</view>
					<text style="padding: 15px 32px; font-size: 20px; color: #1c6adf; font-weight: bold; letter-spacing: 2px;">患者签名服务系统</text>
				</view>
				<view style="display: flex;">
					<view style="width: 50%; height: 70vh; padding: 56px 0 90px 0;">
						<view style="height: 100%; padding: 0px 72px; border-right: 1upx dashed #EAEAEA;">
							<image style="width: 100%; height: 100%;" src="../../static/login_image1.png" mode="aspectFit"></image>
						</view>
					</view>

					<view style="width: 50%; height: 70vh; padding: 36px; padding-top: 60px;" :hidden="userStatus == true">
						<view style="text-align: center; font-weight: 600; font-size: 24px; color: #1c6adf; letter-spacing: 4px;">选择登陆方式</view>
						<view class="buttom_btn buttom_view1" @click="userStatus = true">Ukey账号登录</view>
						<view class="buttom_btn buttom_view2" @click="popupUser = true" >云签扫码登录</view>
						<view style="font-size: 12px; margin: 0 32px; color: #888;">
							<!-- <text style="float: left;">优化意见</text> -->
							<text style="float: right;" @click="iphoneNumber" >联系客服</text>
						</view>
					</view>
					
					<view style="width: 50%; height: 70vh; padding: 36px; padding-top: 48px;" :hidden="userStatus == false">
						<view style="text-align: center; font-weight: 600; font-size: 24px; color: #1c6adf;">UKEY账号登录</view>
						<view style="text-align: center; font-size: 12px; color: #aaa;">请输入Ukey账号密码进行登录</view>
						
						<!-- 手机号+验证码 -->
							<!-- 手机号 -->
							<view style="display: flex; border-bottom: 1upx solid #EAEAEA; margin: 10px 24px;" >
								<image style="width: 16px; height: 16px; margin-top: 15px;" src="../../static/shouji.png" mode="aspectFit" ></image>
								<input style="padding: 12px 12px; font-size: 15px; width: 100%;" type="text" placeholder="输入账号"  v-model="phoneNumber"  @input="inputChange" @confirm="putAway"/>
							</view>
							<view style="display: flex; border-bottom: 1upx solid #EAEAEA; margin: 10px 24px;" >
								<image style="width: 16px; height: 16px; margin-top: 15px;" src="../../static/yanzhengma.png" mode="aspectFit" ></image>
								<input style="padding: 12px 12px; font-size: 15px; width: 100%;" type="password" placeholder="输入密码"  v-model="password" :focus="inputStatus == true" @input="inputChange2" @confirm="loginNetTo" />
							</view>
							<view class="loginButton_view">
								<view  class="lb_v_buttonStyle lb_v_button1" @click="returnClick">返回</view>
								<view class="lb_v_buttonStyle lb_v_button2" @click="loginNetTo" >登录</view>
							</view>
					</view>
					 
					<u-popup v-model="popupUser" mode="center" width="32%" height="42%">
						<view style="background: #FFFFFF; width:100%; text-align: center; ">
							<view style="font-size: 20px; font-weight: bold; margin: 12px 0; letter-spacing: 4px; color: #1c6adf;"> 云签扫码登录</view>
							<image style="width: 25vh; height: 25vh;" src="../../static/erweima.png" mode="aspectFill"></image>
							<view style="font-size: 12px;">请使用'深圳卫健委云签'小程序，扫码登录</view>
						</view>
					</u-popup>
				</view>
			</view>
		</view>
		<view style="font-size: 10px; color: #FFFFFF; text-align: center; width: 100%; z-index: 3; position: relative; bottom: 6px;">技术支持：深圳市圣格灵科技有限公司</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popupUser : false,//云签登录弹框
				userStatus : false, //账号登录模式
				inputStatus : false,//密码框聚焦状态
				
				phoneNumber : '', //账号
				password : '', //密码
			}
		},
		methods: {
			//拨打手机号码
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
			
			//收起键盘
			putAway : function(){
				uni.hideKeyboard()
				this.inputStatus = true
				
			},
			
			//选择返回
			returnClick : function(){
				this.userStatus = false
				this.inputStatus = false
			},
			
			
			//--------------------------------登录，跳转页面----------------------------------
			loginNetTo:function(e){
				this.inputStatus = false
				uni.redirectTo({
					url:'./h_index'
				})
			}
			
		}
	}
</script>

<style lang="scss">
	page{
		background: #0774f0;
	}
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

			.wd_image {
				padding-top: 10upx;
				padding-right: 20upx;
				width: 130upx;
				height: 36upx;
			}
		}
	}


	//动态按钮样式
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
