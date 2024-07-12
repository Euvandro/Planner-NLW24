import { createContext, useContext } from "react";
import { TouchableOpacity, Text, TouchableOpacityProps, TextProps, View, ActivityIndicator } from "react-native";

import clsx from "clsx";

type Variants = "primary" | "secondary";

type ButtonProps = TouchableOpacityProps & {
    variant?: Variants
    isLoading?: boolean,
    flex?: boolean,
}

const ThemeContext = createContext<{ variant?: Variants }>({})

function Button({ variant = "primary", isLoading, children, className, flex = false, ...rest }: ButtonProps) {
    return (

        <TouchableOpacity
            activeOpacity={0.7}
            disabled={isLoading}
            {...rest}
             style={{justifyContent: "center", alignItems: 'center', flexDirection: 'row', flex: flex ? 1 : 0}}
             
        >
            <View className={clsx(
                "h-11 flex-row items-center justify-center rounded-lg gap-2 px-2",
                {
                    "bg-lime-300": variant === "primary",
                    "bg-zinc-800": variant === "secondary",
                },
                className
            )}
            >

                <ThemeContext.Provider value={{ variant }}>
                    {isLoading ? <ActivityIndicator className={variant === "primary" ? "text-lime-950" : "text-zinc-200"} /> : children}
                </ThemeContext.Provider>
            </View>

        </TouchableOpacity>

    )
}

function Title({ children }: TextProps) {

    const { variant } = useContext(ThemeContext)

    return <Text className={clsx("text-base font-semibold", { "text-lime-950": variant === 'primary', "text-zinc-200": variant === 'secondary' })}>
        {children}
    </Text>
}

Button.Title = Title;

export { Button };