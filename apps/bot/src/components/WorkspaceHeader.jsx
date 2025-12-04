import React from 'react';
import ConversationFilters from '@/components/ConversationFilters';
import SectorStats from '@/components/SectorStats';

const WorkspaceHeader = ({ filters, setFilters }) => {
  return (
    <div className="mb-8">
       <SectorStats />
       <div className="mt-6">
         <ConversationFilters filters={filters} setFilters={setFilters} />
       </div>
    </div>
  );
};

export default WorkspaceHeader;