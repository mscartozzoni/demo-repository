import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Bot, Stethoscope, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const RDStationForm = ({ formId }) => {
  useEffect(() => {
    if (window.RDStationForms) {
      new window.RDStationForms(formId, 'UA-203257172-1').createForm();
    }
  }, [formId]);

  return <div id={formId}></div>;
};


const PublicPortal = () => {
    const { toast } = useToast();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
    
    const handleActionClick = () => {
      toast({
        title: "🚧 Ação em desenvolvimento",
        description: "Esta área será conectada ao fluxo de agendamento em breve! 🚀"
      });
    };

  return (
    <>
      <Helmet>
        <title>Clínica de Excelência - Agendamento e Contato</title>
        <meta name="description" content="Bem-vindo à nossa clínica. Agende sua consulta ou entre em contato com nossa equipe de especialistas." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">Clínica de Excelência</span>
            </div>
            <div className="space-x-4">
              <a href="#servicos" className="text-gray-600 hover:text-blue-600">Serviços</a>
              <a href="#contato" className="text-gray-600 hover:text-blue-600">Contato</a>
              <Button onClick={handleActionClick}>Agendar Consulta</Button>
            </div>
          </nav>
        </header>

        <main>
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-blue-600 text-white"
          >
             <div className="container mx-auto px-6 py-20 text-center">
                <motion.div 
                    className="inline-block p-4 bg-white/20 rounded-full mb-4"
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                >
                    <Bot className="h-12 w-12 text-white" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Conectando você ao cuidado que merece</h1>
                <p className="mt-4 text-lg text-blue-200 max-w-2xl mx-auto">
                    Nossa assistente virtual está pronta para ajudar você a agendar consultas, tirar dúvidas e iniciar sua jornada de bem-estar.
                </p>
                <Button size="lg" variant="secondary" className="mt-8" onClick={handleActionClick}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Iniciar Agendamento Online
                </Button>
            </div>
          </motion.section>

          <section id="servicos" className="py-20">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços Especializados</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <CardService title="Consultas Médicas" description="Atendimento completo com especialistas em diversas áreas da saúde." icon={Stethoscope} />
                <CardService title="Exames Laboratoriais" description="Tecnologia de ponta para diagnósticos precisos e rápidos." icon={Calendar} />
                <CardService title="Acompanhamento Personalizado" description="Planos de cuidado contínuo para sua saúde e bem-estar." icon={Bot} />
              </div>
            </div>
          </section>

          <section id="contato" className="bg-gray-100 py-20">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Fale Conosco</h2>
                        <p className="text-gray-600 mb-6">Tem alguma dúvida ou prefere falar diretamente com nossa equipe? Preencha o formulário e classificaremos seu atendimento para uma resposta mais rápida e eficiente.</p>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-blue-600"/>
                                <span>(11) 99999-8888</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-blue-600"/>
                                <span>contato@clinicaexcelencia.com.br</span>
                            </div>
                             <div className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-blue-600"/>
                                <span>Av. Paulista, 1234 - São Paulo, SP</span>
                            </div>
                        </div>
                    </div>
                     <div>
                        <Card className="bg-white p-8 shadow-xl rounded-lg">
                           <RDStationForm formId="rd-form-portal-secretaria" />
                        </Card>
                    </div>
                </div>
            </div>
          </section>
        </main>
        
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-6 text-center">
                <p>&copy; {new Date().getFullYear()} Clínica de Excelência. Todos os direitos reservados.</p>
                <p className="text-sm text-gray-400 mt-2">Tecnologia de atendimento por BotConversa</p>
            </div>
        </footer>
      </div>
    </>
  );
};

const CardService = ({ icon: Icon, title, description }) => (
    <motion.div 
        className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300"
        whileHover={{ scale: 1.05 }}
    >
        <div className="inline-block p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
            <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </motion.div>
);

const Card = ({ className, children }) => (
    <div className={`rounded-lg ${className}`}>
        {children}
    </div>
)


export default PublicPortal;