"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { categories } from "@/lib/mock-data"
import { useState, useEffect, Suspense } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog"
import toast from "react-hot-toast"
import axios from "axios"


const uploadToCloudinary = async (file: File) => {

    if (!(file instanceof File)) {
        throw new Error("Invalid file")
    }

    const formData = new FormData()



    formData.append("file", file)
    console.log("file ", file)
    formData.append("upload_preset", "StationayWeb")
    formData.append("folder", "products")

    console.log([...formData.entries()])

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    )

    console.log(res)

    if (!res.ok) {
        throw new Error("Image upload failed")
    }

    const data = await res.json()
    return data.secure_url
}

function ProductsContent() {
    const [products, setProducts] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)

    const [formData, setFormData] = useState({
        productName: "",
        brandName: "",
        productPrice: "",
        category: "",
        stock: "",
        shortDiscription: "",
        longDiscription: "",
        coverImage: null as File | null,
        otherImages: [] as File[]
    })

    useEffect(() => {
        async function getProducts() {
            const res = await axios.get("/api/product/showAllProducts")
            console.log(res.data)
            if (res.data.success) {
                setProducts(res.data.products)
            }
        }
        getProducts()
    }, [])

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.productName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        const matchesCategory =
            categoryFilter === "all" || product.category === categoryFilter
        return matchesSearch && matchesCategory
    })


    const handleSaveProduct = async () => {
        try {
            toast.loading("Uploading images...", { id: "upload" })

            let coverImageUrl = ""
            let otherImageUrls: string[] = []

            if (formData.coverImage) {
                coverImageUrl = await uploadToCloudinary(formData.coverImage)
            }

            if (formData.otherImages.length > 0) {
                otherImageUrls = await Promise.all(
                    formData.otherImages.map((file) =>
                        uploadToCloudinary(file)
                    )
                )
            }

            toast.loading("Saving product...", { id: "upload" })

            const payload = {
                productName: formData.productName,
                brandName: formData.brandName,
                productPrice: Number(formData.productPrice),
                category: formData.category,
                stock: Number(formData.stock),
                shortDiscription: formData.shortDiscription,
                longDiscription: formData.longDiscription,
                coverImage: coverImageUrl,
                otherImages: otherImageUrls,
            }

            const res = await axios.post(
                "/api/admin/product/createProduct",
                payload
            )

            if (res.data.success) {
                toast.success("Product saved", { id: "upload" })
                setIsDialogOpen(false)

                const refresh = await axios.get("/api/product/showAllProducts")
                setProducts(refresh.data.products)
            }
        } catch (error) {
            toast.error("Failed to save product", { id: "upload" })
            console.error(error)
        }
    }

    const handleEditClick = async (product: any) => {
        setEditingProduct(product)


        setFormData({
            productName: product.productName,
            brandName: product.brandName,
            productPrice: product.productPrice.toString(),
            category: product.category,
            stock: product.stock.toString(),
            shortDiscription: product.shortDiscription,
            longDiscription: product.longDiscription,
            coverImage: null,
            otherImages: [],
        })
        setIsDialogOpen(true)


    }

    async function handleEditUpdate(productId: string) {
        try {
            toast.loading("Updating product...", { id: "upload" })

            let coverImageUrl = editingProduct.coverImage
            let otherImageUrls = editingProduct.otherImages || []

            if (formData.coverImage instanceof File) {
                coverImageUrl = await uploadToCloudinary(formData.coverImage)
            }


            if (formData.otherImages.length > 0) {
                otherImageUrls = await Promise.all(
                    formData.otherImages.map((file) =>
                        uploadToCloudinary(file)
                    )
                )
            }


            const payload = {
                productName: formData.productName,
                brandName: formData.brandName,
                productPrice: Number(formData.productPrice),
                category: formData.category,
                stock: Number(formData.stock),
                shortDiscription: formData.shortDiscription,
                longDiscription: formData.longDiscription,
                coverImage: coverImageUrl,
                otherImages: otherImageUrls,
            }

            console.log(payload)

            const response = await axios.post("/api/admin/product/editProduct", {
                id: productId,
                updatedData: payload,
            })

            if (response.data.success) {
                toast.success("Product updated", { id: "upload" })

                setIsDialogOpen(false)
                setEditingProduct(null)
                resetForm()

                const refresh = await axios.get("/api/product/showAllProducts")
                setProducts(refresh.data.products)
            }
        } catch (error) {
            toast.error("Failed to update product", { id: "upload" })
            console.error(error)
        }
    }

    const resetForm = () => {
        setFormData({
            productName: "",
            brandName: "",
            productPrice: "",
            category: "",
            stock: "",
            shortDiscription: "",
            longDiscription: "",
            coverImage: null,
            otherImages: []
        })
    }



    const handleDeleteProduct = async (productId: string) => {


        try {

            const response = await axios.post("/api/admin/product/deleteProduct", { id: productId })

            if (response?.data?.success) {
                toast.success("Product deleted successfully")
                // Refresh product list
                const refresh = await axios.get("/api/product/showAllProducts")
                setProducts(refresh.data.products)
            } else {
                toast.error("Failed to delete product")
            }


        } catch (error: any) {
            console.log("Unable to delete Product", error)
            toast.error("Failed to delete product")
        }

    }


    // const handleDialogChange = (open: boolean) => {
    //     setIsDialogOpen(open)
    //     if (!open) {
    //         setEditingProduct(null)
    //         setFormData({ productName: "", brandName: "", productPrice: "", category: "", stock: "", shortDiscription: "", longDiscription: "", coverImage: null, otherImages: [] })
    //     }
    // }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">Manage inventory</p>
                </div>

                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) {
                            setEditingProduct(null)
                            resetForm()
                        }
                    }}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingProduct ? "Edit Product" : "Add Product"}
                            </DialogTitle>

                            <DialogDescription>
                                {editingProduct
                                    ? "Update product details, images, and stock information."
                                    : "Add a new product to your inventory."}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4">
                            <Input placeholder="Product Name"
                                value={formData.productName}
                                onChange={(e) =>
                                    setFormData({ ...formData, productName: e.target.value })
                                }
                            />
                            <Input placeholder="Brand Name"
                                value={formData.brandName}
                                onChange={(e) =>
                                    setFormData({ ...formData, brandName: e.target.value })
                                }
                            />
                            <Input type="number" placeholder="Price"
                                value={formData.productPrice}
                                onChange={(e) =>
                                    setFormData({ ...formData, productPrice: e.target.value })
                                }
                            />
                            <Input type="number" placeholder="Stock"
                                value={formData.stock}
                                onChange={(e) =>
                                    setFormData({ ...formData, stock: e.target.value })
                                }
                            />

                            <Select
                                value={formData.category}
                                onValueChange={(v) =>
                                    setFormData({ ...formData, category: v })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    console.log("Selected file:", file)
                                    setFormData({
                                        ...formData,
                                        coverImage: file || null,
                                    })
                                }}
                            />
                            {formData.coverImage && (
                                <p className="text-sm text-muted-foreground">
                                    Selected: {formData.coverImage.name}
                                </p>
                            )}


                            <Input type="file" accept="image/*" multiple
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        otherImages: e.target.files
                                            ? Array.from(e.target.files)
                                            : []
                                    })
                                }
                            />

                            {formData.otherImages.length > 0 && (
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Selected files:</p>
                                    <ul className="list-disc list-inside">
                                        {formData.otherImages.map((file, index) => (
                                            <li key={index}>{file.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Textarea placeholder="Short Description"
                                value={formData.shortDiscription}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        shortDiscription: e.target.value
                                    })
                                }
                            />

                            <Textarea placeholder="Long Description"
                                value={formData.longDiscription}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        longDiscription: e.target.value
                                    })
                                }
                            />

                            {editingProduct ?
                                <Button onClick={() => handleEditUpdate(editingProduct._id)}>
                                    Update
                                </Button>
                                :

                                <Button onClick={handleSaveProduct}>
                                    Create
                                </Button>}

                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                    <motion.div key={product._id} whileHover={{ y: -4 }}>
                        <Card className="w-70 h-full">
                            <img
                                src={product.coverImage}
                                className="h-80 w-full object-cover rounded-t-md"
                            />
                            <div className="p-4 space-y-2">
                                <h3 className="font-semibold">{product.productName}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {product.brandName}
                                </p>
                                <Badge>
                                    {product.stock > 0
                                        ? `${product.stock} in stock`
                                        : "Out of stock"}
                                </Badge>
                                <p className="text-lg font-bold">
                                    ₹{product.productPrice}
                                </p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline"
                                        onClick={() => handleEditClick(product)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product._id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default function AdminProductsPage() {
    return (
        <Suspense fallback={null}>
            <ProductsContent />
        </Suspense>
    )
}
