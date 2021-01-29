<template>
	<view>
		<view style="width: 100%; height: 32px;"></view>
		<view style="display: flex;">
			<!-- 患者状态栏 -->
			<view class="A_view">
					<u-subsection  :list="tabsList" :current="tabsCurrent" @change="tabsChange" bg-color="#3785f9" inactive-color="#fff" height="40" font-size="14"></u-subsection>
					<input type="text" class="view_input"  placeholder="搜索: 床号、姓名、全拼或首拼" />
				
				<!-- 患者信息列表 -->
				<scroll-view style="height: 72vh;" scroll-y>
				<view v-for="(item,index) in patientList " :key="index" class="view_listView"  :class="patientClickNumber === index ? 'view_listViewColor' : '' " @click="patientClick(index)">
						<u-row gutter="2">
							<u-col span="1" text-align="center">
								<view>{{item.bedNumber}}</view>
							</u-col>
							<u-col span="5" text-align="center">
								<view>{{item.name}}</view>
							</u-col>
							<u-col span="3" text-align="center">
								<view>{{item.sex}}</view>
							</u-col>
							<u-col span="3" text-align="center">
								<view>{{item.age}}岁</view>
							</u-col>
						</u-row>
				</view>
				</scroll-view>
			</view>
			
			<!-- 同意书列表 -->
			<view class="B_view">
				<view >
					<view class="view_text" style="background: #3785f9;" v-if="patientClickNumber !== -1">
					{{nameCheck(patientList[patientClickNumber].name)}} - 患者同意书列表
					<image style="width: 20px; height: 20px; float: right; margin-top: 2px;" src="../../static/tx.png" mode="aspectFill" @click="signOut"></image>
					</view>
					<view class="view_text" v-if="patientClickNumber == -1"> 
					患者同意书列表
					<image style="width: 20px; height: 20px; float: right; margin-top: 2px;" src="../../static/tx.png" mode="aspectFill" @click="signOut"></image>
					</view>
					
				</view>

				<view style="display: flex;" v-if="patientClickNumber !== -1">
					<view class="box_scrollView" v-for="(item,index) in buttonList" :key="index" @click="buttonClick(index)" >
						<view class="scrollView_text" :style="{'background' : item.background}">{{item.title}}</view>
					</view>
				</view>

				<view class="B_ListView" v-for="(item,index) in bookList " :key="index" @click="listNatTo(index)" v-if="patientClickNumber !== -1" >
					<view class="ListView_view" >
						<view class="LS_v_text1">{{item.title}}</view>
						<text class="LS_v_text2" v-if="item.type !== 2" :class="item.type === 1 ? 'color1' : 'color2'" >{{bookTypeCheck(item.type)}}</text>
						<text class="LS_v_text2" v-if="item.type == 2" >{{bookTypeCheck(item.type)}}</text>
						<text class="LS_v_text3">{{item.date}}</text>
					</view>
				</view>
				
			</view>
		</view>
		
		<u-popup v-model="PickerShow" mode="center" width="55%" height="80%" @close="closeClick">
			<view class="popup_view">
				<view class="v_title">请选择新建的签署模板</view>
				<scroll-view class="v_score"  scroll-y>
					<u-radio-group :wrap="true" size="20px">
						<u-radio label-size="14px" class="v_s_radio" v-for="(item, index) in PickerList" :key="index"  :disabled="item.disabled" :name="item.title"  :style="PickerIndex == index ? 'border: 1px solid #2979FF;' : ''"   @change="radioChange(index)" ><text :style="PickerIndex == index ? 'color: #2979FF;' : ''">{{item.title}}</text></u-radio>
					</u-radio-group>
				</scroll-view>
				<view class="v_button">
					<text class="v_t_text" style="background: #ff6600; margin-right: 12px;" @click="closeClick">关闭</text>
					<text class="v_t_text" style="background: #2979FF;" @click="defineClick">确认</text>
				</view>
			</view>
			
		</u-popup>
		
		
		<!-- <listpopup @closeClick="closeClick"  @defineClick="defineClick" :popupStatus="PickerShow" :popupList="PickerList"   :popupHeight="popupheight"></listpopup> -->
		
	</view>
</template>

<script>
	// import listpopup from '../../components/listPopupSelector/listPopupSelector.vue'
	export default {
		// components:{
		// 	listpopup
		// },
		data() {
			return {
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
				patientList: [{
					bedNumber: 1,
					name: '张三五',
					sex: '男',
					age: '48',
				}, {
					bedNumber: 2,
					name: '李四',
					sex: '男',
					age: '23'
				},{
					bedNumber: 1,
					name: '张三五',
					sex: '男',
					age: '48',
				}, {
					bedNumber: 2,
					name: '李四',
					sex: '男',
					age: '23'
				},{
					bedNumber: 1,
					name: '张三五',
					sex: '男',
					age: '48',
				}, {
					bedNumber: 2,
					name: '李四',
					sex: '男',
					age: '23'
				},{
					bedNumber: 1,
					name: '张三五',
					sex: '男',
					age: '48',
				}, {
					bedNumber: 2,
					name: '李四',
					sex: '男',
					age: '23'
				},{
					bedNumber: 1,
					name: '张三五',
					sex: '男',
					age: '48',
				}, {
					bedNumber: 2,
					name: '李四',
					sex: '男',
					age: '23'
				},{
					bedNumber: 1,
					name: '张三五',
					sex: '男',
					age: '48',
				}, {
					bedNumber: 2,
					name: '李四',
					sex: '男',
					age: '23'
				}],//患者列表
				patientClickNumber : -1,//点击患者下标
				
				bookList:[{
					title : '入院告知书',
					date : '2021年1月27日16:13:34',
					type : 0,//0是未签，1是已签，2是存档
					url : 'https://www.gjtool.cn/pdfh5/git.pdf',
				},{
					title : '特殊用药知情同意书',
					date : '2021年1月27日16:13:34',
					type : 1,//0是未签，1是已签，2是存档
					url : 'https://www.gjtool.cn/pdfh5/git.pdf',
				},{
					title : '特殊用药知情同意书特殊用药知情同意书特殊用药知情同意书特殊用药知情同意书',
					date : '2021年1月27日16:13:34',
					type : 1,//0是未签，1是已签，2是存档
					url : 'https://www.gjtool.cn/pdfh5/git.pdf',
				}], // 同意书列表
				
				buttonList : [{
					title : '新增',
					background : '#00c566'
				},{
					title : '刷新',
					background : '#ff6600'
				}],//按钮列表
				
				PickerShow : false, //单选框
				PickerList : [{
					title : '入院告知书',
					url : 'https://www.gjtool.cn/pdfh5/git.pdf',
					disabled : false,
				},{
					title : '特殊用药知情同意书',
					url : 'https://www.gjtool.cn/pdfh5/git.pdf',
					disabled : false,
				},{
					title : '生长激素使用同意书',
					url : 'https://www.gjtool.cn/pdfh5/git.pdf',
					disabled : false,
				},{
					title : '狂犬病疫苗和狂犬病人免疫球蛋白使用知情同意书',
					url : 'https://www.gjtool.cn/pdfh5/git.pdf',
					disabled : false,
				},{
					title : '狂犬病疫苗和狂犬病人免疫球蛋白使用知情同意书狂犬病疫苗和狂犬病人免疫球蛋白使用知情同意书',
					url : 'https://www.gjtool.cn/pdfh5/git.pdf',
					disabled : false,
				},{
					title : '狂犬病疫苗和狂犬病人免疫球蛋白使用知情同意书+狂犬病疫苗和狂犬病人免疫球蛋白使用知情同意书',
					url : 'https://www.gjtool.cn/pdfh5/git.pdf',
					disabled : false,
				}],//选择器列表
				PickerIndex : -1,//选择值
				
				
				iphoneBrand : '',//手机型号
				popupheight : '',//弹窗高度
			}
		},
		
		onLoad:function(){
			uni.getSystemInfo({
				success: (res) => {
					this.popupheight = res.windowHeight * 0.6 + 'px';
					console.log(res)
				}
			});
		},
		
		methods: {
			//tabs点击传值
			tabsChange: function(e) {
				this.tabsCurrent = e
			},
			
			//点击患者
			patientClick : function(e){
				if(this.patientClickNumber == e){
					this.patientClickNumber = -1
				}else{
					this.patientClickNumber = e
				}
			},
			
			//名称校验
			nameCheck : function(e){
				if(e == undefined){
					return ''
				}else{
					return e
				}
			},
			
			//同意书状态校验
			bookTypeCheck : function(e){
				if(e == 0){
					return '未签'
				}else if(e == 1){
					return '已签'
				}else {
					return '存档'
				}
			},
			
			//按钮点击
			buttonClick : function(e){
				if(e == 0 ){
					this.PickerShow = true
				}else if(e == 1){
					uni.showLoading({
						title:'刷新列表中...',
					})
					setTimeout(function(){
						uni.hideLoading()
						uni.showToast({
							title:'刷新成功'
						})
					},1500)
				}
			},
			
			//点击列表跳转
			listNatTo : function(e){
				uni.navigateTo({
					url:'../bookPreview/bp_show?url=' +this.bookList[e].url
				})
			},
			
			//关闭弹窗回调
			closeClick:function(){
				this.PickerShow = false;
				this.PickerIndex = -1;
			},
			
			//确认选择回调
			defineClick:function(){
				if(this.PickerIndex == -1){
					uni.showToast({
						title:'请选择模板',
						icon:'none'
					})
				}else{
					this.PickerShow = false;
					uni.navigateTo({
						url:'../bookPreview/bp_show?url=' +this.PickerList[this.PickerIndex].url
					})
					this.PickerIndex = -1;	
				}
				
			},
			
			//实时监听选择值
			radioChange : function(e){
				console.log(e)
				this.PickerIndex = e
			},
			
			
			//退出登录
			signOut :function(e){
				uni.showModal({
					title:'您确定要退出账号吗？',
					confirmColor:'#FA3534',
					confirmText:'退出',
					success: (res) => {
						if(res.confirm){
							uni.redirectTo({
								url:'login'
							})
						}
					}
				})
			}
			
		}
	} 
</script>

<style lang="scss" scoped>
	//患者列表
	.A_view{
		background: #f6f6f6;
		margin:  0 8px; 
		width: 38%;
		.view_input{
			margin:10px 8px;
			background: #fff; 
			border-radius: 5px; 
			padding:11px 12px; 
			font-size: 13px;  
			border: 1px  solid #eee;
		}
		.view_listView{
			background: #f6f6f6;
			margin: 0 8px; 
			border-bottom: 1px solid #eee; 
			padding: 14px 0;
			font-size: 14px;
			&.view_listViewColor{
				background: #A0CFFF;
			}
		}
	}
	
	//同意书列表
	.B_view{
		margin-right: 8px; 
		width: 62%; 
		.view_text{
			width: 100%;
			padding: 11.5px 12px; 
			font-size: 15px; 
			color: #FFFFFF; 
			background: #aaa;
			border-radius: 5px;
		}
		.B_ListView{
			// margin: 0px 12px;
			.ListView_view{
				position: relative; 
				padding: 15px 0 15px 12px;  
				border-bottom: 1px solid #eee;
				.LS_v_text1{
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					width: 350px;
					font-size: 14px;
				}
				.LS_v_text2{
					position: absolute; 
					right: 0px; 
					top:8px; 
					font-size: 13px;
					&.color1{
						color: #1fd757;
					}
					&.color2{
						color: #fe5b5a;;
					}
				}
				.LS_v_text3{
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
			padding: 8px 32px;
			font-size: 14px;
			color: #FFFFFF;
			border-radius: 4px;
		}
	}
	
	
	
	//弹框样式
	.popup_view{
		width: 100%; 
		padding: 16px;
		position: relative;
		.v_title{
			font-weight: bold; 
			font-size: 14px;
		}
		.v_score{
			margin: 8px 0; 
			width: 100%;
			height: 58vh;
			.v_s_radio{
				padding: 10px 24px; 
				margin: 6px 0; 
				border: 1px solid #ccc;
				border-radius: 4px;
			}
			.v_s_classRadio{
				
			}
			
			
			
		}
		.v_button{
			float: right; 
			margin-bottom: 16px; 
			background: #FFFFFF;
			.v_t_text{
				border-radius: 4px;
				font-size: 12px; 
				padding: 8px 32px;
				color: #FFFFFF;
				text-align: center;
			}
		}
		
	}
	
</style>
