export const Footer = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground space-y-1">
        <p>
          문의:{" "}
          <a href="mailto:vibecodingclub.team@gmail.com" className="underline hover:text-foreground transition-colors">
            vibecodingclub.team@gmail.com
          </a>
        </p>
        <p>&copy; 2026 딸깍톤. All rights reserved.</p>
      </div>
    </footer>
  );
};
