"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { orders } from "@/lib/mock-data"
import { use, useState, useEffect } from "react"
import { ArrowLeft, Package, Phone, MapPin, Calendar, Truck, Mail, CreditCard, Upload, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"

const getStatusColor = (status: string) => {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        case "processed":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        case "shipped":
            return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
        case "delivered":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        case "cancelled":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
}


type OrderItem = {
    productId?: {
        _id: string
        productName: string
        coverImage: string
    }
    quantity: number
    price: number
}

type Order = {
    _id: string
    orderId: string
    userId: {
        _id: string
        firstName: string
        lastName: string
        email: string
        phoneNumber: {
            isdCode: string,
            number: string
        }
    }
    items: OrderItem[]
    totalAmount: number
    shippingAddress: {
        locality: string
        city: string
        state: string
        country: string
        pincode: string
    }
    paymentMethod: "cod" | "online"
    status: "pending" | "processed" | "shipped" | "delivered" | "cancelled"
    transactionId?: string
    invoiceUrl?: string
    invoicefileName?: string
    invoiceNotes?: string
    trackingId?: string
    deliveryContact?: string
    createdAt: string
    expectedDeliveryDate?: string
}

const uploadInvoiceFileToCloudinary = async (file: File) => {


    const formData = new FormData()


    formData.append("file", file)

    console.log("Uploading file to Cloudinary:", file)

    formData.append("upload_preset", "StationayWeb")
    formData.append("folder", "products/invoices")

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
            method: "POST",
            body: formData,
        }
    )

    if (!res.ok) throw new Error("Cloudinary upload failed")

    console.log("Cloudinary upload response status:", res.status)
    console.log("Form Data being sent:", formData)

    const data = await res.json()
    return data.secure_url as string
}




export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // const [orderId, setOrderId] = useState<string>("")
    const [order, setOrder] = useState<Order>({} as Order)
    const [status, setStatus] = useState<string>(order.status || "")
    const [estimatedDelivery, setEstimatedDelivery] = useState<string>(order.expectedDeliveryDate || "")
    const [trackingNumber, setTrackingNumber] = useState<string>(order.trackingId || "")
    const [deliveryContact, setDeliveryContact] = useState<string>(order.deliveryContact || "")
    const [invoiceNotes, setInvoiceNotes] = useState<string>("")
    const [uploadedInvoiceUrl, setUploadedInvoiceUrl] = useState<string>("")
    const [uploadedInvoiceName, setUploadedInvoiceName] = useState<string>(order.invoicefileName || "")
    const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
    const shipping = 50; // Fixed shipping cost for demonstration
    const tax = Math.round(order.totalAmount * 0.18); // Assuming 18% tax
    const router = useRouter()





    const { id } = use(params)

    useEffect(() => {
        return () => {
            if (uploadedInvoiceUrl) {
                URL.revokeObjectURL(uploadedInvoiceUrl)
            }
        }
    }, [uploadedInvoiceUrl])


    useEffect(() => {


        async function getData() {
            try {

                console.log("Fetching order with ID:", id)
                const response = await axios.post("/api/admin/order/orderDetails", {
                    id: id,
                })
                console.log("Fetched Order:", response.data)
                if (response?.data?.success) {

                    const fetchedOrder = response.data.order
                    setOrder(fetchedOrder)
                    setStatus(fetchedOrder.status)
                    setEstimatedDelivery(fetchedOrder.expectedDeliveryDate || "")
                    setTrackingNumber(fetchedOrder.trackingId || "")
                    setDeliveryContact(fetchedOrder.deliveryContact || "")
                    setUploadedInvoiceUrl(fetchedOrder.invoiceUrl || "")
                    setUploadedInvoiceName(fetchedOrder.invoicefileName || "")
                }

            } catch (error: any) {
                console.log("Error fetching order:", error.message)
            }

        }
        getData()
    }, [id])

    console.log("fetched Status", status)

    if (!order) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">Loading order...</p>
            </div>
        )
    }

    const handleUpdateOrder = async () => {

        try {

            toast.loading("Updating order...", { id: "update" })

            console.log(status, estimatedDelivery, trackingNumber, deliveryContact)

            const response = await axios.post("/api/admin/order/updateOrder", {
                orderId: order._id,
                status,
                estimatedDelivery,
                trackingNumber,
                deliveryContact,
            })

            if (response?.data?.success) {
                toast.success("Order Updated Successfully", { id: "update" })

                alert(
                    `Order ${order.orderId} updated successfully!\n\nNew Status: ${status}\nDelivery: ${estimatedDelivery}\nTracking: ${trackingNumber}\nContact: ${deliveryContact}`,
                )
                router.refresh()

            }

        } catch (error: any) {
            console.log("Error updating order:", error.message)
        }

    }

    const handleSendInvoice = async () => {
        if (!invoiceFile) {
            toast.error("Please select an invoice file")
            return
        }

        toast.loading("Uploading invoice...", { id: "upload" })

        let cloudInvoiceUrl: string = uploadedInvoiceUrl || ""

        console.log("Invoice file", invoiceFile)

        try {
            cloudInvoiceUrl = await uploadInvoiceFileToCloudinary(invoiceFile)
        } catch (err) {
            toast.error("Invoice upload failed", { id: "upload" })
            return
        }

        console.log("Cloud Invoice URL:", cloudInvoiceUrl)

        const response = await axios.post("/api/admin/order/updateOrder", {
            orderId: order._id,
            invoiceUrl: cloudInvoiceUrl,
            invoiceFile: invoiceFile.name,
            invoiceNotes: invoiceNotes,
        })
        if (response?.data?.success) {
            setUploadedInvoiceUrl(cloudInvoiceUrl)
            setUploadedInvoiceName(invoiceFile.name)
            toast.success("Invoice uploaded successfully!", { id: "upload" })
        }
    }

    const handleInvoiceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadedInvoiceUrl(file.name)
        setUploadedInvoiceName(file.name)
        setInvoiceFile(file)
    }


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/orders">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Order {order.orderId}</h1>
                    <p className="text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Order Status Management */}
                    <Card className="p-6">
                        <h2 className="mb-4 text-xl font-bold text-foreground">Order Management</h2>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="status">Order Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger id="status" className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processed">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="delivery">Estimated Delivery : {estimatedDelivery.split("T")[0]}</Label>
                                <Input
                                    id="delivery"
                                    type="date"
                                    placeholder={estimatedDelivery}
                                    value={estimatedDelivery}
                                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="tracking">Tracking Number</Label>
                                <Input
                                    id="tracking"
                                    type="text"
                                    placeholder={trackingNumber || "e.g : TRK123456789"}
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="contact">Delivery Contact Number</Label>
                                <Input
                                    id="contact"
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={deliveryContact}
                                    onChange={(e) => setDeliveryContact(e.target.value)}
                                    className="mt-2"
                                />
                            </div>

                            <Button onClick={handleUpdateOrder} className="w-full">
                                Update Order Details
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="mb-4 text-xl font-bold text-foreground">Invoice Management</h2>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="invoice-upload">Upload Invoice Document</Label>
                                <div className="mt-2">
                                    <label
                                        htmlFor="invoice-upload"
                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 px-6 py-8 transition-colors hover:border-primary hover:bg-muted/20"
                                    >

                                        <Upload className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {uploadedInvoiceUrl ? uploadedInvoiceName : "Click to upload invoice (PDF, DOC, or Image)"}
                                        </span>
                                    </label>
                                    <input
                                        id="invoice-upload"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={handleInvoiceFileSelect}
                                        className="hidden"
                                    />
                                </div>
                                {uploadedInvoiceUrl && (
                                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                                        <FileText className="h-4 w-4 text-primary" />
                                        <span className="flex-1 text-sm text-foreground">{uploadedInvoiceName}</span>
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href={uploadedInvoiceName} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Send Invoice */}
                    <Card className="p-6">
                        <h2 className="mb-4 text-xl font-bold text-foreground">Send Invoice</h2>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="notes">Invoice Notes (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add any special notes for the invoice..."
                                    value={invoiceNotes}
                                    onChange={(e) => setInvoiceNotes(e.target.value)}
                                    className="mt-2"
                                    rows={3}
                                />
                            </div>
                            <Button onClick={handleSendInvoice} variant="outline" className="w-full bg-transparent">
                                <Mail className="mr-2 h-4 w-4" />
                                Send Invoice to Customer
                            </Button>
                        </div>
                    </Card>

                    {/* Order Items */}
                    <Card className="p-6">
                        <h2 className="mb-4 text-xl font-bold text-foreground">Order Items</h2>
                        <div className="space-y-4">
                            {order?.items?.length ? (
                                order.items.map((item, index) => (
                                    <div
                                        key={item?.productId?._id || `item-${index}`}
                                        className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                                    >
                                        <img
                                            src={item.productId?.coverImage || "/placeholder.svg"}
                                            alt={item.productId?.productName || "Product"}
                                            className="h-16 w-16 object-contain rounded"
                                        />

                                        <div>
                                            <p className="font-medium">
                                                {item.productId?.productName || "Unknown Product"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity}
                                            </p>
                                            <p className="text-sm font-semibold">
                                                ₹{item.price}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground">No items found.</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Current Status */}
                    <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-foreground">Current Status</h3>
                        <Badge className={`${getStatusColor(order.status)} text-base px-4 py-2`}>{order.status}</Badge>
                    </Card>

                    <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-foreground">Payment Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <CreditCard className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Payment Method</p>
                                    <p className="text-sm font-medium text-foreground">{order.paymentMethod}</p>
                                </div>
                            </div>
                            {order.paymentMethod === "online" && order.transactionId && (
                                <div className="flex items-start gap-3">
                                    <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Transaction ID</p>
                                        <p className="text-sm font-medium text-foreground font-mono">{order.transactionId}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Customer Info */}
                    <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-foreground">Customer Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">{order.userId?.firstName} {order.userId?.lastName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-foreground">{order.userId?.phoneNumber?.isdCode}{" "}{order.userId?.phoneNumber?.number}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-foreground">
                                        {order.shippingAddress?.locality}, {order.shippingAddress?.city}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.shippingAddress?.state}, {order.shippingAddress?.country}, {order.shippingAddress?.pincode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Tracking Info */}
                    {order.trackingId && (
                        <Card className="p-6">
                            <h3 className="mb-4 font-semibold text-foreground">Tracking Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Truck className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Tracking Number</p>
                                        <p className="text-sm font-medium text-foreground">{order.trackingId}</p>
                                    </div>
                                </div>
                                {order.expectedDeliveryDate && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Delivery Date</p>
                                            <p className="text-sm font-medium text-foreground">{order.expectedDeliveryDate}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}



                    {/* Order Summary */}
                    <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-foreground">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-foreground">₹{order.totalAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-foreground">₹{shipping.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax</span>
                                <span className="text-foreground">₹{tax.toLocaleString()}</span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-foreground">Total</span>
                                    <span className="text-foreground">₹{order.totalAmount?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div >
        </div >
    )
}
