
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/auth/AuthContext';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import MedicoDashboard from '@/components/dashboards/MedicoDashboard';
import SecretariaDashboard from '@/components/dashboards/SecretariaDashboard';
import SystemRedirect from '@/components/SystemRedirect';
import { Loader2, ShieldAlert, Grid3x3, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Workspace = () => {
    const { profile, loading, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState('sistemas');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!profile) {
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] bg-background text-center p-4">
            <ShieldAlert className="h-16 w-16 text-destructive mb-4 z-10" />
            <h1 className="text-2xl font-bold text-foreground z-10">Perfil não Encontrado</h1>
            <p className="text-muted-foreground z-10 max-w-md mb-6">Não foi possível carregar seu perfil. Tente fazer login novamente.</p>
            <Button onClick={signOut} variant="destructive">
              Fazer Login Novamente
            </Button>
          </div>
        );
    }

    const renderDashboardByRole = () => {
        switch (profile.role) {
            case 'admin':
                return <AdminDashboard profile={profile} />;
            case 'medico':
            case 'doctor':
                return <MedicoDashboard profile={profile} />;
            case 'secretaria':
            case 'receptionist':
                return <SecretariaDashboard profile={profile} />;
            default:
                return <div className="text-center p-8"><p>Bem-vindo(a)! Seu portal está em desenvolvimento.</p></div>;
        }
    };

    return (
        <>
            <Helmet>
                <title>Dashboard - Portal Clinic</title>
                <meta name="description" content="Seu centro de comando para gestão inteligente da clínica." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="sistemas" className="flex items-center gap-2">
                            <Grid3x3 className="h-4 w-4" />
                            Sistemas
                        </TabsTrigger>
                        <TabsTrigger value="dashboard" className="flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="sistemas" className="mt-6">
                        <SystemRedirect />
                    </TabsContent>

                    <TabsContent value="dashboard" className="mt-6">
                        {renderDashboardByRole()}
                    </TabsContent>
                </Tabs>
            </motion.div>
        </>
    );
};

export default Workspace;
