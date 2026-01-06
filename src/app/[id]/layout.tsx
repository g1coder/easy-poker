"use client";

import { FC, PropsWithChildren } from "react";
import { Box } from "@mui/material";

const Layout: FC<PropsWithChildren> = ({ children }) => (
    <Box
        sx={{
            flexGrow: 1,
            p: 2,
            height: "100vh",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }}
    >
        {children}
    </Box>
);

export default Layout;
