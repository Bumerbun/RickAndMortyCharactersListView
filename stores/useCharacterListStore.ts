import { defineStore } from "pinia";
import useApiStore from "./useApiStore";


// characters store for main page character list
export default defineStore('characterList', {
    state: () => ({
        characters : [] as any[], // uses any type, but type for character data should be implemented
        _filter: null as string | null, 
        _nextpage: null as string | null,
        _previouspage: null as string | null,
    }),
    actions: {

        // queries api for characters and returns page data
        async _getPageData(link: string){
            const apiStore = useApiStore()
            const pageData = (await apiStore.get(link)).data
            
            // replaces episodes links with episodes data
            for (let i = 0; i < pageData.results.length; i++){
                pageData.results[i].episode = ((await this._parseEpisodes(pageData.results[i].episode)).splice(0, 5))
            }
            return pageData
        },

        // episodes parsing from episodes link list
        async _parseEpisodes(characterepisodes: string[]){
            const episodes = []
            for (let i = 0; i < characterepisodes.length; i ++){
                episodes.push(await this._getEpisodeData(characterepisodes[i]))
            }
            return episodes
        },
        // parses single episode link
        async _getEpisodeData(link: string){
            const apiStore = useApiStore()
            const episodeData = (await apiStore.get(link)).data
            return (({ name, episode, id }) => ({ name, episode, id }))(episodeData)
        },

        // first / next page getter
        async _getNextPage(){
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

        // previous page getter
        async _getPreviousPage(){
            if (this._previouspage){
                return this._getPageData(this._previouspage)
            }
            return null
        },
        // appends characters to list for infinite scrolling
        async appendNextPage(){
            const pageData = await this._getNextPage()
            if (!pageData){
                return
            }
            this._nextpage = pageData.info?.next
            this._previouspage = pageData.info?.prev
            this.characters.push(...pageData.results)
        },

        // page selection for pagination
        _selectPage(pageData: any){
            if (!pageData){
                return
            }
            this.characters = pageData.results

            this._nextpage = pageData.info?.next
            this._previouspage = pageData.info?.prev
        },

        // pagination next page
        async selectNextPage(){
            this._selectPage(await this._getNextPage())
        },

        //pagination previous page
        async selectPreviousPage(){
            this._selectPage(await this._getPreviousPage())
        },

        // sets new filter and resets data
        setFilter(filter: string){
            this._filter = filter
            this.characters = []
            this._nextpage = null
            this._previouspage = null
        },

        // resets all data
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