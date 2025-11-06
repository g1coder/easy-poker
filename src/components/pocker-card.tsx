import { Card, CardContent, Typography } from "@mui/material";

interface PokerCardProps {
    card: string;
    isSelected: boolean;
    onVote: (card: string) => void;
}

export const PokerCard = ({ card, isSelected, onVote }: PokerCardProps) => {
    return (
        <Card
            sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
                border: isSelected ? "2px solid" : "1px solid",
                borderColor: isSelected ? "primary.main" : "divider",
                backgroundColor: isSelected
                    ? "primary.light"
                    : "background.paper",
                "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 2,
                },
            }}
            onClick={() => onVote(card)}
        >
            <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h5" component="div">
                    {card}
                </Typography>
            </CardContent>
        </Card>
    );
};
