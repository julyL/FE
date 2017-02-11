var vuepage=Vue.component("v-page",{
	template:''
	+'<div class="page-bar">'
	    +'<ul>'
	        +'<li v-show="cur!=0" class="page-prev" @click="topage(cur-1)">上一页</li>'
	        +'<li v-for="var in pagenum" :class="{\'page-active\': cur == var}" class="page-li" @click="topage(var)" v-show="showli(var)">{{var+1}}</li>'
	        +'<li v-show="cur!=pagenum" class="page-next" @click="topage(cur+1)">下一页</li>'
	    +'</ul>'
	+"</div>",
	props:["pagenum"],
	data:function(){
		return {
			cur:0
		}
	},
	methods:{
		 topage:function(val){
		 	  if(this.cur!=val){
		       this.cur=val;
		       this.$dispatch("changepage",val);
		       console.log(val);
		 	  	
		 	  }
		 },
		 showli:function(val){
		 	console.log(val);
		      if((val>=this.cur-5&&val<=this.cur+4&&this.cur>4)||this.cur<=4&&val<=9){
		      		return true;
		      }else{
		      	return false;
		      }

		 }
	}
})