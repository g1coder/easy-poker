import { Box, Container } from "@mui/material";
import { CreateRoom } from "@components/create-room";
import { RestoreRoom } from "@components/restore-room";

export default function Home() {
    return (
        <Container
            component="main"
            sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
            }}
        >
            <Box sx={{ width: "100%" }}>
                <CreateRoom />
                <RestoreRoom />
            </Box>
        </Container>
    );
}
