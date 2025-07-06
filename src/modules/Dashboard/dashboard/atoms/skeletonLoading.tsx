import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


// Skeleton Components
export const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const StatCardSkeleton = () => (
    <Card className="bg-white border border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
        </CardContent>
    </Card>
);

export const QuickActionsSkeleton = () => (
    <Card className="bg-white border border-slate-200">
        <CardHeader>
            <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
        </CardContent>
    </Card>
);

export const RecentActivitySkeleton = () => (
    <Card className="bg-white border border-slate-200">
        <CardHeader>
            <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);