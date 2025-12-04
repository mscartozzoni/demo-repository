import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const content = `
  <div class="prose prose-invert text-purple-200">
    <p>Procedimentos estéticos ambulatoriais têm valores que variam conforme a técnica e os produtos utilizados.</p>
    <p>Estimativas comuns incluem:</p>
    <ul>
      <li><strong>Toxina Botulínica (Botox):</strong> R$ 1.800 - R$ 2.500 por área.</li>
      <li><strong>Preenchimento com Ácido Hialurônico:</strong> R$ 2.000 - R$ 4.000 por seringa.</li>
      <li><strong>Bioestimuladores de Colágeno:</strong> A partir de R$ 3.000 por sessão.</li>
    </ul>
    <hr class="border-white/20 my-4" />
    <p class="text-sm text-yellow-300"><strong>Atenção:</strong> Estes valores são estimativas e não constituem um orçamento formal. O valor final e o plano de tratamento serão definidos após a consulta e avaliação do caso.</p>
  </div>
`;

const AmbulatorialEstimate = ({ onBack }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-white/5 border-white/10 p-6">
        <CardContent className="p-0">
          <div
            className="text-white"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
      </Card>
      <div className="text-center mt-6">
        <Button onClick={onBack} variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-400/10 hover:text-white">
          Voltar
        </Button>
      </div>
    </motion.div>
  );
};

export default AmbulatorialEstimate;