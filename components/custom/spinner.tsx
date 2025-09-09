import { CgSpinner } from "react-icons/cg";

type ButtonSpinnerProps = {
  label?: string;
  className?: string;
};

export const ButtonSpinner = ({ label = "Processing...", className = "" }: ButtonSpinnerProps) => {
  return (
    <span className={`flex items-center justify-center gap-2 ${className}`}>
      <CgSpinner className="animate-spin text-xl" />
      {label}
    </span>
  );
};
