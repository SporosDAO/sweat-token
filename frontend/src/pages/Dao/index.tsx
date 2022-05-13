import { Outlet } from "react-router-dom";
import { DaoProvider } from "../../context/DaoContext";
import { PageLayout } from "../../layout/Page";


export default function Dao() {
    return (
        <DaoProvider>
            <PageLayout>
                <Outlet />
            </PageLayout>
        </DaoProvider>
    )
}