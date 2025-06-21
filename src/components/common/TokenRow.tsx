import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants';
import { formatCurrency, formatLargeNumber, formatPercentage, formatTimeAgo, getChangeColor } from '../../utils';
import type { Token } from '../../types';

interface TokenRowProps {
  token: Token;
  onPress?: (token: Token) => void;
  onFavoritePress?: (tokenId: string) => void;
  isFavorite?: boolean;
  showRank?: boolean;
  rank?: number;
  compact?: boolean;
}

const TokenRow: React.FC<TokenRowProps> = ({
  token,
  onPress,
  onFavoritePress,
  isFavorite = false,
  showRank = false,
  rank,
  compact = false,
}) => {
  const handlePress = () => {
    onPress?.(token);
  };

  const handleFavoritePress = () => {
    onFavoritePress?.(token.id);
  };

  const formatChange = (change: number): string => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, compact && styles.compactContainer]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Left Section - Rank & Token Info */}
      <View style={styles.leftSection}>
        {showRank && rank && (
          <View style={styles.rankContainer}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
        )}
        
        <View style={styles.tokenInfo}>
          <View style={styles.tokenHeader}>
            <Text style={[styles.tokenSymbol, compact && styles.compactSymbol]} numberOfLines={1}>
              {token.symbol}
            </Text>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleFavoritePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name={isFavorite ? 'star' : 'star-border'}
                size={16}
                color={isFavorite ? COLORS.warning : COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>
          
          {!compact && (
            <Text style={styles.tokenName} numberOfLines={1}>
              {token.name}
            </Text>
          )}
        </View>
      </View>

      {/* Middle Section - Price & Market Cap */}
      <View style={styles.middleSection}>
        <Text style={[styles.price, compact && styles.compactPrice]} numberOfLines={1}>
          {formatCurrency(token.price, 'USD', false)}
        </Text>
        
        {!compact && (
          <Text style={styles.marketCap} numberOfLines={1}>
            {formatLargeNumber(token.marketCap)}
          </Text>
        )}
      </View>

      {/* Right Section - Changes & Volume */}
      <View style={styles.rightSection}>
        {/* 30m Change */}
        <View style={styles.changeContainer}>
          <Text style={[styles.changeLabel, compact && styles.compactChangeLabel]}>
            30m
          </Text>
          <View style={[
            styles.changeBadge,
            { backgroundColor: getChangeColor(token.change30m, COLORS) + '20' }
          ]}>
            <Icon
              name={token.change30m > 0 ? 'trending-up' : token.change30m < 0 ? 'trending-down' : 'trending-flat'}
              size={12}
              color={getChangeColor(token.change30m, COLORS)}
              style={styles.changeIcon}
            />
            <Text style={[
              styles.changeText,
              { color: getChangeColor(token.change30m, COLORS) },
              compact && styles.compactChangeText
            ]}>
              {formatChange(token.change30m)}
            </Text>
          </View>
        </View>

        {/* 24h Change */}
        <View style={styles.changeContainer}>
          <Text style={[styles.changeLabel, compact && styles.compactChangeLabel]}>
            24h
          </Text>
          <View style={[
            styles.changeBadge,
            { backgroundColor: getChangeColor(token.change24h, COLORS) + '20' }
          ]}>
            <Icon
              name={token.change24h > 0 ? 'trending-up' : token.change24h < 0 ? 'trending-down' : 'trending-flat'}
              size={12}
              color={getChangeColor(token.change24h, COLORS)}
              style={styles.changeIcon}
            />
            <Text style={[
              styles.changeText,
              { color: getChangeColor(token.change24h, COLORS) },
              compact && styles.compactChangeText
            ]}>
              {formatChange(token.change24h)}
            </Text>
          </View>
        </View>
      </View>

      {/* Volume & Age (Bottom Row for compact) */}
      {!compact && (
        <View style={styles.bottomSection}>
          <Text style={styles.volumeText}>
            Vol: {formatLargeNumber(token.volume24h)}
          </Text>
          <Text style={styles.ageText}>
            {token.age}
          </Text>
        </View>
      )}

      {/* Compact Bottom Info */}
      {compact && (
        <View style={styles.compactBottomSection}>
          <Text style={styles.compactVolumeText}>
            {formatLargeNumber(token.volume24h)}
          </Text>
          <Text style={styles.compactAgeText}>
            {token.age}
          </Text>
        </View>
      )}

      {/* Trade Button */}
      <View style={styles.tradeButtonContainer}>
        <View style={styles.tradeButton}>
          <Text style={styles.tradeButtonText} numberOfLines={1}>TRADE</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
  },
  compactContainer: {
    minHeight: 60,
    paddingVertical: SPACING.xs,
  },
  leftSection: {
    flex: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankContainer: {
    width: 25,
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  rankText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  tokenInfo: {
    flex: 1,
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tokenSymbol: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    flex: 1,
  },
  compactSymbol: {
    fontSize: FONTS.sizes.sm,
  },
  favoriteButton: {
    padding: 4,
  },
  tokenName: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  middleSection: {
    flex: 1.8,
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.xs,
  },
  price: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  compactPrice: {
    fontSize: FONTS.sizes.sm,
  },
  marketCap: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rightSection: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  changeContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  changeLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  compactChangeLabel: {
    fontSize: 10,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  changeIcon: {
    marginRight: 2,
  },
  changeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  compactChangeText: {
    fontSize: 10,
  },
  bottomSection: {
    position: 'absolute',
    bottom: SPACING.xs,
    left: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  volumeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  ageText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  compactBottomSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  compactVolumeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  compactAgeText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  tradeButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tradeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    minWidth: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tradeButtonText: {
    fontSize: 10,
    color: COLORS.background,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TokenRow; 