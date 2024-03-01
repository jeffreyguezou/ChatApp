import React, { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./avatar";
import Logo from "./logo";
import { UserContext } from "../context/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "./contact";

type MessagesType = { text: string; isOur: boolean };

const Chat = () => {
  const [ws, setWs] = useState<WebSocket>();
  const [onlineUsers, setOnlineUsers] = useState({});
  const [selectedUserId, setSelectedUserID] = useState("");
  const { username, id } = useContext(UserContext);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState({});
  const divUnderMessages = useRef();
  let messagesWithoutDupe;

  useEffect(() => {
    connectToWs();
  }, []);

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  }

  function showOnlineUsers(usersArray: []) {
    const users = {};
    usersArray.forEach(({ userId, username }) => {
      users[userId] = username;
    });
    setOnlineUsers(users);
  }

  const onLineUsersExclCurrentUser = { ...onlineUsers };
  delete onLineUsersExclCurrentUser[id];

  function handleMessage(event: { data: string }) {
    const messageData = JSON.parse(event.data);
    if ("online" in messageData) {
      showOnlineUsers(messageData.online);
    } else if ("text" in messageData) {
      console.log({ messageData });
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  const messageChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setNewMessageText(event.currentTarget.value);
  };

  const sendMessageHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ws?.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
      })
    );
    setMessages((prev) => {
      return [
        ...prev,
        {
          text: newMessageText,
          sender: id,
          recipient: selectedUserId,
          _id: Date.now(),
        },
      ];
    });

    setNewMessageText("");
  };

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        const { data } = res;
        setMessages(data);
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlineUsersArray = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlineUsers).includes(p._id));
      const offlineUsers = {};
      offlineUsersArray.forEach((element) => {
        offlineUsers[element._id] = element;
      });
      setOfflineUsers(offlineUsers);
    });
  }, [onlineUsers]);

  useEffect(() => {
    messagesWithoutDupe = uniqBy(messages, "_id");
  }, [messages]);

  return (
    <div className="flex h-screen">
      <div className="bg-blue-50 w-1/3">
        <Logo />
        {Object.keys(onLineUsersExclCurrentUser).map((user) => {
          return (
            <Contact
              key={user}
              userid={user}
              userName={onLineUsersExclCurrentUser[user]}
              onClick={() => setSelectedUserID(user)}
              selected={user === selectedUserId}
              online={true}
            />
          );
        })}
        {Object.keys(offlineUsers).map((user) => {
          return (
            <Contact
              key={user}
              userid={user}
              userName={offlineUsers[user].username}
              onClick={() => setSelectedUserID(user)}
              selected={user === selectedUserId}
              online={false}
            />
          );
        })}
      </div>
      <div className=" flex flex-col bg-blue-100 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-slate-500">
                Select an user to start a conversation
              </div>
            </div>
          )}

          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2 ">
                {messagesWithoutDupe?.map((msg) => {
                  return (
                    <div
                      key={msg._id}
                      className={msg.sender === id ? "text-right" : "text-left"}
                    >
                      <div
                        className={
                          "text-left inline-block p-2 my-2 rounded-md text-sm " +
                          (msg.sender === id
                            ? "bg-blue-500"
                            : "bg-white text-gray-700")
                        }
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>

        {!!selectedUserId && (
          <form onSubmit={sendMessageHandler} className="flex gap-2">
            <input
              value={newMessageText}
              onChange={messageChangeHandler}
              type="text"
              placeholder="Type your message here"
              className="bg-white flex-grow border p-2 rounded-sm"
            ></input>
            <button
              type="submit"
              className="bg-blue-400 p-2 text-white rounded-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default Chat;
