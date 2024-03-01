import Avatar from "./avatar";

const Contact = ({ userid, userName, onClick, selected, online }) => {
  return (
    <>
      <div
        onClick={() => {
          onClick(userid);
        }}
        className={
          "border-b border-gray-100 flex items-center gap-2 cursor-pointer " +
          (selected ? "bg-blue-100" : "")
        }
        key={userid}
      >
        {selected && <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>}
        <div className="flex gap-2 py-2 pl-4 items-center">
          <Avatar online={online} username={userName} userID={userid} />
          <span className="text-gray-800">{userName}</span>
        </div>
      </div>
    </>
  );
};
export default Contact;
