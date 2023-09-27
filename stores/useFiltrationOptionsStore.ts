import { defineStore } from "pinia";

export default defineStore("filtrationOptions", {
    state: () => ({
        name: "",
        status: "",
    }),
    persist: {
        storage: persistedState.localStorage
    }
})