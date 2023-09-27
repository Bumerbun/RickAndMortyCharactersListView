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

        async _getPageData(link: string){
            const apiStore = useApiStore()
            const pageData = (await apiStore.get(link)).data
            console.log(pageData)
            for (let i = 0; i < pageData.results.length; i++){
                pageData.results[i].episode = ((await this._parseEpisodes(pageData.results[i].episode)).splice(0, 5))
            }
            console.log(pageData)
            return pageData
        },
        async _getNextPage(){
            const apiStore = useApiStore()
            if (this.characters.length == 0){
                try {
                    return this._getPageData(`/character?${this._filter}`)
                } catch (error: any) {
                    console.log(error.message)
                    return null
                }
            }
            if (this._nextpage){
                return this._getPageData(this._nextpage)
            }
            return null
        },
        async _getPreviousPage(){
            const apiStore= useApiStore()
            if (this._previouspage){
                return this._getPageData(this._previouspage)
            }
            return null
        },
        async appendNextPage(){
            const pageData = await this._getNextPage()
            if (!pageData){
                return
            }
            this._nextpage = pageData.info?.next
            this._previouspage = pageData.info?.prev
            this.characters.push(...pageData.results)
        },
        async _parseEpisodes(characterepisodes: string[]){
            const episodes = []
            for (let i = 0; i < characterepisodes.length; i ++){
                episodes.push(await this._getEpisodeData(characterepisodes[i]))
            }
            return episodes
        },
        async _getEpisodeData(link: string){
            const apiStore = useApiStore()
            const episodeData = (await apiStore.get(link)).data
            return (({ name, episode, id }) => ({ name, episode, id }))(episodeData)
        },
        _selectPage(pageData: any){
            if (!pageData){
                return
            }
            this.characters = pageData.results

            this._nextpage = pageData.info?.next
            this._previouspage = pageData.info?.prev
        },
        async selectNextPage(){
            this._selectPage(await this._getNextPage())
        },
        async selectPreviousPage(){
            this._selectPage(await this._getPreviousPage())
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