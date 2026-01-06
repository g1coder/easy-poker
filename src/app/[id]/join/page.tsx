"use client";

import { useParams } from "next/navigation";
import { JoinRoom } from "@components/join-room";
import { Container } from "@mui/material";

export default function JoinRoomPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id || null;

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100%",
            }}
        >
            <JoinRoom roomId={id} />;
        </Container>
    );
}
