import { defineStore } from "pinia";


//store preserving selected filtration options 
export default defineStore("filtrationOptions", {
    state: () => ({
        name: "",
        status: "",
    }),
    persist: {
        storage: persistedState.localStorage
    }
})