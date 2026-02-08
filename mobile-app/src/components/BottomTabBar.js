import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, spacing, fontSize, fontWeight} from '../styles/theme';

const BottomTabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Icon mapping
        const getIcon = () => {
          switch (route.name) {
            case 'Leads':
              return '📊';
            case 'Analytics':
              return '📈';
            case 'History':
              return '🔄';
            // case 'Sync':
            //   return '☁️';
            case 'Setup':
              return '⚙️';
            default:
              return '●';
          }
        };
        
        // Label mapping
        const getLabel = () => {
          switch (route.name) {
            case 'Leads':
              return 'LEADS';
            case 'Analytics':
              return 'ANALYTICS';
            case 'History':
              return 'HISTORY';
            // case 'Sync':
            //   return 'SYNC';
            case 'Setup':
              return 'SETUP';
            default:
              return label.toUpperCase();
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}>
            <Text style={[styles.icon, isFocused && styles.iconActive]}>
              {getIcon()}
            </Text>
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {getLabel()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  icon: {
    fontSize: 20,
    marginBottom: spacing.xs,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textLight,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
});

export default BottomTabBar;
