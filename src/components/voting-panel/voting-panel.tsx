import { Box } from "@mui/material";
import { Task } from "@/api";

interface VotingPanelProps {
    task: Task | null;
}

export const VotingPanel = (props: VotingPanelProps) => {
    return <Box>{JSON.stringify(props.task)}</Box>;
};
