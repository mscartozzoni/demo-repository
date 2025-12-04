import React from 'react';

const getAge = (birthDate) => {
  if (!birthDate) return '';
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const m = today.getMonth() - birthDateObj.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
  }
  return age > 0 ? `${age} anos` : 'Menos de 1 ano';
};

const GenericDocumentTemplate = ({ patient, children, isCancelled }) => {
  const logoUrl = "https://horizons-cdn.hostinger.com/39a7f0d8-ec20-48ff-a6d8-8134b005225f/6a752232436963dc1578a259a0e06ddc.png";

  return (
    <div className="document-page bg-white p-6 text-black relative">
      {isCancelled && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div 
            className="text-9xl font-bold text-red-500/30 border-8 border-red-500/30 rounded-lg p-8"
            style={{ transform: 'rotate(-20deg)' }}
          >
            SEM EFEITO
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <header className="flex justify-between items-center pb-4 border-b-2 border-gray-300">
        <div className="text-left">
          <p className="font-bold text-xl text-gray-800">Dr. Marcio Scartozzoni</p>
          <p className="text-md text-gray-600">Cirurgia Plástica</p>
        </div>
        <div className="text-right">
            <div className="w-28 h-auto flex items-center justify-center">
                <img src={logoUrl} alt="Logo da Clínica" className="max-w-full h-auto" />
            </div>
        </div>
      </header>
      
      <main className="py-6">
        {/* Informações do Paciente */}
        <section className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Informações do Paciente</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base">
            <p><span className="font-medium text-gray-500">Nome:</span> <span className="font-semibold">{patient?.full_name || 'N/A'}</span></p>
            <p><span className="font-medium text-gray-500">Idade:</span> <span className="font-semibold">{getAge(patient?.date_of_birth)}</span></p>
            <p><span className="font-medium text-gray-500">Telefone:</span> <span className="font-semibold">{patient?.phone || 'N/A'}</span></p>
            <p><span className="font-medium text-gray-500">Email:</span> <span className="font-semibold">{patient?.email || 'N/A'}</span></p>
          </div>
        </section>

        {/* Conteúdo principal do documento */}
        <div className="space-y-6">
          {children}
        </div>
      </main>

      {/* Rodapé */}
      <footer className="pt-4 border-t-2 border-gray-300 text-center text-xs text-gray-500">
        <p className="font-bold">Clínica Dr. Marcio Scartozzoni</p>
        <p>Endereço, Telefone e E-mail de Contato</p>
        <p>Dr. Marcio Scartozzoni – CRM 133221</p>
      </footer>
    </div>
  );
};

export default GenericDocumentTemplate;