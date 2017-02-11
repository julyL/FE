<template>
    <div>
        <div id="nav">
        <router-link to="/page1" class="navlink">page1</router-link>
        <router-link to="page2" class="navlink">page2</router-link>
        </div>
      </div>
</template>
<script>
export default {
  mounted(){

  },
  data () {
    return {
    
    }
  },
  methods:{

  }
}
</script>

<style lang="sass" scoped>
#nav{
    position: fixed;
    bottom:0;
    left:0;
    width:100%;
    height:.4rem;
    line-height: .4rem;
    background:#47c68c;
    text-align: center;
    .navlink{
      float: left;
      width:33.33%;
      height:100%;

    }
}

</style>

     