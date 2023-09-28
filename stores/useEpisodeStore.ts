import { defineStore } from "pinia";
import useApiStore from "./useApiStore";

export default defineStore("episode", {
    state: () => ({
        _id: null as number | null,
        episodeData: null as any,
    }),
    actions: {
        // sets Id and fills data
        async setId(id : number){
            if (this._id == id){
                return
            }
            const apiStore = useApiStore()
            var episodeData = null
            try {    
                episodeData = (await apiStore.get(`/episode/${id}`)).data
            } 
            catch (error: any) {
                console.log(error.message)
                return
            }
            for (let i = 0; i < episodeData.characters.length; i++){
                episodeData.characters[i] = (({ id, name, image }) => ({ id, name, image }))((await apiStore.get(episodeData.characters[i])).data)
            }
            this.episodeData = episodeData
        }
    },
    persist: {
        storage: persistedState.localStorage
    }
})