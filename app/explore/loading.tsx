import { Loader2 } from "lucide-react";

export default function ExploreLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">Loading Explore...</p>
      </div>
    </div>
  );
}
