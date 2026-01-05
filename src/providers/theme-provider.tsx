"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
    cssVariables: true,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
    },
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const themeToUse = mounted ? theme : createTheme({});

    return (
        <MuiThemeProvider theme={themeToUse}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
};
