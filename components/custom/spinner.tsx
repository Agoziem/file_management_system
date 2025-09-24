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

export const CardSpinner = () => {
  return (
    <div className="mt-14 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <CgSpinner className="animate-spin text-3xl" />
      </div>
    </div>
  );
};

export const UiSpinner = () => {
  return (
    <div className="mt-6 flex items-center justify-center">
      <div className=" p-4">
        <CgSpinner className="animate-spin text-3xl" />
      </div>
    </div>
  );
};

