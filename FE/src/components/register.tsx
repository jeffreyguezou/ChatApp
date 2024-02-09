import React, { useState } from "react";
import Button from "../elements/button";
import FloatingInput from "../elements/floatingInput";

const Register = () => {
  const [enteredUserName, setEnteredUserName] = useState<string>("");
  const [enteredPassword, setEnteredPassword] = useState<string>("");

  const onNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEnteredUserName(e.currentTarget.value);
  };

  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEnteredPassword(e.currentTarget.value);
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
          <Button className="block" bg={"green"}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Register;
