import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Tipos de eventos de webhook da Notus
interface WebhookEvent {
  event_type: string;
  data: any;
  timestamp: string;
  id: string;
}

// Validação da assinatura Svix
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  timestamp: string
): boolean {
  try {
    // Remover prefixo 'whsec_' do secret
    const secretKey = secret.replace('whsec_', '');
    const secretBytes = Buffer.from(secretKey, 'base64');
    
    // Criar conteúdo assinado
    const signedContent = `${timestamp}.${payload}`;
    
    // Calcular assinatura esperada
    const expectedSignature = crypto
      .createHmac('sha256', secretBytes)
      .update(signedContent)
      .digest('base64');
    
    // Comparar assinaturas (usar comparação constante de tempo)
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Erro na verificação da assinatura:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔗 Webhook recebido da Notus');
    
    // Obter headers
    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');
    
    console.log('📋 Headers:', {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature ? 'presente' : 'ausente'
    });
    
    // Verificar headers obrigatórios
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('❌ Headers Svix ausentes');
      return NextResponse.json(
        { error: 'Headers Svix obrigatórios ausentes' },
        { status: 400 }
      );
    }
    
    // Obter payload
    const payload = await request.text();
    console.log('📦 Payload recebido:', payload);
    
    // Verificar timestamp (prevenir ataques de replay)
    const currentTime = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(svixTimestamp);
    const timeDiff = Math.abs(currentTime - webhookTime);
    
    // Tolerância de 5 minutos
    if (timeDiff > 300) {
      console.error('❌ Timestamp muito antigo:', timeDiff, 'segundos');
      return NextResponse.json(
        { error: 'Timestamp muito antigo' },
        { status: 400 }
      );
    }
    
    // Verificar assinatura (usar secret do ambiente)
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('❌ WEBHOOK_SECRET não configurado');
      return NextResponse.json(
        { error: 'Webhook secret não configurado' },
        { status: 500 }
      );
    }
    
    // Extrair assinatura (remover prefixo v1,)
    const signature = svixSignature.replace('v1,', '');
    
    const isValidSignature = verifyWebhookSignature(
      payload,
      signature,
      webhookSecret,
      svixTimestamp
    );
    
    if (!isValidSignature) {
      console.error('❌ Assinatura inválida');
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 401 }
      );
    }
    
    console.log('✅ Webhook validado com sucesso');
    
    // Parse do payload
    const event: WebhookEvent = JSON.parse(payload);
    console.log('🎯 Evento processado:', {
      type: event.event_type,
      id: event.id,
      timestamp: event.timestamp
    });
    
    // Processar evento baseado no tipo
    switch (event.event_type) {
      case 'swap.completed':
        console.log('💱 Swap completado:', event.data);
        // Aqui você pode processar o evento de swap
        break;
        
      case 'cross_swap.completed':
        console.log('🌉 Cross-swap completado:', event.data);
        // Aqui você pode processar o evento de cross-swap
        break;
        
      case 'withdraw_transfer.completed':
        console.log('💸 Saque completado:', event.data);
        // Aqui você pode processar o evento de saque
        break;
        
      case 'deposit_transfer.completed':
        console.log('💰 Depósito completado:', event.data);
        // Aqui você pode processar o evento de depósito
        break;
        
      case 'add_liquidity.completed':
        console.log('💧 Liquidez adicionada:', event.data);
        // Aqui você pode processar o evento de liquidez
        break;
        
      case 'kyc.completed':
        console.log('🆔 KYC completado:', event.data);
        // Aqui você pode processar o evento de KYC
        break;
        
      case 'on_ramp.completed':
        console.log('📈 On-ramp completado:', event.data);
        // Aqui você pode processar o evento de on-ramp
        break;
        
      case 'off_ramp.completed':
        console.log('📉 Off-ramp completado:', event.data);
        // Aqui você pode processar o evento de off-ramp
        break;
        
      default:
        console.log('❓ Evento desconhecido:', event.event_type);
    }
    
    // Salvar evento (aqui você pode salvar no banco de dados)
    // await saveWebhookEvent(event);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processado com sucesso',
      event_type: event.event_type 
    });
    
  } catch (error) {
    console.error('💥 Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para testar webhook
export async function GET() {
  return NextResponse.json({
    message: 'Endpoint de webhook ativo',
    status: 'ready',
    timestamp: new Date().toISOString()
  });
}
