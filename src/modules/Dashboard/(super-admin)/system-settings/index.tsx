"use client"
import React, { createElement, useState } from 'react';
import { Settings, Shield, Database, Mail, Globe, Bell, Key, Save, RefreshCw, AlertTriangle, CheckCircle, Server, Lock, Eye, EyeOff, User, LogOut } from 'lucide-react';
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { SuperAdminSystemSettingsProps } from '@/app/(DASHBOARD)/[role]/(SUPER-ADMIN)/system-settings/page';

export default function index({ role }: SuperAdminSystemSettingsProps) {
    const [activeTab, setActiveTab] = useState('general');
    const [showApiKey, setShowApiKey] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [settings, setSettings] = useState({
        general: {
            systemName: 'CliniTrack',
            systemDescription: 'Medical Administration Dashboard',
            maintenanceMode: false,
            allowRegistration: true,
            defaultTimezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            currency: 'USD'
        },
        security: {
            sessionTimeout: 30,
            passwordMinLength: 8,
            requireSpecialChars: true,
            twoFactorAuth: false,
            loginAttempts: 5,
            lockoutDuration: 15,
            apiRateLimit: 1000
        },
        email: {
            smtpHost: 'smtp.gmail.com',
            smtpPort: 587,
            smtpUsername: 'noreply@clinitrack.com',
            smtpPassword: '••••••••••••',
            fromEmail: 'noreply@clinitrack.com',
            fromName: 'CliniTrack System'
        },
        notifications: {
            emailNotifications: true,
            systemAlerts: true,
            maintenanceAlerts: true,
            securityAlerts: true,
            userRegistration: true,
            dailyReports: false
        },
        database: {
            autoBackup: true,
            backupFrequency: 'daily',
            retentionDays: 30,
            lastBackup: '2024-01-16 02:00:00',
            databaseSize: '2.4 GB'
        },
        api: {
            apiEnabled: true,
            apiKey: 'sk-1234567890abcdef1234567890abcdef1234567890abcdef',
            webhookUrl: 'https://api.clinitrack.com/webhooks',
            rateLimitPerHour: 1000
        }
    });

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'database', label: 'Database', icon: Database },
        { id: 'api', label: 'API', icon: Globe }
    ];

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(''), 3000);
        }, 1000);
    };

    const handleBackup = () => {
        alert('Backup initiated successfully!');
    };

    const handleTestEmail = () => {
        alert('Test email sent successfully!');
    };

    const handleRegenerateApiKey = () => {
        const newApiKey = 'sk-' + Math.random().toString(36).substring(2, 50);
        setSettings({
            ...settings,
            api: { ...settings.api, apiKey: newApiKey }
        });
        alert('API Key regenerated successfully!');
    };

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
                    <input
                        type="text"
                        value={settings.general.systemName}
                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, systemName: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Timezone</label>
                    <select
                        value={settings.general.defaultTimezone}
                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, defaultTimezone: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="CST">Central Time</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">System Description</label>
                <textarea
                    value={settings.general.systemDescription}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, systemDescription: e.target.value } })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                        value={settings.general.dateFormat}
                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, dateFormat: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                        value={settings.general.currency}
                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, currency: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                        <p className="text-sm text-gray-600">Enable maintenance mode to prevent user access</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.general.maintenanceMode}
                            onChange={(e) => setSettings({ ...settings, general: { ...settings.general, maintenanceMode: e.target.checked } })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Allow Registration</h4>
                        <p className="text-sm text-gray-600">Allow new users to register accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.general.allowRegistration}
                            onChange={(e) => setSettings({ ...settings, general: { ...settings.general, allowRegistration: e.target.checked } })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionTimeout: parseInt(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Min Length</label>
                    <input
                        type="number"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => setSettings({ ...settings, security: { ...settings.security, passwordMinLength: parseInt(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                    <input
                        type="number"
                        value={settings.security.loginAttempts}
                        onChange={(e) => setSettings({ ...settings, security: { ...settings.security, loginAttempts: parseInt(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lockout Duration (minutes)</label>
                    <input
                        type="number"
                        value={settings.security.lockoutDuration}
                        onChange={(e) => setSettings({ ...settings, security: { ...settings.security, lockoutDuration: parseInt(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Require Special Characters</h4>
                        <p className="text-sm text-gray-600">Passwords must contain special characters</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.security.requireSpecialChars}
                            onChange={(e) => setSettings({ ...settings, security: { ...settings.security, requireSpecialChars: e.target.checked } })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Enable 2FA for all admin users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => setSettings({ ...settings, security: { ...settings.security, twoFactorAuth: e.target.checked } })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderEmailSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                    <input
                        type="text"
                        value={settings.email.smtpHost}
                        onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtpHost: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                    <input
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtpPort: parseInt(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                    <input
                        type="text"
                        value={settings.email.smtpUsername}
                        onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtpUsername: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                    <input
                        type="password"
                        value={settings.email.smtpPassword}
                        onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtpPassword: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                    <input
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) => setSettings({ ...settings, email: { ...settings.email, fromEmail: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                    <input
                        type="text"
                        value={settings.email.fromName}
                        onChange={(e) => setSettings({ ...settings, email: { ...settings.email, fromName: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
                <button
                    onClick={handleTestEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Mail className="w-4 h-4" />
                    Test Email Configuration
                </button>
            </div>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-gray-600">
                            {key === 'emailNotifications' && 'Send email notifications for system events'}
                            {key === 'systemAlerts' && 'Receive alerts for system-wide issues'}
                            {key === 'maintenanceAlerts' && 'Notifications for maintenance windows'}
                            {key === 'securityAlerts' && 'Security-related notifications'}
                            {key === 'userRegistration' && 'Notifications for new user registrations'}
                            {key === 'dailyReports' && 'Daily system reports via email'}
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setSettings({
                                ...settings,
                                notifications: { ...settings.notifications, [key]: e.target.checked }
                            })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            ))}
        </div>
    );

    const renderDatabaseSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Database Size</h4>
                    <p className="text-2xl font-bold text-gray-900">{settings.database.databaseSize}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Last Backup</h4>
                    <p className="text-sm text-gray-600">{settings.database.lastBackup}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                    <select
                        value={settings.database.backupFrequency}
                        onChange={(e) => setSettings({ ...settings, database: { ...settings.database, backupFrequency: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retention Days</label>
                    <input
                        type="number"
                        value={settings.database.retentionDays}
                        onChange={(e) => setSettings({ ...settings, database: { ...settings.database, retentionDays: parseInt(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                    <h4 className="text-sm font-medium text-gray-900">Auto Backup</h4>
                    <p className="text-sm text-gray-600">Automatically backup database</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.database.autoBackup}
                        onChange={(e) => setSettings({ ...settings, database: { ...settings.database, autoBackup: e.target.checked } })}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
                <button
                    onClick={handleBackup}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Database className="w-4 h-4" />
                    Create Backup Now
                </button>
            </div>
        </div>
    );

    const renderApiSettings = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                    <h4 className="text-sm font-medium text-gray-900">API Access</h4>
                    <p className="text-sm text-gray-600">Enable API access for third-party integrations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.api.apiEnabled}
                        onChange={(e) => setSettings({ ...settings, api: { ...settings.api, apiEnabled: e.target.checked } })}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <div className="flex items-center gap-2">
                    <input
                        type={showApiKey ? 'text' : 'password'}
                        value={settings.api.apiKey}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    />
                    <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleRegenerateApiKey}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Regenerate
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit (per hour)</label>
                    <input
                        type="number"
                        value={settings.api.rateLimitPerHour}
                        onChange={(e) => setSettings({ ...settings, api: { ...settings.api, rateLimitPerHour: parseInt(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                    <input
                        type="url"
                        value={settings.api.webhookUrl}
                        onChange={(e) => setSettings({ ...settings, api: { ...settings.api, webhookUrl: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <h4 className="text-sm font-medium text-yellow-900">API Security Notice</h4>
                </div>
                <p className="text-sm text-yellow-800">
                    Keep your API key secure. Do not share it publicly or embed it in client-side code.
                </p>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return renderGeneralSettings();
            case 'security':
                return renderSecuritySettings();
            case 'email':
                return renderEmailSettings();
            case 'notifications':
                return renderNotificationSettings();
            case 'database':
                return renderDatabaseSettings();
            case 'api':
                return renderApiSettings();
            default:
                return renderGeneralSettings();
        }
    };

    return (
        <ProtectedRoleGuard role={role}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center gap-3">
                                <Server className="w-8 h-8 text-blue-600" />
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                                    <p className="text-sm text-gray-600">Super Admin Dashboard</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                                    <User className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-900">Admin User</span>
                                </div>
                                <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-8">
                        {/* Sidebar Navigation */}
                        <div className="w-64 flex-shrink-0">
                            <nav className="bg-white rounded-lg shadow-sm p-4">
                                <div className="space-y-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${activeTab === tab.id
                                                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="text-sm font-medium">{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </nav>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            <div className="bg-white rounded-lg shadow-sm">
                                {/* Tab Header */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {tabs.find(tab => tab.id === activeTab) && (
                                                <>
                                                    {createElement(tabs.find(tab => tab.id === activeTab).icon, {
                                                        className: "w-5 h-5 text-gray-600"
                                                    })}
                                                    <h2 className="text-xl font-semibold text-gray-900">
                                                        {tabs.find(tab => tab.id === activeTab).label} Settings
                                                    </h2>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {saveStatus === 'saving' && (
                                                <div className="flex items-center gap-2 text-blue-600">
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                    <span className="text-sm">Saving...</span>
                                                </div>
                                            )}
                                            {saveStatus === 'saved' && (
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-sm">Saved successfully!</span>
                                                </div>
                                            )}
                                            <button
                                                onClick={handleSave}
                                                disabled={saveStatus === 'saving'}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tab Content */}
                                <div className="p-6">
                                    {renderTabContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">System Status: Online</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Last Updated: {new Date().toLocaleString()}
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                CliniTrack v2.1.0 - Super Admin Panel
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </ProtectedRoleGuard>
    )
}
