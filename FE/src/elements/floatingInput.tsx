import styled from "styled-components";

const FloatingLabelInput = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #a6a6a6;
  border-radius: 2px;
  padding: 10px;
`;

const InputWrapper = styled.div`
  position: relative;
  & > div {
    position: relative;
    width: 100%;
  }
  & > div > span {
    position: absolute;
    color: gray;
    top: 50%;
    left: 0;
    padding: 0 5px;
    text-transform: uppercase;
    transform: translateY(-50%);
    margin-left: 10px;
    font-size: 15px;
    background-color: white;
    transition: all 100ms ease-in-out;
    border-radius: 10px;
    pointer-events: none;
  }
  input:focus + span {
    top: 0%;
    font-size: 13px;
    color: #1dabda;
  }
  input:not(:placeholder-shown) + span {
    top: 0%;
    font-size: 11px;
    color: #1dabda;
  }
`;

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  staticPlaceholder?: boolean;
}

const FloatingInput = ({
  placeholder,
  staticPlaceholder = false,
  ...props
}: FloatingInputProps) => {
  return (
    <div className="my-5">
      <InputWrapper>
        <div>
          <FloatingLabelInput
            placeholder={staticPlaceholder ? undefined : " "}
            {...props}
          ></FloatingLabelInput>
          <span>{placeholder}</span>
        </div>
      </InputWrapper>
    </div>
  );
};
export default FloatingInput;
