"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Accordion from "../components/Accordion";
import QuickLinks from "../components/QuickLinks";

import legalConfig from "@/data/footer/legal/legal.json";
import termsData from "@/data/footer/legal/terms.json";
import privacyData from "@/data/footer/legal/privacy.json";
import cookiesData from "@/data/footer/legal/cookies.json";

import type { LegalPageConfig, LegalPageData } from "@/interfaces/footer/legal/legal";

// Configuración de cada tipo de página legal desde JSON
const legalPages: Record<string, LegalPageConfig> = legalConfig.pages;

// Datos de cada tipo de página legal
const legalData: Record<string, LegalPageData> = {
  "terminos-y-condiciones": termsData,
  "politica-de-privacidad": privacyData,
  "politica-de-cookies": cookiesData,
};

interface LegalPageProps {
  params: Promise<{ type: string }>;
}

export default function LegalPage({ params }: LegalPageProps) {
  const { type } = use(params);
  
  const pageConfig = legalPages[type];
  const pageData = legalData[type];

  // Si no existe la configuración para este tipo, mostrar 404
  if (!pageConfig || !pageData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-lg p-6 sm:p-8 mb-8 text-white">
          <div className="max-w-5xl mx-auto px-4 py-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {pageConfig.title}
            </h1>
            <p className="text-blue-100 text-base max-w-2xl mx-auto">
              {pageConfig.subtitle}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Quick Links */}
            <QuickLinks />

            {/* Main Content */}
            <main className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  {/* Last Updated Notice */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Última actualización:</span>{" "}
                      {pageData.lastUpdated}. {pageConfig.lastUpdatedNote}
                    </p>
                  </div>

                  {/* Accordion Component */}
                  <Accordion sections={pageData.sections} />

                  {/* Footer Section (only for terms) */}
                  {pageConfig.footerTitle && pageConfig.footerContent && (
                    <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {pageConfig.footerTitle}
                      </h3>
                      {pageConfig.footerContent.map((text, index) => (
                        <p
                          key={index}
                          className={`${index === 0 ? "text-gray-600 mb-4" : "text-sm text-gray-500"}`}
                        >
                          {text}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
