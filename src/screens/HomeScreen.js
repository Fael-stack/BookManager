import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';

const emptyBook = { id: null, titulo: '', autor: '', ano: '', status: 'não lido' };

// Note que a função agora recebe as props do App.js
export default function HomeScreen({ books, removeBook, clearAllBooks, toggleBookStatus, addBook, editBook }) {
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(emptyBook);
  const [isEditing, setIsEditing] = useState(false);

  // O useEffect que carregava e salvava os dados foi movido para o App.js

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(b =>
      b.titulo.toLowerCase().includes(q) ||
      b.autor.toLowerCase().includes(q) ||
      String(b.ano).includes(q) ||
      b.status.toLowerCase().includes(q)
    );
  }, [books, query]);

  const openCreate = () => {
    setIsEditing(false);
    setForm(emptyBook);
    setModalVisible(true);
  };

  const openEdit = (book) => {
    setIsEditing(true);
    setForm(book);
    setModalVisible(true);
  };

  const saveForm = () => {
    if (!form.titulo.trim() || !form.autor.trim() || !String(form.ano).trim()) {
      Alert.alert('Atenção', 'Preencha título, autor e ano.');
      return;
    }
    if (!/^[0-9]{1,4}$/.test(String(form.ano))) {
      Alert.alert('Atenção', 'Ano inválido.');
      return;
    }
    
    if (isEditing) {
        editBook(form);
    } else {
        addBook(form);
    }

    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.status === 'lido' && styles.cardRead]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.meta}>Autor: {item.autor}</Text>
        <Text style={styles.meta}>Ano: {item.ano}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.smallBtn} onPress={() => toggleBookStatus(item.id)}>
          <Text style={styles.smallBtnText}>{item.status === 'lido' ? 'Marcar não lido' : 'Marcar lido'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallBtnOutline} onPress={() => openEdit(item)}>
          <Text style={styles.smallBtnOutlineText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallBtnDanger} onPress={() => removeBook(item.id)}>
          <Text style={styles.smallBtnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7fb' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Buscar por título, autor, ano ou status…"
              value={query}
              onChangeText={setQuery}
              style={styles.input}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.clearAll} onPress={clearAllBooks}>
              <Text style={styles.clearAllText}>Limpar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.empty}>Nenhum livro cadastrado ainda.</Text>
            }
            contentContainerStyle={{ paddingBottom: 120 }}
          />

          <TouchableOpacity style={styles.fab} onPress={openCreate}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{isEditing ? 'Editar Livro' : 'Novo Livro'}</Text>

              <TextInput
                placeholder="Título"
                value={form.titulo}
                onChangeText={(v) => setForm(s => ({ ...s, titulo: v }))}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Autor"
                value={form.autor}
                onChangeText={(v) => setForm(s => ({ ...s, autor: v }))}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Ano de publicação"
                keyboardType="number-pad"
                value={form.ano ? String(form.ano) : ''}
                onChangeText={(v) => setForm(s => ({ ...s, ano: v.replace(/[^0-9]/g, '') }))}
                style={styles.modalInput}
                maxLength={4}
              />
              <View style={styles.statusRow}>
                <TouchableOpacity
                  style={[styles.statusPill, form.status === 'lido' && styles.statusPillActive]}
                  onPress={() => setForm(s => ({ ...s, status: 'lido' }))}
                >
                  <Text style={[styles.statusPillText, form.status === 'lido' && styles.statusPillTextActive]}>LIDO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.statusPill, form.status === 'não lido' && styles.statusPillActive]}
                  onPress={() => setForm(s => ({ ...s, status: 'não lido' }))}
                >
                  <Text style={[styles.statusPillText, form.status === 'não lido' && styles.statusPillTextActive]}>NÃO LIDO</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveForm}>
                  <Text style={styles.saveBtnText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { fontSize: 24, fontWeight: '800', color: '#2d3436', marginBottom: 12 },
    searchBox: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 8 },
    input: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#dfe6e9' },
    clearAll: { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#ffeaa7', borderRadius: 10 },
    clearAllText: { color: '#6c5ce7', fontWeight: '700' },
    empty: { textAlign: 'center', color: '#636e72', marginTop: 32 },
    card: { backgroundColor: '#fff', borderRadius: 14, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: '#ecf0f1' },
    cardRead: { opacity: 0.85 },
    title: { fontSize: 18, fontWeight: '800', color: '#2d3436' },
    meta: { color: '#636e72', marginTop: 2 },
    badge: { alignSelf: 'flex-start', backgroundColor: '#dfe6e9', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, marginTop: 8 },
    badgeText: { fontSize: 12, fontWeight: '800', color: '#2d3436' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
    smallBtn: { backgroundColor: '#00b894', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
    smallBtnDanger: { backgroundColor: '#d63031', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
    smallBtnOutline: { borderColor: '#0984e3', borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
    smallBtnText: { color: '#fff', fontWeight: '700' },
    smallBtnOutlineText: { color: '#0984e3', fontWeight: '700' },
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#0984e3',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
    },
    fabText: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: -2 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', padding: 16 },
    modalCard: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 16 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: '#2d3436', marginBottom: 12 },
    modalInput: { backgroundColor: '#f9fbfd', borderWidth: 1, borderColor: '#ecf0f1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginTop: 10 },
    statusRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
    statusPill: { borderWidth: 1, borderColor: '#dfe6e9', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
    statusPillActive: { backgroundColor: '#e3f2fd', borderColor: '#0984e3' },
    statusPillText: { fontWeight: '800', color: '#2d3436' },
    statusPillTextActive: { color: '#0984e3' },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 },
    cancelBtn: { paddingVertical: 10, paddingHorizontal: 14 },
    cancelBtnText: { color: '#636e72', fontWeight: '700' },
    saveBtn: { backgroundColor: '#0984e3', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
    saveBtnText: { color: '#fff', fontWeight: '800' },
});