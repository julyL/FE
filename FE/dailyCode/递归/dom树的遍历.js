
// 广度优先遍历

// 采用队列的实现方式 
function bfs(node,fn){
	if(!node){
    	return;
    }
    var childArray=[node],
    	headNode;
    while(childArray.length>0){
		headNode=childArray.shift();
		fn(headNode);
		[].push.apply(childArray,headNode.children);
    }
}

// 深度度优先遍历
function dfs(node,fn){
    if(!node){
    	return;
    }
    fn(node);
    var childArray=Array.from(node.children);
	childArray.forEach(v=>{
		dfs(v,fn);
	})
}

function print(node){
	console.log(node.tagName+"  "+node.classList);
}










