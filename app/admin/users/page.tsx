"use client"

import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    Search,
    Shield,
    UserIcon,
    Mail,
    Phone,
    Calendar,
} from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function UsersPage() {
    return (
        <Suspense fallback={null}>
            <UsersContent />
        </Suspense>
    )
}

function UsersContent() {
    const [users, setUsers] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [showRoleDialog, setShowRoleDialog] = useState(false)
    const [newRole, setNewRole] = useState<"user" | "admin">("user")


    useEffect(() => {
        async function getData() {
            const response = await axios.get("/api/admin/user/showAllUser")
            if (response?.data?.success) {
                setUsers(response.data.allUsers)
            }
        }
        getData()
    }, [])


    const filteredUsers = users.filter((user) =>
        `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )


    const handleRoleChange = (user: any) => {
        setSelectedUser(user)
        setNewRole(user.role === "admin" ? "user" : "admin")
        setShowRoleDialog(true)
    }

    const confirmRoleChange = async () => {
        if (!selectedUser) return


        try {
            const response = await axios.post(
                "/api/admin/user/roleUpdateToAdmin",
                {
                    id: selectedUser._id,
                    role: newRole,
                }
            )
            console.log("response", response.data)

            if (response?.data?.success) {
                setUsers((prev) =>
                    prev.map((u) =>
                        u._id === selectedUser._id
                            ? { ...u, role: newRole }
                            : u
                    )
                )

            }
        } catch (error) {
            console.error("Failed to change role", error)
        } finally {
            setShowRoleDialog(false)
            setSelectedUser(null)
        }
    }


    const stats = {
        totalUsers: users.length,
        admins: users.filter((u) => u.role === "admin").length,
        regularUsers: users.filter((u) => u.role === "user").length,
    }

    return (
        <div className="space-y-6">

            <div>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold"
                >
                    User Management
                </motion.h1>
                <p className="text-muted-foreground">
                    Manage user roles and permissions
                </p>
            </div>


            <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-6">
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </Card>
                <Card className="p-6">
                    <p className="text-sm text-muted-foreground">Admins</p>
                    <p className="text-2xl font-bold">{stats.admins}</p>
                </Card>
                <Card className="p-6">
                    <p className="text-sm text-muted-foreground">Users</p>
                    <p className="text-2xl font-bold">{stats.regularUsers}</p>
                </Card>
            </div>


            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </Card>


            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-muted-foreground"
                                    >
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <UserIcon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Phone className="h-3 w-3 text-muted-foreground" />
                                                {user.phoneNumber.isdCode}  {user.phoneNumber.number}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                {new Date(user.createdAt).toLocaleDateString("en-IN")}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.role === "admin"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className="capitalize"
                                            >
                                                {user.role === "admin" && (
                                                    <Shield className="mr-1 h-3 w-3" />
                                                )}
                                                {user.role}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant={
                                                    user.role === "admin"
                                                        ? "destructive"
                                                        : "default"
                                                }
                                                onClick={() => handleRoleChange(user)}
                                            >
                                                {user.role === "admin"
                                                    ? "Remove Admin"
                                                    : "Make Admin"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>


            <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Role Change</DialogTitle>
                        <DialogDescription>
                            Change role of{" "}
                            <span className="font-semibold">
                                {selectedUser?.firstName} {selectedUser?.lastName}
                            </span>{" "}
                            from{" "}
                            <span className="capitalize font-semibold">
                                {selectedUser?.role}
                            </span>{" "}
                            to{" "}
                            <span className="capitalize font-semibold">{newRole}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowRoleDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={confirmRoleChange}>
                            Confirm Change
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
