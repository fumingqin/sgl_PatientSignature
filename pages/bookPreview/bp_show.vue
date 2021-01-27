<template>
	<view>
		<web-view :src="url"></web-view>
		<!-- <scroll-view scroll-x>
			<view style="display: flex;">
				<view class="box_scrollView" v-for="(item,index) in buttonList" :key="index" @click="buttonClick(index)" >
					<text class="scrollView_text" :style="{'background' : item.background}">{{item.title}}</text>
				</view>
			</view>
		</scroll-view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad:function(e){
			this.
			this.bookLoad()
		},
		methods: {
			//打开PDF
			bookLoad : function(){
				uni.downloadFile({
					url: 'http://www.jztech.top:18088/home/download/Environment',
					success:(res)=>{
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath : filePath,
							success: (res) => {
								console.log(res)
							},
							fail: (err) => {
								console.log(err)
							}
						})
						console.log(res)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
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
