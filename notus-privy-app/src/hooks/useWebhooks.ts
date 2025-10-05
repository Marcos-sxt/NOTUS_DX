"use client";

import { useState, useCallback } from 'react';
import { webhookActions, WebhookConfig, WebhookEvent } from '@/lib/actions/webhooks';

export interface WebhookState {
  webhooks: WebhookConfig[];
  events: WebhookEvent[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  testing: boolean;
}

export function useWebhooks() {
  const [state, setState] = useState<WebhookState>({
    webhooks: [],
    events: [],
    loading: false,
    error: null,
    creating: false,
    testing: false,
  });

  const loadWebhooks = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔗 Carregando webhooks...');
      
      const response = await webhookActions.getWebhooks();
      
      console.log('✅ Webhooks carregados:', response.webhooks.length);
      setState(prev => ({ ...prev, webhooks: response.webhooks, loading: false }));
    } catch (error: unknown) {
      console.error('❌ Erro ao carregar webhooks:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao carregar webhooks',
        loading: false 
      }));
    }
  }, []);

  const createWebhook = useCallback(async (params: {
    url: string;
    events: string[];
    secret?: string;
  }) => {
    setState(prev => ({ ...prev, creating: true, error: null }));

    try {
      console.log('🔗 Criando webhook...');
      
      const webhook = await webhookActions.createWebhook(params);
      
      console.log('✅ Webhook criado:', webhook);
      setState(prev => ({ 
        ...prev, 
        webhooks: [...prev.webhooks, webhook],
        creating: false 
      }));
      
      return webhook;
    } catch (error: unknown) {
      console.error('❌ Erro ao criar webhook:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao criar webhook',
        creating: false 
      }));
    }
  }, []);

  const loadWebhookEvents = useCallback(async (webhookId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔗 Carregando eventos do webhook...');
      
      const response = await webhookActions.getWebhookEvents(webhookId);
      
      console.log('✅ Eventos carregados:', response.events.length);
      setState(prev => ({ ...prev, events: response.events, loading: false }));
    } catch (error: unknown) {
      console.error('❌ Erro ao carregar eventos:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao carregar eventos',
        loading: false 
      }));
    }
  }, []);

  const testWebhook = useCallback(async (webhookId: string) => {
    setState(prev => ({ ...prev, testing: true, error: null }));

    try {
      console.log('🔗 Testando webhook...');
      
      const result = await webhookActions.testWebhook(webhookId);
      
      console.log('✅ Webhook testado:', result);
      setState(prev => ({ ...prev, testing: false }));
      
      return result;
    } catch (error: unknown) {
      console.error('❌ Erro ao testar webhook:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao testar webhook',
        testing: false 
      }));
    }
  }, []);

  const deleteWebhook = useCallback(async (webhookId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔗 Deletando webhook...');
      
      await webhookActions.deleteWebhook(webhookId);
      
      console.log('✅ Webhook deletado');
      setState(prev => ({ 
        ...prev, 
        webhooks: prev.webhooks.filter(w => w.id !== webhookId),
        loading: false 
      }));
    } catch (error: unknown) {
      console.error('❌ Erro ao deletar webhook:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao deletar webhook',
        loading: false 
      }));
    }
  }, []);

  return {
    ...state,
    loadWebhooks,
    createWebhook,
    loadWebhookEvents,
    testWebhook,
    deleteWebhook,
  };
}
