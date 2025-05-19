import { useEffect, useMemo } from "react";
import {
  NDKFilter,
  NDKKind,
  useNDKCurrentPubkey,
  useSubscribe,
} from "@nostr-dev-kit/ndk-hooks";
import Feed from "@/components/Feed";
import { ArticleWithInteraction, Audicles } from "@/components/FeedItem";
import { useReactionsStore } from "@/stores/reactions";

export default function HomeScreen() {
  const { addEvents } = useReactionsStore();
  const currentUserPubkey = useNDKCurrentPubkey();
  const articlesListFilter = useMemo(
    () => [
      {
        kinds: [NDKKind.Article],
        limit: 100,
        "#client": ["Pure Signal"],
      } as NDKFilter,
    ],
    []
  );
  const { events: articles } = useSubscribe(articlesListFilter);

  const articleIds = articles.map((a) => a.id);
  const interactionsFilter = useMemo(() => {
    return [
      {
        kinds: [NDKKind.GenericRepost, NDKKind.Reaction],
        "#k": ["30023"],
        "#e": articleIds,
        // "#client": ["Pure Signal"],
      } as NDKFilter,
    ];
  }, [articleIds]);

  const { events: interactions } = useSubscribe(
    interactionsFilter,
    { skipVerification: true },
    [articleIds]
  );

  useEffect(() => {
    addEvents(interactions, currentUserPubkey);
  }, [interactions]);

  const mappedInteractions = useMemo(() => {
    const mapped: Record<
      string,
      { reposts: number; quotes: number; reactions: number }
    > = {};

    interactions.forEach((interaction, i) => {
      const articleTag = interaction.tags.find((t) => t[0] === "e");

      if (!articleTag) return;
      if (!mapped[articleTag[1]]) {
        mapped[articleTag[1]] = {
          quotes: 0,
          reactions: 0,
          reposts: 0,
        };
        return;
      }
      switch (interaction.kind) {
        case NDKKind.GenericRepost:
          mapped[articleTag[1]].reposts += 1;
          break;
        case NDKKind.Reaction:
          mapped[articleTag[1]].reactions += 1;
          break;
        case NDKKind.Repost:
          mapped[articleTag[1]].quotes += 1;
          break;
        default:
          break;
      }
    });
    return mapped;
  }, [interactions]);

  const modifiedArticles = articles
    // .filter((article) =>
    //   article.getMatchingTags("client").find((tag) => tag[1] === "Pure Signal")
    // )
    .map((article) => {
      const interactions = mappedInteractions[article.id] || {
        quotes: 0,
        reactions: 0,
        reposts: 0,
      };
      return Object.assign(article, { interactions }) as ArticleWithInteraction;
    });

  // const audicles: Audicles = {
  //   id: "audicles",
  //   items: modifiedArticles.slice(0, 9),
  // };

  // console.log(interactions[interactions.length - 1]);
  // console.log(modifiedArticles.length && modifiedArticles[1].interactions);
  return <Feed articles={[...modifiedArticles]} />;
}
