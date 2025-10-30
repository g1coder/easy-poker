import { Box } from "@mui/material";
import { Room } from "@components/room";

export default function Home() {
    return (
        <main>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <Room />
            </Box>
        </main>
    );
}
