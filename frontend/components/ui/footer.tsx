import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-dark text-white py-12">
            <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Mealora</h3>
                    <p className="text-gray-300 text-sm">
                        Transforming your health, one bite at a time.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Navigation</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link href="/" className="hover:text-white">Home</Link></li>
                        <li><Link href="/about" className="hover:text-white">About Me</Link></li>
                        <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
                        <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link href="/about" className="hover:text-white">About Me</Link></li>
                        <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>

            <div className="container mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} Mealora Inc. All rights reserved.
            </div>
        </footer>
    )
}
