import axios from "axios";
import { defineStore } from "pinia";

const baseURL = "https://rickandmortyapi.com/api";
const api = axios.create({
    baseURL: baseURL,
    headers: {
      common: {},
    },
  })

export default defineStore("apistore", {
    actions: {
        urlToPath(url: string){
            return url.replace(baseURL, "")
        },
        get(test: string){
            return api.get(this.urlToPath(test))
        }
    }
})