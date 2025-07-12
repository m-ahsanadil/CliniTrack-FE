import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAllReports } from "../api/slice"
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { useEffect } from "react"
import { formatDate } from "date-fns"
import { GetAllReports } from "../api/types"
import { ReportStatus, ReportType, UserRole } from "@/src/enum"
import { useReport } from "@/src/redux/providers/contexts/ReportContext"
import { RoleGuard } from "@/components/role-guard"
import { TableRowActions } from "@/src/components/ui/TableRowActions"

interface RecentReportTabProps {
    onSwitchToEdit?: () => void; // Add this prop to switch to edit tab
}

export const RecentReportTab = ({ onSwitchToEdit }: RecentReportTabProps) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const {
        loading,

        // CRUD operations
        handleDeleteReport,
        handleAddReport,
        handleEditReport,
    } = useReport();

    const { reports } = useAppSelector(state => state.reports)

    // Event handlers
    const handleFetchReports = (): void => {
        dispatch(fetchAllReports());
    };


    const handleDownloadReport = (reportId: string): void => {
        // API call implementation
    };


    useEffect(() => {
        handleFetchReports();
    }, []);

    const getStatusColor = (status: ReportStatus): string => {
        switch (status) {
            case ReportStatus.GENERATED:
                return 'bg-green-100 text-green-800';
            case ReportStatus.PENDING:
                return 'bg-yellow-100 text-yellow-800';
            case ReportStatus.FAILED:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <Card className='bg-slate-800 border-slate-700'>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Recent Reports</CardTitle>
                    <Button onClick={handleFetchReports} disabled={loading}>
                        {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className='border-slate-700'>
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading reports...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
                        <p className="text-gray-600">No reports are available for your role.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reports.map((report: GetAllReports) => (
                            <div key={report._id} className="flex items-center justify-between p-4 border border-slate-700 rounded-lg hover:bg-gray-400 hover:text-slate-800 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold  text-gray-400">{report.title}</h3>
                                        <p className="text-sm text-gray-500">{report.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                                            <span>Type: {report.reportType}</span>
                                            {/* <span>Generated: {formatDate(report.createdAt)}</span> */}
                                            {/* <span>By: {report.generatedByUserId?.username || report.createdBy}</span> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={getStatusColor(report.status as ReportStatus)}>
                                        {report.status}
                                    </Badge>
                                    {report.status?.toLowerCase() === 'generated' && (
                                        <div className="flex gap-2">
                                            <TableRowActions
                                                onDownload={() => handleDownloadReport(report._id)}
                                                onEdit={() => handleEditReport(report)}
                                                onDelete={() => handleDeleteReport(report._id)}
                                                onView={function (): void {
                                                    throw new Error("Function not implemented.")
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}