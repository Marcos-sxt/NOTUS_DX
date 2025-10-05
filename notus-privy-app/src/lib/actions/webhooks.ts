/**
 * 🔗 Webhooks Actions
 * Endpoints para configuração de webhooks
 * Baseado na documentação Notus API
 */

import { notusAPI } from '../api/client';

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  failureCount: number;
}

export interface WebhookEvent {
  id: string;
  webhookId: string;
  eventType: string;
  payload: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  createdAt: string;
  deliveredAt?: string;
  error?: string;
}

export interface CreateWebhookParams {
  url: string;
  events: string[];
  secret?: string;
}

export const webhookActions = {
  /**
   * Listar webhooks configurados
   * GET /webhooks
   * ⚠️ ATENÇÃO: Endpoint não disponível na API atual (404)
   * Documentação: https://docs.notus.team/docs/guides/webhook-overview
   */
  getWebhooks: async (): Promise<{ webhooks: WebhookConfig[]; total: number }> => {
    try {
      const response = await notusAPI.get('webhooks').json<{ webhooks: WebhookConfig[]; total: number }>();
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Endpoints de webhooks não estão disponíveis na Notus API atual. Consulte WEBHOOKS-API-REPORT.md para mais detalhes.');
      }
      throw error;
    }
  },

  /**
   * Criar novo webhook
   * POST /webhooks
   * ⚠️ ATENÇÃO: Endpoint não disponível na API atual (404)
   * Documentação: https://docs.notus.team/docs/guides/webhook-quickstart
   */
  createWebhook: async (params: CreateWebhookParams): Promise<WebhookConfig> => {
    try {
      const response = await notusAPI.post('webhooks', {
        json: params,
      }).json<WebhookConfig>();
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Endpoints de webhooks não estão disponíveis na Notus API atual. Consulte WEBHOOKS-API-REPORT.md para mais detalhes.');
      }
      throw error;
    }
  },

  /**
   * Obter detalhes de um webhook
   * GET /webhooks/{webhookId}
   * ⚠️ ATENÇÃO: Endpoint não disponível na API atual (404)
   */
  getWebhookDetails: async (webhookId: string): Promise<WebhookConfig> => {
    try {
      const response = await notusAPI.get(`webhooks/${webhookId}`).json<WebhookConfig>();
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Endpoints de webhooks não estão disponíveis na Notus API atual. Consulte WEBHOOKS-API-REPORT.md para mais detalhes.');
      }
      throw error;
    }
  },

  /**
   * Atualizar webhook
   * PUT /webhooks/{webhookId}
   * ⚠️ ATENÇÃO: Endpoint não disponível na API atual (404)
   */
  updateWebhook: async (webhookId: string, params: Partial<CreateWebhookParams>): Promise<WebhookConfig> => {
    try {
      const response = await notusAPI.put(`webhooks/${webhookId}`, {
        json: params,
      }).json<WebhookConfig>();
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Endpoints de webhooks não estão disponíveis na Notus API atual. Consulte WEBHOOKS-API-REPORT.md para mais detalhes.');
      }
      throw error;
    }
  },

  /**
   * Deletar webhook
   * DELETE /webhooks/{webhookId}
   * ⚠️ ATENÇÃO: Endpoint não disponível na API atual (404)
   */
  deleteWebhook: async (webhookId: string): Promise<{ success: boolean }> => {
    try {
      const response = await notusAPI.delete(`webhooks/${webhookId}`).json<{ success: boolean }>();
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Endpoints de webhooks não estão disponíveis na Notus API atual. Consulte WEBHOOKS-API-REPORT.md para mais detalhes.');
      }
      throw error;
    }
  },

  /**
   * Obter eventos de um webhook
   * GET /webhooks/{webhookId}/events
   * ⚠️ ATENÇÃO: Endpoint não disponível na API atual (404)
   */
  getWebhookEvents: async (webhookId: string, params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<{ events: WebhookEvent[]; total: number }> => {
    try {
      const response = await notusAPI.get(`webhooks/${webhookId}/events`, {
        searchParams: params,
      }).json<{ events: WebhookEvent[]; total: number }>();
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Endpoints de webhooks não estão disponíveis na Notus API atual. Consulte WEBHOOKS-API-REPORT.md para mais detalhes.');
      }
      throw error;
    }
  },

  /**
   * Testar webhook
   * POST /webhooks/{webhookId}/test
   * ⚠️ ATENÇÃO: Endpoint não disponível na API atual (404)
   */
  testWebhook: async (webhookId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await notusAPI.post(`webhooks/${webhookId}/test`).json<{ success: boolean; message: string }>();
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Endpoints de webhooks não estão disponíveis na Notus API atual. Consulte WEBHOOKS-API-REPORT.md para mais detalhes.');
      }
      throw error;
    }
  },
};
