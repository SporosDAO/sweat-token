import { Grid, Paper } from "@mui/material";
import useDao from "../../context/DaoContext";

export default function Dashboard() {
    const { dao } = useDao()
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <h2>
                        Welcome to {dao?.name}
                    </h2>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <h2>Projects overview</h2>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <h2>Ongoing Proposals</h2>
                </Paper>
            </Grid>
        </Grid>
    )

}