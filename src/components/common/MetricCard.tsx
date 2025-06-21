import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants';
import { formatCurrency, formatLargeNumber, formatPercentage, getChangeColor } from '../../utils';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  change?: number; // percentage change
  changeLabel?: string;
  icon?: string;
  currency?: boolean;
  compact?: boolean;
  onPress?: () => void;
  loading?: boolean;
  rank?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  currency = true,
  compact = false,
  onPress,
  loading = false,
  rank,
}) => {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    if (currency) {
      return formatCurrency(val, 'USD', compact);
    }
    return formatLargeNumber(val);
  };

  const getChangeIcon = (change: number): string => {
    return change > 0 ? 'arrow-upward' : change < 0 ? 'arrow-downward' : 'remove';
  };

  const CardContent = () => (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {/* Header with title and optional icon/rank */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {icon && (
            <Icon 
              name={
                icon === 'water-drop' ? 'opacity' : 
                icon === 'people' ? 'group' : 
                icon === 'bar-chart' ? 'assessment' :
                icon === 'timeline' ? 'show-chart' :
                icon === 'rocket-launch' ? 'launch' :
                icon
              } 
              size={20} 
              color={COLORS.textSecondary} 
              style={styles.titleIcon}
            />
          )}
          <Text style={[styles.title, compact && styles.compactTitle]} numberOfLines={1}>
            {title}
          </Text>
          {rank && (
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{rank}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Main Value */}
      <View style={styles.valueContainer}>
        {loading ? (
          <View style={styles.loadingValue} />
        ) : (
          <Text style={[styles.value, compact && styles.compactValue]} numberOfLines={1}>
            {formatValue(value)}
          </Text>
        )}
      </View>

      {/* Subtitle and Change */}
      <View style={styles.footer}>
        {subtitle && (
          <Text style={[styles.subtitle, compact && styles.compactSubtitle]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        
        {change !== undefined && (
          <View style={styles.changeContainer}>
            <Icon 
              name={getChangeIcon(change)} 
              size={16} 
              color={getChangeColor(change, COLORS)} 
              style={styles.changeIcon}
            />
            <Text style={[styles.changeText, { color: getChangeColor(change, COLORS) }]}>
              {formatPercentage(Math.abs(change))}
            </Text>
            {changeLabel && (
              <Text style={styles.changeLabel}> {changeLabel}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={[styles.touchable, compact && styles.compactTouchable]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 120,
  },
  compactContainer: {
    padding: SPACING.sm,
    minHeight: 80,
  },
  touchable: {
    borderRadius: BORDER_RADIUS.md,
  },
  compactTouchable: {
    borderRadius: BORDER_RADIUS.sm,
  },
  header: {
    marginBottom: SPACING.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleIcon: {
    marginRight: SPACING.xs,
  },
  title: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  compactTitle: {
    fontSize: FONTS.sizes.xs,
  },
  rankBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rankText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  valueContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: SPACING.xs,
  },
  value: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  compactValue: {
    fontSize: FONTS.sizes.lg,
  },
  loadingValue: {
    height: 28,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.sm,
    opacity: 0.6,
  },
  footer: {
    marginTop: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  compactSubtitle: {
    fontSize: 10,
    marginBottom: 2,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeIcon: {
    marginRight: 2,
  },
  changeText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  changeLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
});

export default MetricCard; 