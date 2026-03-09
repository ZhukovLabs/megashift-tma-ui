const SkeletonRow = () => (
    <div className="relative overflow-hidden rounded-lg bg-base-100 border border-base-200">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-base-200"/>
        <div className="flex items-center justify-between gap-3 p-3 pl-6">
            <div className="flex flex-col flex-1 gap-1.5">
                <div className="h-4 w-24 rounded bg-base-200 animate-pulse"/>
                <div className="h-1.5 bg-base-200 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 rounded-full bg-base-300 animate-pulse"/>
                </div>
            </div>
            <div className="h-6 w-12 rounded-full bg-base-200 animate-pulse"/>
        </div>
    </div>
);

const SkeletonTotal = () => (
    <div className="mt-3 flex justify-end">
        <div className="h-7 w-20 rounded-full bg-primary/30 animate-pulse"/>
    </div>
);

const SkeletonSalaryProgress = () => (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-4 p-6 bg-base-100 rounded-2xl shadow-lg border border-base-200">
        <div className="relative w-40 h-40">
            <div className="w-full h-full rounded-full border-4 border-base-200 animate-pulse"/>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <div className="h-6 w-20 rounded bg-base-200 animate-pulse"/>
                <div className="h-4 w-16 rounded bg-base-200 animate-pulse"/>
            </div>
        </div>
        <div className="flex justify-between w-full mt-4">
            <div className="h-4 w-12 rounded bg-base-200 animate-pulse"/>
            <div className="h-4 w-12 rounded bg-base-200 animate-pulse"/>
        </div>
    </div>
);

export const StatisticsSkeleton = () => {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col gap-2">
                <SkeletonRow/>
                <SkeletonRow/>
                <SkeletonRow/>
                <SkeletonTotal/>
            </div>
            <div className="mt-6">
                <SkeletonSalaryProgress/>
            </div>
        </div>
    );
};
