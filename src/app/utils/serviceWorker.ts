 export async function registerServiceWorker ()  {
    if(!("serviceWorker" in navigator)){
        throw Error("Service brokers are not supported by this browser")
    }
    await navigator.serviceWorker.register("/serviceWorker.js")
 }

 export async function getReadyServiceWorker ()  {
    if(!("serviceWorker" in navigator)){
        throw Error("Service brokers are not supported by this browser")
    }
    return navigator.serviceWorker.ready
 }
 