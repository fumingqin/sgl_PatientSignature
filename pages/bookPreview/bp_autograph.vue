<template>
	<view style="padding: 8px 12px;" >
		<view class="auto_A_view">
			<text class="A_v_text"> <text style="color: #FA3534;">温馨提醒：</text>请用正楷进行签署，保证签署权益的完整性，签署完成后无法修改</text>
			<text class="A_v_text" style="margin-left: 20px;"> <text style="color: #FA3534;">共签署：</text>{{fileData.positions.length}}处</text>
			<text  class="A_v_text" style="margin-left: 20px;"> <text style="color: #FA3534;">您正处在：</text>第{{positionSeq +1}}处</text>
			<view>
				<text  class="A_v_text"> <text style="color: #FA3534;">请签写：</text>{{fileData.positions[positionSeq].tip}}</text>
			</view>
		</view> 
		
		<view style="border: 1px solid #d6d6d6;">
			<canvas id="canvas" disable-scroll="true" :style="{'width':width,'height':height}" canvas-id="cid" @touchstart="starts" @touchmove="moves" @touchend="end"></canvas>
		</view>
		
		<view class="auto_B_view" >
			<view class="B_v_button" style="background: #bbb;"  @click="back">返回</view>
			<view class="B_v_button" style="background: #ff6600;" @click="clear">重写</view>
			<view class="B_v_button" style="background: #2979FF;" v-if="positionSeq < fileData.positions.length -1" @click="save">下一步</view>
			<view class="B_v_button" style="background: #2979FF;" v-if="positionSeq == fileData.positions.length -1 " @click="save">完成签名</view>
		</view>
	</view>
</template>
 
<script>
	import { pathToBase64, base64ToPath } from '../../js_sdk/mmmm-image-tools/index.js'
	export default {
		data() {
			return {
				resultUrl: '',
				dom: null,
				line: [],
				width: '0px',
				height: '0px',
				radius: 0,
				fileData : {
					positions : [{
						tip :''
					}]
				},//文档数据
				id : '',//文档id
				
				positionSeq : 0, //签名序号
			}
		},
		created() {
			uni.getSystemInfo({
				success: (res) => {
					this.width = res.windowWidth - 24 + 'px';
					this.height = res.windowHeight - 180 + 'px';
				}
			});
			this.dom = uni.createCanvasContext('cid');
		},
		onLoad:function(){
			uni.getStorage({
				key:'fileData',
				success:(res)=>{
					this.fileData = res.data
				}
			})
			uni.getStorage({
				key:'fileDataId',
				success:(res)=>{
					this.id = res.data
				}
			})
		},
		onBackPress: () => {
			// return true
		},
		methods: {
			end(e) {

			},
			distance(a, b) {
				let x = b.x - a.x;
				let y = b.y - a.y;
				return Math.sqrt(x * x + y * y);
			},
			starts(e) {
				this.line.push({
					points: [{
						time: new Date().getTime(),
						x: e.touches[0].x,
						y: e.touches[0].y,
						dis: 0
					}]
				})
				let currentPoint = {
					x: e.touches[0].x,
					y: e.touches[0].y
				}
				this.currentPoint = currentPoint
				this.drawer(this.line[this.line.length - 1])
			},
			moves(e) {
				let point = {
					x: e.touches[0].x,
					y: e.touches[0].y
				}
				this.lastPoint = this.currentPoint,
					this.currentPoint = point
				this.line[this.line.length - 1].points.push({
					time: new Date().getTime(),
					x: e.touches[0].x,
					y: e.touches[0].y,
					dis: this.distance(this.currentPoint, this.lastPoint)
				})
				this.drawer(this.line[this.line.length - 1])
			},
			drawer(item) {
				let x1, x2, y1, y2, len, radius, r, cx, cy, t = 0.5,
					x, y;
				var time = 0;
				if (item.points.length > 2) {
					let lines = item.points[item.points.length - 3];
					let line = item.points[item.points.length - 2];
					let end = item.points[item.points.length - 1];
					x = line.x;
					y = line.y;
					x1 = lines.x;
					y1 = lines.y;
					x2 = end.x;
					y2 = end.y;
					// console.log(x, y)
					var dis = 0;
					time = (line.time - lines.time) + (end.time - line.time)
					dis = line.dis + lines.dis + end.dis;
					var dom = uni.createCanvasContext('cid');
					var or = Math.min(time / dis * this.linePressure + this.lineMin, this.lineMax);
					// P0（x1,y1）,P2(x2,y2), P1(cx,cy)起点，终点，控制点
					cx = (x - (Math.pow(1 - t, 2) * x1) - Math.pow(t, 2) * x2) / (2 * t * (1 - t))
					cy = (y - (Math.pow(1 - t, 2) * y1) - Math.pow(t, 2) * y2) / (2 * t * (1 - t))
					dom.setLineCap('round')
					dom.beginPath();
					// dom.strokeStyle = 'black';
					dom.setStrokeStyle('black')
					dom.setLineWidth(6)
					// dom.lineWidth = 5;
					// 起始点
					dom.moveTo(x1, y1);
					dom.quadraticCurveTo(cx, cy, x2, y2);
					dom.stroke();
					dom.draw(true)
				}

			},
			//清理画布
			clear() {
				this.dom.clearRect(0, 0, 1000, 1000)
				this.dom.draw()
			},
			
			
			//签名保存图片合成
			save : function(){
				uni.showLoading({
					title:'保存签名中...'
				})
				uni.canvasToTempFilePath({
					canvasId: 'cid',
					fileType: 'png',
					quality: 1, //图片质量
					success:(res)=>{
						// console.log(res.tempFilePath)
						pathToBase64(res.tempFilePath)
						.then(base64 => {
							uni.request({
								url: this.$sgl.SglInterface.uploadStamp.Url,
								method:this.$sgl.SglInterface.uploadStamp.method,
								data:{
									id : Number(this.id),
									seq : this.fileData.positions[this.positionSeq].seq,
									data  : base64
								},
								success :(res)=>{
									if(res.data.status){
										if(this.fileData.positions.length == this.positionSeq +1){
											uni.hideLoading()
											this.completeSigning()
										}else{
											this.clear()
											uni.hideLoading()
											this.positionSeq = this.positionSeq + 1;
										}
										
									}else{
										uni.hideLoading()
										uni.showToast({
											title:'签名保存失败，请检查是否连接内网WIFI/网络是否正常',
											icon:'none'
										})
									}
								},
								fail : (err)=>{
									// console.log(err)
									uni.showToast({
										title:'网络异常，请查看平板是否连接内网WIFI',
										icon:'none'
									})
								}
							})
						 })
					}
				})
			},
			
			//完成签名，文件合成
			completeSigning : function(){
				uni.showLoading({
					title:'签署中...'
				})
				uni.request({
					url: this.$sgl.SglInterface.composePDF.Url,
					method:this.$sgl.SglInterface.composePDF.method,
					data:{
						id : Number(this.id),
					},
					success: (res) => {
						console.log(res)
						if(res.data.status){
							uni.hideLoading()
							uni.showToast({
								title:'签署成功'
							})
							uni.navigateBack()
						}else{
							uni.hideLoading()
							uni.showToast({
								title:'签署失败，请重试按钮~',
								icon:'none'
							})
						}
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showToast({
							title:'网络异常，请查看平板是否连接内网WIFI',
							icon:'none'
						})
					}
				})
				
				
			},
			
			//返回上一个页面
			back(){
					uni.showModal({
						title:'您确定要返回吗？',
						content:'为确保签署的完整性、真实性等原因，返回后，已签名的内容将进行清空，同时患者需要重新进行身份认证!',
						success : (res) => {
							if(res.confirm){
								uni.navigateBack()
							}
						}
					})
			}
		}
	}
</script>

<style scoped lang="scss">
	.auto_A_view{
		width: 100%;
		margin-bottom: 8px;
		.A_v_text{
			text-align: center;
			 font-size: 15px;
			 font-weight: bold; 
		}
	}
	
	.auto_B_view{
		width: 100%;
		display: flex; 
		margin-top: 16px;
		text-align: center; 
		padding: 0 20px; 
		font-size: 15px;
		
		.B_v_button{
			width: 33%;
			margin: 0 20upx; 
			padding: 11px 0px;
			color: #FFFFFF;
			border-radius: 4px;
		}
	}
	
	
</style>
