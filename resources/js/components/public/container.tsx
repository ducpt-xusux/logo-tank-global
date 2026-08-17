import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container = ({
  children,
  className,
  ...props
}: ContainerProps) => {
    return (
        <div
            className={cn("mx-auto w-full max-w-[1238px] px-2", className)}
            {...props}
        >
            {children}
        </div>
    );
};
