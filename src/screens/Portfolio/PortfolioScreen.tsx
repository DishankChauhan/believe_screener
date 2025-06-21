import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants';
import { formatCurrency, formatLargeNumber } from '../../utils';
import MetricCard from '../../components/common/MetricCard';
import TokenRow from '../../components/common/TokenRow';
import type { Token, Holding, RootStackParamList } from '../../types';

const screenWidth = Dimensions.get('window').width;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const PortfolioScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  // Mock portfolio data
  const portfolioData = {
    totalValue: 127450.89,
    totalCost: 98200.00,
    totalPnL: 29250.89,
    totalPnLPercent: 29.78,
    dayChange: 2847.32,
    dayChangePercent: 2.28,
    holdings: [
      {
        token: {
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
          createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
        },
        position: 125000,
        value: 10668.75,
        weight: 8.37,
      },
      {
        token: {
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
          createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
        },
        position: 850,
        value: 38819.50,
        weight: 30.45,
      },
    ] as Holding[],
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleTokenPress = useCallback((token: Token) => {
    navigation.navigate('TokenDetail', { tokenId: token.id });
  }, [navigation]);

  const handleFavoritePress = useCallback((tokenId: string) => {
    console.log('Toggle favorite for token:', tokenId);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color={COLORS.background} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Portfolio Overview */}
        <View style={styles.overviewSection}>
          <View style={styles.totalValueContainer}>
            <Text style={styles.totalValueLabel}>Total Portfolio Value</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(portfolioData.totalValue, 'USD')}
            </Text>
            <View style={styles.dayChangeContainer}>
              <Icon
                name={portfolioData.dayChange >= 0 ? 'arrow-upward' : 'arrow-downward'}
                size={16}
                color={portfolioData.dayChange >= 0 ? COLORS.success : COLORS.error}
              />
              <Text style={[
                styles.dayChangeText,
                { color: portfolioData.dayChange >= 0 ? COLORS.success : COLORS.error }
              ]}>
                {portfolioData.dayChange >= 0 ? '+' : ''}{formatCurrency(portfolioData.dayChange, 'USD')} 
                ({portfolioData.dayChangePercent >= 0 ? '+' : ''}{portfolioData.dayChangePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total P&L"
              value={formatCurrency(portfolioData.totalPnL, 'USD')}
              subtitle={`${portfolioData.totalPnLPercent >= 0 ? '+' : ''}${portfolioData.totalPnLPercent.toFixed(2)}%`}
              change={portfolioData.totalPnLPercent}
              compact
            />
            <MetricCard
              title="Total Cost"
              value={formatCurrency(portfolioData.totalCost, 'USD')}
              subtitle="Avg. buy price"
              compact
            />
          </View>
        </View>

        {/* Holdings */}
        <View style={styles.holdingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Holdings</Text>
            <TouchableOpacity style={styles.sortButton}>
              <Icon name="sort" size={20} color={COLORS.textMuted} />
              <Text style={styles.sortText}>Value</Text>
            </TouchableOpacity>
          </View>
          {portfolioData.holdings.map((holding) => (
            <View key={holding.token.id} style={styles.holdingContainer}>
              <TokenRow
                token={holding.token}
                onPress={handleTokenPress}
                onFavoritePress={handleFavoritePress}
                isFavorite={false}
                compact
              />
              <View style={styles.holdingDetails}>
                <View style={styles.holdingRow}>
                  <Text style={styles.holdingLabel}>Position:</Text>
                  <Text style={styles.holdingValue}>
                    {formatLargeNumber(holding.position)} {holding.token.symbol}
                  </Text>
                </View>
                <View style={styles.holdingRow}>
                  <Text style={styles.holdingLabel}>Value:</Text>
                  <Text style={styles.holdingValue}>
                    {formatCurrency(holding.value, 'USD')}
                  </Text>
                </View>
                <View style={styles.holdingRow}>
                  <Text style={styles.holdingLabel}>Weight:</Text>
                  <Text style={styles.holdingValue}>{holding.weight.toFixed(2)}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  overviewSection: {
    padding: SPACING.md,
  },
  totalValueContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  totalValueLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  totalValue: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  dayChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayChangeText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  holdingsSection: {
    paddingHorizontal: SPACING.md,
  },
  sectionHeader: {
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
  holdingContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  holdingDetails: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  holdingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  holdingLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  holdingValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
});

export default PortfolioScreen; 