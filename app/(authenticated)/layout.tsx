'use client';

import {ReactNode, useMemo} from 'react';
import {BottomMenu} from '@/widgets/bottom-menu';
import {ROUTES} from '@/shared/constants/routes';
import {Calendar, ChartNoAxesCombined, ClipboardClock, Settings2} from 'lucide-react';
import {AuthGate} from '@/features/auth/ui/auth-gate';
import {InviteGate} from '@/features/invite/ui/invite-gate';
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