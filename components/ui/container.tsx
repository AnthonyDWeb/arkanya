import {ReactNode} from "react";

type ContainerProps = {
    children: ReactNode;
    className?: string;
};

export default function Container({children, className = ""}: ContainerProps) {
    return (
        <div className={`w-[90%] xl:w-[70%] mx-auto ${className}`}>
            {children}
        </div>
    );
}