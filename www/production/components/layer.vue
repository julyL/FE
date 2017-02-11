<template>
    <div class="layerbox" :layerstyle=layerstyle>
    {{layerword}}
    </div>
</template>
<script>
export default {
    props: ['layerword','time',"layerstyle"],
    data() {
        return {

        }
    },
    methods: {

    },
    events:{
        showlayer(){
        var time=this.time||2000;
            $('.layerbox').addClass('show');
            setTimeout(function(){
                $('.layerbox').removeClass('show');
            },time)
        }
    }
}
</script>
<style lang="sass" scoped>
.layerbox {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 1.72rem;
    height: 1rem;
    line-height: 1rem;
    opacity: 0;
    transition: opacity .3s;
    border-radius: 3px;
    background-color: #000000;
    text-align: center;
    color:#fff;
    transform:translate(-50%,-50%);
    z-index: 666;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    display: none;
}
.show{
    opacity:.65;
    display: block;
}
</style>
