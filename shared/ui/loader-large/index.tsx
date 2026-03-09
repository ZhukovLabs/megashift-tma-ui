'use client';

import {Loader2} from 'lucide-react';

export function LoaderLarge() {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={48}/>
        </div>
    );
}
