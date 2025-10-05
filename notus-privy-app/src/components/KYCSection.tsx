"use client";

import { useKYC } from '@/hooks/useKYC';
import { useEffect, useState } from 'react';

interface KYCSectionProps {
  userId: string | null;
  title?: string;
}

export function KYCSection({ userId, title = "🆔 KYC & Ramp" }: KYCSectionProps) {
  const {
    verificationSession,
    loading,
    error,
    createVerificationSession,
    getVerificationSession,
    finalizeVerification,
  } = useKYC(userId);

  useEffect(() => {
    console.log('🆔 KYCSection inicializado para usuário:', userId);
  }, [userId]);

  const handleStartKYC = async () => {
    if (!userId) return;

    try {
      const result = await createVerificationSession({
        firstName: 'João',
        lastName: 'Silva',
        birthDate: '1990-01-01',
        documentId: '12345678901',
        documentCategory: 'IDENTITY_CARD',
        documentCountry: 'BRAZIL',
        livenessRequired: true,
        email: 'joao.silva@example.com',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234-567',
      });
      if (result) {
        console.log('KYC iniciado com sucesso:', result);
      }
    } catch (error) {
      console.error('Erro ao iniciar KYC:', error);
    }
  };

  const handleFinalizeVerification = async () => {
    if (!verificationSession) return;

    try {
      const result = await finalizeVerification(verificationSession.id);
      if (result) {
        console.log('Verificação finalizada:', result);
      }
    } catch (error) {
      console.error('Erro ao finalizar verificação:', error);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* KYC Section */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-3">🆔 Verificação de Identidade</h4>
        
        {verificationSession ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white">Status:</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                verificationSession.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300' :
                verificationSession.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' :
                verificationSession.status === 'FAILED' ? 'bg-red-500/20 text-red-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {verificationSession.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white">Nome:</span>
              <span className="text-white">{verificationSession.firstName} {verificationSession.lastName}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white">Documento:</span>
              <span className="text-white">{verificationSession.document?.type || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white">Categoria:</span>
              <span className="text-white">{verificationSession.document?.category || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white">Liveness Required:</span>
              <span className="text-white">{verificationSession.livenessRequired ? 'Sim' : 'Não'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white">Criado em:</span>
              <span className="text-white">{new Date(verificationSession.createdAt).toLocaleString()}</span>
            </div>

            {verificationSession.frontDocumentUpload && (
              <div className="mt-4">
                <h5 className="text-white font-medium mb-2">Upload de Documentos:</h5>
                <div className="space-y-2">
                  <div className="p-2 bg-white/5 rounded text-sm">
                    <div className="text-white">Documento Frente: Disponível</div>
                    <div className="text-gray-300 text-xs">URL de upload fornecida</div>
                  </div>
                  {verificationSession.backDocumentUpload && (
                    <div className="p-2 bg-white/5 rounded text-sm">
                      <div className="text-white">Documento Verso: Disponível</div>
                      <div className="text-gray-300 text-xs">URL de upload fornecida</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {verificationSession.status === 'PENDING' && (
              <button
                onClick={handleFinalizeVerification}
                disabled={loading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Finalizando...' : 'Finalizar Verificação'}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-gray-300 text-center py-4">
              Nenhuma sessão de verificação ativa
            </div>
            
            <button
              onClick={handleStartKYC}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando Sessão...' : 'Iniciar Verificação KYC'}
            </button>
          </div>
        )}
      </div>

      {/* Ramp Section */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-3">💰 Fiat On/Off Ramp</h4>
        
        <div className="space-y-4">
          <div className="text-gray-300 text-center py-4">
            Funcionalidade de Ramp em desenvolvimento
          </div>
          
          <div className="text-sm text-gray-400 text-center">
            Esta funcionalidade requer integração com os endpoints oficiais da Notus API
          </div>
        </div>
      </div>
    </div>
  );
}