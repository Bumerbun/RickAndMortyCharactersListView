import { defineStore } from "pinia";
import useApiStore from "./useApiStore";


// basic store for character data
export default defineStore("character", {
    state: () => ({
        _id: null as number | null,
        characterData: null as any, // should be class for storing character data
    }),
    actions: {
        // sets Id and fills data
        async setId(id : number){
            if (this._id == id){
                return
            }
            const apiStore = useApiStore()
            var characterData = null
            try {    
                characterData = (await apiStore.get(`/character/${id}`)).data
            } 
            catch (error: any) {
                console.log(error.message)
                return
            }
            this.characterData = characterData
        }
    }
})