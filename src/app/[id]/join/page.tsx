"use client";

import { useParams } from "next/navigation";
import { Container } from "@mui/material";
import { JoinRoom } from "@components/join-room";

export default function JoinRoomPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id || null;

    return (
        <Container
            sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
            }}
        >
            <JoinRoom roomId={id} />
        </Container>
    );
}
