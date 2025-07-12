import { ReportType, ReportTypeValues, UserRole } from "@/src/enum"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useAppSelector } from "@/src/redux/store/reduxHook"

export const GenerateReportTab = () => {
    const { user } = useAppSelector(state => state.auth);
    const [reportType, setReportType] = useState<ReportType>(ReportType.OTHER);

    // Role-based permissions
    const permissions = {
        canCreateReports: [UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR, UserRole.SUPER_ADMIN].includes(user?.role as UserRole || ''),
        canDeleteReports: [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user?.role as UserRole || ''),
        canViewFinancialReports: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF].includes(user?.role as UserRole || ''),
        canViewMedicalReports: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR].includes(user?.role as UserRole || '')
    };


    const handleGenerateReport = (reportTitle: string): void => {
        if (!permissions.canCreateReports) {
            return;
        }

        // setReportsModalOpen(true);
    };


    return (
        <>
            <Card className='bg-slate-800 border-slate-700'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Quick Report Generation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* {quickReports.map((report, index) => {
                                        const IconComponent = report.icon;
                                        const canGenerate = report.roles.includes(user?.role || '');

                                        return (
                                            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className={`inline-flex p-2 rounded-lg ${report.color} mb-3`}>
                                                    <IconComponent className="h-5 w-5" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                                                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => handleGenerateReport(report.title)}
                                                    disabled={!canGenerate}
                                                >
                                                    {canGenerate ? (
                                                        "Generate Report"
                                                    ) : (
                                                        <>
                                                            <Lock className="h-3 w-3 mr-2" />
                                                            Restricted Access
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => setReportsModalOpen(true)}
                                                >
                                                    Generate Report
                                                </Button>

                                            </div>
                                        );
                                    })} */}
                    </div>
                </CardContent>
            </Card>

            {/* Custom Report Builder */}
            {permissions.canCreateReports && (
                <Card className='bg-slate-800 border-slate-700'>
                    <CardHeader>
                        <CardTitle>Custom Report Builder</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Report Type</label>
                                <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)} >
                                    <SelectTrigger className='bg-slate-600 border-slate-700'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ReportTypeValues.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Format</label>
                                <Select defaultValue="pdf">
                                    <SelectTrigger className='bg-slate-600 border-slate-700'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pdf">PDF</SelectItem>
                                        <SelectItem value="excel">Excel</SelectItem>
                                        <SelectItem value="csv">CSV</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Report Name</label>
                                <Input placeholder="Enter report name" className='bg-slate-600 border-slate-700' />
                            </div>
                        </div>
                        <Button
                            className="flex items-center gap-2"
                            onClick={() => handleGenerateReport('Custom Report')}
                        >
                            <FileText className="h-4 w-4" />
                            Generate Custom Report
                        </Button>
                    </CardContent>
                </Card>
            )}
        </>
    )
}