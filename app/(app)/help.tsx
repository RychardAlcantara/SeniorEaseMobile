import React, { useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/presentation/theme/ThemeProvider'
import { PageHeader, ScreenShell } from '../../src/presentation/components/PageHeader'

const guiaSections = [
  {
    titulo: 'Como criar uma tarefa',
    descricao:
      'Clique no botão "Criar nova tarefa" presente na tela principal (Início) ou no menu Tarefas. Preencha o nome da tarefa, a data e confirme. Ela aparecerá na seção "Minhas Tarefas".',
  },
  {
    titulo: 'Como concluir uma tarefa',
    descricao:
      'Na lista de tarefas, encontre a tarefa desejada e clique no botão "Concluir". A tarefa será concluída e movida para o histórico.',
  },
  {
    titulo: 'Como editar uma tarefa',
    descricao:
      'No modo Avançado, cada tarefa possui um botão "Editar". Clique nele para alterar o nome ou as informações da tarefa. Após, clique em salvar para salvar as alterações.',
  },
  {
    titulo: 'Como excluir uma tarefa',
    descricao:
      'No modo Avançado, cada tarefa possui um botão "Excluir". Clique nele e confirme a exclusão na janela que aparecer. Atenção: essa ação não pode ser desfeita.',
  },
  {
    titulo: 'Como alterar as configurações',
    descricao:
      'Acesse o menu "Configurações" na barra inferior. Lá você pode alterar o tamanho da fonte, espaçamento entre letras, ativar o alto contraste e escolher entre o modo Simplificado ou Avançado.',
  },
  {
    titulo: 'Como ativar o Alto Contraste',
    descricao:
      'Você pode ativar o alto contraste pelo menu de Configurações. O modo alto contraste usa fundo escuro e cores vibrantes para facilitar a leitura.',
  },
  {
    titulo: 'Diferença entre modo Simplificado e Avançado',
    descricao:
      'O modo Simplificado mostra apenas o essencial, com menos informações na tela. O modo Avançado exibe mais opções e detalhes, como estatísticas, edição e exclusão de tarefas.',
  },
  {
    titulo: 'Como usar a tela de Tarefas',
    descricao:
      'Na barra inferior, toque em "Tarefas" para acessar a tela completa de gerenciamento. Lá você encontra as tarefas pendentes e o histórico de concluídas.',
  },
]

const faqItems = [
  {
    pergunta: 'Minhas configurações são salvas automaticamente?',
    resposta:
      'Sim. Na tela de Configurações, todas as alterações são aplicadas e salvas automaticamente assim que você seleciona uma opção. Não é necessário clicar em nenhum botão para confirmar.',
  },
  {
    pergunta: 'Como aumento o tamanho das letras?',
    resposta:
      'Acesse Configurações na barra de navegação e na seção "Tamanho da Fonte" escolha entre A- (menor), A (normal) ou A+ (maior). A alteração será aplicada automaticamente.',
  },
  {
    pergunta: 'O que é o espaçamento ampliado?',
    resposta:
      'O espaçamento ampliado aumenta a distância entre as letras em toda a aplicação, facilitando a leitura para pessoas com dificuldade visual.',
  },
  {
    pergunta: 'Onde vejo as tarefas que já concluí?',
    resposta:
      'No Modo Avançado do Início, a seção "Histórico" aparece abaixo da lista de tarefas. Ou acesse a tela "Tarefas" na barra inferior para ver o histórico completo.',
  },
  {
    pergunta: 'Como excluo uma tarefa?',
    resposta:
      'No modo Avançado, cada tarefa na lista possui um botão "Excluir". Toque nele e confirme a exclusão. Atenção: essa ação não pode ser desfeita.',
  },
  {
    pergunta: 'Como busco uma tarefa específica?',
    resposta:
      'No modo Avançado, na tela "Tarefas", utilize o campo de busca no topo da tela. Digite parte do nome da tarefa e a lista será filtrada automaticamente.',
  },
  {
    pergunta: 'Como volto para a tela principal?',
    resposta:
      'Toque em "Início" na barra de navegação inferior.',
  },
]

function FAQItem({ pergunta, resposta, colors, fontSize: fs, letterSpacing }: {
  pergunta: string
  resposta: string
  colors: any
  fontSize: any
  letterSpacing: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <TouchableOpacity
      onPress={() => setOpen(!open)}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={pergunta}
      accessibilityState={{ expanded: open }}
      style={[styles.faqItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.faqHeader}>
        <Ionicons name="help-circle-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
        <Text style={[styles.faqQuestion, { color: colors.text, fontSize: fs.label, flex: 1, letterSpacing }]}>
          {pergunta}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
      </View>
      {open && (
        <Text style={[styles.faqAnswer, { color: colors.textMuted, fontSize: fs.body, letterSpacing }]}>
          {resposta}
        </Text>
      )}
    </TouchableOpacity>
  )
}

export default function HelpScreen() {
  const { colors, fontSize, letterSpacing, isHighContrast } = useTheme()

  return (
    <ScreenShell>
      <PageHeader title="Central de Ajuda" subtitle="Tudo o que você precisa saber para usar o app" />

      <ScrollView
        style={[styles.body, { backgroundColor: colors.background }]}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Guia de Uso */}
        <View style={styles.sectionHeader}>
          <Ionicons name="book-outline" size={22} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize.label + 2, letterSpacing }]}>
            Guia de Uso
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          {guiaSections.map((section, index) => (
            <View key={index}>
              <Text style={[styles.guiaTitle, { color: colors.text, fontSize: fontSize.label, letterSpacing }]}>
                {index + 1}. {section.titulo}
              </Text>
              <Text style={[styles.guiaDesc, { color: colors.textMuted, fontSize: fontSize.body, letterSpacing }]}>
                {section.descricao}
              </Text>
              {index < guiaSections.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* FAQ */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize.label + 2, letterSpacing }]}>
            Perguntas Frequentes
          </Text>
        </View>

        {faqItems.map((item, index) => (
          <FAQItem
            key={index}
            pergunta={item.pergunta}
            resposta={item.resposta}
            colors={colors}
            fontSize={fontSize}
            letterSpacing={letterSpacing}
          />
        ))}

        {/* Contato */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Ionicons name="call-outline" size={22} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize.label + 2, letterSpacing }]}>
            Precisa de mais ajuda?
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={[styles.contactIntro, { color: colors.textMuted, fontSize: fontSize.body, letterSpacing }]}>
            Se não encontrou a resposta que procurava, entre em contato com a nossa equipe de suporte:
          </Text>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL('tel:+551112345678')}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Ligar para o suporte"
          >
            <Ionicons name="call" size={18} color={colors.primary} />
            <Text style={[styles.contactText, { color: colors.text, fontSize: fontSize.body, letterSpacing }]}>
              (11) 12345-6789
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL('mailto:suporte@seniorease.com.br')}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Enviar e-mail para o suporte"
          >
            <Ionicons name="mail" size={18} color={colors.primary} />
            <Text style={[styles.contactText, { color: colors.text, fontSize: fontSize.body, letterSpacing }]}>
              suporte@seniorease.com.br
            </Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.horario, { color: colors.textMuted, fontSize: fontSize.caption, letterSpacing }]}>
            Horário de atendimento: Segunda a Sexta, das 8h às 18h.
          </Text>
        </View>
      </ScrollView>
    </ScreenShell>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
  },
  guiaTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  guiaDesc: {
    lineHeight: 22,
  },
  divider: {
    height: 1,
    marginVertical: 16,
    opacity: 0.4,
  },
  faqItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqQuestion: {
    fontWeight: '600',
  },
  faqAnswer: {
    marginTop: 12,
    lineHeight: 22,
    paddingLeft: 30,
  },
  contactIntro: {
    marginBottom: 16,
    lineHeight: 22,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  contactText: {
    fontWeight: '600',
  },
  horario: {
    fontStyle: 'italic',
  },
})
