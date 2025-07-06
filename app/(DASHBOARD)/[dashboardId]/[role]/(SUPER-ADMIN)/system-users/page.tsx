// "use client";
// import React, { useState } from 'react';
// import { Users, Search, Filter, Plus, Edit, Trash2, Eye, Ban, CheckCircle, AlertTriangle, MoreVertical, Mail, Phone, MapPin, Calendar } from 'lucide-react';


// export default function SystemUserPage() {

//     return (
//       <>
//       </>
//     );
// }


import SuperAdminUsers from '@/src/modules/Dashboard/(super-admin)/system-users'

export interface SuperAdminUsersProps {
    dashboardId: string
    role: string
}


export default async function SuperAdminUsersPage({ params }: { params: Promise<SuperAdminUsersProps> }) {
    const resolvedParams = await params

    return (
        <SuperAdminUsers
            dashboardId={resolvedParams.dashboardId}
            role={resolvedParams.role}
        />
    );
}
