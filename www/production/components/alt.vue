<template>
    <div class="shadow">
        <div class="alt" :class="{'small':type=='alt'}">
            <div class="tip">提示</div>
            <div class="alt-con">{{altword}}</div>
            <div class="btn-w" v-if="type=='ask'">
                <div class="cancel" @click="cancel">取消</div>
                <div class="ensure" @click='ensure'>确定</div>
            </div>
            <div class="btn-alt" v-if="type=='alt'" @click="ensure">好的</div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['altword', 'type'],
    methods: {
        cancel() {
            this.$emit("cancel");
        },
        ensure() {
            this.$emit("ensure");
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

.alt {
    background-color: #fff;
    z-index: 666;
    width: 3rem;
    height: 1.6rem;
    text-align: center;
    border-radius: 4px;
    font-size: 16px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
}

.small {
    width: 2.5rem;
}

.tip {
    height: .5rem;
    line-height: .5rem;
    padding-left: .15rem;
    text-align: left;
    color: #181818;
    font-size: 16px;
}

.alt-con {
    font-size: 18px;
    color: #6c6c6c;
    line-height: .3rem;
    letter-spacing: 2px;
}

.btn-w {
    position: absolute;
    border-radius: 0 0 4px 4px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    height: .42rem;
    line-height: .42rem;
    text-align: center;
    letter-spacing: 3px;
}

.cancel {
    float: left;
    width: 50%;
    background: #fff;
    color: #ff5a5f;
}

.ensure {
    float: right;
    width: 50%;
    color: #fff;
    background: #ff5a5f;
}

.btn-alt {
    position: absolute;
    border-radius: 0 0 4px 4px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    height: .42rem;
    line-height: .42rem;
    text-align: center;
    letter-spacing: 3px;
    color: #fff;
    background: #ff5a5f;
}
</style>
