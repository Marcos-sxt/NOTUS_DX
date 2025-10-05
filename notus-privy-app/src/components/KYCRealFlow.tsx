"use client";

import { useKYC } from '@/hooks/useKYC';
import { useState, useRef } from 'react';

interface KYCRealFlowProps {
  userId: string | null;
}

export function KYCRealFlow({ userId }: KYCRealFlowProps) {
  const {
    verificationSession,
    uploadData,
    individualId,
    loading,
    error,
    uploading,
    createVerificationSession,
    uploadFrontDocument,
    uploadBackDocument,
    finalizeVerification,
    getVerificationSession,
  } = useKYC(userId);

  const [currentStep, setCurrentStep] = useState<'form' | 'upload' | 'processing' | 'completed'>('form');
  const [formData, setFormData] = useState({
    firstName: 'João',
    lastName: 'Silva Santos',
    birthDate: '1990-03-15',
    documentId: '12345678901',
    documentCategory: 'DRIVERS_LICENSE' as const,
    documentCountry: 'BRAZIL',
    livenessRequired: false,
    email: 'joao@email.com',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01234-567',
  });

  const frontFileRef = useRef<HTMLInputElement>(null);
  const backFileRef = useRef<HTMLInputElement>(null);

  const handleCreateSession = async () => {
    try {
      const response = await createVerificationSession(formData);
      if (response) {
        setCurrentStep('upload');
        console.log('✅ Sessão criada, URLs de upload disponíveis');
      }
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
    }
  };

  const handleUploadFront = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📤 Uploading front document:', file.name);
    const success = await uploadFrontDocument(file);
    if (success) {
      console.log('✅ Front document uploaded successfully');
    }
  };

  const handleUploadBack = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📤 Uploading back document:', file.name);
    const success = await uploadBackDocument(file);
    if (success) {
      console.log('✅ Back document uploaded successfully');
    }
  };

  const handleFinalize = async () => {
    if (!verificationSession) return;

    try {
      await finalizeVerification(verificationSession.id);
      setCurrentStep('processing');
      
      // Monitorar status automaticamente
      const checkStatus = async () => {
        const response = await getVerificationSession(verificationSession.id);
        if (response?.session.status === 'COMPLETED') {
          setCurrentStep('completed');
          console.log('🎉 KYC aprovado! Individual ID:', response.session.individualId);
        } else if (response?.session.status === 'FAILED') {
          console.log('❌ KYC rejeitado');
          setCurrentStep('upload'); // Permitir nova tentativa
        } else if (response?.session.status === 'VERIFYING') {
          // Continuar verificando
          setTimeout(checkStatus, 5000); // Verificar a cada 5 segundos
        }
      };

      // Iniciar monitoramento
      setTimeout(checkStatus, 2000);
    } catch (error) {
      console.error('Erro ao finalizar:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">🆔 KYC Real - Fluxo Completo</h2>
      
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 'form' ? 'bg-blue-600' : 'bg-gray-600'
          }`}>1</div>
          <div className="w-16 h-1 bg-gray-600"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 'upload' ? 'bg-blue-600' : 'bg-gray-600'
          }`}>2</div>
          <div className="w-16 h-1 bg-gray-600"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 'processing' ? 'bg-blue-600' : 'bg-gray-600'
          }`}>3</div>
          <div className="w-16 h-1 bg-gray-600"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 'completed' ? 'bg-green-600' : 'bg-gray-600'
          }`}>4</div>
        </div>
      </div>

      {/* Step 1: Form */}
      {currentStep === 'form' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">1️⃣ Dados Pessoais</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Nome</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Sobrenome</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Data de Nascimento</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Documento</label>
              <select
                value={formData.documentCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, documentCategory: e.target.value as any }))}
                className="w-full p-3 rounded-lg bg-white/20 text-white"
              >
                <option value="DRIVERS_LICENSE">CNH</option>
                <option value="IDENTITY_CARD">RG</option>
                <option value="PASSPORT">Passaporte</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleCreateSession}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Criando Sessão...' : 'Criar Sessão KYC'}
          </button>
        </div>
      )}

      {/* Step 2: Upload */}
      {currentStep === 'upload' && verificationSession && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">2️⃣ Upload de Documentos</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">📄 Documento Frente</h4>
              <input
                ref={frontFileRef}
                type="file"
                accept="image/*"
                onChange={handleUploadFront}
                className="w-full p-3 rounded-lg bg-white/20 text-white"
              />
              <p className="text-sm text-gray-300 mt-2">
                ⚠️ Deve ser uma foto do documento original, bem iluminada e legível
              </p>
            </div>

            {uploadData.backDocument && (
              <div>
                <h4 className="text-lg font-medium text-white mb-3">📄 Documento Verso</h4>
                <input
                  ref={backFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadBack}
                  className="w-full p-3 rounded-lg bg-white/20 text-white"
                />
                <p className="text-sm text-gray-300 mt-2">
                  ⚠️ Upload do verso do documento (quando aplicável)
                </p>
              </div>
            )}

            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <h5 className="text-yellow-200 font-medium mb-2">⚠️ Importante</h5>
              <ul className="text-yellow-100 text-sm space-y-1">
                <li>• URLs de upload expiram em 15 minutos</li>
                <li>• Use foto do documento original (não digitalizado)</li>
                <li>• Documento deve estar bem iluminado e legível</li>
                <li>• Sem reflexos ou sombras na foto</li>
              </ul>
            </div>

            <button
              onClick={handleFinalize}
              disabled={uploading}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {uploading ? 'Finalizando...' : 'Finalizar Verificação'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Processing */}
      {currentStep === 'processing' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">3️⃣ Processando Verificação</h3>
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white mb-4">IA analisando documentos automaticamente...</p>
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
            <h5 className="text-blue-200 font-medium mb-2">🤖 Verificação Automática</h5>
            <ul className="text-blue-100 text-sm space-y-1">
              <li>• OCR extraindo dados do documento</li>
              <li>• Validação de autenticidade</li>
              <li>• Verificação de consistência</li>
              <li>• Detecção de fraudes</li>
            </ul>
          </div>
        </div>
      )}

      {/* Step 4: Completed */}
      {currentStep === 'completed' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">4️⃣ Verificação Aprovada! 🎉</h3>
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
            <h5 className="text-green-200 font-medium mb-2">✅ KYC Aprovado</h5>
            <p className="text-green-100 text-sm">
              Individual ID: <code className="bg-black/20 px-2 py-1 rounded">{individualId}</code>
            </p>
          </div>
          <p className="text-white mb-4">
            Agora você pode usar funcionalidades de Ramp (depósito/saque) com este ID!
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mt-4">
          <h5 className="text-red-200 font-medium mb-2">❌ Erro</h5>
          <p className="text-red-100 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
