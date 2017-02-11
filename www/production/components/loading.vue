<template>
    <div class="loadbox">
        <div class="load">
            <div class="line" v-show="isloading">
                <div class="borline"></div>
                <div class="borline"></div>
                <div class="borline"></div>
                <div class="borline"></div>
                <div class="borline"></div>
                <div class="borline"></div>
                <div class="circlebg"></div>
            </div>
        <div class="altword" :class="{'center':!isloading}">{{altword}}</div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['altword'],
    data() {
        return {
            isloading:true
        }
    },
    events:{
        loaded(){
            this.isloading=false;
             setTimeout(()=>{
                    this.isloading=true;
            },1010)
        }
    },
    methods: {

    }
}
</script>
<style lang="sass" scoped>
.load {
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    width: 1.15rem;
    height: 1.15rem;
    border-radius: 5px;
    margin: auto;
    background: rgba(0, 0, 0, .55);
}
.loadbox{
    position: relative;
}
.altword {
    position: absolute;
    bottom:20px;
    left:0;
    width:100%;
    text-align: center;
    color: #fff;
}
.center{
    height: 100%;
    top: 0;
    line-height: 1.15rem;
}

/** 加载动画的静态样式 **/

.load {
    overflow: hidden;
}

.line {
    width: 36px;
    height: 36px;
    margin: .2rem auto;
    position: relative;
}

.load .line .borline {
    position: absolute;
    left: 16px;
    top: 0;
    width: 3px;
    height: 36px;
}

.load .line .borline:before,
.load .line .borline:after {
    content: '';
    display: block;
    height: 50%;
    background: #fcfcfc;
    border-radius: 5px;
}

.load .line .borline:nth-child(2) {
    -webkit-transform: rotate(30deg);
}

.load .line .borline:nth-child(3) {
    -webkit-transform: rotate(60deg);
}

.load .line .borline:nth-child(4) {
    -webkit-transform: rotate(90deg);
}

.load .line .borline:nth-child(5) {
    -webkit-transform: rotate(120deg);
}

.load .line .borline:nth-child(6) {
    -webkit-transform: rotate(150deg);
}

.load .circlebg {
    position: absolute;
    left: 0;
    top: 0;
    right:0;
    bottom:0;
    margin:auto;
    width: .1rem;
    height: .1rem;
    border-radius: .1rem;
    background: rgba(0, 0, 0, .55);
}


/** 加载动画 **/

@-webkit-keyframes load {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.load .line .borline:nth-child(1):before {
    -webkit-animation: load 1.2s linear 0s infinite;
}

.load .line .borline:nth-child(2):before {
    -webkit-animation: load 1.2s linear 0.1s infinite;
}

.load .line .borline:nth-child(3):before {
    -webkit-animation: load 1.2s linear 0.2s infinite;
}

.load .line .borline:nth-child(4):before {
    -webkit-animation: load 1.2s linear 0.3s infinite;
}

.load .line .borline:nth-child(5):before {
    -webkit-animation: load 1.2s linear 0.4s infinite;
}

.load .line .borline:nth-child(6):before {
    -webkit-animation: load 1.2s linear 0.5s infinite;
}

.load .line .borline:nth-child(1):after {
    -webkit-animation: load 1.2s linear 0.6s infinite;
}

.load .line .borline:nth-child(2):after {
    -webkit-animation: load 1.2s linear 0.7s infinite;
}

.load .line .borline:nth-child(3):after {
    -webkit-animation: load 1.2s linear 0.8s infinite;
}

.load .line .borline:nth-child(4):after {
    -webkit-animation: load 1.2s linear 0.9s infinite;
}

.load .line .borline:nth-child(5):after {
    -webkit-animation: load 1.2s linear 1s infinite;
}

.load .line .borline:nth-child(6):after {
    -webkit-animation: load 1.2s linear 1.1s infinite;
}
</style>
