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

LogBox.ignoreLogs(['EmojiPicker', 'componentWillReceiveProps', 'componentWillMount']);

export default function App() {
  const [tarefas, setTarefas] = useState([
    { id: 1, nome: 'Comprar BTC na baixa', emoji: '💰', categoria: 'Financeiro', concluida: false },
    { id: 2, nome: 'Levar a morena no cinema', emoji: '💜', categoria: 'Relacionamento', concluida: false },
    { id: 3, nome: 'Comprar detergente', emoji: '🛒', categoria: 'Mercado', concluida: false },
    { id: 4, nome: 'Preparar aula de mobile', emoji: '📚', categoria: 'Trabalho', concluida: true },
    { id: 5, nome: 'Criar protótipo figma', emoji: '🎨', categoria: 'Trabalho', concluida: true },
  ]);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [pickerAberto, setPickerAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [emoji, setEmoji] = useState('😀');
  const [categoria, setCategoria] = useState('');

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const hoje = new Date();
  const dataFormatada = hoje.getDate() + ' de ' + meses[hoje.getMonth()] + ', ' + hoje.getFullYear();

  const incompletas = tarefas.filter(t => !t.concluida);
  const realizadas = tarefas.filter(t => t.concluida);

  function marcarTarefa(id) {
    const novas = tarefas.map(t => {
      if (t.id === id) {
        return { ...t, concluida: !t.concluida };
      }
      return t;
    });
    setTarefas(novas);
  }

  function adicionarTarefa() {
    if (nome === '') return;
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

  function selecionarEmoji(e) {
    setEmoji(e.emoji || e);
    setPickerAberto(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={styles.data}>{dataFormatada}</Text>
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
              <Text style={[styles.tarefaNome, { color: '#666', textDecorationLine: 'line-through' }]}>{t.nome}</Text>
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
                placeholderTextColor="#666"
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
                    placeholderTextColor="#666"
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  data: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  contador: { color: '#888', marginBottom: 20 },
  tituloSecao: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  tarefa: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  tarefaNome: { color: '#fff', fontSize: 16 },
  tarefaCategoria: { color: '#888', fontSize: 13 },
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
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#1a1a1a', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitulo: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 10 },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
  },
  label: { color: '#aaa', fontSize: 13, marginBottom: 5 },
  botaoEmoji: {
    backgroundColor: '#2a2a2a',
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
  botaoCriarTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
