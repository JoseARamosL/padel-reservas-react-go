import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const { user, logout, isLoggedIn } = useAuth();
    const router = useRouter();

    if (isLoggedIn === null || (isLoggedIn && !user)) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    if (!isLoggedIn || !user) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.headerTitleDark}>Setting</Text>
                <View style={styles.content}>
                    <Text style={styles.loginText}>You are not logged in.</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
                        <Text style={styles.loginButtonText}>Go to Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.mainContainer}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <SafeAreaView edges={['top']}>
                    <Text style={styles.headerTitle}>Settings</Text>

                    <View style={styles.profileInfo}>
                        <Image
                            source={{ uri: 'https://avatars.githubusercontent.com/u/127152011?v=4' }}
                            style={styles.avatar}
                        />
                        <View style={styles.nameContainer}>
                            <Text style={styles.helloText}>Hello</Text>
                            <Text style={styles.nameText}>{user.name ?? 'Lonnie'} {user.surnames ?? 'Murphy'}</Text>
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <MaterialCommunityIcons name="pencil" size={18} color="#b0b0bc" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            {/* Content Section */}
            <View style={styles.contentOverlay}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Horizontal Cards */}
                    <View style={styles.cardsContainer}>
                        <View style={styles.cardWrapper}>
                            <TouchableOpacity style={[styles.card, styles.cardActive]}>
                                <MaterialCommunityIcons name="power" size={36} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.cardText}>Hacer algo</Text>
                        </View>

                        <View style={styles.cardWrapper}>
                            <TouchableOpacity style={styles.card}>
                                <Feather name="lock" size={30} color="#cbd0d9" />
                            </TouchableOpacity>
                            <Text style={styles.cardText}>Hacer algo</Text>
                        </View>

                        <View style={styles.cardWrapper}>
                            <TouchableOpacity style={styles.card}>
                                <MaterialCommunityIcons name="key-outline" size={32} color="#cbd0d9" />
                            </TouchableOpacity>
                            <Text style={styles.cardText}>Hacer algo</Text>
                        </View>
                    </View>

                    {/* Menu List */}
                    <View style={styles.menuContainer}>
                        <MenuItem title="Messages" badge={3} />
                        <MenuItem title="Change Password" />
                        <MenuItem title="Support" />

                        <TouchableOpacity style={[styles.menuItem, {
                            borderBottomWidth: 0, backgroundColor: '#1b2a47', borderRadius: 10, padding: 10,
                            marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center'
                        }]} onPress={logout}>
                            <Text style={styles.signOutText}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

function MenuItem({ title, badge, onPress }: { title: string, badge?: number, onPress?: () => void }) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuItemLeft}>
                <Text style={styles.menuItemText}>{title}</Text>
                {badge ? (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                ) : null}
            </View>
            <Feather name="chevron-right" size={20} color="#cbd0d9" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#0f1a2e',
    },
    headerSection: {
        backgroundColor: '#0f1a2e',
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 10,
    },
    headerTitleDark: {
        color: '#0f1a2e',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 10,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ccc',
    },
    nameContainer: {
        flex: 1,
        marginLeft: 16,
    },
    helloText: {
        color: '#8b95a6',
        fontSize: 14,
        marginBottom: 4,
    },
    nameText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    editButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1b2a47',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentOverlay: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 35,
        paddingBottom: 25,
    },
    cardWrapper: {
        alignItems: 'center',
        width: '30%',
    },
    card: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f2f2f7',
    },
    cardActive: {
        backgroundColor: '#f62e2e',
        shadowColor: '#f62e2e',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        borderWidth: 0,
    },
    cardText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1a1a24',
        textAlign: 'center',
    },
    menuContainer: {
        paddingHorizontal: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 22,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f5',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        color: '#1a1a24',
        fontWeight: '600',
    },
    badge: {
        backgroundColor: '#f62e2e',
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    signOutText: {
        fontSize: 16,
        color: '#f62e2e',
        fontWeight: '600',
        marginTop: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#0f1a2e',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
