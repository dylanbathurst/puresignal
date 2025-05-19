import { useCurrentUserProfile } from "@nostr-dev-kit/ndk-mobile";
import { Globe, Headphones, LucideProps, User } from "lucide-react-native";
import { Image } from "react-native";
export const icons = {
  News: (props: LucideProps) => <Globe width={20} height={20} {...props} />,
  Profile: (props: LucideProps) => {
    const userProfile = useCurrentUserProfile();

    if (userProfile)
      return (
        <Image
          style={{ borderRadius: 50 }}
          width={20}
          height={20}
          source={{ uri: userProfile?.picture }}
        />
      );

    return <User width={20} height={20} {...props} />;
  },
  Audio: (props: LucideProps) => (
    <Headphones width={20} height={20} {...props} />
  ),
};
