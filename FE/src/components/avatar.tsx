type AvatarProps = {
  userID: string;
  username: string;
  online: boolean;
};

const Avatar = ({ userID, username, online }: AvatarProps) => {
  const COLORS = [
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-teal-200",
  ];

  const userIDBase10 = parseInt(userID, 16);
  const colorIndex = userIDBase10 % COLORS.length;
  const color = COLORS[colorIndex];
  return (
    <div
      className={
        "w-8 h-8 relative rounded-full flex items-center justify-center " +
        color
      }
    >
      <div className="opacity-70">{username[0]}</div>

      {online && (
        <div className="absolute rounded-full w-2.5 h-2.5 bg-green-600 bottom-0 right-0 border border-white"></div>
      )}
      {!online && (
        <div className="absolute rounded-full w-2.5 h-2.5 bg-slate-400 bottom-0 right-0 border border-white"></div>
      )}
    </div>
  );
};
export default Avatar;
