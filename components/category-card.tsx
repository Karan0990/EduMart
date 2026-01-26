import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Pen, BookOpen, Folder, Palette } from "lucide-react"
import type { Category } from "@/lib/types"

interface CategoryCardProps {
    category: Category
}

const iconMap = {
    pen: Pen,
    book: BookOpen,
    folder: Folder,
    palette: Palette,
}

export function CategoryCard({ category }: CategoryCardProps) {
    const Icon = iconMap[category.icon as keyof typeof iconMap] || Pen

    return (
        <Link href={`/shop?category=${category.id}`}>
            <Card className="group hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
