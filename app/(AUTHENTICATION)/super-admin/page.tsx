import Login from "@/src/modules/Authentication/auth";

export default function SuperAdminLoginPage() {
    return <Login isSuperAdmin={true} />;
}