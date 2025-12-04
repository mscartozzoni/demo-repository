
import React from 'react';
import DashboardWidgets from './DashboardWidgets';
import NotificationCenter from './NotificationCenter';

const MedicoDashboard = ({ profile }) => {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-foreground">Portal do Médico</h1>
                <p className="text-muted-foreground">Bem-vindo(a) de volta, {profile.full_name}.</p>
            </header>

            <DashboardWidgets profile={profile} />

             <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-5">
                    <NotificationCenter profile={profile} />
                </div>
            </div>
        </div>
    );
};

export default MedicoDashboard;
