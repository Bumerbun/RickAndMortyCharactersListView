<template>
    <div>
        <div class="card" style="height: 100%;">
            <h2>{{ characterData?.name }}</h2>
            <p>Разновидность: {{ characterData?.species }}</p>
            <img :src="characterData?.image"/>
            <p>Локация: {{ characterData?.location.name }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import useCharacterStore from '~/stores/useCharacterStore';


export default {
    beforeMount(){
        this.characterStore.setId(Number(this.$route.query.id))

    },
    mounted(){
    },
    data(){
        return {
            characterStore: useCharacterStore()
        }
    },
    computed: {
        characterData(){
            return this.characterStore.characterData
        }
    }
}
</script>

<style scoped>

.card{
    display:flow-root;
    margin: 0 auto;
    width: 50%;
    font-size:30px;
}
</style>