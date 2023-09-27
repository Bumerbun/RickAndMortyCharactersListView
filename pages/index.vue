<template>
    <div>
        <input type="button" v-on:click="resetCharacters">
        <input type="button" v-on:click="appendCharacters">
        <div class="filtration_options">
            <div class="filtration_option">
                <label for="status_select" class="filtration_label">Статус</label>
                <select ref="status_select" class="selection_menu" v-model="selectedFiltration.status" v-on:change="updateFiltration">
                    <option v-for="status in statusOptions" :value="status" class="selection_option" :selected="status == selectedFiltration.status">{{ status }}</option>
                </select>
            </div>
            <div class="filtration_option">
                <label for="name_input">Поиск по имени</label>
                <input type="search" ref="name_input" v-model="selectedFiltration.name" v-on:input="updateFiltration"/>
            </div>
        </div>
        <div class="character_cards_list">
            <div class="character_card" v-for="cardData in characters">
                <p> {{ cardData.name }}</p>
                <p>Разновидность: {{ cardData.species }}</p>
                <img :src="cardData.image">
                <div class="episodes_list">
                    <div class="episode" v-for="episode in cardData.episode">
                        <p>{{ episode }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
  import useApiStore from "../stores/useApiStore";
  import useCharactersStore from "../stores/useCharactersStore"
import useFiltrationOptionsStore from "../stores/useFiltrationOptionsStore";
  
  export default {
    mounted(){
        window.onscroll = () => this.onScroll()
        if (this.characters.length == 0){
            this.appendCharacters()
        }
    },
    data() {
      return {
        apiStore: useApiStore(),
        charactersStore: useCharactersStore(),
        selectedFiltration: useFiltrationOptionsStore(),
        statusOptions: ["", "alive", "dead", "unknown"]
      }
    },
    computed: {
        characters() {
            return this.charactersStore.characters
        }
    },
    methods: {
        async updateFiltration(){
            this.charactersStore.setFilter(`name=${this.selectedFiltration.name}&status=${this.selectedFiltration.status}`)
            await this.charactersStore.appendNextPage()
        },
        resetCharacters(){
            this.charactersStore.reset()
        },
        async appendCharacters(){
            await this.charactersStore.appendNextPage()
        },
        onScroll(){
            let bottomOfWindow = Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight

            if (bottomOfWindow) {
                this.appendCharacters()
            }
        }
    }
  }
</script>
<style scoped>
.character_cards_list{
  display: flex;
  flex-wrap: wrap;
}

.character_card{
  width: 21%;
  box-sizing: border-box;
  margin: 2%;
  border-radius: 1%;
  border: solid;
  border-color: aqua;
  text-align: center;
}
</style>