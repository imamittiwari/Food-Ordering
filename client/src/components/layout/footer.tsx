import { Link } from "wouter";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/">
              <span className="text-primary font-bold text-2xl cursor-pointer">QuickBite</span>
            </Link>
            <p className="text-muted-foreground mt-2 max-w-md">
              Delicious food delivered fast to your door. Browse our menu and order your favorite meals.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-foreground font-semibold mb-3">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#">
                    <a className="text-muted-foreground hover:text-primary">About Us</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="text-muted-foreground hover:text-primary">Careers</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="text-muted-foreground hover:text-primary">Partners</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="text-muted-foreground hover:text-primary">Blog</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-foreground font-semibold mb-3">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#">
                    <a className="text-muted-foreground hover:text-primary">Contact Us</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="text-muted-foreground hover:text-primary">FAQs</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="text-muted-foreground hover:text-primary">Privacy Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="text-muted-foreground hover:text-primary">Terms of Service</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-foreground font-semibold mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col-reverse md:flex-row md:justify-between md:items-center">
          <p className="text-muted-foreground text-sm mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} QuickBite. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#">
              <a className="text-muted-foreground hover:text-primary text-sm">Privacy Policy</a>
            </Link>
            <Link href="#">
              <a className="text-muted-foreground hover:text-primary text-sm">Terms of Service</a>
            </Link>
            <Link href="#">
              <a className="text-muted-foreground hover:text-primary text-sm">Cookie Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
