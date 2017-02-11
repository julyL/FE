<template>
	<div class="v-tab" :style="tabstyle">
		<div class="v-tabli" v-for="var in tablist" @click="tabchange($index)"
			:class='{"v-tab-active":tabindex==$index}' :style="activeStyle($index)">{{var}}</div>
		<div class="v-tab-bor" :style='{left:posileft}'></div>
  	</div>
</template>
<script>
export default {
 props:["tabindex","tablist","contstyle","activetyle","borstyle","tabstyle"],
 ready(){
 	var len=this.tablist.length,
 		 $tab=$(".v-tabli"),
 		 $bor=$(".v-tab-bor"),
 		 width=$(".v-tab").width()/len,
 		 self=this;
 	$tab.width(width);
 	$bor.width(width);
 	this.contstyle&&$tab.css(this.contstyle); 
 	this.borstyle&&$bor.css(this.borstyle); 
 	this.tabstyle&&$(".v-tab").css(this.tabstyle); 
 	this.tabindex=this.tabindex||0;
 },
  data () {
    return {
 		
    }
  },
  computed:{
  	posileft(){
  		return $(".v-tab").width()/this.tablist.length*this.tabindex+"px";
  	},
  },
  methods:{
  	tabchange(val){
  		this.tabindex=val;
  		this.$dispatch("tabchange",val);
  	},
  	activeStyle(index){
  		if(index==this.tabindex){
  			return this.activetyle;
  		}
  	}
  }
}
</script>

<style lang="sass" scoped>
.v-tab{
	width:100%;
	overflow: hidden;
	text-align: center;
	position: relative;
	background:#fff;
	font-size:14px;
	.v-tabli{
		font-size: 14px;
		float:left;
		height: .43rem;
		line-height: .43rem;
		border-bottom:1px solid #ff4063;
	}
	.v-tab-bor{
		position: absolute;
		bottom:0;
		// left:0;
		height:2px;
		background: #ff4063;
		transition:all .3s;
	}
	.v-tab-active{
		color:#ff4063;
	}
}

</style>

     