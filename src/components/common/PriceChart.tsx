import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants';
import { formatCurrency, formatLargeNumber } from '../../utils';
import type { ChartDataPoint } from '../../types';

const screenWidth = Dimensions.get('window').width;

interface PriceChartProps {
  data: ChartDataPoint[];
  timeframe: string;
  high: number;
  low: number;
  height?: number;
}

type ChartType = 'line' | 'area' | 'volume' | 'combined';

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  timeframe, 
  high, 
  low, 
  height = 220 
}) => {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [showVolume, setShowVolume] = useState(false);

  // Prepare data for the chart
  const chartData = {
    labels: data.map((point, index) => {
      // Show fewer labels to avoid crowding
      if (data.length <= 6) return '';
      if (index === 0 || index === Math.floor(data.length / 2) || index === data.length - 1) {
        const date = new Date(point.timestamp);
        if (timeframe === '24h') {
          return date.getHours() + 'h';
        } else if (timeframe === '1h' || timeframe === '2h' || timeframe === '4h') {
          return date.getMinutes() + 'm';
        } else {
          return date.getDate() + 'd';
        }
      }
      return '';
    }),
    datasets: [
      {
        data: data.map(point => point.price),
        color: (opacity = 1) => COLORS.primary,
        strokeWidth: 2,
      },
    ],
  };

  // Volume data for combined charts
  const volumeData = {
    labels: chartData.labels,
    datasets: [
      {
        data: data.map(point => point.volume / 1000000), // Convert to millions
        color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`, // Purple for volume
        strokeWidth: 1,
      },
    ],
  };

  // Enhanced chart config with gradients
  const getChartConfig = (type: ChartType) => ({
    backgroundColor: 'transparent',
    backgroundGradientFrom: COLORS.backgroundSecondary,
    backgroundGradientTo: COLORS.backgroundSecondary,
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    decimalPlaces: type === 'volume' ? 1 : 6,
    color: (opacity = 1) => {
      if (type === 'volume') return `rgba(156, 39, 176, ${opacity})`;
      return `rgba(0, 255, 136, ${opacity})`; // Primary green
    },
    labelColor: (opacity = 1) => COLORS.textMuted,
    style: {
      borderRadius: BORDER_RADIUS.md,
    },
    propsForDots: {
      r: type === 'area' ? '0' : '3',
      strokeWidth: '1',
      stroke: type === 'volume' ? '#9C27B0' : COLORS.primary,
      fill: type === 'volume' ? '#9C27B0' : COLORS.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '5,5',
      stroke: COLORS.border,
      strokeWidth: 0.3,
      strokeOpacity: 0.3,
    },
    propsForLabels: {
      fontSize: FONTS.sizes.xs,
    },
    fillShadowGradient: type === 'volume' ? '#9C27B0' : COLORS.primary,
    fillShadowGradientOpacity: type === 'area' ? 0.3 : 0.1,
    fillShadowGradientFrom: type === 'volume' ? '#9C27B0' : COLORS.primary,
    fillShadowGradientFromOpacity: type === 'area' ? 0.6 : 0.2,
    fillShadowGradientTo: type === 'volume' ? '#9C27B0' : COLORS.primary,
    fillShadowGradientToOpacity: 0.1,
  });

  // Calculate price change
  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

  // Calculate volume stats
  const totalVolume = data.reduce((sum, point) => sum + point.volume, 0);
  const avgVolume = totalVolume / data.length;

  const renderChartTypeButtons = () => (
    <View style={styles.chartTypeContainer}>
      <TouchableOpacity
        style={[styles.chartTypeButton, chartType === 'area' && styles.activeChartType]}
        onPress={() => setChartType('area')}
      >
        <Icon name="show-chart" size={16} color={chartType === 'area' ? COLORS.background : COLORS.textMuted} />
        <Text style={[styles.chartTypeText, chartType === 'area' && styles.activeChartTypeText]}>
          Area
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.chartTypeButton, chartType === 'line' && styles.activeChartType]}
        onPress={() => setChartType('line')}
      >
        <Icon name="timeline" size={16} color={chartType === 'line' ? COLORS.background : COLORS.textMuted} />
        <Text style={[styles.chartTypeText, chartType === 'line' && styles.activeChartTypeText]}>
          Line
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.chartTypeButton, showVolume && styles.activeChartType]}
        onPress={() => setShowVolume(!showVolume)}
      >
        <Icon name="bar-chart" size={16} color={showVolume ? COLORS.background : COLORS.textMuted} />
        <Text style={[styles.chartTypeText, showVolume && styles.activeChartTypeText]}>
          Volume
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderChart = () => {
    if (data.length <= 1) {
      return (
        <View style={[styles.noDataContainer, { height }]}>
          <Icon name="show-chart" size={48} color={COLORS.textMuted} />
          <Text style={styles.noDataText}>No chart data available</Text>
          <Text style={styles.noDataSubtext}>Price data will appear here when available</Text>
        </View>
      );
    }

    const chartWidth = screenWidth - (SPACING.md * 2);
    const chartHeight = showVolume ? height - 80 : height;

    return (
      <View style={styles.chartContainer}>
        {/* Main Price Chart */}
        <View style={styles.mainChart}>
          {chartType === 'area' ? (
            <LineChart
              data={chartData}
              width={chartWidth}
              height={chartHeight}
              chartConfig={{
                ...getChartConfig('area'),
                fillShadowGradientOpacity: 0.4,
                fillShadowGradientFromOpacity: 0.8,
                fillShadowGradientToOpacity: 0.1,
              }}
              style={styles.chart}
              withDots={false}
              withShadow={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={false}
              segments={4}
              bezier
            />
          ) : (
            <LineChart
              data={chartData}
              width={chartWidth}
              height={chartHeight}
              chartConfig={getChartConfig('line')}
              bezier
              style={styles.chart}
              withDots={data.length <= 10}
              withShadow={false}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={false}
              segments={4}
            />
          )}
        </View>

        {/* Volume Chart Overlay */}
        {showVolume && (
          <View style={styles.volumeChart}>
            <Text style={styles.volumeLabel}>Volume (M)</Text>
            <LineChart
              data={volumeData}
              width={chartWidth}
              height={80}
              chartConfig={getChartConfig('volume')}
              style={styles.volumeChartStyle}
              withDots={false}
              withShadow={false}
              withVerticalLabels={false}
              withHorizontalLabels={false}
              fromZero={true}
              segments={2}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Chart Stats Header */}
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>High</Text>
          <Text style={styles.statValue}>{formatCurrency(high, 'USD', false)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Low</Text>
          <Text style={styles.statValue}>{formatCurrency(low, 'USD', false)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Change</Text>
          <Text style={[
            styles.statValue, 
            { color: priceChange >= 0 ? COLORS.success : COLORS.error }
          ]}>
            {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
          </Text>
        </View>
        {showVolume && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Avg Vol</Text>
            <Text style={styles.statValue}>{formatLargeNumber(avgVolume)}</Text>
          </View>
        )}
      </View>

      {/* Chart Type Controls */}
      {renderChartTypeButtons()}

      {/* Chart */}
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  chartTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: BORDER_RADIUS.sm,
    padding: 4,
  },
  chartTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginHorizontal: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  activeChartType: {
    backgroundColor: COLORS.primary,
  },
  chartTypeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  activeChartTypeText: {
    color: COLORS.background,
    fontWeight: '600',
  },
  chartContainer: {
    alignItems: 'center',
  },
  mainChart: {
    marginBottom: SPACING.xs,
  },
  chart: {
    borderRadius: BORDER_RADIUS.sm,
  },
  volumeChart: {
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  volumeLabel: {
    fontSize: FONTS.sizes.xs,
    color: '#9C27B0',
    marginBottom: SPACING.xs,
    textAlign: 'center',
    fontWeight: '600',
  },
  volumeChartStyle: {
    borderRadius: BORDER_RADIUS.sm,
    marginTop: -10,
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: BORDER_RADIUS.md,
    width: screenWidth - (SPACING.md * 2),
  },
  noDataText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  noDataSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});

export default PriceChart; 