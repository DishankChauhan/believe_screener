import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants';
import { formatCurrency, formatLargeNumber } from '../../utils';
import TokenRow from '../../components/common/TokenRow';
import type { Token, RootStackParamList } from '../../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  // Mock favorite tokens data - in real app, this would come from Redux store
  const [favoriteTokens] = useState<Token[]>([
    {
      id: '1',
      symbol: 'LAUNCHCOIN',
      name: 'Launch Coin on Believe',
      price: 0.08535,
      marketCap: 85350000,
      volume24h: 30052857.14,
      change24h: -4.20,
      change30m: -21.00,
      liquidity: 5000000,
      trades24h: 1234,
      transactions24h: 1234,
      holders: 892,
      age: '4d ago',
      contractAddress: '0x1234...5678',
      address: '0x1234...5678',
      createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
    },
    {
      id: '4',
      symbol: 'BELIEVE',
      name: 'Believe Protocol',
      price: 45.67,
      marketCap: 456700000,
      volume24h: 2300000,
      change24h: -1.50,
      change30m: 2.10,
      liquidity: 8000000,
      trades24h: 567,
      transactions24h: 567,
      holders: 1245,
      age: '2w ago',
      contractAddress: '0x4567...9012',
      address: '0x4567...9012',
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 2 weeks ago
    },
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleTokenPress = useCallback((token: Token) => {
    navigation.navigate('TokenDetail', { tokenId: token.address });
  }, [navigation]);

  const handleFavoritePress = useCallback((tokenId: string) => {
    // In real app, this would update the Redux store
    console.log('Toggle favorite for token:', tokenId);
  }, []);

  const renderToken = ({ item }: { item: Token }) => (
    <TokenRow
      token={item}
      onPress={handleTokenPress}
      onFavoritePress={handleFavoritePress}
      isFavorite={true}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="star-border" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the star icon on any token to add it to your favorites
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Main')}
      >
        <Icon name="search" size={20} color={COLORS.background} />
        <Text style={styles.browseButtonText}>Browse Tokens</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Favorites</Text>
      <Text style={styles.headerSubtitle}>
        {favoriteTokens.length} token{favoriteTokens.length !== 1 ? 's' : ''} saved
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderHeader()}
      
      <FlatList
        data={favoriteTokens}
        renderItem={renderToken}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 }, // Account for bottom tab bar
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl * 2,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  browseButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.background,
    marginLeft: SPACING.sm,
  },
});

export default FavoritesScreen; 