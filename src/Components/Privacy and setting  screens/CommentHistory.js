import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';

import { AuthContext } from '../../Context/AuthContext';
import GetCommentHistoryAPI from '../../Fetch_API/CommentHistory';

// Classy Editorial Palette
const BG_COLOR = '#FAF9F6';       // Soft Cream / Off-White Canvas
const CARD_BG = '#FFFFFF';        // Crisp White Surface
const BORDER_COLOR = '#E5E7EB';   // Delicate Border Line
const ACCENT_PRIMARY = '#312E81'; // Deep Midnight Indigo
const ACCENT_MUTED = '#6366F1';   // Soft Indigo Highlight
const ACCENT_THREAD = '#E0E7FF';  // Quote Thread Accent
const TEXT_MAIN = '#0F172A';      // Deep Charcoal
const TEXT_MUTED = '#64748B';     // Slate Grey

function timeAgo(dateString) {
  if (!dateString) return '';
  const then = new Date(dateString.replace(' ', 'T'));
  const now = new Date();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return then.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

function formatCount(n) {
  const num = Number(n) || 0;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return `${num}`;
}

const CommentTimelineCard = ({ item }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 40,
      bounciness: 3,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 3,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.card}
      >
        {/* Top Header: Creator Profile & Date */}
        <View style={styles.authorBar}>
          <View style={styles.authorInfo}>
            {item.post_author_profile ? (
              <Image source={{ uri: item.post_author_profile }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person" size={10} color={TEXT_MUTED} />
              </View>
            )}
            <Text style={styles.authorName} numberOfLines={1}>
              {item.post_author_name || 'Creator'}
            </Text>
          </View>

          <Text style={styles.timeText}>{timeAgo(item.comment_date)}</Text>
        </View>

        {/* Content Section: Thumbnail + Quote Block */}
        <View style={styles.cardBody}>
          <View style={styles.mediaContainer}>
            <Image
              source={{
                uri: item.video_thumbnail || 'https://via.placeholder.com/300x400',
              }}
              style={styles.videoThumb}
            />
            <View style={styles.playOverlay}>
              <Ionicons name="play" size={10} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.contentContainer}>
            <Text numberOfLines={1} style={styles.videoTitle}>
              {item.video_description || 'Untitled Publication'}
            </Text>

            {/* Editorial Quote Thread Block */}
            <View style={styles.quoteBlock}>
              <Text numberOfLines={3} style={styles.commentBodyText}>
                {item.comment}
              </Text>
            </View>
          </View>
        </View>

        {/* Card Footer: Minimal Metrics */}
        <View style={styles.cardFooter}>
          <View style={styles.statsGroup}>
            <View style={styles.pillStat}>
              <Ionicons name="heart-outline" size={12} color={TEXT_MUTED} />
              <Text style={styles.pillStatText}>{formatCount(item.comment_likes)}</Text>
            </View>

            <View style={styles.pillStat}>
              <Icon name="corner-down-right" size={11} color={TEXT_MUTED} />
              <Text style={styles.pillStatText}>
                {formatCount(item.reply_count)} {Number(item.reply_count) === 1 ? 'reply' : 'replies'}
              </Text>
            </View>
          </View>

          <View style={styles.viewLink}>
            <Text style={styles.viewLinkText}>View thread</Text>
            <Ionicons name="chevron-forward" size={12} color={ACCENT_PRIMARY} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function CommentHistoryScreen() {
  const { userId } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCommentHistory = async (isMounted = true) => {
    try {
      const data = await GetCommentHistoryAPI(userId);
      if (isMounted) {
        setComments(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      if (isMounted) setComments([]);
    } finally {
      if (isMounted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (userId) {
      loadCommentHistory(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCommentHistory(true);
  }, [userId]);

  const totalLikes = comments.reduce((acc, curr) => acc + (Number(curr.comment_likes) || 0), 0);
  const totalReplies = comments.reduce((acc, curr) => acc + (Number(curr.reply_count) || 0), 0);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" color={ACCENT_PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG_COLOR} />

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>ACTIVITY ARCHIVE</Text>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Comments</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{comments.length}</Text>
          </View>
        </View>
      </View>

      {/* Editorial Overview Strip */}
      <View style={styles.summaryBanner}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{comments.length}</Text>
          <Text style={styles.summaryLabel}>Posts</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{formatCount(totalLikes)}</Text>
          <Text style={styles.summaryLabel}>Likes Received</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{formatCount(totalReplies)}</Text>
          <Text style={styles.summaryLabel}>Replies Received</Text>
        </View>
      </View>

      {/* Main Comment Feed */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) =>
          item.comment_id ? item.comment_id.toString() : index.toString()
        }
        renderItem={({ item }) => <CommentTimelineCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ACCENT_PRIMARY}
            colors={[ACCENT_PRIMARY]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Icon name="message-square" size={24} color={ACCENT_PRIMARY} />
            </View>
            <Text style={styles.emptyTitle}>No Activity Recorded</Text>
            <Text style={styles.emptySub}>
              Your discussion history is clean. Comments you contribute will be archived here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  centerContainer: {
    flex: 1,
    justify: 'center',
    alignItems: 'center',
    backgroundColor: BG_COLOR,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: ACCENT_MUTED,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: TEXT_MAIN,
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: ACCENT_PRIMARY,
  },
  summaryBanner: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_MAIN,
  },
  summaryLabel: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: BORDER_COLOR,
    height: '65%',
    alignSelf: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  authorBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  avatarFallback: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EEF2FF',
    justify: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_MAIN,
  },
  timeText: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: '400',
  },
  cardBody: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaContainer: {
    position: 'relative',
    width: 72,
    height: 96,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  videoThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justify: 'space-between',
  },
  videoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MAIN,
    lineHeight: 18,
  },
  quoteBlock: {
    borderLeftWidth: 2,
    borderLeftColor: ACCENT_THREAD,
    paddingLeft: 10,
    marginTop: 6,
  },
  commentBodyText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  statsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pillStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pillStatText: {
    fontSize: 11,
    fontWeight: '500',
    color: TEXT_MUTED,
  },
  viewLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: ACCENT_PRIMARY,
  },
  emptyContainer: {
    flex: 1,
    justify: 'center',
    alignItems: 'center',
    paddingVertical: 70,
    paddingHorizontal: 36,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    justify: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_MAIN,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 19,
  },
});