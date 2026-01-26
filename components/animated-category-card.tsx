"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Pen, Book, Folder, Palette } from "lucide-react"
import type { Category } from "@/lib/types"
import { motion } from "framer-motion"

interface AnimatedCategoryCardProps {
    category: Category
    index?: number
}

const iconMap = {
    pen: Pen,
    book: Book,
    folder: Folder,
    palette: Palette,
}

export function AnimatedCategoryCard({ category, index = 0 }: AnimatedCategoryCardProps) {
    const Icon = iconMap[category.icon as keyof typeof iconMap] || Pen

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link href={`/shop?category=${category.id}`}>
                <Card className="group hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                        <motion.div
                            className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Icon className="h-8 w-8 text-primary" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    )
}
