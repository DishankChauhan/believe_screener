import React, { useState, useMemo, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants';
import TokenRow from '../../components/common/TokenRow';
import { debounce } from '../../utils';
import { useGetTokensQuery, useLazySearchTokensQuery } from '../../store/api/believeScreenerApi';
import type { Token, TokenFilters } from '../../types';

// Mock token data as fallback
const mockTokens: Token[] = [
  {
    id: '1',
    symbol: 'LAUNCHCOIN',
    name: 'Launch Coin on Believe',
    price: 0.08535,
    marketCap: 85350000,
    volume24h: 30370000,
    change30m: -21.6,
    change24h: -4.2,
    liquidity: 5460000,
    trades24h: 87160,
    transactions24h: 87160,
    holders: 12543,
    age: '4d',
    contractAddress: 'ABC123DEF456GHI789JKL',
    address: 'ABC123DEF456GHI789JKL',
    createdAt: Date.now() - (4 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    symbol: 'MEMECOIN',
    name: 'Doge Killer Supreme',
    price: 0.00234,
    marketCap: 2340000,
    volume24h: 1200000,
    change30m: 45.2,
    change24h: 12.8,
    liquidity: 340000,
    trades24h: 5420,
    transactions24h: 5420,
    holders: 1205,
    age: '2h',
    contractAddress: 'DEF456GHI789JKL012MNO',
    address: 'DEF456GHI789JKL012MNO',
    createdAt: Date.now() - (2 * 60 * 60 * 1000),
  },
  {
    id: '3',
    symbol: 'MOONSHOT',
    name: 'To The Moon Token',
    price: 1.234,
    marketCap: 12340000,
    volume24h: 890000,
    change30m: -8.5,
    change24h: 234.5,
    liquidity: 1200000,
    trades24h: 3210,
    transactions24h: 3210,
    holders: 892,
    age: '1d',
    contractAddress: 'GHI789JKL012MNO345PQR',
    address: 'GHI789JKL012MNO345PQR',
    createdAt: Date.now() - (24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    symbol: 'BELIEVE',
    name: 'Believe Protocol',
    price: 45.67,
    marketCap: 45670000,
    volume24h: 2300000,
    change30m: 2.1,
    change24h: -1.5,
    liquidity: 3400000,
    trades24h: 8900,
    transactions24h: 8900,
    holders: 4567,
    age: '1w',
    contractAddress: 'JKL012MNO345PQR678STU',
    address: 'JKL012MNO345PQR678STU',
    createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    symbol: 'DEGEN',
    name: 'Degen Finance',
    price: 0.456,
    marketCap: 4560000,
    volume24h: 670000,
    change30m: -12.3,
    change24h: 8.9,
    liquidity: 890000,
    trades24h: 2100,
    transactions24h: 2100,
    holders: 678,
    age: '3d',
    contractAddress: 'MNO345PQR678STU901VWX',
    address: 'MNO345PQR678STU901VWX',
    createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
  },
];

const SORT_OPTIONS = [
  { key: 'marketCap', label: 'Market Cap', icon: 'arrow-upward' },
  { key: 'volume24h', label: '24h Volume', icon: 'assessment' },
  { key: 'change24h', label: '24h Change', icon: 'show-chart' },
  { key: 'createdAt', label: 'Age', icon: 'schedule' },
];

interface TokenListScreenProps {
  navigation: any;
}

const TokenListScreen: React.FC<TokenListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<keyof Token>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<TextInput>(null);

  // Real API integration
  const filters: TokenFilters = {
    sortBy: sortBy as 'marketCap' | 'volume' | 'change24h' | 'age',
    sortOrder,
    searchQuery: searchQuery.trim() || undefined,
  };

  const { 
    data: tokenData, 
    isLoading, 
    isError, 
    refetch 
  } = useGetTokensQuery(filters);

  const [searchTokens, { 
    data: searchResults, 
    isLoading: isSearching 
  }] = useLazySearchTokensQuery();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length > 2) {
        searchTokens(query.trim());
      }
    }, 300),
    [searchTokens]
  );

  // Use real data if available, fallback to mock data
  const tokens = useMemo(() => {
    if (searchQuery.trim().length > 2 && searchResults) {
      return searchResults;
    }
    if (tokenData?.tokens) {
      return tokenData.tokens;
    }
    return mockTokens;
  }, [tokenData, searchResults, searchQuery]);

  // Use useCallback to prevent re-creating the function on every render
  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.trim().length > 2) {
      debouncedSearch(text);
    }
  }, [debouncedSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    // Keep focus on the input after clearing
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  // Filtered tokens based on search (for fallback mock data)
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim() || tokenData?.tokens || searchResults) {
      return tokens;
    }
    
    const query = searchQuery.toLowerCase();
    return tokens.filter(token => 
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery, tokenData, searchResults]);

  // Local sorting for mock data (real API handles sorting server-side)
  const sortedTokens = useMemo(() => {
    if (tokenData?.tokens || searchResults) {
      return filteredTokens; // API already sorted
    }

    return [...filteredTokens].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'desc' 
          ? bValue.localeCompare(aValue) 
          : aValue.localeCompare(bValue);
      }
      
      return 0;
    });
  }, [filteredTokens, sortBy, sortOrder, tokenData, searchResults]);

  const handleTokenPress = useCallback((token: Token) => {
    // Navigate to token detail with both tokenId and tokenAddress for API calls
    navigation.navigate('TokenDetail', { 
      tokenId: token.id,
      tokenAddress: token.address || token.contractAddress 
    });
  }, [navigation]);

  const handleFavoritePress = useCallback((tokenId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tokenId)) {
        newFavorites.delete(tokenId);
      } else {
        newFavorites.add(tokenId);
      }
      return newFavorites;
    });
  }, []);

  const handleSortPress = useCallback((key: keyof Token) => {
    if (sortBy === key) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  }, [sortBy]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search tokens, symbols, or addresses..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="never"
          blurOnSubmit={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}
          >
            <Icon name="close" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortButton,
                sortBy === option.key && styles.activeSortButton
              ]}
              onPress={() => handleSortPress(option.key as keyof Token)}
            >
              <Icon 
                name={option.icon} 
                size={16} 
                color={sortBy === option.key ? COLORS.background : COLORS.textSecondary}
                style={styles.sortIcon}
              />
              <Text style={[
                styles.sortButtonText,
                sortBy === option.key && styles.activeSortButtonText
              ]}>
                {option.label}
              </Text>
              {sortBy === option.key && (
                <Icon 
                  name={sortOrder === 'desc' ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} 
                  size={16} 
                  color={COLORS.background}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {sortedTokens.length} token{sortedTokens.length !== 1 ? 's' : ''} found
        </Text>
      </View>
    </View>
  ), [searchQuery, sortBy, sortOrder, sortedTokens.length, handleSearch, handleClearSearch, handleSortPress]);

  const renderToken = useCallback(({ item, index }: { item: Token; index: number }) => (
    <TokenRow
      token={item}
      rank={index + 1}
      showRank={true}
      onPress={handleTokenPress}
      onFavoritePress={handleFavoritePress}
      isFavorite={favorites.has(item.id)}
    />
  ), [handleTokenPress, handleFavoritePress, favorites]);

  const renderEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Icon name="search" size={48} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No tokens found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search terms or filters
      </Text>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sortedTokens}
        renderItem={renderToken}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 100, // Space for bottom tab navigation
  },
  headerContainer: {
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  sortContainer: {
    marginBottom: SPACING.sm,
  },
  sortLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeSortButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortIcon: {
    marginRight: 4,
  },
  sortButtonText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  activeSortButtonText: {
    color: COLORS.background,
    fontWeight: '600',
  },
  resultsContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  resultsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

export default TokenListScreen; 