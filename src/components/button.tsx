import { TouchableOpacity, Text, TouchableOpacityProps, TextProps } from "react-native";

import clsx from "clsx";

type Variants = "primary" | "secondary";

type ButtonProps = TouchableOpacityProps & {
    variant?: Variants
    isLoading?: boolean
}

function Button({ variant = "primary", isLoading, children, ...rest }: ButtonProps) {
    return(
    <TouchableOpacity className="w-full bg-lime-500">
        {children}
    </TouchableOpacity>
    )
}

function Title({ children }: TextProps) {
    return <Text>{children}</Text>
}

Button.Title = Title;

export { Button };