<template>
	<view>
		<view class="background">
			<image class="br_image" src="../../static/background.png" mode="aspectFill"></image>
		</view>
		<view class="window">
			<view class="window_top">
				<view style="width: 50%;height:100%;position:relative;text-align: right;-webkit-align-items:center;border-right: 1upx solid #EAEAEA;">
					<image class="wd_image" src="../../static/wjw_logo.png" mode="aspectFit"></image>
				</view>
				<view style="width: 50%;height:100%;position:relative;text-align: left;-webkit-align-items:center;border-right: 1upx solid #EAEAEA;">
					<text></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	
	page{
		background: #0074ef;
	}
	
	.background{
		width: 100%;
		height: 100vh;
		
		.br_image{
			z-index: 1;
			width: 100%;
			height: calc(100vh - 1rpx);
		}
	}
	
	.window{
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		
		.window_top{
			padding: 10upx 20upx;
			border-radius: 10upx;
			background: #FFFFFF;
			margin: 20upx;
			-webkit-align-items:center;
			
			.wd_image{
				padding-top: 10upx;
				padding-right: 20upx;
				width: 130upx;
				height: 36upx;
			}
		}
	}
</style>
