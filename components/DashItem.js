import {Box, Paper} from "@mui/material";

export function DashItem({children, sx = {}, transparent = false, padding = 2, mb = 2, outerSx = {}}) {
    let inner =
        <Box p={padding} sx={sx}>
            {children}
        </Box>;

    if (!transparent) {
        inner =
            <Paper elevation={1}>
                {inner}
            </Paper>
    }

    return (
        <Box mb={mb} sx={outerSx}>
            {inner}
        </Box>
    )
}