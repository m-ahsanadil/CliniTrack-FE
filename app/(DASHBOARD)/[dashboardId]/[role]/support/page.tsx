import { Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Support</h1>
            <p className="text-slate-600 mb-6">
                We're here to help you with anything related to CliniTrack. Reach out through the following options:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Support */}
                <div className="bg-white p-5 rounded-xl shadow border border-slate-200">
                    <Mail className="text-indigo-600 mb-3" size={28} />
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Email Support</h2>
                    <p className="text-slate-600 mb-2">Reach us 24/7 via email:</p>
                    <p className="font-medium text-indigo-600">support@clinitrack.com</p>
                </div>

                {/* Phone Support */}
                <div className="bg-white p-5 rounded-xl shadow border border-slate-200">
                    <Phone className="text-indigo-600 mb-3" size={28} />
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Call Us</h2>
                    <p className="text-slate-600 mb-2">Available Monday to Friday, 9 AM – 5 PM:</p>
                    <p className="font-medium text-indigo-600">+92 300 1234567</p>
                </div>

                {/* Live Chat */}
                <div className="bg-white p-5 rounded-xl shadow border border-slate-200">
                    <MessageCircle className="text-indigo-600 mb-3" size={28} />
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Live Chat</h2>
                    <p className="text-slate-600 mb-2">Chat with our support team in real-time.</p>
                    <p className="text-slate-400 text-sm italic">Coming soon...</p>
                </div>

                {/* FAQ */}
                <div className="bg-white p-5 rounded-xl shadow border border-slate-200">
                    <HelpCircle className="text-indigo-600 mb-3" size={28} />
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">FAQ</h2>
                    <p className="text-slate-600 mb-2">Check our Frequently Asked Questions.</p>
                    <p className="font-medium text-indigo-600 underline cursor-pointer">
                        View FAQ
                    </p>
                </div>
            </div>
        </div>
    );
}
