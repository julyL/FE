<template>
    <div class="shadow">
        <div class="box">
            <div class="box-top">
                <span class="close" @click="close">&times;</span>
                <div class="boxword" v-html="boxword"></div>
            </div>
            <div class="box-bottom">
                <img src="http://www.yitianyishu.com/js/dist/twocode.jpg" alt="" class="twocode">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        boxword: ''
    },
    data() {
        return {

        }
    },
    methods: {
        close() {
            this.$emit("closeInvitebox");
        }
    }
}
</script>
<style lang="sass" scoped>
.shadow {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .7);
    z-index: 99;
}

.box {
    width: 2.71rem;
    height: 3.31rem;
    border-radius: 20px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    overflow: hidden;
}

.box-top {
    height: 1.15rem;
    background: #333;
    position: relative;
    color: #fff;
    padding: .38rem .18rem .1rem;
}

.box-bottom {
    background: #fff;
    overflow: hidden;
}

.twocode {
    width: 1.8rem;
    height: 1.8rem;
    display: block;
    margin: .17rem auto;
}

.boxword {
    font-size: 15px;
}

.close {
    color: #ff5a5f;
    position: absolute;
    right: .1rem;
    top: -.05rem;
    font-size: 36px;
}

.lceil {
    position: relative;
    top: -3px;
    font-size: 16px;
    left: -1px;
    margin: 0 2px;
}

.rfloor {
    position: relative;
    top: 2px;
    font-size: 16px;
    left: 1px;
}

.strong-word {
    font-weight: bold;
}

@media screen and (max-width:340px) {
    .boxword {
        font-size: 12px;
    }
}
</style>
