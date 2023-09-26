<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script lang="ts">
import useApiStore from "./stores/useApiStore";
import useCharactersStore from "./stores/useCharactersStore"

export default {
  mounted(){
    this.testlog();
  },
  data() {
    return {
      apiStore: useApiStore(),
      charactersStore: useCharactersStore()
    }
  },
  methods: {
    async testlog(){
      var test2 = (await this.apiStore.get("/character?status=alive")).data
      console.log(test2)
      this.charactersStore.setFilter("species=Human")
      await this.charactersStore.selectNextPage()
      await this.charactersStore.appendNextPage()
      console.log(this.charactersStore.characters)
    }
  }
}
</script>
