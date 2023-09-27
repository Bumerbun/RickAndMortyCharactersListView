import { defineStore } from "pinia";
import useApiStore from "./useApiStore";

export default defineStore('character', {
    state: () => ({
        characters : [] as any[],
        _filter: null as string | null, 
        _nextpage: null as string | null,
        _previouspage: null as string | null,
    }),
    actions: {
        async getNextPage(){
            const apiStore = useApiStore()
            if (this.characters.length == 0){
                const result = (await apiStore.get(`/character?${this._filter}`)).data
                if ("error" in result){
                    return null
                }
                return result
            }
            if (this._nextpage){
                console.log(this._nextpage)
                return (await apiStore.get(this._nextpage)).data
            }
            return null
        },
        async getPreviousPage(){
            const apiStore= useApiStore()
            if (this._previouspage){
                return (await apiStore.get(this._previouspage)).data
            }
            return null
        },
        async appendNextPage(){
            const apiStore = useApiStore()
            const pageData = await this.getNextPage()
            if (!pageData){
                return
            }
            const nextpage = pageData.info?.next
            this._nextpage = nextpage ? apiStore.urlToPath(nextpage) : null
            this.characters.push(...pageData.results)
        },
        parseEpisodes(characterepisodes: string[]){

            const apiStore = useApiStore()
            characterepisodes.slice(0,5).map((elem) => {
                apiStore.get(apiStore.urlToPath(elem)) 
            })
        },
        _selectPage(pageData: any){
            if (!pageData){
                return
            }
            const apiStore = useApiStore()

            this.characters = pageData.results

            const nextpage = pageData.info?.next
            this._nextpage = nextpage ? apiStore.urlToPath(nextpage) : null

            const previouspage = pageData.info?.prev
            this._previouspage = previouspage ? apiStore.urlToPath(pageData.info?.prev) : null
        },
        async selectNextPage(){
            this._selectPage(await this.getNextPage())
        },
        async selectPreviousPage(){
            this._selectPage(await this.getPreviousPage())
        },
        setFilter(filter: string){
            this._filter = filter
            this.characters = []
            this._nextpage = null
            this._previouspage = null
        },
        reset(){
            this._filter = null
            this.characters = []
            this._nextpage = null
            this._previouspage = null
        }
    },
    persist: {
        storage: persistedState.localStorage
    }
})