import { Loader2 } from "lucide-react";
import React from "react";

type Props = {};

const LoadingComponent = (props: Props) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Loader2 className="animate-spin w-10 h-10 text-primary" />
    </div>
  );
};

export default LoadingComponent;