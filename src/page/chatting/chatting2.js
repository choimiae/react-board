import React from "react";

function Chatting2() {
    var clientWebSocket = new WebSocket("ws://192.168.50.198:8091/echo");
    clientWebSocket.onopen = function() {
        console.log("clientWebSocket.onopen", clientWebSocket);
        console.log("clientWebSocket.readyState", "websocketstatus");
        clientWebSocket.send("event-me-from-browser");
    }
    clientWebSocket.onclose = function(error) {
        console.log("clientWebSocket.onclose", clientWebSocket, error);
        events("Closing connection");
    }
    clientWebSocket.onerror = function(error) {
        console.log("clientWebSocket.onerror", clientWebSocket, error);
        events("An error occured");
    }
    clientWebSocket.onmessage = function(error) {
        console.log("clientWebSocket.onmessage", clientWebSocket, error);
        events(error.data);
    }
    function events(responseEvent) {
        document.querySelector(".events").innerHTML += responseEvent + "<br>";
    }

    return (
        <div className="events"></div>
    )

}

export default Chatting2;
