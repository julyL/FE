<template>
    <div class="bar">
        <span class="word">每家民宿都是一种生活方式</span>
        <span class="close" @click="closeBar"></span>
        <span class="invite_btn" @click='invitenow'>立即关注</span>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    methods:{
    	invitenow(){
    		this.$emit("invitenow");
    	},
    	closeBar(){
    		this.$emit("closeBar");
    	}
    }
}
</script>
<style lang="sass" scoped>
.bar {
    background: #fff url(../../production/assets/image/logo-@3x.png) no-repeat .1rem center / .3rem .3rem;
    position: absolute;
    height: .39rem;
    padding-left:.5rem;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    box-shadow: 1px 1px 5px #989494;
}

.word {
    display: inline-block;
    height: .39rem;
    line-height: .39rem;
}

.invite_btn {
	float: right;
	margin-top:.075rem;
	margin-right:.07rem;
  height: .24rem;
  line-height: .24rem;
  border-radius: 12px;
	padding:0 8px;
  border: solid 1px #a0a0a0;
}

.close {
	float: right;
	width: .39rem;
	height: 100%;
	background: #fff url(../../production/assets/image/ic_popbox_cancel@2x.png) no-repeat center center / .15rem .15rem;
}
@media (max-width:330px){
	.bar{
		font-size: 12px;
	}
}
</style>
