<template>
    <div>
        <div class="filtration_options">
            <div class="filtration_option">
                <label for="name_input">Имя: </label>
                <input type="search" ref="name_input" v-model="selectedFiltration.name" v-on:input="updateFiltration"/>
            </div>
            <div class="filtration_option">
                <label for="status_select" class="filtration_label">Статус: </label>
                <select ref="status_select" class="selection_menu" v-model="selectedFiltration.status" v-on:change="updateFiltration">
                    <option v-for="status in statusOptions" :value="status" class="selection_option" :selected="status == selectedFiltration.status">{{ status }}</option>
                </select>
            </div>
        </div>
        <div class="character_cards_list">
            <div class="card" v-for="cardData in characters">
                <NuxtLink :to="`/character?id=${cardData.id}`">
                    <h2> {{ cardData.name }}</h2>
                    <p>Разновидность: {{ cardData.species }}</p>
                    <img class="card_image" :src="cardData.image">
                </NuxtLink>
                <div>
                    <div class="episode_row" v-for="episode in cardData.episode">
                        <NuxtLink class="link_fill" :to="`/episode?id=${episode.id}`"/>
                        <div class="episode_name">{{ episode.name }}</div>
                        <div class="episode">{{ episode.episode }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import useApiStore from "../stores/useApiStore";
import useCharacterListStore from "../stores/useCharacterListStore"
import useFiltrationOptionsStore from "../stores/useFiltrationOptionsStore";

// filtrations + character data preview
// switch for infinite-scrolling / pagination mode can be implemented, but not needed
export default {
    mounted(){
        // setup for infinite-scroll
        window.onscroll = () => this.onScroll()
        if (this.characters.length == 0){
            this.appendCharacters()
        }
    },
    data() {
      return {
        apiStore: useApiStore(),
        charactersStore: useCharacterListStore(),
        selectedFiltration: useFiltrationOptionsStore(),
        statusOptions: ["", "alive", "dead", "unknown"]  // in future change to enum
      }
    },
    computed: {
        characters() {
            return this.charactersStore.characters
        }
    },
    methods: {

        // updates filtration options and reloads found characters
        async updateFiltration(){
            this.charactersStore.setFilter(`name=${this.selectedFiltration.name}&status=${this.selectedFiltration.status}`)
            await this.charactersStore.appendNextPage()
        },
        // hard reset of character list
        resetCharacters(){
            this.charactersStore.reset()
        },
        // hard append next characters
        async appendCharacters(){
            await this.charactersStore.appendNextPage()
        },
        // infinite-scroll append
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
  width: 100%;
}

.card_image{
    max-width: 100%;
    border-radius: 1%;
}

.overlay_link{
    width: 100%;
    height: 100%;
}
.filtration_options{
    display: flex;
    margin-left: 2%;
    gap: 1%;
}
.episodes_list{
    width: 100%;
    
}.episode_row .link_fill {
  position:absolute;
  left:0; top:0; bottom:0; right:0;
}
.episode_row{
    position:relative;
    display: grid;
    grid-template-columns: auto max-content;
    column-gap: 5px;
    padding: 2% 4%;
}
.episode_name{
    text-align: left;
}.episode{
    text-align: right;
}

</style>