import type { EmailData } from './types'

function escape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function buildEmail(data: EmailData): string {
  const name = escape(data.name)
  const email = escape(data.email)
  const service = escape(data.service)
  const message = escape(data.message)
  const url = escape(data.url)
  const sentAt = escape(data.sentAt)

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 40px;
      background: #F5F3FA;
      font-family: Inter, Roboto, Arial, Helvetica, sans-serif;
      color: #2D2438;
    }
    .container {
      max-width: 700px;
      margin: auto;
      background: #FFFFFF;
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid #E8E2F1;
    }
    .header {
      background: #4F2D7F;
      color: #FFF;
      padding: 32px;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
    }
    .header p {
      margin-top: 8px;
      margin-bottom: 0;
      opacity: .85;
    }
    .content {
      padding: 36px;
    }
    .section {
      margin-bottom: 28px;
    }
    .label {
      color: #8B809A;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .08em;
      margin-bottom: 8px;
    }
    .value {
      font-size: 16px;
      line-height: 1.6;
    }
    .card {
      background: #F8F6FC;
      border-left: 4px solid #c5e22e;
      padding: 20px;
      border-radius: 10px;
      white-space: pre-wrap;
      line-height: 1.7;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      gap: 16px 0;
      margin-bottom: 30px;
    }
    .grid .title {
      color: #7D708B;
      font-size: 13px;
      font-weight: bold;
    }
    .grid .info {
      color: #2D2438;
      margin-bottom: 16px;
    }
    .button {
      display: inline-block;
      margin-top: 10px;
      background: #8b2fcc;
      color: #fff;
      text-decoration: none;
      padding: 15px 24px;
      border-radius: 10px;
      font-weight: bold;
    }
    .footer {
      background: #F8F6FC;
      padding: 28px 36px;
      font-size: 13px;
      color: #746C81;
    }
    .footer strong {
      color: #4F2D7F;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- header -->
    <div class="header">
      <h1>Novo contato pelo site</h1>
      <p>Um potencial cliente acabou de preencher o formulário da Purple Comunicação.</p>
    </div>

    <div class="content">
      <div class="grid">
        <!-- title -->
        <div class="title">Nome</div>
        <div class="info">${name}</div>

        <!-- email -->
        <div class="title">E-mail</div>
        <div class="info"><a href="mailto:${email}">${email}</a></div>

        <!-- service -->
        <div class="title">Serviço</div>
        <div class="info">${service}</div>

        <!-- sent at -->
        <div class="title">Recebido em</div>
        <div class="info">${sentAt}</div>

        <!-- source -->
        <div class="title">Origem</div>
        <div class="info"><a href="${url}">${url}</a></div>
      </div>

      <!-- message -->
      <div class="section">
        <div class="label">Mensagem enviada</div>
        <div class="card">${message}</div>
      </div>

      <!-- reply -->
      <a class="button" href="mailto:${email}?subject=Re:%20${encodeURIComponent(service)}">Responder ao cliente</a>
    </div>

    <div class="footer">
      <strong>Purple Comunicação</strong><br>
      Este e-mail foi enviado automaticamente pelo formulário de contato do site.
    </div>
  </div>
</body>
</html>
`
}
