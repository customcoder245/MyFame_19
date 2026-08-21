import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const BASE_URL = 'https://myfame.com/wp-json';

interface FAQ {
  id: number;
  title: string;
  content: string;
}

const Faq = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredFaqs(faqs);
    } else {
      const keyword = search.toLowerCase();
      setFilteredFaqs(
        faqs.filter(
          item =>
            item.title.toLowerCase().includes(keyword) ||
            stripHtml(item.content).toLowerCase().includes(keyword),
        ),
      );
    }
  }, [search, faqs]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${BASE_URL}/support/v1/help-articles`);
      const json = await response.json();

      if (json.status === 200) {
        setFaqs(json.data);
        setFilteredFaqs(json.data);
      } else {
        setError(json.message || 'Failed to load FAQs.');
      }
    } catch (error) {
      console.log(error);
      setError('Failed to load FAQs.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFAQs();
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  const renderItem = ({ item }: { item: FAQ }) => {
    const expanded = expandedId === item.id;

    return (
      <View style={[styles.accordionCard, expanded && styles.accordionCardActive]}>
        <TouchableOpacity
          style={styles.accordionHeader}
          activeOpacity={0.7}
          onPress={() => setExpandedId(expanded ? null : item.id)}
        >
          <Text style={[styles.questionText, expanded && styles.questionTextActive]}>
            {item.title}
          </Text>

          <View style={[styles.toggleCircle, expanded && styles.toggleCircleActive]}>
            <Text style={[styles.toggleSymbol, expanded && styles.toggleSymbolActive]}>
              {expanded ? '−' : '+'}
            </Text>
          </View>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.answerWrapper}>
            <Text style={styles.answerText}>
              {stripHtml(item.content)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" color="#111827" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchFAQs}>
            <Text style={styles.retryBtnText}>RETRY REFRESH</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.mainContainer}>
        
        {/* Editorial Top Header Block */}
        <View style={styles.headerBlock}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>DOCUMENTATION LOGS</Text>
          </View>
          <Text style={styles.screenTitle}>Help Center</Text>
          <Text style={styles.screenSubtitle}>
            Browse platform manuals, find immediate solutions, and review system features.
          </Text>
        </View>

        {/* Clean Integrated Search Bar Container */}
        <View style={styles.searchCardWrapper}>
          <Text style={styles.searchInlineIcon}>🔍</Text>
          <TextInput
            placeholder="Search questions or topics..."
            placeholderTextColor="#A0AEC0"
            value={search}
            onChangeText={setSearch}
            style={styles.searchEntryField}
            clearButtonMode="while-editing"
          />
        </View>

        {/* FAQ Accordion Render Pipeline */}
        <FlatList
          data={filteredFaqs}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listLayout}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#111827" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIndicatorIcon}>📂</Text>
              <Text style={styles.emptyTitleText}>No Articles Matching Query</Text>
              <Text style={styles.emptySubText}>Try using alternative keywords or strings.</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Faq;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  headerBlock: {
    marginBottom: 28,
  },
  statusBadge: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 1,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -1,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 6,
    lineHeight: 22,
  },
  searchCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInlineIcon: {
    fontSize: 15,
    marginRight: 12,
    color: '#A0AEC0',
  },
  searchEntryField: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1A202C',
  },
  listLayout: {
    paddingBottom: 40,
  },
  accordionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 2,
    elevation: 1,
  },
  accordionCardActive: {
    borderColor: '#111827',
  },
  accordionHeader: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    lineHeight: 22,
    paddingRight: 12,
  },
  questionTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleCircleActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  toggleSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginTop: -1,
  },
  toggleSymbolActive: {
    color: '#FFFFFF',
  },
  answerWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    backgroundColor: '#FAFAFA',
  },
  answerText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
  },
  emptyIndicatorIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A5568',
  },
  emptySubText: {
    fontSize: 13,
    color: '#A0AEC0',
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FED7D7',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    color: '#C53030',
    fontWeight: '600',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});