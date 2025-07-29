## FrameworkNI - Framework Nova Integral (frontend)

Este framework foi desenvolvido pela nossa empresa com o objetivo de acelerar e padronizar o desenvolvimento de novos projetos. Ele fornece uma base sólida e rica em funcionalidades essenciais que atendem às necessidades comuns de diversas aplicações, permitindo que a equipe foque nas características específicas de cada projeto.

Nosso objetivo com este framework é não apenas padronizar o desenvolvimento, mas também permitir que novos membros da equipe se adaptem rapidamente ao nosso ambiente de trabalho, com ferramentas familiares e eficazes. Além disso, garantimos que os projetos criados com esta base sigam padrões elevados de qualidade, segurança e desempenho. Consulte sempre que necessário essa documentação.


## Índice

- [Primeiro passo](#primeiro-passo)
- [Padrão dos commits](#padrão-dos-commits)
- [Como gerar uma nova versão](#como-gerar-uma-nova-versão)
- [Reiniciado o versionamento](#reiniciado-o-versionamento)
- [Atualizando a versão major](#atualizando-a-versão-major)
- [Links úteis](#links-úteis)

## Primeiro passo

Este projeto utiliza dependências do Node.js. Ao clonar o repositório, antes de tudo, atualize-as executando o comando abaixo na raiz do projeto, no mesmo nível da pasta `.git`. 

```bash
npm install
```

Então crie a sua branch de trabalho (Switch/Checkout), normalmente a partir da branch `develop`.

## Padrão dos commits

Durante a realização dos commits, seguimos um padrão semântico de tags. É importante identificar o tipo de commit que está sendo feito para usar a tag adequada. A seguir, veja qual tag utilizar em cada situação.

| Tag     | Quando aplicar                              |
|---------|---------------------------------------------|
| `feat`| Quando adicionar uma nova funcionalidade, sendo que já foi testada e está completa. |
| `fix`| Quando corrigir um bug ou erro.             |
| `docs`  | Quando modificar ou adicionar documentação. |
| `wip`   | Quando o trabalho está em progresso (Work in Progress) |
| `general` | Para alterações gerais não cobertas pelas tags anteriores. |
| `version` | Para atualizar a versão minor (x.1.x) e patch (x.x.1)|
| `major` | Para atualizar a versão major (1.x.x)|

⚠️ **Atenção:** As tags `feat` e `fix` devem ser usadas com maior cautela, pois elas impactam o versionamento, modificando a versão do projeto e atualizando os registros no `CHANGELOG.md`.
  
Exemplos de commit:

```bash
feat: adiciona funcionalidade para atualizar dados cadastrais
```

```bash
fix: corrige um bug relacionado ao login
```

```bash
docs: adição de comentários, mudanças no README, etc
```

```bash
wip: trabalho em progresso para a nova interface de usuário
```

```bash
general: alterações gerais, refatoração de código
```

```bash
version: gera uma nova versão do sistema para minor ou patch
```

```bash
major: gera uma nova versão do sistema para major
```
💡 **Dica:** Você pode usar um escopo junto à tag para especificar exatamente a que parte do código o commit se refere. Basta incluir o escopo entre parênteses após a tag. 

Veja o exemplo a seguir:

```bash
wip(fix): corrigindo a funcionalidade de autenticação de usuário
```

## Como gerar uma nova versão

Para gerar uma nova versão do sistema, utilize a tag `version`. Ao executar este procedimento, uma nova versão será criada com base nos commits pendentes conforme as seguintes regras:

- **Incremento da Versão Minor:** Se dentre os commits pendentes houver pelo menos um com a tag `feat`, o número da versão _minor_ (por exemplo, de 0.1.0 para 0.2.0) será incrementado.
- **Incremento da Versão Patch:** Se os commits pendentes contiverem apenas a tag `fix`, o número da versão _patch_ (por exemplo, de 0.0.1 para 0.0.2) será atualizado.

Durante o processo de geração da nova versão, os seguintes arquivos são modificados automaticamente:

- `package.json`
- `CHANGELOG.md`
- `AssemblyInfo.cs` (versão do assembly do projeto)

Esse procedimento assegura que o changelog esteja atualizado e que a versão do sistema reflita corretamente as alterações realizadas.

Exemplos de commit:

```bash
version: gerando nova versão do sistema
```

## Reiniciado o versionamento

Para reiniciar o versionamento, siga os seguintes passos:

1. Primeiro, você deve remover todas as tags de versões atuais do repositório. Isso irá permitir que o standard-version reinicie o versionamento a partir da versão que você definir.

    Para excluir as tags locais e remotas, utilize os seguintes comandos:


    ```bash
    # Remove tags locais
    git tag -d $(git tag -l)    
    ``` 

2. Agora no arquivo `package.json` altere o valor do campo **version** para o valor de versão que deve iniciar
3. Apague o arquivo `CHANGELOG.md`
4. execute o comando abaixo, para gerar a primeira versão.
   ```bash
    npm run release -- --first-release
   ```
⚠️ **Atenção:** Se haver conflitos de tags, pode ser necessário apagar também as tags do repositório remoto.

## Atualizando a versão major

Para atualizar a versão major, ou seja 1.x.x, basta fazer um commit usando a tag a seguir:
```bash
# padrão do commit com a tag 'major' 
major: atualiza para a nova versão 2.0
```


## Links úteis

[Standard version](https://github.com/conventional-changelog/standard-version)

[Semantic version](https://semver.org/lang/pt-BR/)

[Husky Git Hooks](https://typicode.github.io/husky/get-started.html)

[Commitlint](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)

[Standard version](https://github.com/conventional-changelog/standard-version#installing-standard-version)

[Ionic v7]([standard-version](https://github.com/conventional-changelog/standard-version#installing-standard-version))

[Angular v17](https://v17.angular.io/docs)