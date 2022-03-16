import React, {useEffect, useState} from "react";
import io from "socket.io-client";
const socket = io("http://192.168.50.59:3001");

function Chat() {
    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {
        socket.on("receive message", (message) => {
            setMessageList([...messageList, message])
        });
    }, [msg])

    const sendMsg = (e) => {
        e.preventDefault();
        // if(!name || !msg) return false;
        socket.emit("send message", {
            name: "익명",
            msg: msg,
        });

        setName("");
        setMsg("");
    }

    const changeMsg = (e) => {
        setMsg(e.target.value);
    }

    return (
        <div>
            <form className="chat-use-box" onSubmit={(e)=>{sendMsg(e);}}>
                <div className="chat-use-inp">
                    {/*<input type="text" onChange={(e) => {changeName(e);}} value="익명" placeholder="아이디" />*/}
                    <input type="text" onChange={(e) => {changeMsg(e);}} value={msg} placeholder="메시지 내용" />
                </div>
                <button className="chat-use-btn" type="submit">보내기</button>
            </form>
            <section className="chat-box">
                {messageList.map((item, key) => (
                    <div className="chat-item" key={key}>
                        <p className="name">{item.name}</p>
                        <p className="msg">{item.msg}</p>
                    </div>
                ))}
            </section>
        </div>
    )
}

export default Chat;




