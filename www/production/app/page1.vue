<template>
    <div>
          page1
           <h2 @click="btnclick">确认弹窗</h2>
           <h2 @click="toast">提示弹窗</h2>
           <toast :altword="toastword" @ensure="toastEnsure"></toast>
           <alt :altword="altword" @ensure="altEnsure" @cancel="altCancel"></alt>
      </div>
</template>
<script>
import alt from '../components/alt.vue';
import toast from '../components/toast.vue';
export default {
  mounted(){

  },
  data () {
    return {
       altword:'',
       toastword:""
    }
  },
  components:{
    alt,
    toast
  },
  methods:{
      toast(){
        this.toastword='Hello World!';
      },
      toastEnsure(){
        this.toastword="";
      },
      btnclick(){
         this.altword="Hello word!"
      },
      altEnsure(){
         this.altword="";
         console.log("ensure ...");
      },
      altCancel(){
        this.altword="";
        console.log('cancel ....');
      }
  }
}
</script>

<style lang="sass">


</style>

     