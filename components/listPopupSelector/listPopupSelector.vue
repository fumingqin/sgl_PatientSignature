<template>
	<view>
		<u-popup v-model="popupStatus" mode="center" width="55%" height="78%" @close="closeClick" >
			<view class="popup_view">
				<view class="v_title">请选择新建的签署模板</view>
				<scroll-view class="v_score" :style="{'height' : popupHeight}" scroll-y>
					<u-radio-group :wrap="true" size="24px">
						<u-radio label-size="18px" class="v_s_radio" v-for="(item, index) in popupList" :key="index" :disabled="item.disabled" :name="item.title" @change="radioChange(index)" >{{item.title}}</u-radio>
					</u-radio-group>
				</scroll-view>
				
				<view class="v_button">
					<view class="v_t_text" style="background: #ff6600; margin-right: 12px;" @click="closeClick">关闭</view>
					<view class="v_t_text" style="background: #2979FF;" @click="defineClick">确认</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>
 
<script>
	var that = this;
	export default {
		props:{
			popupList:{
				type:Array,
				default (){
					return []
				},
			},
			popupStatus:{
				type:Boolean,
				default () {  
                    return false  
                },
			},
			popupHeight:{
				type: String,
				default : '',
			}
		},
		data() {
			return {
				 a : -1,
			};
		},
		onLoad: function() {
		},
		
		methods:{
			
			radioChange : function(e){
				that.a = e
			},
			closeClick : function(){
				that.a = -1;
				that.$emit('closeClick', 'close')
			},
			defineClick : function(e){
				if(that.a == -1){
					uni.showToast({
						title:'请选择模板',
						icon:'none'
					})
				}else{
					this.$emit('defineClick', that.a)
					that.a = -1;
				}
				
			}
			
		}
	}
</script>

<style lang="scss">
	.popup_view{
		width: 100%; 
		padding: 16px;
		.v_title{
			font-weight: bold; 
			font-size: 20px;
		}
		.v_score{
			margin: 16px 0; 
			width: 100%;
			.v_s_radio{
				padding: 10px 24px; 
				margin: 6px 0; 
				border: 1px solid #ccc;
				border-radius: 4px;
			}
		}
		
		.v_button{
			float: right; 
			margin-bottom: 16px; 
			display: flex;
			.v_t_text{
				font-size: 15px; 
				padding: 12px 32px;
				color: #FFFFFF;
				text-align: center;
			}
		}
	}
</style>
