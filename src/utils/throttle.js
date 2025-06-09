export function throttle( callee, timeout = 300 ) {

    let timer = null

    return ( ...args ) => {
        if( timer ) return
        callee( ...args )
        timer = setTimeout( () => {
            clearTimeout( timer )
            timer = null
        }, timeout )
    }
    
}