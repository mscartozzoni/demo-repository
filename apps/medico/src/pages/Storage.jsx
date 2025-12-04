import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { HardDrive, FileText, Image, Video, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Storage = () => {
  const { t } = useTranslation();

  const totalStorage = 50; // GB
  const usedStorage = 12.5; // GB
  const usagePercentage = (usedStorage / totalStorage) * 100;

  const storageBreakdown = [
    { name: 'documents', size: '5.2 GB', icon: FileText, color: 'text-blue-400', percentage: (5.2 / usedStorage) * 100 },
    { name: 'images', size: '3.8 GB', icon: Image, color: 'text-green-400', percentage: (3.8 / usedStorage) * 100 },
    { name: 'videos', size: '2.1 GB', icon: Video, color: 'text-red-400', percentage: (2.1 / usedStorage) * 100 },
    { name: 'database', size: '1.4 GB', icon: Database, color: 'text-purple-400', percentage: (1.4 / usedStorage) * 100 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <Helmet>
        <title>{t('storage.title')} - Portal do Médico</title>
        <meta name="description" content={t('storage.meta_description')} />
      </Helmet>
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{t('storage.header')}</h1>
          <p className="text-slate-400 mt-2">{t('storage.subtitle')}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-6 h-6 text-primary" />
                <span>{t('storage.usage_overview')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-bold text-white">{usedStorage.toFixed(1)} GB</span>
                <span className="text-slate-400">/ {totalStorage} GB {t('storage.used')}</span>
              </div>
              <div className="w-full bg-primary/10 rounded-full h-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-primary h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercentage}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </div>
              <p className="text-center text-sm text-slate-300 font-medium">
                {t('storage.nvme_info')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-4">{t('storage.breakdown_title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {storageBreakdown.map((item, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Card className="glass-effect h-full">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`p-3 rounded-full bg-primary/10 ${item.color} mb-4`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <p className="text-lg font-semibold text-white">{t(`storage.breakdown.${item.name}`)}</p>
                                <p className="text-2xl font-bold text-slate-200 my-1">{item.size}</p>
                                <p className="text-sm text-slate-400">{item.percentage.toFixed(1)}% {t('storage.of_total')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Storage;