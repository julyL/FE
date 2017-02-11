<template>
        <div class="shadow">
            <div id="alt" :style="altstyle">
                    <div class="alt-con">{{confirmword}}</div>
                <div class="btn-w">
                    <div class="btn-cancel" @click="cancel()">取消</div>
                    <div class="btn-sure" @click="sure()">确定</div>
                </div>
            </div>
        </div>
</template>
<script>
export default {
    props: ['confirmword', 'sureword','altstyle'],
    methods: {
        sure() {
            this.$dispatch("confirmSure");
        },
        cancel(){
            this.$dispatch("confirmCancel");
        }
    },
    data() {
        return {

        }
    }
}
</script>
<style lang="sass" scoped>
.shadow {
    position: fixed;
    z-index: 665;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .3);
}
#alt {
    background-color: #fff;
    position: fixed;
    z-index: 666;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3rem;
    height: 1.52rem;
    text-align: center;
    border-radius: 4px;
    font-size: 16px;
}

.alt-con {
line-height: 1.1rem;
    height: 1.1rem;
    color: #b76372;
    font-size: 22px;
    letter-spacing: 2px;
}
.btn-w {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: .42rem;
    line-height: .42rem;
    overflow: hidden;
    text-align: center;
    letter-spacing: 8px;
}

.btn-cancel {
    float: left;
    width: 50%;
    height: 100%;
    color: #ff4063;
    background: #fafafa;
    border-radius: 0 0 0 4px;
}

.btn-sure {
    float: left;
    width: 50%;
    height: 100%;
    color: #fff;
    background: #ff4063;
    border-radius: 0 0 4px 0;
}

</style>
