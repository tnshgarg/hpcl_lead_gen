import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable, // Replaced TouchableOpacity
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import {colors, spacing, fontSize, fontWeight, borderRadius, shadows} from '../styles/theme';
import {useLeads} from '../context/LeadsContext';

const LeadIntelligenceScreen = ({navigation, route}) => {
  const {leads} = useLeads();
  const {leadId} = route.params || {};
  
  // Find the lead or fallback to a default if direct navigation (dev)
  const lead = leads.find(l => l.id === leadId) || leads[0];

  // Handler for opening email client
  const handleEmail = async () => {
    const {email, name, contact} = lead;
    
    if (!email) {
      Alert.alert('No Email', 'Email address not available for this lead.');
      return;
    }

    const subject = encodeURIComponent(`Follow-up: ${name}`);
    const body = encodeURIComponent(
      `Hi ${contact},\n\nI wanted to follow up regarding our recent discussion about ${name}.\n\nLooking forward to connecting with you.\n\nBest regards`
    );
    
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    
    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert('Cannot Open Email', 'No email app is available on this device.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open email client.');
      console.error('Email error:', error);
    }
  };

  // Handler for creating calendar reminder
  const handleCalendarReminder = async () => {
    try {
      // Request calendar permissions
      const {status} = await Calendar.requestCalendarPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Calendar access is required to add reminders. Please enable it in your device settings.'
        );
        return;
      }

      // Get default calendar or create one
      let calendarId;
      if (Platform.OS === 'ios') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendar = calendars.find(cal => cal.allowsModifications);
        calendarId = defaultCalendar ? defaultCalendar.id : calendars[0]?.id;
      } else {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendar = calendars.find(
          cal => cal.isPrimary && cal.allowsModifications
        );
        calendarId = defaultCalendar ? defaultCalendar.id : calendars[0]?.id;
      }

      if (!calendarId) {
        Alert.alert('Error', 'No suitable calendar found on your device.');
        return;
      }

      // Create event details
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1); // Tomorrow at the same time
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1); // 1 hour duration

      const eventDetails = {
        title: `Follow-up: ${lead.name}`,
        notes: `Contact: ${lead.contact}\nIndustry: ${lead.industry}\nLocation: ${lead.location}\nMatch: ${lead.match}%`,
        startDate: startDate,
        endDate: endDate,
        timeZone: 'GMT',
        alarms: [{relativeOffset: -15}], // 15 minutes before
      };

      // Create the event
      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      
      Alert.alert(
        'Reminder Added',
        `A follow-up reminder for ${lead.name} has been added to your calendar for tomorrow.`,
        [{text: 'OK', style: 'default'}]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to add calendar reminder. Please try again.');
      console.error('Calendar error:', error);
    }
  };

  // Handler for initiating phone call
  const handlePhoneCall = async () => {
    const {phone, contact} = lead;
    
    if (!phone) {
      Alert.alert('No Phone Number', 'Phone number not available for this lead.');
      return;
    }

    const phoneUrl = `tel:${phone}`;
    
    try {
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Cannot Make Call', 'Phone calls are not supported on this device.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate phone call.');
      console.error('Phone call error:', error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>LEAD INTELLIGENCE</Text>
        <Pressable style={styles.iconButton}>
          <Icon name="ellipsis-horizontal" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Company Card with Map Background */}
        <View style={styles.companyCard}>
          <View style={styles.companyHeader}>
            <View style={styles.companyLogoContainer}>
              <View style={styles.companyLogo}>
                <Icon name="business" size={40} color={colors.primary} />
              </View>
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>{lead.match}%</Text>
              </View>
            </View>
            <View style={styles.companyDetails}>
              <Text style={styles.companyName}>{lead.name}</Text>
              <View style={styles.companyMeta}>
                <Icon name="location-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={styles.companyMetaText}>
                  {lead.industry} • {lead.location}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Priority Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipContainer}>
          <View style={[styles.chip, {backgroundColor: lead.statusColor || colors.primary}]}>
            <Text style={styles.chipText}>{lead.status}</Text>
          </View>
          <View style={[styles.chip, styles.chipTender]}>
            <Text style={styles.chipText}>TENDER ACTIVE</Text>
          </View>
          <View style={[styles.chip, styles.chipValue]}>
            <Text style={styles.chipText}>HIGH VALUE</Text>
          </View>
          <View style={[styles.chip, styles.chipGlobal]}>
            <Text style={styles.chipTextDark}>GLOBAL 500</Text>
          </View>
        </ScrollView>

        {/* Why This Lead Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>WHY THIS LEAD?</Text>
            <Pressable style={styles.liveInsightsButton}>
              <Text style={styles.liveInsightsLink}>Live Insights</Text>
              <Icon name="pulse" size={14} color={colors.primary} style={{ marginLeft: 4 }} />
            </Pressable>
          </View>

          {/* Dynamic Opportunities/Signals */}
          {(lead.dossier?.opportunities || []).slice(0, 2).map((opp, index) => (
             <View key={index} style={styles.insightCard}>
              <View style={[styles.insightIcon, index % 2 !== 0 && styles.insightIconPurple]}>
                <Icon name={index % 2 === 0 ? "megaphone-outline" : "trending-up-outline"} size={20} color={index % 2 === 0 ? colors.primary : "#9333EA"} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{opp.type || 'SIGNAL'}</Text>
                <Text style={styles.insightDescription}>
                  {opp.description || typeof opp === 'string' ? opp : 'Growth signal detected.'}
                </Text>
              </View>
              <Text style={styles.insightTime}>Recent</Text>
            </View>
          ))}
          
          {(!lead.dossier?.opportunities?.length) && (lead.aiReportSummary || []).slice(0, 1).map((summary, index) => (
             <View key={`fallback-${index}`} style={styles.insightCard}>
              <View style={styles.insightIcon}>
                <Icon name="bulb-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>KEY INSIGHT</Text>
                <Text style={styles.insightDescription}>
                  {summary || 'No specific signals detected.'}
                </Text>
              </View>
              <Text style={styles.insightTime}>Analysis</Text>
            </View>
          ))}
        </View>

        {/* 1️⃣ Confidence Level Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONFIDENCE LEVEL</Text>
          <View style={styles.confidenceCard}>
            <Text style={styles.confidencePercentage}>{lead.confidenceScore || lead.match}%</Text>
            <View style={styles.confidenceBarContainer}>
              <View 
                style={[
                  styles.confidenceBarFill, 
                  {width: `${lead.confidenceScore || lead.match}%`}
                ]} 
              />
            </View>
            <Text style={styles.confidenceSubtext}>
              Based on signal strength and data reliability.
            </Text>
          </View>
        </View>

        {/* 2️⃣ Urgency Level Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>URGENCY</Text>
          <View style={styles.urgencyCard}>
            <View style={[
              styles.urgencyBadge,
              lead.urgencyLevel === 'High' && styles.urgencyBadgeHigh,
              lead.urgencyLevel === 'Medium' && styles.urgencyBadgeMedium,
              lead.urgencyLevel === 'Low' && styles.urgencyBadgeLow,
            ]}>
              <Text style={styles.urgencyText}>{lead.urgencyLevel || 'Medium'}</Text>
            </View>
            <Text style={styles.urgencySubtext}>
              Driven by tender timelines and expansion schedules.
            </Text>
          </View>
        </View>

        {/* 3️⃣ Recommended Product Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECOMMENDED PRODUCT TO PITCH</Text>
          <View style={styles.productCard}>
            <View style={styles.productHeader}>
              <View style={styles.productIcon}>
                <Icon name="bulb" size={20} color={colors.primary} />
              </View>
              <View style={styles.productContent}>
                <Text style={styles.productName}>{lead.recommendedProduct?.name || 'Standard Solution'}</Text>
                <Text style={styles.productJustification}>
                  {lead.recommendedProduct?.justification || 'Fits standard profile.'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4️⃣ AI Report Section */}
        <View style={styles.section}>
          <View style={styles.aiReportHeader}>
            <Text style={styles.sectionTitle}>AI REPORT</Text>
            <Icon name="sparkles" size={16} color={colors.primary} style={{marginLeft: 8}} />
          </View>
          <View style={styles.aiReportCard}>
            {(lead.aiReportSummary || []).map((bullet, index) => (
              <View key={index} style={styles.aiReportBullet}>
                <View style={styles.aiReportBulletDot} />
                <Text style={styles.aiReportBulletText}>{bullet}</Text>
              </View>
            ))}
            <Text style={styles.aiReportSubtext}>
              Generated from recent public signals.
            </Text>
          </View>
        </View>

        {/* Company Intelligence Section - Simplified & Dynamic */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COMPANY INTELLIGENCE</Text>

          <View style={styles.intelligenceCard}>
            <View style={styles.intelligenceRow}>
              <View style={styles.intelligenceItem}>
                <Text style={styles.intelligenceLabel}>INDUSTRY</Text>
                <View style={styles.employeeCount}>
                   <Text style={styles.intelligenceValue}>{lead.industry || 'Unknown'}</Text>
                </View>
              </View>
               <View style={styles.intelligenceItem}>
                <Text style={styles.intelligenceLabel}>SIZE</Text>
                <View style={styles.stockSymbol}>
                  <Text style={styles.intelligenceValue}>{lead.dossier?.details?.companySize || 'Medium'}</Text>
                </View>
              </View>
            </View>

             <View style={styles.fleetSection}>
               <Text style={styles.intelligenceLabel}>DATA SOURCE</Text>
               <View style={styles.fleetTags}>
                 <View style={styles.fleetTag}>
                   <Text style={styles.fleetTagText}>{lead.dossier?.company ? 'Corporate Registry' : 'Public Signals'}</Text>
                 </View>
               </View>
             </View>
          </View>
        </View>

        <View style={{height: spacing.xxxl}} />
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View style={styles.bottomCTA}>
        <Pressable style={styles.callButton} onPress={handlePhoneCall}>
          <Icon name="call-outline" size={24} color={colors.textSecondary} />
        </Pressable>
        <Pressable style={styles.calendarButton} onPress={handleCalendarReminder}>
          <Icon name="calendar-outline" size={24} color={colors.textSecondary} />
        </Pressable>
        <Pressable
          style={styles.emailButton}
          onPress={handleEmail}>
          <Icon name="mail" size={20} color={colors.textWhite} style={styles.emailButtonIcon} />
          <Text 
            style={styles.emailButtonText} 
            numberOfLines={1} 
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}
          >
            Email {lead.contact || 'Contact'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.background, // Seamless match
  },
  iconButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  chipScroll: {
    paddingVertical: spacing.md,
  },
  chipContainer: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    ...shadows.sm,
  },
  chipPriority: {
    backgroundColor: colors.primary, // Using primary blue
  },
  chipTender: {
    backgroundColor: colors.accent, // Warm amber
  },
  chipValue: {
    backgroundColor: colors.success, // Green
  },
  chipGlobal: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
    letterSpacing: 0.5,
  },
  chipTextDark: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  companyCard: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: spacing.base,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card, // Premium shadow box
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogoContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  companyLogo: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg, // Soft rounded square
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  matchBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: colors.cardBackground,
    ...shadows.sm,
  },
  matchBadgeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  companyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyMetaText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  section: {
    marginTop: spacing.xl, // Increased spacing between sections
    paddingHorizontal: spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 11, // Smaller uppercase label
    fontWeight: fontWeight.extraBold,
    color: colors.textLight,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  liveInsightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  liveInsightsLink: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card, // Card shadow
    borderWidth: 1,
    borderColor: colors.borderLight, // Subtle border
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  insightIconPurple: {
    backgroundColor: '#F3E8FF',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 10,
    fontWeight: fontWeight.extraBold,
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  insightDescription: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  insightTime: {
    fontSize: 10,
    color: colors.textLight,
    marginLeft: spacing.sm,
    fontWeight: fontWeight.medium,
  },
  intelligenceCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  revenueSection: {
    marginBottom: spacing.lg,
  },
  intelligenceLabel: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  revenueAmount: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    gap: 6, // Specific gap
  },
  chartBar: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    minHeight: 4,
  },
  intelligenceRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  intelligenceItem: {
    flex: 1,
  },
  intelligenceValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  employeeCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  growingBadge: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.success,
    marginLeft: spacing.xs,
  },
  stockSymbol: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  stockExchange: {
    fontSize: 10,
    fontWeight: fontWeight.medium,
    color: colors.textLight,
    marginLeft: spacing.xs,
  },
  fleetSection: {
    paddingTop: spacing.xs,
  },
  fleetTags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  fleetTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background, // Match background
    borderWidth: 1,
    borderColor: colors.border,
  },
  fleetTagText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  // 1️⃣ Confidence Level Styles
  confidenceCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  confidencePercentage: {
    fontSize: 48,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.md,
    letterSpacing: -1,
  },
  confidenceBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  confidenceSubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // 2️⃣ Urgency Level Styles
  urgencyCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  urgencyBadgeHigh: {
    backgroundColor: '#FEE2E2',
  },
  urgencyBadgeMedium: {
    backgroundColor: '#FEF3C7',
  },
  urgencyBadgeLow: {
    backgroundColor: '#F3F4F6',
  },
  urgencyText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  urgencySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // 3️⃣ Recommended Product Styles
  productCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  productContent: {
    flex: 1,
  },
  productName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  productJustification: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // 4️⃣ AI Report Styles
  aiReportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  aiReportCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md, // Clean vertical stacking
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  aiReportBullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiReportBulletDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  aiReportBulletText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    lineHeight: 22,
    flex: 1,
  },
  aiReportSubtext: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  // Fixed Bottom CTA
  bottomCTA: {
     position: 'absolute',
     bottom: 0,
     left: 0,
     right: 0,
     flexDirection: 'row',
     padding: spacing.base,
     backgroundColor: colors.background, // Seamless
     borderTopWidth: 1,
     borderTopColor: colors.borderLight,
     gap: spacing.md,
     ...shadows.cardTop,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    ...shadows.soft,
  },
  emailButtonIcon: {
    marginRight: spacing.sm,
  },
  emailButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
});

export default LeadIntelligenceScreen;
