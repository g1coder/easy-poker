import { Box, Container } from "@mui/material";
import { CreateRoom } from "@components/create-room";

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
            </Box>
        </Container>
    );
}
