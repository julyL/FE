<template>
    <div>
        <div class="info-top">
            <div class="v-infobox">
                <img class="v-avator" :src="user.avator">
                <div class="v-info" :class='{"v-line2":linenum==1}'>
                    <div class="v-nameinfo">
                        <div class="v-name">{{user.name}}
                            <div class="v-satrs">
                                <div class="v-star" v-for="n in +user.stars"></div>
                            </div>
                        </div>
                        <slot></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['user','linenum'],
    data() {
        return {
        
        }
    }
}
</script>
<style lang="sass" scoped>
.v-infobox {
    overflow: hidden;
    padding: .15rem .15rem .15rem .1rem;
    .v-avator {
        overflow: hidden;
        float: left;
        width: 0.78rem;
        height: 0.78rem;
        border-radius: .78rem;
        box-shadow: 0px 5px 5px 0 rgba(0, 0, 0, 0.1);
    }
    .v-info {
        float:left;
        font-size: 16px;
    }
    .v-nameinfo {
        padding: .03rem 0 0 .2rem;
        line-height: 22px;
    }
    .v-name {}
    .v-satrs {
        overflow: hidden;
        display: inline-block;
        margin-left: 8px;
    }
    .v-star {
        width: .09rem;
        height: .09rem;
        float: left;
        background: url('../../assets/image/-ic_star@2x.png') no-repeat;
        background-size: .09rem .09rem;
        margin-right: 2px;
    }
}
.v-line2{
    .v-nameinfo{
        padding-top:.17rem;
    }
}
</style>
