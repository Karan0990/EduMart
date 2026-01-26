import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-muted border-t border-border mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">StationeryHub</h3>
                        <p className="text-sm text-muted-foreground">
                            Your one-stop shop for all stationery needs. Quality products at affordable prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
                        <div className="flex flex-col gap-2">
                            <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Shop
                            </Link>
                            <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Categories
                            </Link>
                            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                About Us
                            </Link>
                        </div>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Customer Service</h4>
                        <div className="flex flex-col gap-2">
                            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Contact Us
                            </Link>
                            <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Shipping Info
                            </Link>
                            <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Returns
                            </Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Contact</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>support@stationeryhub.in</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Mumbai, Maharashtra</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 text-center">
                    <p className="text-sm text-muted-foreground">© 2025 StationeryHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
