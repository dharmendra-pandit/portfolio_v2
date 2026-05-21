import { Card, CardContent } from "@/components/ui/card"

export const ProjectSkeleton = () => {
  return (
    <Card className="relative h-full p-8 bg-foreground/5 border border-foreground/5 rounded-[2rem] backdrop-blur-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse">
      <CardContent className="p-0 relative z-10 flex flex-col h-full border-none">
        <div className="flex justify-between items-start mb-8">
          <div className="w-14 h-14 bg-foreground/10 rounded-2xl" />
          <div className="flex gap-4">
            <div className="w-9 h-9 bg-foreground/10 rounded-full" />
            <div className="w-9 h-9 bg-foreground/10 rounded-full" />
          </div>
        </div>

        <div className="h-8 bg-foreground/10 rounded-md w-3/4 mb-4" />
        <div className="h-24 bg-foreground/10 rounded-md w-full mb-8" />

        <div className="flex flex-wrap gap-2 mt-auto">
          <div className="h-7 w-20 bg-foreground/10 rounded-full" />
          <div className="h-7 w-24 bg-foreground/10 rounded-full" />
          <div className="h-7 w-16 bg-foreground/10 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}
