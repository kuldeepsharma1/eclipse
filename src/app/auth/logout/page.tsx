import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/getSession';
import React from 'react'

export default async function page() {
    const session = await getSession();
    const user = session?.user;
    return (
        <div>
            <p>{user?.email}</p>
            <form
            action={async () => {
                "use server";
                await signOut();
            }}
        >
            <Button type="submit" variant={"ghost"}>
                Logout
            </Button>
        </form></div>
    )
}
