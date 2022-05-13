import { Box } from "@mui/system";
import { Link } from "react-router-dom";


export default function NotFound() {

    return (
        <Box p={5}>
            <h1>Page not found</h1>
            <p><Link to="/">Return to homepage</Link></p>
        </Box>
    )

}