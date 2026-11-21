"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react";
import { api } from "@/lib/axios";

type Dashboard = {
    revenue: number;
    orders: number;
    activeProducts: number;
    customers: number;
    recentOrders: {
        _id: string;
        orderId: string;
        customerInfo: { fullName: string };
        totalAmount: number;
        orderStatus: string;
    }[];
};

const number = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 2 });

export default function AdminDashboard() {
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        api.get<{ data: Dashboard }>("/orders/dashboard", { signal: controller.signal })
            .then(({ data }) => {
                if (controller.signal.aborted) return;
                const result = data.data;
                if (!Array.isArray(result?.recentOrders) ||
                    ![result.revenue, result.orders, result.activeProducts, result.customers].every(Number.isFinite)) {
                    throw new Error("Invalid dashboard response");
                }
                setDashboard(result);
            })
            .catch(() => { if (!controller.signal.aborted) setFailed(true); });
        return () => controller.abort();
    }, [attempt]);

    const stats = [
        { title: "Total Revenue", value: dashboard ? `Rs. ${number.format(dashboard.revenue)}` : "—", icon: DollarSign },
        { title: "Orders", value: dashboard ? number.format(dashboard.orders) : "—", icon: ShoppingBag },
        { title: "Active Products", value: dashboard ? number.format(dashboard.activeProducts) : "—", icon: Activity },
        { title: "Customers", value: dashboard ? number.format(dashboard.customers) : "—", icon: Users },
    ];

    return (
        <div className="space-y-6 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-gray-700" />
                                </div>

                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-900">Recent Orders</h3>
                    <Link href="/admin/orders" className="inline-flex min-h-11 items-center text-sm text-gray-500 hover:text-black">View All</Link>
                </div>
                {failed ? (
                    <div role="alert" className="p-6 text-sm text-gray-700">
                        Couldn’t load dashboard.
                        <button type="button" className="ml-2 min-h-11 px-2 underline" onClick={() => {
                            setFailed(false);
                            setAttempt(value => value + 1);
                        }}>Retry</button>
                    </div>
                ) : !dashboard ? (
                    <p role="status" className="p-6 text-sm text-gray-500">Loading dashboard…</p>
                ) : dashboard.recentOrders.length === 0 ? (
                    <p className="p-6 text-sm text-gray-500">No recent orders to display.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {dashboard.recentOrders.map(order => (
                            <li key={order._id} className="flex flex-wrap justify-between gap-3 px-6 py-4 text-sm text-gray-900">
                                <div><strong>{order.orderId}</strong><p>{order.customerInfo.fullName}</p></div>
                                <div className="text-right"><strong>Rs. {number.format(order.totalAmount)}</strong>
                                    <p>{order.orderStatus === "Confirmed" ? "Processing" : order.orderStatus}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
