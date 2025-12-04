
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const IntegrationCard = ({ icon, title, description, children }) => (
  <Card className="glass-effect-soft hover:shadow-lg transition-shadow duration-300 flex flex-col">
    <CardHeader className="flex flex-row items-center space-x-4 pb-4">
      <div className="p-3 bg-primary rounded-lg shadow-lg">
        {icon}
      </div>
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col pt-2">{children}</CardContent>
  </Card>
);

export default IntegrationCard;
