import {ReactNode} from 'react';
import {BottomMenu} from '@/components/bottom-menu';
import {ROUTES} from '@/constants/routes';
import {Calendar, ChartNoAxesCombined, ClipboardClock, User, Settings2} from 'lucide-react';
import {AuthGate} from '@/components/auth-gate';
import {InviteGate} from '@/components/invite-gate';

const bottomMenuItems = [
    {path: ROUTES.schedule, icon: <Calendar size={24}/>},
    {path: ROUTES.shifts, icon: <ClipboardClock size={24}/>},
    {path: ROUTES.statistics, icon: <ChartNoAxesCombined size={24}/>},
    {path: ROUTES.profile, icon: <User size={24}/>},
    {path: ROUTES.settings, icon: <Settings2 size={24}/>},
];

export default function Layout({children}: { children: ReactNode }) {
    return (
        <AuthGate>
            <InviteGate>
                {children}
                <BottomMenu items={bottomMenuItems}/>
            </InviteGate>
        </AuthGate>
    );
}
