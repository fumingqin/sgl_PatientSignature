<template>
	<view>
		<view style="width: 100%; height: 32upx;"></view>
		<view style="display: flex;">
			<!-- 患者状态栏 -->
			<view class="A_view">
				<u-subsection :list="tabsList" :current="tabsCurrent" @change="tabsChange" bg-color="#3785f9" inactive-color="#fff" font-size="16" height="48"></u-subsection>
				<input type="text" class="view_input"  placeholder="搜索: 床号、姓名、全拼或首拼" />
				
				<!-- 患者信息列表 -->
				<view v-for="(item,index) in patientList " :key="index" class="view_listView" :class="patientClickNumber === index ? 'view_listViewColor' : '' " @click="patientClick(index)">
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
			</view>
			
			<!-- 同意书列表 -->
			<view class="B_view">
				<view style="height: 48upx;">
					<text class="view_text" v-if="patientClickNumber !== -1">{{nameCheck(patientList[patientClickNumber].name)}} - 患者同意书列表</text>
					<text class="view_text" v-if="patientClickNumber == -1"> 患者同意书列表</text>
				</view>
				
				<scroll-view scroll-x>
					<view style="display: flex;">
						<view class="box_scrollView" v-for="(item,index) in buttonList" :key="index" @click="buttonClick(index)" >
							<text class="scrollView_text" :style="{'background' : item.background}">{{item.title}}</text>
						</view>
					</view>
				</scroll-view>
				
				<u-picker  v-model="PickerShow" mode="selector" :range="PickerList" range-key="title" @confirm="natTo"></u-picker>
				
				
				<view class="B_ListView" v-for="(item,index) in bookList " :key="index">
					<view class="ListView_view">
						<text class="LS_v_text1">{{item.title}}</text>
						<text class="LS_v_text2" v-if="item.title !== 2" :class="item.title === 1 ? 'color1' : 'color2'" >{{bookTypeCheck(item.type)}}</text>
						<text class="LS_v_text2" v-if="item.title == 2" >{{bookTypeCheck(item.type)}}</text>
						<text class="LS_v_text3">{{item.date}}</text>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
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
					bedNumber: 1,
					name: '张三五',
					sex: '男',
					age: '48'
				}],//患者列表
				patientClickNumber : -1,//点击患者下标
				
				bookList:[{
					title : '入院告知书',
					date : '2021年1月27日16:13:34',
					type : 0,//0是未签，1是已签，2是存档
				},{
					title : '特殊用药知情同意书',
					date : '2021年1月27日16:13:34',
					type : 1,//0是未签，1是已签，2是存档
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
					url : '',
				},{
					title : '特殊用药知情同意书',
					url : '',
				}],//选择器列表
				
				

			}
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
			
			//点击选择器内容
			natTo : function(e){
				console.log(e)
				this.PickerShow = false
				uni.navigateTo({
					url:'../bookPreview/bp_show'
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	//患者列表
	.A_view{
		background: #f6f6f6;
		width: 40%;
		.view_input{
			margin:12upx 8upx 4upx 8upx;
			background: #fff; 
			height: 44upx; 
			border-radius: 4upx; 
			padding:0 12upx; 
			font-size: 16upx;  
			border: 1px  solid #eee;
		}
		.view_listView{
			background: #f6f6f6;
			margin: 0 8upx; 
			border-bottom: 1px solid #eee; 
			padding: 14upx 0;
			font-size: 16upx;
			&.view_listViewColor{
				background: #A0CFFF;
			}
		}
	}
	
	//同意书列表
	.B_view{
		margin-left: 4upx;  
		background: #3785f9;  
		width: 60%; 
		height: 48upx; 
		border-radius: 4upx;
		.view_text{
			padding: 0 12upx; 
			font-size: 16upx; 
			color: #FFFFFF; 
			font-weight: 400;
		}
		.B_ListView{
			padding: 0upx 12upx;
			.ListView_view{
				position: relative; 
				padding: 6upx 0 16upx 0;  
				border-bottom: 1px solid #eee;
				.LS_v_text1{
					font-size: 16upx;
				}
				.LS_v_text2{
					position: absolute; 
					right: 0upx; 
					top:10upx; 
					font-size: 14upx;
					&.color1{
						color: #1fd757;
					}
					&.color2{
						color: #fe5b5a;;
					}
				}
				.LS_v_text3{
					position: absolute; 
					right: 0upx; 
					bottom: 14upx; 
					font-size: 12upx;
				}
			}
		}
	}
	
	//滑动区域
	.box_scrollView {
		white-space: nowrap;
		margin: 4upx 0;
		.scrollView_text {
			margin-left: 12upx;
			padding: 8upx 16upx;
			font-size: 14upx;
			color: #FFFFFF;
			border-radius: 4upx;
		}
	}
	
</style>
