# Banco de Dados — Saint X (ambiente de teste)

Este schema é a versão inicial, pensada para PostgreSQL.

Para rodar localmente:
1. Criar um banco vazio (ex: `createdb saintx_test`).
2. Rodar `psql saintx_test < schema.sql`.
3. Conectar a aplicação usando as credenciais do ambiente de teste vinculado ao e-mail institucional da Saint X.

Pontos de atenção antes de produção:
- Mover dados bancários de vendedores para um serviço tokenizado (ex: gateway de pagamento), não manter número de conta em texto puro.
- Habilitar criptografia em repouso no provedor do banco.
- Definir política de backup e retenção de dados conforme LGPD.
- Criar usuários de banco com permissões mínimas por serviço (princípio do menor privilégio).
