
/**
 * bfs遍历dom树
 * @param  {[ElementNode]}   node     遍历的根节点
 * @param  {Function} fn              遍历得到节点时执行的函数
 * @param  {[boolean]}   next 		  是否遍历root的兄弟(默认为true)
 * @return {[type]}                   [description]
 */

function bfs(node,fn,zindex,){
	debugger;
	var zindex=zindex||1;
	if(!node){
		return;
	}
	fn(node,zindex);
	if(zindex==1){
		zindex++;
		bfs(node.children[0],fn,zindex);
		return;
	}
	if(node.nextElementSibling){
		bfs(node.nextElementSibling,fn,zindex);
	}else if(node.parentNode.nextElementSibling&&zindex!=2){
		bfs(node.parentNode.nextElementSibling,fn,zindex);
	}else{
		debugger;
		var nodeArrs=[].slice.call(node.parentNode.children).filter(v=>{
			return v.children.length>0;
		});
		if(nodeArrs.length>0){
			node=nodeArrs[0].children[0];
			zindex++;
			bfs(node,fn,zindex);
		}
	}
}



