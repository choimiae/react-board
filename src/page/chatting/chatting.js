import React from "react";

function Chatting() {
    let ws = null;
    const url = "ws://192.168.50.198:8091/echo";

    function connect() {
        ws = new WebSocket(url);
        ws.onopen = function() {
            log("연결됨");
        };

        ws.onmessage = function(event) {
            log(event.data);

        };

        ws.onclose = function(event) {
            log("연결 끊김");
        };
    }

    function disconnect() {
        if (ws != null) {
            ws.close();
            ws = null;
        }
    }

    function echo() {
        if (ws != null) {
            const message = document.getElementById("message").value;
            log("보낸 메시지 :: " + message);
            ws.send(message);
        } else alert("연결 먼저!");
    }

    function log(message) {
        const console = document.getElementById("logging");
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(message));
        console.appendChild(p);
    }

    return (
        <div>
            <div>
                <div>
                    <button type="button" onClick={()=> {connect();}}>연결하기</button>
                    <button type="button" onClick={()=>{disconnect();}}>연결끊기</button>
                </div>
                <div>
                    <textarea id="message" placeholder="메시지를 입력하세요."></textarea>
                </div>
                <div>
                    <button onClick={()=>{echo();}}>메시지 보내기</button>
                </div>
            </div>
            <div>
                <h3>로그</h3>
                <div id="logging"></div>
            </div>
        </div>
    )
}

export default Chatting;
