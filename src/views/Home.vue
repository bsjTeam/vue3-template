<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { defineComponent,onMounted} from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import API from '@/api/httpApi';
export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
  setup(){
    onMounted(() => {
     console.log(API);
    })

  },
  
});
</script>
