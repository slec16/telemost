import { defineStore } from "pinia";


export const useSocketStore = defineStore( 'socket', {

    state: () => ( {
        wsConn: undefined,
        socketState: 0
    }),
    getters: {

    },
    actions: {
        connectWs() {
            console.log("test")
            this.wsConn = new WebSocket('ws://localhost:9000')

        },

        disconnectWs() {

        },

        openWs() {
            this.wsConn.onopen = (userName) => {
                this.wsConn.send(JSON.stringify(userName))
            }
        }


    }

} )