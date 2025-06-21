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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, TIMEFRAMES } from '../../constants';
import { formatCurrency, formatLargeNumber, formatPercentage, getChangeColor, formatTimeAgo } from '../../utils';
import MetricCard from '../../components/common/MetricCard';
import PriceChart from '../../components/common/PriceChart';
import type { Token, TokenPerformance, TradingActivity, TopHolder } from '../../types';

const { width: screenWidth } = Dimensions.get('window');

interface TokenDetailScreenProps {
  route: {
    params: {
      tokenId: string;
    };
  };
  navigation: any;
}

const TokenDetailScreen: React.FC<TokenDetailScreenProps> = ({ route, navigation }) => {
  const { tokenId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock token data - in real app, this would come from API
  const tokenData: Token = {
    id: tokenId,
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
  };

  const performanceData: TokenPerformance = {
    currentPrice: tokenData.price,
    open: 0.1065,
    high: 0.1124,
    low: 0.0821,
    close: tokenData.price,
    volume: tokenData.volume24h,
    chartData: [
      { timestamp: Date.now() - 24 * 60 * 60 * 1000, price: 0.1065, volume: 25000000 },
      { timestamp: Date.now() - 20 * 60 * 60 * 1000, price: 0.1124, volume: 28000000 },
      { timestamp: Date.now() - 16 * 60 * 60 * 1000, price: 0.1089, volume: 32000000 },
      { timestamp: Date.now() - 12 * 60 * 60 * 1000, price: 0.0956, volume: 35000000 },
      { timestamp: Date.now() - 8 * 60 * 60 * 1000, price: 0.0889, volume: 31000000 },
      { timestamp: Date.now() - 4 * 60 * 60 * 1000, price: 0.0821, volume: 29000000 },
      { timestamp: Date.now(), price: 0.08535, volume: 30370000 },
    ],
    momentum: {
      '30m': -21.6,
      '1h': -18.4,
      '6h': -12.8,
      '24h': -4.2,
    },
  };

  const tradingActivity: TradingActivity = {
    totalTrades: 87160,
    uniqueWallets: 8542,
    buyVolume: 18500000,
    sellVolume: 11870000,
    buyTrades: 52896,
    sellTrades: 34264,
  };

  const topHolders: TopHolder[] = [
    { address: 'ABC123...789JKL', percentage: 12.5, amount: 146875000, value: 12534375, isLargest: true },
    { address: 'DEF456...012MNO', percentage: 8.3, amount: 97475000, value: 8318063 },
    { address: 'GHI789...345PQR', percentage: 6.1, amount: 71637500, value: 6115281 },
    { address: 'JKL012...678STU', percentage: 4.8, amount: 56400000, value: 4815240 },
    { address: 'MNO345...901VWX', percentage: 3.9, amount: 45825000, value: 3912094 },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
  };

  const handleTimeframePress = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const handleTradePress = () => {
    // Navigate to trading interface
    console.log('Trade pressed for:', tokenData.symbol);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
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
        <Text style={styles.tokenSymbol}>{tokenData.symbol}</Text>
        <Text style={styles.tokenName}>{tokenData.name}</Text>
        <Text style={styles.tokenAge}>Created {tokenData.age} ago</Text>
      </View>

      <View style={styles.priceSection}>
        <Text style={styles.currentPrice}>
          {formatCurrency(tokenData.price, 'USD', false)}
        </Text>
        <View style={styles.priceChange}>
          <Icon
            name={tokenData.change24h > 0 ? 'trending-up' : 'trending-down'}
            size={20}
            color={getChangeColor(tokenData.change24h, COLORS)}
          />
          <Text style={[styles.changeText, { color: getChangeColor(tokenData.change24h, COLORS) }]}>
            {formatPercentage(Math.abs(tokenData.change24h))} (24h)
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
              value={tokenData.marketCap}
              currency={true}
              compact={true}
              icon="trending-up"
            />
          </View>
          <View style={styles.statItem}>
            <MetricCard
              title="24h Volume"
              value={tokenData.volume24h}
              currency={true}
              compact={true}
              icon="bar-chart"
            />
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MetricCard
              title="Liquidity"
              value={tokenData.liquidity}
              currency={true}
              compact={true}
              icon="water-drop"
            />
          </View>
          <View style={styles.statItem}>
            <MetricCard
              title="Holders"
              value={tokenData.holders}
              currency={false}
              compact={true}
              icon="people"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderTradingActivity = () => (
    <View style={styles.tradingSection}>
      <Text style={styles.sectionTitle}>Trading Activity</Text>
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
          <View key={holder.address} style={styles.holderRow}>
            <View style={styles.holderRank}>
              <Text style={styles.holderRankText}>{index + 1}</Text>
            </View>
            <View style={styles.holderInfo}>
              <Text style={styles.holderAddress}>{holder.address}</Text>
              <Text style={styles.holderAmount}>
                {formatLargeNumber(holder.amount)} {tokenData.symbol}
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
        <Text style={styles.tradeButtonText}>Trade {tokenData.symbol}</Text>
        <Icon name="arrow-forward" size={20} color={COLORS.background} />
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
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {renderHeader()}
        {renderChart()}
        {renderStats()}
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
});

export default TokenDetailScreen; 