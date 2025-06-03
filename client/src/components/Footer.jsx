const Footer = () => (
  <footer className="bg-surface border-t border-border py-6 mt-12 text-center text-muted text-sm">
    <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p>© {new Date().getFullYear()} Xeno CRM. All rights reserved.</p>
      <nav className="flex gap-6">
        <a href="/privacy" className="hover:text-primary transition">Privacy Policy</a>
        <a href="/terms" className="hover:text-primary transition">Terms of Service</a>
        <a href="/contact" className="hover:text-primary transition">Contact</a>
      </nav>
    </div>
  </footer>
);

export default Footer;
