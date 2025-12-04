
import React from 'react';
import DashboardWidgets from './DashboardWidgets';
import NotificationCenter from './NotificationCenter';

const SecretariaDashboard = ({ profile }) => {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-foreground">Portal da Secretaria</h1>
                <p className="text-muted-foreground">Organize seu dia de trabalho, {profile.full_name}.</p>
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

export default SecretariaDashboard;
