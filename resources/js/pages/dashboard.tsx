import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface LoginHistory {
    user: {
        name: string;
        username: string;
        role: string;
    };
    ip_address: string;
    last_activity: string;
    user_agent: string;
}

interface DashboardProps {
    loginHistory: LoginHistory[];
    loginStats: Array<{ date: string; count: number }>;
    totalUsers: number;
    activeUsers: number;
}

export default function Dashboard({ loginHistory, loginStats, totalUsers, activeUsers }: DashboardProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getBrowserIcon = (userAgent: string) => {
        if (userAgent.includes('Chrome')) return '🌐';
        if (userAgent.includes('Firefox')) return '🦊';
        if (userAgent.includes('Safari')) return '🧭';
        if (userAgent.includes('Edge')) return '📱';
        return '🌐';
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card className="relative overflow-hidden p-6">
                        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10" />
                        <h3 className="text-lg font-semibold">Waktu Sekarang</h3>
                        <p className="text-3xl font-bold">
                            {currentTime.toLocaleTimeString('id-ID')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {currentTime.toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </Card>

                    <Card className="relative overflow-hidden p-6">
                        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-green-500/10" />
                        <h3 className="text-lg font-semibold">Pengguna Aktif</h3>
                        <p className="text-3xl font-bold">{activeUsers}</p>
                        <p className="text-sm text-muted-foreground">Online dalam 5 menit terakhir</p>
                    </Card>

                    <Card className="relative overflow-hidden p-6">
                        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-500/10" />
                        <h3 className="text-lg font-semibold">Total Pengguna</h3>
                        <p className="text-3xl font-bold">{totalUsers}</p>
                        <p className="text-sm text-muted-foreground">Total Pengguna Di Dalam Sistem</p>
                    </Card>

                    <Card className="relative overflow-hidden p-6">
                        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-purple-500/10" />
                        <h3 className="text-lg font-semibold">Status Sistem</h3>
                        <p className="text-3xl font-bold text-green-500">Aktif</p>
                        <p className="text-sm text-muted-foreground">Sistem berjalan normal</p>
                    </Card>
                </div>

                {/* Chart & History Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Login Statistics Chart */}
                    <Card className="p-6">
                        <h3 className="mb-4 text-lg font-semibold">Statistik Login Harian</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={loginStats}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                                    <XAxis 
                                        dataKey="date" 
                                        tickFormatter={(date) => new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        labelFormatter={(date) => new Date(date).toLocaleDateString('id-ID', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                        formatter={(value) => [`${value} pengguna`, 'Login']}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#8884d8" 
                                        strokeWidth={2}
                                        dot={{ fill: '#8884d8' }}
                                        name="Jumlah Login"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Login History */}
                    <Card className="p-6">
                        <h3 className="mb-4 text-lg font-semibold">Aktivitas Login Terakhir</h3>
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-4">
                                {loginHistory.map((history, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">
                                                {getBrowserIcon(history.user_agent)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{history.user.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    @{history.user.username} • {history.user.role}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    IP :
                                                    {history.ip_address}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(history.last_activity).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
