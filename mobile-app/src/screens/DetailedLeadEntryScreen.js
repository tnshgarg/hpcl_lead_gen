import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import {colors, spacing, fontSize, fontWeight, borderRadius, shadows} from '../styles/theme';
import {useLeads} from '../context/LeadsContext';

const DetailedLeadEntryScreen = ({navigation, route}) => {
  const {addOutcome, leads} = useLeads();
  const {leadId} = route.params || {};
  
  // Safe fallback if direct access
  const lead = leads.find(l => l.id === leadId) || {name: 'Unknown Lead'};

  const [rating, setRating] = useState(4);
  const [selectedOutcome, setSelectedOutcome] = useState('Interested');
  const [selectedNextStep, setSelectedNextStep] = useState('Send Proposal');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState([
    {id: 1, label: 'Price sensitive', color: colors.primary},
    {id: 2, label: 'Urgent need', color: colors.error},
    {id: 3, label: 'Decision maker', color: colors.success},
  ]);

  const outcomes = [
    {id: 'Contacted', icon: 'checkmark-circle-outline', label: 'Contacted', color: colors.primary},
    {id: 'Interested', icon: 'thumbs-up-outline', label: 'Interested', color: colors.success},
    {id: 'Unreachable', icon: 'call-outline', label: 'Unreachable', color: colors.warning},
    {id: 'Not Relevant', icon: 'close-circle-outline', label: 'Not Relevant', color: colors.textLight},
  ];

  const nextSteps = [
    {id: 'Follow-up Call', label: 'Follow-up Call'},
    {id: 'Send Proposal', label: 'Send Proposal'},
    {id: 'Meeting Set', label: 'Meeting Set'},
    {id: 'Sample Sent', label: 'Sample Sent'},
  ];

  const handleSaveOutcome = () => {
    const outcomeObj = outcomes.find(o => o.id === selectedOutcome);
    addOutcome(leadId, outcomeObj, notes);

    // Redirect Logic
    if (selectedOutcome === 'Interested' || selectedOutcome === 'Contacted') {
      navigation.navigate('LeadFeed');
    } else {
      navigation.navigate('ActionHistory');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{lead.name}</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Lead Quality Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LEAD QUALITY</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Icon
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color={star <= rating ? "#F59E0B" : colors.border}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
            <Text style={styles.ratingValue}>{rating}.0</Text>
          </View>
        </View>

        {/* Outcome Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>OUTCOME</Text>
          <View style={styles.outcomeGrid}>
            {outcomes.map(outcome => (
              <TouchableOpacity
                key={outcome.id}
                style={[
                  styles.outcomeCard,
                  selectedOutcome === outcome.id && styles.outcomeCardActive,
                ]}
                onPress={() => setSelectedOutcome(outcome.id)}>
                <View
                  style={[
                    styles.outcomeIconContainer,
                    selectedOutcome === outcome.id && styles.outcomeIconActive,
                  ]}>
                  <Icon
                    name={outcome.icon}
                    size={24}
                    color={selectedOutcome === outcome.id ? colors.textWhite : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.outcomeLabel,
                    selectedOutcome === outcome.id && styles.outcomeLabelActive,
                  ]}>
                  {outcome.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Next Step Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NEXT STEP</Text>
          <View style={styles.nextStepGrid}>
            {nextSteps.map(step => (
              <TouchableOpacity
                key={step.id}
                style={[
                  styles.nextStepButton,
                  selectedNextStep === step.id && styles.nextStepButtonActive,
                ]}
                onPress={() => setSelectedNextStep(step.id)}>
                <Text
                  style={[
                    styles.nextStepText,
                    selectedNextStep === step.id && styles.nextStepTextActive,
                  ]}>
                  {step.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Visit Notes Section */}
        <View style={styles.section}>
          <View style={styles.notesHeader}>
            <Text style={styles.sectionLabel}>VISIT NOTES</Text>
            <TouchableOpacity style={styles.voiceInputButton}>
              <Icon name="mic-outline" size={16} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.voiceInputLink}>VOICE INPUT</Text>
            </TouchableOpacity>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {tags.map(tag => (
              <View key={tag.id} style={[styles.tag, {borderColor: tag.color}]}>
                <Text style={[styles.tagText, {color: tag.color}]}>+ {tag.label}</Text>
              </View>
            ))}
          </View>

          {/* Notes Input */}
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add specific requirements or context..."
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={{height: spacing.xxxl}} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveOutcome}>
          <Text style={styles.saveButtonText}>Save Outcome</Text>
        </TouchableOpacity>
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
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  section: {
    marginTop: spacing.xl, // Increased spacing
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: fontWeight.extraBold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg, // Soft rounded
    padding: spacing.lg,
    ...shadows.card, // Premium shadow
    justifyContent: 'center',
  },
  star: {
    marginHorizontal: 4,
  },
  ratingValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
    marginLeft: spacing.lg,
  },
  outcomeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  outcomeCard: {
    width: '47%',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.card,
  },
  outcomeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.cardBackground,
    ...shadows.soft,
  },
  outcomeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  outcomeIconActive: {
    backgroundColor: colors.primary,
  },
  outcomeLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  outcomeLabelActive: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  nextStepGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  nextStepButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  nextStepButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.md,
  },
  nextStepText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  nextStepTextActive: {
    color: colors.textWhite,
    fontWeight: fontWeight.bold,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  voiceInputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  voiceInputLink: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
  },
  tagText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  notesInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  bottomContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.soft,
  },
  saveButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
});

export default DetailedLeadEntryScreen;
