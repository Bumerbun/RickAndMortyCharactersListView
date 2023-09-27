import { defineStore } from "pinia";
import useApiStore from "./useApiStore";

export default defineStore("character", {
    state: () => ({
        _id: null as number | null,
        characterData: null as any,
    }),
    actions: {
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