import { getUserSession } from "@/actions/auth/user";
import Header from "./Header";


export default async function HeaderWrapper() {
    const user = await getUserSession();
    return <Header user={{ name: user?.name ?? undefined, email: user?.email ?? undefined }} />;
}