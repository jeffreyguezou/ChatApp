type AvatarProps = {
  userID: string;
  username: string;
};

const Avatar = ({ userID, username }: AvatarProps) => {
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
        "w-8 h-8 rounded-full flex items-center justify-center " + color
      }
    >
      <div className="opacity-70">{username[0]}</div>
    </div>
  );
};
export default Avatar;
