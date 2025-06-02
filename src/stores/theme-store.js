import { defineStore } from "pinia"

export const useThemeStore = defineStore( 'theme', {
    state: () => ( {
        theme: 'dark'
    } ),
    getters: {
        changeTheme: (state) => {
            state.theme === 'light' ? state.theme = 'dark' : state.theme = 'light'
        },
    },
} )