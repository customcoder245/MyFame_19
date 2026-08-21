const linkingConfig = {
  prefixes: [
    'myfame://',
    'https://myfame.com',
    'https://www.myfame.com',
  ],

  config: {
    screens: {
      // ✅ Must be at root level — directly in Stack.Navigator
      OtherUserProfileScreen: {
        path: 'profile/:userId',
        parse: {
          userId: (id) => String(id),
        },
      },
      BottomNavigator: 'home',
    },
  },
};

export default linkingConfig;