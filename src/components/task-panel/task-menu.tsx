import { useState } from "react";
import { Menu, MenuItem, IconButton, Typography, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";

interface TaskMenuProps {
    onDelete: () => void;
}

export const TaskMenu = ({ onDelete }: TaskMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton size="small" onClick={handleClick}>
                <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 160,
                        borderRadius: 2,
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        handleClose();
                        onDelete();
                    }}
                    sx={{ p: 1, color: "error.main" }}
                >
                    <Stack direction="row" gap={1}>
                        <DeleteIcon fontSize="small" />
                        <Typography variant="body2">Delete task</Typography>
                    </Stack>
                </MenuItem>
            </Menu>
        </>
    );
};
