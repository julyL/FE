<template>
    <div>
        page1
        <h2 @click="btnclick">确认弹窗</h2>
        <h2 @click="toast">提示弹窗</h2>
        <toast :altword="toastword" @ensure="toastEnsure"></toast>
        <alt :altword="altword" @ensure="altEnsure" @cancel="altCancel"></alt>
        <div class="test">
            <h5>vue filter测试</h5>
            <div class="input"><input type="text" v-model="input"></div>
            <div>整数<input type="text" v-model="input1"><span>{{input1 | toFixed(0)}}</span></div>
            <div>正整数<input type="text" v-model="input2"><span>{{input2 |  +toFixed(0)}}</span></div>           
             <div>浮点数<input type="text" v-model="input3"><span>{{input3 |  toFixed(2)}}</span></div>
            <div>正浮点数<input type="text" v-model="input4"><span>{{input4 |  +toFixed(2)}}</span></div>
        </div>
    </div>
</template>
<script>
import alt from '../components/alt.vue';
import toast from '../components/toast.vue';
import '../js/fn/filter.js';
export default {
    mounted() {

        },
        data() {
            return {
                input:"",
                input1: "",
                input2: "",
                input3: "",
                input4: "",
                altword: '',
                toastword: ""
            }
        },
        components: {
            alt,
            toast
        },
        methods: {
            integer(val){
                return isNaN(val)?0:(+val).toFixed(0)
            },
            toast() {
                this.toastword = 'Hello World!';
            },
            toastEnsure() {
                this.toastword = "";
            },
            btnclick() {
                this.altword = "Hello word!"
            },
            altEnsure() {
                this.altword = "";
                console.log("ensure ...");
            },
            altCancel() {
                this.altword = "";
                console.log('cancel ....');
            }
        }
}
</script>
<style lang="sass">
.test {
    background: #47c68c;
    height: 300px;
    input {
        border: 1px solid #ccc;
    }
}
</style>
