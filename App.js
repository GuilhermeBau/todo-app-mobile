import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  LogBox,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';
import EmojiPicker from 'react-native-emoji-chooser';

// se tiver bug aqui a culpa é do JavaScript, não minha
LogBox.ignoreLogs(['EmojiPicker', 'componentWillReceiveProps', 'componentWillMount']);

export default function App() {
  // tarefas que nunca vão ser feitas mas tá registrado pra parecer produtivo
  const [tarefas, setTarefas] = useState([
    { id: 1,  nome: 'Pagar o aluguel antes de ser despejado',              emoji: '🏠', categoria: 'Financeiro',    concluida: false },
    { id: 2,  nome: 'Deletar o WhatsApp da outra antes que a nova veja',   emoji: '🗑️', categoria: 'Sobrevivência', concluida: false },
    { id: 3,  nome: 'Renovar CNH',                                         emoji: '🪪', categoria: 'Documentos',    concluida: false },
    { id: 4,  nome: 'Marcar encontro com a vizinha enquanto namorada viaja',emoji: '✈️', categoria: 'Logística',     concluida: false },
    { id: 5,  nome: 'Agendar consulta no dentista',                        emoji: '🦷', categoria: 'Saúde',         concluida: false },
    { id: 6,  nome: 'Criar senha diferente pro segundo celular',           emoji: '📱', categoria: 'Segurança',     concluida: false },
    { id: 7,  nome: 'Entregar TCC antes da banca reprovar na raiva',       emoji: '📄', categoria: 'Faculdade',     concluida: false },
    { id: 8,  nome: 'Ensaiar desculpa pra chegar tarde de novo',           emoji: '🤥', categoria: 'Criatividade',  concluida: false },
    { id: 9,  nome: 'Pagar IPVA',                                          emoji: '🚗', categoria: 'Financeiro',    concluida: false },
    { id: 10, nome: 'Limpar histórico do Maps antes do role suspeito',     emoji: '📍', categoria: 'Higiene',       concluida: false },
    { id: 11, nome: 'Ir ao mercado',                                       emoji: '🛒', categoria: 'Mercado',       concluida: true  },
    { id: 12, nome: 'Convencer a namorada que o perfume é do Uber',        emoji: '🚕', categoria: 'Sobrevivência', concluida: true  },
    { id: 13, nome: 'Renovar seguro de vida (por precaução)',              emoji: '💀', categoria: 'Precaução',     concluida: true  },
    { id: 14, nome: 'Cancelar Netflix que a ex ainda usa',                 emoji: '📺', categoria: 'Financeiro',    concluida: true  },
  ]);

  // true = modo escuro, false = modo claro, igual meu humor na segunda de manhã
  const [temaEscuro, setTemaEscuro] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pickerAberto, setPickerAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [emoji, setEmoji] = useState('😀');
  const [categoria, setCategoria] = useState('');

  // objeto sagrado das cores, não mexa nisso
  const tema = {
    fundo:       temaEscuro ? '#000'     : '#fff',
    texto:       temaEscuro ? '#fff'     : '#000',
    contador:    temaEscuro ? '#888'     : '#666',
    modal:       temaEscuro ? '#1a1a1a' : '#f5f5f5',
    input:       temaEscuro ? '#2a2a2a' : '#e8e8e8',
    divisor:     temaEscuro ? '#222'     : '#ddd',
    riscado:     temaEscuro ? '#888'     : '#aaa',
    placeholder: temaEscuro ? '#666'     : '#999',
    label:       temaEscuro ? '#aaa'     : '#666',
  };

  const styles = getStyles(tema);

  // calendário manual porque o Intl.DateTimeFormat não confia em ninguém
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const hoje = new Date();
  const dataFormatada = hoje.getDate() + ' de ' + meses[hoje.getMonth()] + ', ' + hoje.getFullYear();

  // filter é o único relacionamento estável aqui
  const incompletas = tarefas.filter(t => !t.concluida);
  const realizadas = tarefas.filter(t => t.concluida);

  // alterna entre concluída e não concluída, igual minha motivação ao longo do dia
  function marcarTarefa(id) {
    const novas = tarefas.map(t => {
      if (t.id === id) {
        return { ...t, concluida: !t.concluida };
      }
      return t;
    });
    setTarefas(novas);
  }

  // cria a tarefa e limpa tudo, igual resetar a vida após uma crise existencial
  function adicionarTarefa() {
    if (nome === '') return; // sem nome não vai, igual curricular sem experiência
    const nova = {
      id: Date.now(),
      nome: nome,
      emoji: emoji,
      categoria: categoria || 'Geral',
      concluida: false,
    };
    setTarefas([...tarefas, nova]);
    setNome('');
    setEmoji('😀');
    setCategoria('');
    setPickerAberto(false);
    setModalVisivel(false);
  }

  // fecha o picker após escolher o emoji, que nem amizade que some depois de pegar o favor
  function selecionarEmoji(e) {
    setEmoji(e.emoji || e);
    setPickerAberto(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={temaEscuro ? 'light' : 'dark'} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <View style={styles.topoHeader}>
          <Text style={styles.data}>{dataFormatada}</Text>
          <TouchableOpacity onPress={() => setTemaEscuro(!temaEscuro)}>
            <MaterialIcons
              name={temaEscuro ? 'light-mode' : 'dark-mode'}
              size={24}
              color={tema.texto}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.contador}>{incompletas.length} incompletas, {realizadas.length} realizadas</Text>

        <Text style={styles.tituloSecao}>Incompletas</Text>
        {incompletas.map(t => (
          <View key={t.id} style={styles.tarefa}>
            <Checkbox value={t.concluida} onValueChange={() => marcarTarefa(t.id)} color="#6C63FF" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.tarefaNome}>{t.nome}</Text>
              <Text style={styles.tarefaCategoria}>{t.emoji} {t.categoria}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.tituloSecao}>Realizadas</Text>
        {realizadas.map(t => (
          <View key={t.id} style={styles.tarefa}>
            <Checkbox value={t.concluida} onValueChange={() => marcarTarefa(t.id)} color="#6C63FF" />
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.tarefaNome, { color: tema.riscado, textDecorationLine: 'line-through' }]}>{t.nome}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisivel(true)}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisivel} transparent={true} animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setModalVisivel(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitulo}>Tarefa</Text>

              <TextInput
                style={styles.input}
                placeholder="Nome da tarefa"
                placeholderTextColor={tema.placeholder}
                value={nome}
                onChangeText={setNome}
              />

              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <View style={{ marginRight: 10 }}>
                  <Text style={styles.label}>Emoji</Text>
                  <TouchableOpacity style={styles.botaoEmoji} onPress={() => setPickerAberto(!pickerAberto)}>
                    <Text style={{ fontSize: 22 }}>{emoji}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Categoria</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Mercado"
                    placeholderTextColor={tema.placeholder}
                    value={categoria}
                    onChangeText={setCategoria}
                  />
                </View>
              </View>

              {pickerAberto && (
                <View style={{ height: 250, marginTop: 10 }}>
                  <EmojiPicker onSelect={selecionarEmoji} />
                </View>
              )}

              <TouchableOpacity style={styles.botaoCriar} onPress={adicionarTarefa}>
                <Text style={styles.botaoCriarTexto}>Criar</Text>
              </TouchableOpacity>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// função que recebe o tema e devolve os estilos. basicamente um personal shopper de cores
function getStyles(tema) {
  return StyleSheet.create({
    container:        { flex: 1, backgroundColor: tema.fundo },
    topoHeader:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    data:             { color: tema.texto, fontSize: 28, fontWeight: 'bold' },
    contador:         { color: tema.contador, marginBottom: 20 },
    tituloSecao:      { color: tema.texto, fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
    tarefa:           { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    tarefaNome:       { color: tema.texto, fontSize: 16 },
    tarefaCategoria:  { color: tema.contador, fontSize: 13 },
    fab: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#6C63FF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay:          { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modal:            { backgroundColor: tema.modal, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    modalTitulo:      { color: tema.texto, fontSize: 18, fontWeight: '600', marginBottom: 10 },
    input: {
      backgroundColor: tema.input,
      color: tema.texto,
      borderRadius: 8,
      padding: 10,
      fontSize: 15,
    },
    label:            { color: tema.label, fontSize: 13, marginBottom: 5 },
    botaoEmoji: {
      backgroundColor: tema.input,
      borderRadius: 8,
      width: 60,
      height: 42,
      justifyContent: 'center',
      alignItems: 'center',
    },
    botaoCriar: {
      backgroundColor: '#6C63FF',
      borderRadius: 8,
      padding: 14,
      alignItems: 'center',
      marginTop: 15,
      flexShrink: 0,
    },
    botaoCriarTexto:  { color: '#fff', fontWeight: '600', fontSize: 16 },
  });
}
