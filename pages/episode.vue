<template>
    <div>
        <div class="card_title">
            <h2>{{ episodeData?.name }} {{ episodeData?.episode }}</h2>
            <p>Дата релиза: {{ episodeData?.air_date }}</p>
        </div>
        <div class="character_list">
            <div class="card" v-for="character in episodeData?.characters">
                <NuxtLink :to="`./character?id=${character?.id}`">
                    <img class="image" :src="character?.image"/>
                    <p>{{ character?.name }}</p>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import useEpisodeStore from '~/stores/useEpisodeStore'

// 
export default {
    beforeMount(){
        this.episodeStore.setId(Number(this.$route.query.id))
    },
    mounted(){
    },
    data(){
        return {
            episodeStore: useEpisodeStore()
        }
    },
    computed: {
        episodeData(){
            return this.episodeStore.episodeData
        }
    }
}
</script>

<style scoped>

.card_title{
  text-align: center;
}
.character_list{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.character{
  width: 29.3%;
  position: relative;
  box-sizing: border-box;
  margin: 2%;
  border-radius: 1%;
  border: solid;
  border-color: rgba(136, 136, 136, 0.738);
  text-align: center;
}
.image{
    max-width: 100%;
    margin: 5% 5% 0% 5%;
}
h2, p {
    margin: 0;
    text-align: center;
}
</style>