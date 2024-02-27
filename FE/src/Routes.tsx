import Chat from "./components/chat";
import Register from "./components/registerAndLogin";
import { UserContext } from "./context/UserContext";
import { useContext } from "react";

export default function Routes() {
  const { username, id } = useContext(UserContext);
  if (username) {
    return <Chat />;
  } else {
  }
  return <Register />;
}
