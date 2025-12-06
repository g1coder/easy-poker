import React from "react";
import {
    Breadcrumbs,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    useTheme,
} from "@mui/material";
import { Delete, MoreVert, Home, Folder } from "@mui/icons-material";

interface BreadcrumbsWithDeleteMenuProps {
    items: BreadcrumbItem[];
    onDelete?: () => void;
    deleteLabel?: string;
}

const BreadcrumbsWithDeleteMenu: React.FC<BreadcrumbsWithDeleteMenuProps> = ({
    items,
    onDelete,
    deleteLabel = "Удалить",
}) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        onDelete?.();
        handleClose();
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(1),
            }}
        >
            <Breadcrumbs aria-label="breadcrumb" sx={{ flex: 1 }}>
                {items.map((item, index) => (
                    <Typography
                        key={index}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color:
                                index === items.length - 1
                                    ? "text.primary"
                                    : "text.secondary",
                            fontSize: "0.875rem",
                            fontWeight: index === items.length - 1 ? 600 : 400,
                        }}
                    >
                        {index === 0 ? (
                            <Home sx={{ fontSize: 16, mr: 0.5 }} />
                        ) : null}
                        {item.path ? (
                            <a
                                href={item.path}
                                style={{
                                    color: "inherit",
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {index > 0 && (
                                    <Folder sx={{ fontSize: 16, mr: 0.5 }} />
                                )}
                                {item.label}
                            </a>
                        ) : (
                            <>
                                {index > 0 && (
                                    <Folder sx={{ fontSize: 16, mr: 0.5 }} />
                                )}
                                {item.label}
                            </>
                        )}
                    </Typography>
                ))}
            </Breadcrumbs>

            <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{
                    color: "text.secondary",
                    "&:hover": {
                        backgroundColor: "action.hover",
                    },
                }}
            >
                <MoreVert />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                    <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{deleteLabel}</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default BreadcrumbsWithDeleteMenu;
