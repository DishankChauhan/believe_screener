import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  SafeAreaView 
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants';
import MetricCard from '../../components/common/MetricCard';

const DashboardScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  // Mock data based on Believe Screener website
  const dashboardData = {
    lifetimeVolume: 3766997438,
    coinLaunches: 40603,
    activeCoins: 174,
    totalMarketCap: 172760000,
    volume24h: 41980000,
    transactions24h: 148410,
    totalLiquidity: 21980000,
    creatorCoins: {
      marketCap: 87410000,
      volume: 11610000,
      transactions: 61250,
      liquidity: 16530000,
    },
    launchCoin: {
      marketCap: 85350000,
      volume: 30370000,
      transactions: 87160,
      liquidity: 5460000,
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

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
          <Text style={styles.headerSubtitle}>Dashboard Overview</Text>
        </View>

        {/* Main Metrics Row */}
        <View style={styles.mainMetricsContainer}>
          <View style={styles.mainMetricRow}>
            <View style={styles.mainMetricItem}>
              <MetricCard
                title="Lifetime Volume"
                value={dashboardData.lifetimeVolume}
                subtitle="Calculated about 6 hours ago"
                icon="trending-up"
                currency={true}
                compact={false}
              />
            </View>
          </View>
          
          <View style={styles.twoColumnRow}>
            <View style={styles.halfWidth}>
              <MetricCard
                title="Coin Launches"
                value={dashboardData.coinLaunches}
                subtitle="@launchcoin"
                icon="rocket-launch"
                currency={false}
                compact={true}
                change={2.5}
                changeLabel="today"
              />
            </View>
            <View style={styles.halfWidth}>
              <MetricCard
                title="Active Coins"
                value={dashboardData.activeCoins}
                subtitle="5+ trades in 24h"
                icon="trending-up"
                currency={false}
                compact={true}
                change={-1.2}
                changeLabel="24h"
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
                value={dashboardData.totalMarketCap}
                subtitle={`$${(dashboardData.creatorCoins.marketCap / 1000000).toFixed(1)}M Creator Coins`}
                currency={true}
                compact={true}
                change={5.2}
              />
            </View>
            <View style={styles.halfWidth}>
              <MetricCard
                title="24h Volume"
                value={dashboardData.volume24h}
                subtitle={`$${(dashboardData.creatorCoins.volume / 1000000).toFixed(1)}M Creator Coins`}
                currency={true}
                compact={true}
                change={-3.1}
              />
            </View>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.halfWidth}>
              <MetricCard
                title="24h Transactions"
                value={dashboardData.transactions24h}
                subtitle={`${(dashboardData.creatorCoins.transactions / 1000).toFixed(1)}K Creator Coins`}
                currency={false}
                compact={true}
                change={8.7}
              />
            </View>
            <View style={styles.halfWidth}>
              <MetricCard
                title="Total Liquidity"
                value={dashboardData.totalLiquidity}
                subtitle={`$${(dashboardData.creatorCoins.liquidity / 1000000).toFixed(1)}M Creator Coins`}
                currency={true}
                compact={true}
                change={1.4}
              />
            </View>
          </View>
        </View>

        {/* LaunchCoin vs Creator Coins Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Platform Breakdown</Text>
          
          <View style={styles.twoColumnRow}>
            <View style={styles.halfWidth}>
              <MetricCard
                title="LAUNCHCOIN"
                value={dashboardData.launchCoin.marketCap}
                subtitle="Launch Coin on Believe"
                currency={true}
                compact={true}
                change={-21.6}
                changeLabel="24h"
                rank={1}
              />
            </View>
            <View style={styles.halfWidth}>
              <MetricCard
                title="Creator Coins"
                value={dashboardData.creatorCoins.marketCap}
                subtitle="All other tokens"
                currency={true}
                compact={true}
                change={4.2}
                changeLabel="24h"
              />
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStatsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsRow}>
            <MetricCard
              title="Top Token"
              value="LAUNCHCOIN"
              subtitle="$85.35M Market Cap"
              compact={true}
              currency={false}
              icon="star"
            />
          </View>
        </View>

        {/* Bottom padding for tab navigation */}
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
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  mainMetricsContainer: {
    marginBottom: SPACING.lg,
  },
  mainMetricRow: {
    marginBottom: SPACING.md,
  },
  mainMetricItem: {
    flex: 1,
  },
  metricsGrid: {
    marginBottom: SPACING.lg,
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  halfWidth: {
    flex: 0.48,
  },
  breakdownSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  quickStatsSection: {
    marginBottom: SPACING.lg,
  },
  statsRow: {
    marginBottom: SPACING.sm,
  },
  bottomPadding: {
    height: 100, // Space for bottom tab navigation
  },
});

export default DashboardScreen; 