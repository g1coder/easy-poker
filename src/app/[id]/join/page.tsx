"use client";

import { useParams, useRouter } from "next/navigation";
import { Container } from "@mui/material";
import { JoinRoom } from "@components/join-room";

export default function JoinRoomPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id || null;
    const { push } = useRouter();

    return (
        <Container
            sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
            }}
        >
            <JoinRoom
                roomId={id}
                onJoin={() => {
                    push(`/${id}`);
                }}
            />
        </Container>
    );
}
