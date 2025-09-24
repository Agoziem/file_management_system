import { ReactNode } from "react";

interface EmptyResponseProps {
  icon: ReactNode;
  message: string;
  className?: string;
  actionbtn?: ReactNode;
}

const EmptyResponse = ({
  icon,
  message,
  className = "",
  actionbtn,
}: EmptyResponseProps) => {
  return (
    <div className={`text-center py-6 ${className}`}>
      <div className="text-7xl">{icon}</div>
      <p className=" mb-4 text-sm">{message}</p>
      {actionbtn && actionbtn}
    </div>
  );
};

export default EmptyResponse;
