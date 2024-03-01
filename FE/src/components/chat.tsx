import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "./logo";
import { UserContext } from "../context/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "./contact";

const Chat = () => {
  const [ws, setWs] = useState<WebSocket>();
  const [onlineUsers, setOnlineUsers] = useState({});
  const [selectedUserId, setSelectedUserID] = useState("");
  const { username, id, setId, setUsername } = useContext(UserContext);
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

  messagesWithoutDupe = uniqBy(messages, "_id");

  function logoutHandler() {
    axios.post("/logout").then(() => {
      setWs(null);
      setId("");
      setUsername("");
    });
  }

  const sendFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files[0];
    console.log(typeof file);
  };

  return (
    <div className="flex h-screen">
      <div className="bg-blue-50 w-1/3 flex flex-col">
        <div className="flex-grow">
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
        <div className="p-2 text-center">
          <span className="mr-2 text-sm text-gray-500">Welcome {username}</span>
          <button
            className="text-sm text-gray-600 bg-blue-200 py-1 px-2 border rounded-sm"
            onClick={logoutHandler}
          >
            Log Out
          </button>
        </div>
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
            <label className="bg-blue-200 p-2 text-gray-500 cursor-pointer rounded-sm border border-blue-300">
              <input
                type="file"
                className="hidden"
                onChange={sendFileHandler}
              />
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
                  d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                />
              </svg>
            </label>
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
