import { defineStore } from "pinia";


export const useSocketStore = defineStore( 'socket', {

    state: () => ( {
        wsConn: undefined,
        socketState: 0,
        recieveMessage: undefined
    }),
    getters: {

    },
    actions: {
        connectWs() {
            this.wsConn = new WebSocket('ws://localhost:9000')
        },

        disconnectWs() {
            this.wsConn.close()
            this.socketState = this.wsConn.readyState // по сути наверно перенести в getters
        },

        openWs(userName) {
            this.wsConn.onopen = (e) => {
                this.socketState = this.wsConn.readyState
                this.wsConn.send(JSON.stringify(userName))

            }
            this.wsConn.onmessage = (e) => {
                const message = JSON.parse(e.data)
                this.recieveMessage = message
            }
        },

        sendMassageWs(message) {
            this.wsConn.send(JSON.stringify(message))
        }


    }

} )