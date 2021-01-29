<template>
	<view>
		<u-popup v-model="show" mode="center" width="55%">
			<view class="popup_view">
				<view class="v_title">请选择新建的签署模板</view>
				<scroll-view class="v_score" :style="{'height' : popupHeight}" scroll-y>
					<u-radio-group :wrap="true" size="24px">
						<u-radio label-size="18px" class="v_s_radio" v-for="(item, index) in list" :key="index" :disabled="item.disabled" :name="item.name" @change="radioChange(index)" >入院知情书</u-radio>
					</u-radio-group>
				</scroll-view>
				
				<view class="v_button">
					<view class="v_t_text" style="background: #ff6600; margin-right: 12px;">关闭</view>
					<view class="v_t_text" style="background: #2979FF;">确认</view>
				</view>
				
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				popupHeight: '', //窗体高度
				popupHeight2: '', //窗体高度\
				list: [{
						name: '入院知情书',
						disabled: false
					},
					{
						name: '特殊用药知情同意书',
						disabled: false
					},
					{
						name: '手术同意书',
						disabled: false
					}
				],
			};
		},
		onLoad: function() {
			uni.getSystemInfo({
				success: (res) => {
					this.popupHeight = res.windowHeight * 0.75 * 0.5 + 'px';
					this.popupHeight2 = res.windowHeight * 0.75 * 0.8 + 'px';
				}
			});
		},
		
		methods:{
			radioChange : function(e){
				this.$emit('change', e )
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
