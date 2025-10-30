"use client";

import { useParams } from "next/navigation";
import { Container } from "@mui/material";

export default function Room() {
    const { id: roomId } = useParams<{ id: string }>();

    return <Container>{roomId}</Container>;
}
