
import { Leaf } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-8 px-4 md:px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Leaf className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-headline font-semibold text-foreground">JalSevak</h2>
          </div>
          <p className="text-sm">
            Empowering Indian farmers with data-driven insights.
          </p>
        </div>
        <div className="md:text-center">
          <h3 className="font-semibold text-foreground mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/app" className="hover:text-primary transition-colors">Launch App</Link></li>
          </ul>
        </div>
         <div className="md:text-right">
          <h3 className="font-semibold text-foreground mb-2">Contact Info</h3>
          <address className="not-italic text-sm space-y-1">
            <p>Pune, Maharashtra, India</p>
            <p>Email: <a href="mailto:support@jalsevak.com" className="hover:text-primary transition-colors">support@jalsevak.com</a></p>
          </address>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-4 border-t border-border text-center text-sm">
        <p>&copy; {new Date().getFullYear()} JalSevak. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
