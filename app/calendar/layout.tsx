import {BottomMenu} from "@/components/bottom-menu";
import {Calendar, User} from 'lucide-react';

export default function Layout({children}: { children: React.ReactNode }) {
    return <>
        {children}
        <BottomMenu items={[
            {
                id: 'calendar',
                icon: <Calendar size={22}/>,
            },
            {
                id: 'profile',
                icon: <User size={22}/>,
            },
        ]}/>
    </>
}