'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { ShiftStatisticsTable } from '@/components/shift-statistics-table';

export default function StatisticsPage() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-base-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Статистика смен</h1>

            <ShiftStatisticsTable month={2} year={2026} />

            <div className="flex gap-4 mt-6">
                <Link
                    href={ROUTES.schedule}
                    className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/80 transition-colors"
                >
                    К календарю
                </Link>
            </div>
        </div>
    );
}
