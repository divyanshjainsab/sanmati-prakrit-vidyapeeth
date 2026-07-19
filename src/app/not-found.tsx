export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="font-serif text-3xl font-bold text-maroon-800">Site not available</h1>
      <p className="max-w-md text-maroon-700/80">
        This address isn&apos;t set up yet. If you expected a site here, please check the link or
        contact the administrator.
      </p>
    </div>
  );
}
