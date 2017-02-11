<template>
    <div class="top-w" id="slide_id">
        <div class="top-imgw" :style="{transform:'translateX('+toLeft+'px)','width':imgs.length*100+'%'}">
                <img class="topimg" :src="img.image" :style="{'width':100/imgs.length+'%'}" v-for="(img,index) in imgs" :key='index'>
        </div>
        <div id="toggle-img" v-if="imgs.length>1">
            <div class="to-in">
                <div class="t-img-b" v-for="(n,index) in imgs.length" :class="{'t-check':index==imgindex}">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
        data(){
          return {
            imgindex:0,       //轮播图选择的图片
            imgW:0,           //轮播图片宽度  
          }
        },
        props:['imgs'],
        computed: {
        toLeft(){
                return -this.imgW * this.imgindex;
            }
        },
        events:{
            swipeStart(){
                //轮播
                   var self=this,elimg,touchimg;
                    (function() {
                        self.$nextTick(function(){
                            elimg = document.querySelector(".topimg"),
                            touchimg = document.querySelector(".top-imgw"),
                            self.imgW =elimg.clientWidth;
                            if(self.imgs.length<2){
                                return ;
                            }
                            T.start(); //初始化轮播

                            toggleHandle();
                        });     
                        var T = (function() {
                            var timer;
                            function start() {
                                timer = setInterval(function() {
                                    self.imgindex = (self.imgindex + 1) % self.imgs.length;
                                }.bind(self), 3000)
                            };

                            function end() {
                                clearInterval(timer);
                            }

                            return {
                                start: start,
                                end: end
                            }
                        }).apply(self);

                        var restart,retimer;
                        function toggleHandle(){
                            var sx, ex,
                                nowX;
                            touchimg.addEventListener("touchstart", function(e) {
                                T.end();
                                restart=true;
                                clearTimeout(retimer);
                                sx = e.changedTouches[0].pageX;
                                touchimg.style.transition = "none";
                                nowX = touchimg.style.transform.match(/-?\d+/) ? touchimg.style.transform.match(/-?\d+/)[0] - 0 : 0;
                            });

                            touchimg.addEventListener("touchmove", function(e) {
                                e.preventDefault();
                                ex = e.changedTouches[0].pageX;
                                touchimg.style.transform = "translateX(" + (nowX + ex - sx) + "px)";
                            });

                            touchimg.addEventListener("touchend", function(e) {
                                if(restart){
                                    retimer=setTimeout(function(){
                                        T.start();
                                    },3000)   
                                }
                                touchimg.style.transition = "all .3s";
                                ex = e.changedTouches[0].pageX;
                                if (ex - sx > 20 && self.imgindex > 0) {
                                    self.imgindex--;
                                } else if (ex - sx < -20 && self.imgindex < self.imgs.length - 1) {
                                    self.imgindex++;
                                } else {
                                    touchimg.style.transform = "translateX(" + (-self.imgindex * self.imgW) + "px)";
                                }
                            })         
                        };

                    })();
            }
        }
}
</script>

<style lang='sass' scoped>
.top-w{
    height:2.31rem;
    position: relative;
    overflow: hidden;
}
.top-imgw{
    height:100%;
    overflow: hidden;
    transition:all .3s;
    transform-style: preserve-3d;
    backface-visibility: hidden;
}
#containerMap{
    height: 2.5rem;
}
.topimg{
    height:100%;
    float: left;
}
 #toggle-img{
    position: absolute;
    bottom:.18rem;
    left:50%;
 }
 .t-img-b{
    float: left;
    height: 8px;
    width:8px;
    line-height: 8px;
    border-radius: 8px;
    background: rgba(0,0,0,.5);
    margin-right: 18px;
 }
 .t-img-b:nth-last-child(1){
    margin-right: 0;
 }
 .t-check{
    background:#fff;
 }
 .to-in{
    position: relative;
    width:100%;
    overflow: hidden;
    left:-50%;
    height: 9px;
 }
</style>
