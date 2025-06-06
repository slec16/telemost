import { defineStore } from "pinia";


export const useMediaStore = defineStore( 'media', {
    state: () =>( {
        audioInputDevice: {},
        audioOutputDevice: {},
        videoDevice: {},
        volumeInput: null,
        volumeOutput: null
    } ),
    getters: {

    },
    actions: {
        
    }
} )