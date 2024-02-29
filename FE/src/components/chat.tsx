import React, { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./avatar";
import Logo from "./logo";
import { UserContext } from "../context/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";

type MessagesType = { text: string; isOur: boolean };

const Chat = () => {
  const [ws, setWs] = useState<WebSocket>();
  const [onlineUsers, setOnlineUsers] = useState({});
  const [selectedUserId, setSelectedUserID] = useState("");
  const { username, id } = useContext(UserContext);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const divUnderMessages = useRef();

  useEffect(() => {
    connectToWs();
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {});
  }, []);

  function connectToWs() {}

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

  function selectContact(userId: string) {
    setSelectedUserID(userId);
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
          id: Date.now(),
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
      //axios.get('/messages/'+selectedUserId)
    }
  }, [selectedUserId]);

  const messagesWithoutDupe = uniqBy(messages, "id");
  console.log(messagesWithoutDupe);

  return (
    <div className="flex h-screen">
      <div className="bg-blue-50 w-1/3">
        <Logo />
        {Object.keys(onLineUsersExclCurrentUser).map((user) => {
          return (
            <div
              onClick={() => {
                selectContact(user);
              }}
              className={
                "border-b border-gray-100 flex items-center gap-2 cursor-pointer " +
                (user === selectedUserId ? "bg-blue-100" : "")
              }
              key={user}
            >
              {user === selectedUserId && (
                <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
              )}
              <div className="flex gap-2 py-2 pl-4 items-center">
                <Avatar username={onlineUsers[user]} userID={user} />
                <span className="text-gray-800">{onlineUsers[user]}</span>
              </div>
            </div>
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
                        sender:{msg.sender}
                        <br />
                        my id:{id}
                        <br />
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
