"use client";

import { useState, useCallback } from 'react';
import { 
  kycActions, 
  rampActions,
  KYCVerificationSession, 
  KYCCreateSessionResponse,
  KYCStatusResponse,
  DocumentUploadData,
  RampDepositQuote, 
  RampWithdrawQuote,
  RampDepositOrder,
  RampWithdrawOrder,
  RampDepositQuoteParams,
  RampWithdrawQuoteParams,
  KYCCreateSessionParams
} from '@/lib/actions/kyc';

export interface KYCState {
  verificationSession: KYCVerificationSession | null;
  uploadData: {
    frontDocument?: DocumentUploadData;
    backDocument?: DocumentUploadData;
  };
  individualId: string | null; // ID do indivíduo após KYC aprovado
  depositQuote: RampDepositQuote | null;
  withdrawQuote: RampWithdrawQuote | null;
  depositOrder: RampDepositOrder | null;
  withdrawOrder: RampWithdrawOrder | null;
  loading: boolean;
  error: string | null;
  uploading: boolean;
  executing: boolean;
}

export function useKYC(userId: string | null) {
  const [state, setState] = useState<KYCState>({
    verificationSession: null,
    uploadData: {},
    individualId: null,
    depositQuote: null,
    withdrawQuote: null,
    depositOrder: null,
    withdrawOrder: null,
    loading: false,
    error: null,
    uploading: false,
    executing: false,
  });

  // KYC Functions
  const createVerificationSession = useCallback(async (params: KYCCreateSessionParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🆔 Criando sessão de verificação KYC...');
      
      const response = await kycActions.createVerificationSession(params);
      
      console.log('✅ Sessão de verificação criada:', response);
      setState(prev => ({ 
        ...prev, 
        verificationSession: response.session,
        uploadData: {
          frontDocument: response.frontDocumentUpload,
          backDocument: response.backDocumentUpload
        },
        loading: false 
      }));
      return response;
    } catch (error: unknown) {
      console.error('❌ Erro ao criar sessão de verificação:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao criar sessão de verificação',
        loading: false 
      }));
    }
  }, []);

  const getVerificationSession = useCallback(async (sessionId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🆔 Verificando status da sessão KYC...');
      
      const session = await kycActions.getVerificationSession(sessionId);
      
      console.log('✅ Status da sessão verificado:', session);
      setState(prev => ({ 
        ...prev, 
        verificationSession: session.session,
        individualId: session.session.individualId || null,
        loading: false 
      }));
      return session;
    } catch (error: unknown) {
      console.error('❌ Erro ao verificar sessão:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao verificar sessão',
        loading: false 
      }));
    }
  }, []);

  const finalizeVerification = useCallback(async (sessionId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🆔 Finalizando verificação KYC...');
      
      const result = await kycActions.finalizeVerification(sessionId);
      
      console.log('✅ Verificação finalizada:', result);
      setState(prev => ({ ...prev, loading: false }));
      
      // Recarregar sessão
      await getVerificationSession(sessionId);
      
      return result;
    } catch (error: unknown) {
      console.error('❌ Erro ao finalizar verificação:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao finalizar verificação',
        loading: false 
      }));
    }
  }, [getVerificationSession]);

  // Ramp Functions
  const createDepositQuote = useCallback(async (params: RampDepositQuoteParams) => {
    setState(prev => ({ ...prev, loading: true, error: null, depositQuote: null }));

    try {
      console.log('💰 Criando cotação de depósito...');
      
      const quote = await rampActions.createDepositQuote(params);
      
      console.log('✅ Cotação de depósito criada:', quote);
      setState(prev => ({ ...prev, depositQuote: quote, loading: false }));
      return quote;
    } catch (error: unknown) {
      console.error('❌ Erro ao criar cotação de depósito:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao criar cotação de depósito',
        loading: false 
      }));
    }
  }, []);

  const createDepositOrder = useCallback(async (quoteId: string) => {
    setState(prev => ({ ...prev, executing: true, error: null }));

    try {
      console.log('💰 Criando ordem de depósito...');
      
      const order = await rampActions.createDepositOrder({ quoteId });
      
      console.log('✅ Ordem de depósito criada:', order);
      setState(prev => ({ ...prev, depositOrder: order, executing: false }));
      return order;
    } catch (error: unknown) {
      console.error('❌ Erro ao criar ordem de depósito:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao criar ordem de depósito',
        executing: false 
      }));
    }
  }, []);

  const createWithdrawQuote = useCallback(async (params: RampWithdrawQuoteParams) => {
    setState(prev => ({ ...prev, loading: true, error: null, withdrawQuote: null }));

    try {
      console.log('💰 Criando cotação de saque...');
      
      const quote = await rampActions.createWithdrawQuote(params);
      
      console.log('✅ Cotação de saque criada:', quote);
      setState(prev => ({ ...prev, withdrawQuote: quote, loading: false }));
      return quote;
    } catch (error: unknown) {
      console.error('❌ Erro ao criar cotação de saque:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao criar cotação de saque',
        loading: false 
      }));
    }
  }, []);

  const createWithdrawOrder = useCallback(async (quoteId: string) => {
    setState(prev => ({ ...prev, executing: true, error: null }));

    try {
      console.log('💰 Criando ordem de saque...');
      
      const order = await rampActions.createWithdrawOrder({ quoteId });
      
      console.log('✅ Ordem de saque criada:', order);
      setState(prev => ({ ...prev, withdrawOrder: order, executing: false }));
      return order;
    } catch (error: unknown) {
      console.error('❌ Erro ao criar ordem de saque:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao criar ordem de saque',
        executing: false 
      }));
    }
  }, []);

  const clearQuotes = useCallback(() => {
    setState(prev => ({
      ...prev,
      depositQuote: null,
      withdrawQuote: null,
      depositOrder: null,
      withdrawOrder: null
    }));
  }, []);

  // Document Upload Functions
  const uploadFrontDocument = useCallback(async (file: File) => {
    if (!state.uploadData.frontDocument) {
      console.error('❌ Dados de upload do documento frente não disponíveis');
      return false;
    }

    setState(prev => ({ ...prev, uploading: true, error: null }));

    try {
      console.log('📤 Fazendo upload do documento frente...');
      const success = await kycActions.uploadDocument(file, state.uploadData.frontDocument);
      
      if (success) {
        console.log('✅ Documento frente enviado com sucesso');
      } else {
        console.error('❌ Falha no upload do documento frente');
      }
      
      setState(prev => ({ ...prev, uploading: false }));
      return success;
    } catch (error: unknown) {
      console.error('❌ Erro no upload do documento frente:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro no upload do documento',
        uploading: false 
      }));
      return false;
    }
  }, [state.uploadData.frontDocument]);

  const uploadBackDocument = useCallback(async (file: File) => {
    if (!state.uploadData.backDocument) {
      console.error('❌ Dados de upload do documento verso não disponíveis');
      return false;
    }

    setState(prev => ({ ...prev, uploading: true, error: null }));

    try {
      console.log('📤 Fazendo upload do documento verso...');
      const success = await kycActions.uploadDocument(file, state.uploadData.backDocument);
      
      if (success) {
        console.log('✅ Documento verso enviado com sucesso');
      } else {
        console.error('❌ Falha no upload do documento verso');
      }
      
      setState(prev => ({ ...prev, uploading: false }));
      return success;
    } catch (error: unknown) {
      console.error('❌ Erro no upload do documento verso:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro no upload do documento',
        uploading: false 
      }));
      return false;
    }
  }, [state.uploadData.backDocument]);

  return {
    ...state,
    // KYC Functions
    createVerificationSession,
    getVerificationSession,
    finalizeVerification,
    uploadFrontDocument,
    uploadBackDocument,
    // Ramp Functions
    createDepositQuote,
    createDepositOrder,
    createWithdrawQuote,
    createWithdrawOrder,
    clearQuotes,
  };
}
