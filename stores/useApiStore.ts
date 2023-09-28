import axios from "axios";
import { defineStore } from "pinia";

const baseURL = "https://rickandmortyapi.com/api";
const api = axios.create({
    baseURL: baseURL,
    headers: {
      common: {},
    },
  })

// global axios instance 
// uses queries to get data 
// js api for web api can be implemented for easier use
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