import {BottomMenu} from "@/components/bottom-menu";
import {Calendar, User} from 'lucide-react';

export default function Layout({children}: { children: React.ReactNode }) {
    return <>
        {children}
        <BottomMenu items={[
            {
                path: '/calendar',
                icon: <Calendar size={22}/>,
            },
            {
                path: '/profile',
                icon: <User size={22}/>,
            },
        ]}/>
    </>
}