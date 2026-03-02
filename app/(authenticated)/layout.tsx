'use client';

import {ReactNode, useMemo} from 'react';
import {BottomMenu} from '@/components/bottom-menu';
import {ROUTES} from '@/constants/routes';
import {Calendar, ChartNoAxesCombined, ClipboardClock, Settings2} from 'lucide-react';
import {AuthGate} from '@/components/auth-gate';
import {InviteGate} from '@/components/invite-gate';
import {useUserStore} from '@/entities/user';

type Props = {
    children: ReactNode;
};

export default function Layout({children}: Props) {
    const currentClaims = useUserStore(state => state.currentClaims);

    const canReadStatistics =
        !currentClaims || currentClaims.includes('READ_STATISTICS');

    const bottomMenuItems = useMemo(() => {
        const items: Array<{ path: string, icon: ReactNode }> = [
            {path: ROUTES.schedule, icon: <Calendar size={24}/>},
            {path: ROUTES.shifts, icon: <ClipboardClock size={24}/>},
        ];

        if (canReadStatistics) {
            items.push({
                path: ROUTES.statistics,
                icon: <ChartNoAxesCombined size={24}/>,
            });
        }

        items.push({
            path: ROUTES.settings,
            icon: <Settings2 size={24}/>,
        });

        return items;
    }, [canReadStatistics]);

    return (
        <AuthGate>
            <InviteGate>
                {children}
                <BottomMenu items={bottomMenuItems}/>
            </InviteGate>
        </AuthGate>
    );
}