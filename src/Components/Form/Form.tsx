import React, { CSSProperties, ReactElement, ReactNode } from "react";
import cn from "./Form.less";

interface FormProps {
    children: ReactNode;
}

export function Form({ children }: FormProps): ReactElement {
    return <div className={cn("form")}>{children}</div>;
}

interface FormRowProps {
    label?: string;
    useTopAlignForLabel?: boolean;
    singleLineControlGroup?: boolean;
    style?: CSSProperties;
    children: ReactNode;
}

export function FormRow({
    label,
    useTopAlignForLabel,
    singleLineControlGroup,
    children,
    style,
}: FormRowProps): ReactElement {
    return (
        <div className={cn("row")}>
            {label != null && (
                <div className={cn("label", { "label-for-group": useTopAlignForLabel })}>
                    {label}
                </div>
            )}
            <div className={cn("control")}>
                <div style={style} className={cn({ group: singleLineControlGroup })}>
                    {children}
                </div>
            </div>
        </div>
    );
}
