import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants';
import MetricCard from '../../components/common/MetricCard';
import TokenRow from '../../components/common/TokenRow';
import { useGetDashboardMetricsQuery, useGetTokensQuery } from '../../store/api/believeScreenerApi';
import { formatCurrency, formatLargeNumber } from '../../utils';
import type { Token, RootStackParamList } from '../../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // API queries
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading, 
    isError: isDashboardError, 
    refetch: refetchDashboard 
  } = useGetDashboardMetricsQuery();

  const { 
    data: tokensData, 
    isLoading: isTokensLoading, 
    isError: isTokensError, 
    refetch: refetchTokens 
  } = useGetTokensQuery({});

  // Use real data if available, fallback to mock data
  const metrics = dashboardData || {
    lifetimeVolume: 3766997438,
    coinLaunches: 40603,
    activeCoins: 174,
    totalMarketCap: 172760000,
    volume24h: 41980000,
    transactions24h: 148410,
    totalLiquidity: 21980000,
    creatorCoinsStats: {
      marketCap: 87410000,
      volume: 11610000,
      transactions: 61250,
      liquidity: 16530000,
    },
    launchCoinStats: {
      marketCap: 85350000,
      volume: 30370000,
      transactions: 87160,
      liquidity: 5460000,
    }
  };

  const tokens = tokensData?.tokens || [];

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return tokens;
    
    const query = searchQuery.toLowerCase();
    return tokens.filter(token => 
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchDashboard(), refetchTokens()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchDashboard, refetchTokens]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleTokenPress = useCallback((token: Token) => {
    navigation.navigate('TokenDetail', { 
      tokenId: token.id,
      tokenAddress: token.address || token.contractAddress 
    });
  }, [navigation]);

  const renderDashboardMetrics = () => (
    <View style={styles.metricsSection}>
      {/* Main Metrics Row */}
      <View style={styles.mainMetricsContainer}>
        <View style={styles.mainMetricRow}>
          <View style={styles.mainMetricItem}>
            <MetricCard
              title="Lifetime Volume"
              value={metrics.lifetimeVolume}
              subtitle="Calculated about 6 hours ago"
              icon="arrow-upward"
              currency={true}
              compact={false}
              loading={isDashboardLoading}
            />
          </View>
        </View>
        
        <View style={styles.twoColumnRow}>
          <View style={styles.halfWidth}>
            <MetricCard
              title="Coin Launches"
              value={metrics.coinLaunches}
              subtitle="@launchcoin"
              icon="launch"
              currency={false}
              compact={true}
              change={2.5}
              changeLabel="today"
              loading={isDashboardLoading}
            />
          </View>
          <View style={styles.halfWidth}>
            <MetricCard
              title="Active Coins"
              value={metrics.activeCoins}
              subtitle="5+ trades in 24h"
              icon="arrow-upward"
              currency={false}
              compact={true}
              change={-1.2}
              changeLabel="24h"
              loading={isDashboardLoading}
            />
          </View>
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.twoColumnRow}>
          <View style={styles.halfWidth}>
            <MetricCard
              title="Total Market Cap"
              value={metrics.totalMarketCap}
              subtitle={`$${(metrics.creatorCoinsStats.marketCap / 1000000).toFixed(1)}M Creator Coins`}
              currency={true}
              compact={true}
              change={5.2}
              loading={isDashboardLoading}
            />
          </View>
          <View style={styles.halfWidth}>
            <MetricCard
              title="24h Volume"
              value={metrics.volume24h}
              subtitle={`$${(metrics.creatorCoinsStats.volume / 1000000).toFixed(1)}M Creator Coins`}
              currency={true}
              compact={true}
              change={-3.1}
              loading={isDashboardLoading}
            />
          </View>
        </View>

        <View style={styles.twoColumnRow}>
          <View style={styles.halfWidth}>
            <MetricCard
              title="24h Transactions"
              value={metrics.transactions24h}
              subtitle={`${(metrics.creatorCoinsStats.transactions / 1000).toFixed(1)}K Creator Coins`}
              currency={false}
              compact={true}
              change={8.7}
              loading={isDashboardLoading}
            />
          </View>
          <View style={styles.halfWidth}>
            <MetricCard
              title="Total Liquidity"
              value={metrics.totalLiquidity}
              subtitle={`$${(metrics.creatorCoinsStats.liquidity / 1000000).toFixed(1)}M Creator Coins`}
              currency={true}
              compact={true}
              change={1.4}
              loading={isDashboardLoading}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Icon name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search tokens..."
        placeholderTextColor={COLORS.textMuted}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
          <Icon name="clear" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderTokenItem = ({ item }: { item: Token }) => (
    <TokenRow
      token={item}
      showRank={true}
      onPress={() => handleTokenPress(item)}
    />
  );

  const renderTokensSection = () => (
    <View style={styles.tokensSection}>
      <View style={styles.tokensSectionHeader}>
        <Text style={styles.sectionTitle}>All Tokens</Text>
        <Text style={styles.resultsText}>
          {filteredTokens.length} token{filteredTokens.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      {renderSearchBar()}
      
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <View style={styles.headerTokenColumn}>
          <Text style={styles.headerText}>Token</Text>
        </View>
        <View style={styles.headerTradeColumn}>
          <Text style={styles.headerText}>Trade/CA</Text>
        </View>
        <View style={styles.headerPriceColumn}>
          <Text style={styles.headerText}>Price</Text>
        </View>
        <View style={styles.headerChangeColumn}>
          <Text style={styles.headerText}>24h Change</Text>
        </View>
      </View>
      
      {isTokensLoading && tokens.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading tokens...</Text>
        </View>
      ) : filteredTokens.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="search-off" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No tokens found' : 'No tokens available'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? 'Try adjusting your search query' : 'Please try again later'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTokens}
          renderItem={renderTokenItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.tokenSeparator} />}
        />
      )}
    </View>
  );

  if (isDashboardError && isTokensError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>Unable to load data</Text>
          <Text style={styles.errorSubtext}>Please check your connection and try again</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Believe Screener</Text>
          <View style={styles.headerSubtitleContainer}>
            <Text style={styles.headerSubtitle}>Dashboard Overview</Text>
            {/* Connection Status */}
            <View style={styles.connectionStatus}>
              <View style={[
                styles.connectionDot, 
                { backgroundColor: (!isDashboardError || !isTokensError) ? COLORS.success : COLORS.error }
              ]} />
              <Text style={styles.connectionStatusText}>
                {(!isDashboardError || !isTokensError) ? 'Connected' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>

        {/* Dashboard Metrics */}
        {renderDashboardMetrics()}

        {/* Tokens Section */}
        {renderTokensSection()}

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  connectionStatusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  metricsSection: {
    marginBottom: SPACING.xl,
  },
  mainMetricsContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  mainMetricRow: {
    marginBottom: SPACING.md,
  },
  mainMetricItem: {
    width: '100%',
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  metricsGrid: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  tokensSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  tokensSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
    fontFamily: FONTS.regular,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  tokenSeparator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    fontFamily: FONTS.regular,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.error,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontFamily: FONTS.regular,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  bottomPadding: {
    height: 100, // Space for bottom tab bar
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTokenColumn: {
    flex: 2,
  },
  headerTradeColumn: {
    flex: 2,
  },
  headerPriceColumn: {
    flex: 1.5,
  },
  headerChangeColumn: {
    flex: 1.2,
  },
  headerText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
});

export default DashboardScreen; 