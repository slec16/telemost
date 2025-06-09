import { defineStore } from "pinia";


export const useMediaStore = defineStore( 'media', {
    state: () =>( {
        audioInputDevice: null,
        audioOutputDevice: null,
        videoDevice: null,
        volumeInput: null,
        volumeOutput: null
    } ),
    getters: {

    },
    actions: {
        
    }
} )