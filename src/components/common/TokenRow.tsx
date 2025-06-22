import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants';
import { formatCurrency, getChangeColor } from '../../utils';
import type { Token } from '../../types';

interface TokenRowProps {
  token: Token;
  onPress?: (token: Token) => void;
  onFavoritePress?: (tokenId: string) => void;
  isFavorite?: boolean;
  showRank?: boolean;
  rank?: number;
}

const TokenRow: React.FC<TokenRowProps> = ({
  token,
  onPress,
  onFavoritePress,
  isFavorite = false,
  showRank = false,
  rank,
}) => {
  const handlePress = () => {
    if (onPress) {
      // Use the provided onPress handler (for in-app navigation)
      onPress(token);
    } else {
      // Fallback to opening the browser if no onPress handler is provided
      const tokenUrl = `https://www.believescreener.com/token/${token.address}`;
      Linking.openURL(tokenUrl).catch(err => {
        console.error('Failed to open URL:', err);
      });
    }
  };

  const handleFavoritePress = () => {
    onFavoritePress?.(token.id);
  };

  const handleTradePress = (e: any) => {
    e.stopPropagation();
    // Open believescreener.com token page for trading
    const tokenUrl = `https://www.believescreener.com/token/${token.address}`;
    Linking.openURL(tokenUrl);
  };

  const handleCAPress = (e: any) => {
    e.stopPropagation();
    // Copy address to clipboard or show address
    console.log('Contract Address:', token.address);
  };

  const formatChange = (change: number): string => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const truncateAddress = (address: string): string => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Token Column */}
      <View style={styles.tokenColumn}>
        <View style={styles.tokenHeader}>
          <Text style={styles.tokenSymbol} numberOfLines={1}>
            {token.symbol}
          </Text>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            <Icon
              name={isFavorite ? 'star' : 'star-border'}
              size={14}
              color={isFavorite ? COLORS.warning : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.tokenName} numberOfLines={1}>
          {token.name}
        </Text>
      </View>

      {/* Trade/CA Column */}
      <View style={styles.tradeColumn}>
        <TouchableOpacity style={styles.tradeButton} onPress={handleTradePress}>
          <Text style={styles.tradeButtonText}>TRADE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.caButton} onPress={handleCAPress}>
          <Text style={styles.caButtonText}>CA</Text>
        </TouchableOpacity>
        <Text style={styles.addressText} numberOfLines={1}>
          {truncateAddress(token.address)}
        </Text>
      </View>

      {/* Price Column */}
      <View style={styles.priceColumn}>
        <Text style={styles.price} numberOfLines={1}>
          {formatCurrency(token.price, 'USD', false)}
        </Text>
      </View>

      {/* 24h Change Column */}
      <View style={styles.changeColumn}>
        <View style={[
          styles.changeBadge,
          { backgroundColor: getChangeColor(token.change24h, COLORS) + '20' }
        ]}>
          <Icon
            name={token.change24h > 0 ? 'arrow-upward' : token.change24h < 0 ? 'arrow-downward' : 'remove'}
            size={12}
            color={getChangeColor(token.change24h, COLORS)}
          />
          <Text style={[
            styles.changeText,
            { color: getChangeColor(token.change24h, COLORS) }
          ]}>
            {formatChange(token.change24h)}
          </Text>
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
    marginVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 70,
  },
  tokenColumn: {
    flex: 2,
    paddingRight: SPACING.sm,
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tokenSymbol: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteButton: {
    padding: 2,
  },
  tokenName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  tradeColumn: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  tradeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 4,
  },
  tradeButtonText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  caButton: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 4,
  },
  caButtonText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  addressText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  priceColumn: {
    flex: 1.5,
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.sm,
  },
  price: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  changeColumn: {
    flex: 1.2,
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  changeText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default TokenRow; 