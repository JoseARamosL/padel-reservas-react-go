import { useTheme } from './use-theme';

export const useColorScheme = () => {
    const { colorScheme } = useTheme();
    return colorScheme;
};
