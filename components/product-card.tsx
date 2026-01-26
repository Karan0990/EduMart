import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { Product } from "@/lib/types"


interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {

    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/product/${product._id}`}>
                <div className="aspect-square relative overflow-hidden bg-muted">
                    <Image
                        src={product.coverImage || "/placeholder.svg"}
                        alt={product.productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.stock < 20 && (
                        <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">Low Stock</Badge>
                    )}
                </div>
            </Link>
            <CardContent className="p-4">
                <Link href={`/product/${product._id}`}>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.productName}
                    </h3>
                </Link>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">₹{product.productPrice}</span>
                    <span className="text-xs text-muted-foreground">
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full" disabled={product.stock === 0}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    )
}
