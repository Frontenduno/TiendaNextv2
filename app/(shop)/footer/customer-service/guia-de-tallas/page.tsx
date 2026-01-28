'use client';

import React, { useState } from 'react';
import { 
  GenderType, 
  GenderTab,
  SizeGuideData
} from '@/interfaces/footer/customer-service/size-guide';
import { StickyNav } from '../components';
import { 
  CategoryCard, 
  MeasurementTipCard 
} from '../../../../components/zise-guide';
import sizeGuideData from '@/data/footer/customer-service/size-guide.json';
import { HeroBanner } from '@/components/shared/HeroBanner';

// Cast the imported JSON to our type
const data = sizeGuideData as SizeGuideData;

export default function SizeGuidePage() {
  const [activeGender, setActiveGender] = useState<GenderType>('hombre');

  const currentGenderData = data.sizeData[activeGender];

  return (
    <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <HeroBanner
            title="Guía de Tallas"
            subtitle="Encuentra tu talla perfecta con nuestra guía completa de medidas. Selecciona el género para ver las tablas correspondientes."
            padding="p-6 sm:p-8 mb-8"
          />

          {/* Gender Tabs */}
          <StickyNav
            items={data.genderTabs.map((tab: GenderTab) => ({ id: tab.id, title: tab.label }))}
            activeId={activeGender}
            onItemClick={(id) => id && setActiveGender(id as GenderType)}
            maxWidth="max-w-6xl"
          />

          {/* Size Tables Section */}
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {currentGenderData.categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Measurement Tips Section */}
          <section className="py-12 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
                ¿Cómo Medirte Correctamente?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {data.measurementTips.map((tip) => (
                  <MeasurementTipCard key={tip.id} tip={tip} />
                ))}
              </div>
            </div>
          </section>
        </div>
    </main>
  );
}