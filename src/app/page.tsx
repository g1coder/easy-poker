import { Box } from "@mui/material";
import { CreateRoom } from "@components/create-room";

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
                <CreateRoom />
            </Box>
        </main>
    );
}
