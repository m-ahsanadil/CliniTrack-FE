import { Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";


export default function SupportPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
                    Support
                </h1>
                <p className="text-lg text-gray-600 text-center mb-12">
                    We're here to help you with anything related to CliniTrack. Reach out through the following options:
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Email Support */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <Mail className="h-8 w-8 text-blue-600 mr-3" />
                            <h2 className="text-2xl font-semibold text-gray-900">Email Support</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Reach us 24/7 via email:
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                <a 
                                    href="mailto:adilmuhammadfaizan@gmail.com" 
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    adilmuhammadfaizan@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                <a 
                                    href="mailto:muhammadmahsanadil@gmail.com" 
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    muhammadmahsanadil@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Phone Support */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <Phone className="h-8 w-8 text-green-600 mr-3" />
                            <h2 className="text-2xl font-semibold text-gray-900">Call Us</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Available Monday to Friday, 9 AM – 5 PM:
                        </p>
                        <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                            <a 
                                href="tel:+923122713867" 
                                className="text-green-600 hover:text-green-800 hover:underline font-medium"
                            >
                                +92 312 2713867
                            </a>
                        </div>
                    </div>

                    {/* Live Chat */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <MessageCircle className="h-8 w-8 text-purple-600 mr-3" />
                            <h2 className="text-2xl font-semibold text-gray-900">Live Chat</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Chat with our support team in real-time.
                        </p>
                        <div className="bg-gray-100 rounded-lg p-3">
                            <span className="text-gray-500 italic">Coming soon...</span>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <HelpCircle className="h-8 w-8 text-orange-600 mr-3" />
                            <h2 className="text-2xl font-semibold text-gray-900">FAQ</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Check our Frequently Asked Questions.
                        </p>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                            View FAQ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}