import React, { useContext, useState } from "react";
import Button from "../elements/button";
import FloatingInput from "../elements/floatingInput";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Register = () => {
  const [enteredUserName, setEnteredUserName] = useState<string>("");
  const [enteredPassword, setEnteredPassword] = useState<string>("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("Register");

  const onNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEnteredUserName(e.currentTarget.value);
  };

  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEnteredPassword(e.currentTarget.value);
  };

  const { setUsername, setId } = useContext(UserContext);

  const submitHandler = async () => {
    const url = isLoginOrRegister === "Register" ? "register" : "login";
    const { data } = await axios.post(url, {
      username: enteredUserName,
      password: enteredPassword,
    });

    setUsername(enteredUserName);
    setId(data.id);
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center justify-center">
      <div className="w-1/2">
        <h1 className="text-sky-400 font-extrabold flex justify-center">
          WE-CHAT
        </h1>
        <FloatingInput
          onChange={onNameChange}
          value={enteredUserName}
          placeholder="Username"
        />
        <FloatingInput
          type="password"
          placeholder="password"
          value={enteredPassword}
          onChange={onPasswordChange}
        />
        <div className="flex justify-center">
          <Button onClick={submitHandler} className="block" bg={"green"}>
            {isLoginOrRegister}
          </Button>
        </div>
        <div className="text-center mt-2">
          {isLoginOrRegister === "Register" && (
            <div>
              Already a member?{" "}
              <button
                onClick={() => {
                  setIsLoginOrRegister("Login");
                }}
              >
                Login Here
              </button>
            </div>
          )}
          {isLoginOrRegister === "Login" && (
            <div>
              New User?{" "}
              <button
                onClick={() => {
                  setIsLoginOrRegister("Register");
                }}
              >
                Register Here
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Register;
