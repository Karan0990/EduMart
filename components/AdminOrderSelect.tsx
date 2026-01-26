"use client"

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

export default function AdminOrderSelect() {
    return (
        <Select defaultValue="pending">
            <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
        </Select>
    )
}
