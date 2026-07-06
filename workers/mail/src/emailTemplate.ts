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
  const language = escape(data.language)
  const sentAt = escape(data.sentAt)

  return `
<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<style>

body{
    margin:0;
    padding:32px;
    background:#F5F3FA;
    font-family:Arial,Helvetica,sans-serif;
    color:#2C2434;
}

.container{
    max-width:700px;
    margin:auto;
    background:#FFFFFF;
    border-radius:16px;
    overflow:hidden;
    border:1px solid #E8E3EF;
}

.header{
    background:#4F2D7F;
    color:#FFFFFF;
    padding:28px 36px;
}

.header h1{
    margin:0;
    font-size:24px;
}

.content{
    padding:36px;
}

.grid{
    display:grid;
    grid-template-columns:170px 1fr;
    gap:12px 20px;
}

.label{
    color:#7E748B;
    font-weight:bold;
}

.value{
    color:#2C2434;
}

.message{

    margin-top:30px;

    background:#F8F6FC;

    padding:22px;

    border-left:4px solid #6D28D9;

    border-radius:8px;

    white-space:pre-wrap;

    line-height:1.7;

}

.button{

    display:inline-block;

    margin-top:30px;

    background:#A3E635;

    color:#222;

    text-decoration:none;

    padding:14px 24px;

    border-radius:8px;

    font-weight:bold;

}

.footer{

    background:#F8F6FC;

    padding:28px 36px;

    font-size:13px;

    color:#6F677B;

}

</style>

</head>

<body>

<div class="container">

<div class="header">

<h1>Novo contato pelo site</h1>

</div>

<div class="content">

<div class="grid">

<div class="label">Nome</div>
<div class="value">${name}</div>

<div class="label">Email</div>
<div class="value">${email}</div>

<div class="label">Serviço</div>
<div class="value">${service}</div>

<div class="label">Recebido em</div>
<div class="value">${sentAt}</div>

<div class="label">Idioma</div>
<div class="value">${language}</div>

<div class="label">Origem</div>
<div class="value">${url}</div>

</div>

<div class="message">

${message}

</div>

<a
class="button"
href="mailto:${email}?subject=Re:%20${encodeURIComponent(service)}">

Responder ao cliente

</a>

</div>

<div class="footer">

Mensagem enviada automaticamente pelo formulário do site da Purple Comunicação.

</div>

</div>

</body>

</html>
`
}
