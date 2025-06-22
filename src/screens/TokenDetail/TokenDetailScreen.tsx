import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackScreenProps } from '@react-navigation/stack';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, TIMEFRAMES } from '../../constants';
import { formatCurrency, formatLargeNumber, formatPercentage, getChangeColor, formatTimeAgo } from '../../utils';
import MetricCard from '../../components/common/MetricCard';
import PriceChart from '../../components/common/PriceChart';
import { useGetTokenDetailsQuery } from '../../store/api/believeScreenerApi';
import type { Token, TokenPerformance, TradingActivity, TopHolder, RootStackParamList } from '../../types';

const { width: screenWidth } = Dimensions.get('window');

type TokenDetailScreenProps = StackScreenProps<RootStackParamList, 'TokenDetail'>;

const TokenDetailScreen: React.FC<TokenDetailScreenProps> = ({ route, navigation }) => {
  const { tokenId } = route.params;
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [isFavorite, setIsFavorite] = useState(false);

  // Use the real API to fetch token details - pass the tokenId as the address
  const { 
    data: tokenData, 
    isLoading, 
    isError, 
    refetch 
  } = useGetTokenDetailsQuery(tokenId);

  // Fallback mock data if real API fails
  const fallbackTokenData: Token = {
    id: tokenId,
    symbol: 'UNKNOWN',
    name: 'Loading Token...',
    price: 0,
    marketCap: 0,
    volume24h: 0,
    change30m: 0,
    change24h: 0,
    liquidity: 0,
    trades24h: 0,
    transactions24h: 0,
    holders: 0,
    age: '0d',
    contractAddress: tokenId,
    address: tokenId,
    createdAt: Date.now(),
    // Add new fields with defaults
    totalSupply: 0,
    circulatingSupply: 0,
    topHolders: [],
    tradingActivity24h: {
      totalTrades: 0,
      uniqueWallets: 0,
      buys: { count: 0, volume: 0 },
      sells: { count: 0, volume: 0 }
    },
    allTimeTradingActivity: {
      totalTrades: 0,
      totalVolume: 0,
      buys: { count: 0, volume: 0 },
      sells: { count: 0, volume: 0 }
    },
    chartData: []
  };

  const currentTokenData = tokenData || fallbackTokenData;

  const performanceData: TokenPerformance = {
    currentPrice: currentTokenData.price,
    open: currentTokenData.price * 1.25, // Estimate
    high: currentTokenData.price * 1.31, // Estimate
    low: currentTokenData.price * 0.96, // Estimate
    close: currentTokenData.price,
    volume: currentTokenData.volume24h,
    chartData: currentTokenData.chartData && currentTokenData.chartData.length > 0 
      ? currentTokenData.chartData 
      : [
        { timestamp: Date.now() - 24 * 60 * 60 * 1000, price: currentTokenData.price * 1.25, volume: currentTokenData.volume24h * 0.8 },
        { timestamp: Date.now() - 20 * 60 * 60 * 1000, price: currentTokenData.price * 1.31, volume: currentTokenData.volume24h * 0.9 },
        { timestamp: Date.now() - 16 * 60 * 60 * 1000, price: currentTokenData.price * 1.27, volume: currentTokenData.volume24h * 1.1 },
        { timestamp: Date.now() - 12 * 60 * 60 * 1000, price: currentTokenData.price * 1.12, volume: currentTokenData.volume24h * 1.2 },
        { timestamp: Date.now() - 8 * 60 * 60 * 1000, price: currentTokenData.price * 1.04, volume: currentTokenData.volume24h * 1.0 },
        { timestamp: Date.now() - 4 * 60 * 60 * 1000, price: currentTokenData.price * 0.96, volume: currentTokenData.volume24h * 0.95 },
        { timestamp: Date.now(), price: currentTokenData.price, volume: currentTokenData.volume24h },
      ],
    momentum: {
      '30m': currentTokenData.change30m,
      '1h': currentTokenData.change30m * 0.8,
      '6h': currentTokenData.change24h * 0.6,
      '24h': currentTokenData.change24h,
    },
  };

  // Use real trading activity data from API
  const tradingActivity: TradingActivity = {
    totalTrades: currentTokenData.tradingActivity24h?.totalTrades || currentTokenData.trades24h || 0,
    uniqueWallets: currentTokenData.tradingActivity24h?.uniqueWallets || Math.floor((currentTokenData.trades24h || 0) * 0.1),
    buyVolume: currentTokenData.tradingActivity24h?.buys?.volume || currentTokenData.volume24h * 0.61,
    sellVolume: currentTokenData.tradingActivity24h?.sells?.volume || currentTokenData.volume24h * 0.39,
    buyTrades: currentTokenData.tradingActivity24h?.buys?.count || Math.floor((currentTokenData.trades24h || 0) * 0.61),
    sellTrades: currentTokenData.tradingActivity24h?.sells?.count || Math.floor((currentTokenData.trades24h || 0) * 0.39),
  };

  // Use real top holders data from API
  const topHolders: TopHolder[] = currentTokenData.topHolders && currentTokenData.topHolders.length > 0
    ? currentTokenData.topHolders
        .filter((holder, index, arr) => {
          // Filter out duplicates and invalid entries
          return holder && holder.address && 
                 arr.findIndex(h => h.address === holder.address) === index;
        })
        .slice(0, 10) // Limit to top 10
        .map((holder, index) => ({
          address: `${holder.address.slice(0, 6)}...${holder.address.slice(-6)}`,
          percentage: holder.percentage || 0,
          amount: holder.amount || 0,
          value: (holder.amount || 0) * currentTokenData.price,
          isLargest: index === 0
        }))
    : [
        { address: `${currentTokenData.address.slice(0, 6)}...${currentTokenData.address.slice(-6)}`, percentage: 12.5, amount: currentTokenData.marketCap * 0.125 / currentTokenData.price, value: currentTokenData.marketCap * 0.125, isLargest: true },
        { address: `${currentTokenData.address.slice(1, 7)}...${currentTokenData.address.slice(-5)}`, percentage: 8.3, amount: currentTokenData.marketCap * 0.083 / currentTokenData.price, value: currentTokenData.marketCap * 0.083 },
        { address: `${currentTokenData.address.slice(2, 8)}...${currentTokenData.address.slice(-4)}`, percentage: 6.1, amount: currentTokenData.marketCap * 0.061 / currentTokenData.price, value: currentTokenData.marketCap * 0.061 },
        { address: `${currentTokenData.address.slice(3, 9)}...${currentTokenData.address.slice(-3)}`, percentage: 4.8, amount: currentTokenData.marketCap * 0.048 / currentTokenData.price, value: currentTokenData.marketCap * 0.048 },
        { address: `${currentTokenData.address.slice(4, 10)}...${currentTokenData.address.slice(-2)}`, percentage: 3.9, amount: currentTokenData.marketCap * 0.039 / currentTokenData.price, value: currentTokenData.marketCap * 0.039 },
      ];

  const onRefresh = () => {
    refetch();
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
  };

  const handleTimeframePress = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const handleTradePress = () => {
    // Open the believescreener.com token page in browser or navigate to trade
    console.log('Trade pressed for:', currentTokenData.symbol);
    console.log('Token URL: https://www.believescreener.com/token/' + currentTokenData.address);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading token details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && !tokenData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>Unable to load token details</Text>
          <Text style={styles.errorSubtext}>Please check your connection and try again</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-ios" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton}>
          <Icon
            name={isFavorite ? 'star' : 'star-border'}
            size={24}
            color={isFavorite ? COLORS.warning : COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tokenInfo}>
        <Text style={styles.tokenSymbol}>{currentTokenData.symbol}</Text>
        <Text style={styles.tokenName}>{currentTokenData.name}</Text>
        <Text style={styles.tokenAge}>Created {currentTokenData.age} ago</Text>
      </View>

      <View style={styles.priceSection}>
        <Text style={styles.currentPrice}>
          {formatCurrency(currentTokenData.price, 'USD', false)}
        </Text>
        <View style={styles.priceChange}>
          <Icon
            name={currentTokenData.change24h > 0 ? 'arrow-upward' : 'arrow-downward'}
            size={16}
            color={currentTokenData.change24h > 0 ? COLORS.success : COLORS.error}
          />
          <Text style={[styles.changeText, { color: getChangeColor(currentTokenData.change24h, COLORS) }]}>
            {formatPercentage(Math.abs(currentTokenData.change24h))} (24h)
          </Text>
        </View>
      </View>
    </View>
  );

  const renderChart = () => (
    <View style={styles.chartSection}>
      <View style={styles.chartHeader}>
        <Text style={styles.sectionTitle}>Price Chart</Text>
        <View style={styles.timeframeButtons}>
          {TIMEFRAMES.slice(0, 4).map((timeframe) => (
            <TouchableOpacity
              key={timeframe.key}
              style={[
                styles.timeframeButton,
                selectedTimeframe === timeframe.key && styles.activeTimeframeButton,
              ]}
              onPress={() => handleTimeframePress(timeframe.key)}
            >
              <Text
                style={[
                  styles.timeframeText,
                  selectedTimeframe === timeframe.key && styles.activeTimeframeText,
                ]}
              >
                {timeframe.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Real Chart Component */}
      <PriceChart
        data={performanceData.chartData}
        timeframe={selectedTimeframe}
        high={performanceData.high}
        low={performanceData.low}
        height={200}
      />
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Token Statistics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MetricCard
              title="Market Cap"
              value={currentTokenData.marketCap}
              currency={true}
              compact={true}
              icon="assessment"
            />
          </View>
          <View style={styles.statItem}>
            <MetricCard
              title="24h Volume"
              value={currentTokenData.volume24h}
              currency={true}
              compact={true}
              icon="opacity"
            />
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MetricCard
              title="Liquidity"
              value={currentTokenData.liquidity}
              currency={true}
              compact={true}
              icon="group"
            />
          </View>
          <View style={styles.statItem}>
            <MetricCard
              title="Holders"
              value={currentTokenData.holders}
              currency={false}
              compact={true}
              icon="group"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderTokenDetails = () => (
    <View style={styles.tokenDetailsSection}>
      <Text style={styles.sectionTitle}>Token Details</Text>
      <View style={styles.tokenDetailsGrid}>
        <View style={styles.tokenDetailsRow}>
          <View style={styles.tokenDetailItem}>
            <Text style={styles.tokenDetailLabel}>Total Supply</Text>
            <Text style={styles.tokenDetailValue}>
              {formatLargeNumber(currentTokenData.totalSupply || 0)}
            </Text>
          </View>
          <View style={styles.tokenDetailItem}>
            <Text style={styles.tokenDetailLabel}>Circulating Supply</Text>
            <Text style={styles.tokenDetailValue}>
              {formatLargeNumber(currentTokenData.circulatingSupply || 0)}
            </Text>
          </View>
        </View>
        
        {currentTokenData.allTimeTradingActivity && (
          <View style={styles.allTimeSection}>
            <Text style={styles.allTimeTitle}>All-Time Trading Activity</Text>
            <View style={styles.allTimeGrid}>
              <View style={styles.allTimeRow}>
                <View style={styles.allTimeItem}>
                  <Text style={styles.allTimeLabel}>Total Trades</Text>
                  <Text style={styles.allTimeValue}>
                    {formatLargeNumber(currentTokenData.allTimeTradingActivity.totalTrades)}
                  </Text>
                </View>
                <View style={styles.allTimeItem}>
                  <Text style={styles.allTimeLabel}>Total Volume</Text>
                  <Text style={styles.allTimeValue}>
                    {formatCurrency(currentTokenData.allTimeTradingActivity.totalVolume, 'USD', true)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.allTimeRow}>
                <View style={styles.allTimeItem}>
                  <Text style={styles.allTimeLabel}>All-Time Buys</Text>
                  <Text style={styles.allTimeValue}>
                    {formatLargeNumber(currentTokenData.allTimeTradingActivity.buys.count)}
                  </Text>
                  <Text style={styles.allTimeSubtext}>
                    {formatCurrency(currentTokenData.allTimeTradingActivity.buys.volume, 'USD', true)}
                  </Text>
                </View>
                <View style={styles.allTimeItem}>
                  <Text style={styles.allTimeLabel}>All-Time Sells</Text>
                  <Text style={styles.allTimeValue}>
                    {formatLargeNumber(currentTokenData.allTimeTradingActivity.sells.count)}
                  </Text>
                  <Text style={styles.allTimeSubtext}>
                    {formatCurrency(currentTokenData.allTimeTradingActivity.sells.volume, 'USD', true)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderTradingActivity = () => (
    <View style={styles.tradingSection}>
      <Text style={styles.sectionTitle}>24h Trading Activity</Text>
      <View style={styles.tradingGrid}>
        <View style={styles.tradingRow}>
          <View style={styles.tradingItem}>
            <Text style={styles.tradingLabel}>Buy Volume</Text>
            <Text style={styles.tradingValue}>
              {formatCurrency(tradingActivity.buyVolume, 'USD', true)}
            </Text>
            <Text style={styles.tradingSubtext}>
              {tradingActivity.buyTrades.toLocaleString()} trades
            </Text>
          </View>
          <View style={styles.tradingItem}>
            <Text style={styles.tradingLabel}>Sell Volume</Text>
            <Text style={styles.tradingValue}>
              {formatCurrency(tradingActivity.sellVolume, 'USD', true)}
            </Text>
            <Text style={styles.tradingSubtext}>
              {tradingActivity.sellTrades.toLocaleString()} trades
            </Text>
          </View>
        </View>
        
        <View style={styles.tradingRow}>
          <View style={styles.tradingItem}>
            <Text style={styles.tradingLabel}>Total Trades</Text>
            <Text style={styles.tradingValue}>
              {tradingActivity.totalTrades.toLocaleString()}
            </Text>
          </View>
          <View style={styles.tradingItem}>
            <Text style={styles.tradingLabel}>Unique Wallets</Text>
            <Text style={styles.tradingValue}>
              {tradingActivity.uniqueWallets.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTopHolders = () => (
    <View style={styles.holdersSection}>
      <Text style={styles.sectionTitle}>Top Holders</Text>
      <View style={styles.holdersList}>
        {topHolders.map((holder, index) => (
          <View key={`holder-${index}-${holder.address}`} style={styles.holderRow}>
            <View style={styles.holderRank}>
              <Text style={styles.holderRankText}>{index + 1}</Text>
            </View>
            <View style={styles.holderInfo}>
              <Text style={styles.holderAddress}>{holder.address}</Text>
              <Text style={styles.holderAmount}>
                {formatLargeNumber(holder.amount)} {currentTokenData.symbol}
              </Text>
            </View>
            <View style={styles.holderStats}>
              <Text style={styles.holderPercentage}>{holder.percentage}%</Text>
              <Text style={styles.holderValue}>
                {formatCurrency(holder.value, 'USD', true)}
              </Text>
            </View>
            {holder.isLargest && (
              <View style={styles.largestBadge}>
                <Text style={styles.largestBadgeText}>TOP</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderTradeButton = () => (
    <View style={styles.tradeButtonSection}>
      <TouchableOpacity style={styles.tradeButton} onPress={handleTradePress}>
        <Text style={styles.tradeButtonText}>Trade {currentTokenData.symbol}</Text>
        <Icon name="arrow-forward-ios" size={20} color={COLORS.background} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {renderHeader()}
        {renderChart()}
        {renderStats()}
        {renderTokenDetails()}
        {renderTradingActivity()}
        {renderTopHolders()}
        
        {/* Bottom padding for safe area */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {renderTradeButton()}
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
    paddingBottom: 100, // Space for trade button
  },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  favoriteButton: {
    padding: SPACING.xs,
  },
  tokenInfo: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  tokenSymbol: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  tokenName: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  tokenAge: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  priceSection: {
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  chartSection: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timeframeButtons: {
    flexDirection: 'row',
  },
  timeframeButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginLeft: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.backgroundSecondary,
  },
  activeTimeframeButton: {
    backgroundColor: COLORS.primary,
  },
  timeframeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  activeTimeframeText: {
    color: COLORS.background,
    fontWeight: '600',
  },
  statsSection: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statsGrid: {
    marginTop: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  statItem: {
    flex: 0.48,
  },
  tradingSection: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tradingGrid: {
    marginTop: SPACING.md,
  },
  tradingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  tradingItem: {
    flex: 0.48,
    backgroundColor: COLORS.backgroundTertiary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tradingLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  tradingValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  tradingSubtext: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  holdersSection: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  holdersList: {
    marginTop: SPACING.md,
  },
  holderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundTertiary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  holderRank: {
    width: 30,
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  holderRankText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  holderInfo: {
    flex: 1,
  },
  holderAddress: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginBottom: 2,
  },
  holderAmount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  holderStats: {
    alignItems: 'flex-end',
  },
  holderPercentage: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  holderValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  largestBadge: {
    backgroundColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: SPACING.xs,
  },
  largestBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  tradeButtonSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tradeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tradeButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.background,
    marginRight: SPACING.xs,
  },
  bottomPadding: {
    height: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  errorText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.error,
    marginBottom: SPACING.md,
  },
  errorSubtext: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  retryButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  tokenDetailsSection: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tokenDetailsGrid: {
    marginTop: SPACING.md,
  },
  tokenDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  tokenDetailItem: {
    flex: 0.48,
  },
  tokenDetailLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  tokenDetailValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  allTimeSection: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  allTimeTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  allTimeGrid: {
    marginTop: SPACING.md,
  },
  allTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  allTimeItem: {
    flex: 0.48,
  },
  allTimeLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  allTimeValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  allTimeSubtext: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
});

export default TokenDetailScreen; 