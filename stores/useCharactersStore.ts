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
            const apiStore= useApiStore()
            if (this.characters.length == 0){
                const result = (await apiStore.get(`/character?${this._filter}`)).data
                if ("error" in result){
                    return null
                }
                return result
            }
            if (this._nextpage){
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
            const pageData = await this.getNextPage()
            if (!pageData){
                return
            }
            this.characters.push(pageData.results)
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
        }
    }
})